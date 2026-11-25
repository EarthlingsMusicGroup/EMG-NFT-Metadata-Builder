"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { playCue, playTick, setMuted, unlockFromGesture } from "./audio";
import { BEATBOT, type SoundCue, type TourStep } from "./config";
import { Monogram } from "./monogram";
import { setTalking } from "./signals";
import { loadPrefs, savePrefs, type BeatBotPrefs } from "./storage";
import { resolveFieldTip, type FieldReading } from "./tips";
import {
  firstShowable,
  isStepShowable,
  pageFromPath,
  previousShowable,
  showableSteps,
} from "./tour";

const BeatBotScene = dynamic(
  () => import("./beatbot-scene").then((mod) => mod.BeatBotScene),
  {
    ssr: false,
    loading: () => <Monogram className="h-full w-full" />,
  },
);

type Corner = "bl" | "br" | "tl" | "tr";

type Speech = {
  id: string;
  text: string;
  note: string | null;
  cue: SoundCue;
};

export function BeatBotWidget() {
  const pathname = usePathname() ?? "/";
  const reduced = useReducedMotion();
  const initial = useRef<BeatBotPrefs | null>(null);
  if (!initial.current) initial.current = loadPrefs();
  const prefsRef = useRef(initial.current);

  const [dismissed, setDismissed] = useState(initial.current.dismissed);
  const [collapsed, setCollapsed] = useState(
    initial.current.collapsed ??
      (typeof window !== "undefined" &&
        window.matchMedia("(max-width: 640px)").matches),
  );
  const [muted, setMutedState] = useState(initial.current.muted);
  const [tourCompleted, setTourCompleted] = useState(
    initial.current.tourCompleted,
  );
  const [tourId, setTourId] = useState<string | null>(null);
  const [tourStepId, setTourStepId] = useState<string | null>(null);
  const [domTick, setDomTick] = useState(0);
  const [builderStep, setBuilderStep] = useState<string | null>(null);
  const [fieldId, setFieldId] = useState<string | null>(null);
  const [fieldVersion, setFieldVersion] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [slim, setSlim] = useState(false);
  const [corner, setCorner] = useState<Corner>("bl");

  const rootRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const fieldRef = useRef<HTMLElement | null>(null);
  const userHid = useRef(false);
  const dismissedRef = useRef(dismissed);
  const greeted = useRef(false);
  dismissedRef.current = dismissed;

  const commit = (partial: Partial<BeatBotPrefs>) => {
    const next = { ...prefsRef.current, ...partial };
    prefsRef.current = next;
    savePrefs(next);
  };

  function greet() {
    unlockFromGesture();
    if (greeted.current || prefsRef.current.muted) return;
    greeted.current = true;
    playCue("greeting");
  }

  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;
    const narrow = window.matchMedia("(max-width: 640px)").matches;
    root.style.paddingBottom = narrow ? (collapsed || dismissed ? "4.75rem" : "46vh") : "";
    return () => {
      root.style.paddingBottom = "";
    };
  }, [collapsed, dismissed, slim]);

  useEffect(() => {
    const read = () => {
      const step = document.querySelector("[data-beatbot-step]");
      setBuilderStep(step?.getAttribute("data-beatbot-step") ?? null);
    };
    read();
    const root = document.getElementById("main-content") ?? document.body;
    const observer = new MutationObserver(read);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    fieldRef.current = null;
    setFieldId(null);
  }, [builderStep, pathname]);

  useEffect(() => {
    const onFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-beatbot-root]")) return;
      const field = target.closest<HTMLElement>("[data-beatbot-field]");
      fieldRef.current = field;
      setFieldId(field?.getAttribute("data-beatbot-field") ?? null);
      setFieldVersion((version) => version + 1);
      if (!field || dismissedRef.current) return;
      greet();
      if (!userHid.current) setCollapsed(false);
    };
    const onEdit = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element) || !fieldRef.current) return;
      if (target.closest("[data-beatbot-field]") !== fieldRef.current) return;
      setFieldVersion((version) => version + 1);
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("input", onEdit);
    document.addEventListener("change", onEdit);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("input", onEdit);
      document.removeEventListener("change", onEdit);
    };
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    const read = () => {
      const keyboard = viewport
        ? viewport.height < window.innerHeight * 0.75
        : false;
      const dialog = document.querySelector("[role='dialog'], [role='alertdialog']");
      setSlim(keyboard || dialog !== null);
    };
    read();
    viewport?.addEventListener("resize", read);
    const observer = new MutationObserver(read);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      viewport?.removeEventListener("resize", read);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!tourId) return;
    const root = document.getElementById("main-content") ?? document.body;
    const observer = new MutationObserver(() => {
      setDomTick((tick) => tick + 1);
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [tourId]);

  const tour = BEATBOT.tours.find((item) => item.id === tourId) ?? null;
  const page = pageFromPath(pathname);

  useEffect(() => {
    if (!tour) return;
    const hasTarget = (step: TourStep) => findTarget(step.targets) !== null;
    const current = tour.steps.find((step) => step.id === tourStepId) ?? null;
    if (current && isStepShowable(current, page, hasTarget)) return;
    const start = current
      ? tour.steps.findIndex((step) => step.id === current.id) + 1
      : 0;
    const next = firstShowable(tour, page, hasTarget, start);
    if (!next) {
      setTourId(null);
      setTourStepId(null);
      setTourCompleted(true);
      commit({ tourCompleted: true });
      playCue("confirm");
      return;
    }
    setTourStepId(next.id);
  }, [tour, tourStepId, page, domTick]);

  const fieldTip = useMemo(() => {
    if (!fieldId || !fieldRef.current || dismissed) return null;
    return resolveFieldTip(fieldId, readControl(fieldRef.current));
  }, [fieldId, fieldVersion, dismissed]);

  const tourStep =
    tour?.steps.find((step) => step.id === tourStepId) ?? null;
  const stepsNow = tour
    ? showableSteps(tour, page, (step) => findTarget(step.targets) !== null)
    : [];
  const stepIndex = tourStep
    ? stepsNow.findIndex((step) => step.id === tourStep.id)
    : -1;

  const stepTip = builderStep ? BEATBOT.stepTips[builderStep] : undefined;
  const speech: Speech = tour && tourStep
    ? {
        id: `tour:${tour.id}:${tourStep.id}`,
        text: tourStep.text,
        note: null,
        cue: tourStep.cue ?? "step",
      }
    : fieldTip
      ? {
          id: `tip:${fieldTip.id}:${fieldTip.text}`,
          text: fieldTip.text,
          note: fieldTip.note,
          cue: "tick",
        }
            : !tourCompleted
              ? {
                  id: "invite",
                  text: BEATBOT.invite,
                  note: null,
                  cue: "none",
                }
        : notice
          ? { id: "notice", text: notice, note: null, cue: "none" }
          : stepTip
            ? {
                id: `step:${builderStep}`,
                text: stepTip,
                note: null,
                cue: "none",
              }
            : { id: "idle", text: BEATBOT.idle, note: null, cue: "none" };

  const visible = !dismissed && !collapsed;
  const typed = useTypedText(visible ? speech.text : "", reduced, () => {
    if (!reduced) playTick();
  });

  useEffect(() => {
    const talking =
      visible &&
      !slim &&
      !reduced &&
      speech.text.length > 0 &&
      typed.length < speech.text.length;
    setTalking(talking);
    return () => setTalking(false);
  }, [visible, slim, reduced, typed, speech.text]);

  useEffect(() => {
    if (!visible) return;
    playCue(speech.cue);
  }, [speech.id, visible]);

  useEffect(() => {
    if (!visible || !speech.note) return;
    playCue("question");
  }, [speech.id, speech.note, visible]);

  useLayoutEffect(() => {
    if (!visible || slim) return;
    const node = rootRef.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const target = tourStep ? findTarget(tourStep.targets) : null;
    const next = pickCorner(
      box.width || 300,
      box.height || 320,
      target?.getBoundingClientRect() ?? null,
    );
    setCorner((current) => (current === next ? current : next));
  }, [visible, slim, tourStep, speech.id, typed.length === speech.text.length]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (document.querySelector("[role='dialog'], [role='alertdialog']")) return;
      if (helpOpen) {
        setHelpOpen(false);
        helpButtonRef.current?.focus();
        return;
      }
      if (!tourId) return;
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      endTour(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [helpOpen, tourId]);

  useEffect(() => {
    if (!helpOpen) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (helpRef.current?.contains(target)) return;
      if (helpButtonRef.current?.contains(target)) return;
      setHelpOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [helpOpen]);

  function beginTour(id: string) {
    greet();
    setNotice(null);
    setHelpOpen(false);
    setCollapsed(false);
    setDismissed(false);
    setTourStepId(null);
    setTourId(id);
    setDomTick((tick) => tick + 1);
  }

  function endTour(completed: boolean) {
    setTourId(null);
    setTourStepId(null);
    if (completed) {
      setTourCompleted(true);
      commit({ tourCompleted: true });
      playCue("confirm");
    }
  }

  function go(delta: 1 | -1) {
    if (!tour || !tourStep) return;
    unlockFromGesture();
    const hasTarget = (step: TourStep) => findTarget(step.targets) !== null;
    if (delta < 0) {
      const previous = previousShowable(tour, page, hasTarget, tourStep.id);
      if (previous) setTourStepId(previous.id);
      return;
    }
    const index = tour.steps.findIndex((step) => step.id === tourStep.id);
    const next = firstShowable(tour, page, hasTarget, index + 1);
    if (!next) endTour(true);
    else setTourStepId(next.id);
  }

  const highlight = tourStep ? findTarget(tourStep.targets) : null;

  if (dismissed) {
    return (
      <div
        data-beatbot-root=""
        className="fixed z-40 touch-manipulation"
        style={cornerStyle("bl", false)}
      >
        <button
          type="button"
          className={buttonClass(false)}
          onClick={() => {
            unlockFromGesture();
            setDismissed(false);
            setCollapsed(false);
            setHelpOpen(true);
            commit({ dismissed: false, collapsed: false });
          }}
        >
          Help
        </button>
      </div>
    );
  }

  if (!visible) {
    return (
      <div
        data-beatbot-root=""
        className="fixed z-40 touch-manipulation"
        style={cornerStyle("bl", false)}
      >
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-md touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={
            tourCompleted
              ? "Open BeatBot"
              : "Open BeatBot. A short tour is waiting."
          }
          aria-expanded="false"
          onClick={() => {
            if (tourCompleted) {
              unlockFromGesture();
              playCue("open");
            } else {
              greet();
            }
            setCollapsed(false);
            commit({ collapsed: false });
          }}
        >
          <Monogram className="h-9 w-9" />
        </button>
      </div>
    );
  }

  const showInvite = speech.id === "invite" && !tour;
  const onLast = tour ? stepIndex === stepsNow.length - 1 : false;

  return (
    <>
      <style>{TARGET_STYLE}</style>
      {highlight
        ? createPortal(
            <Highlight target={highlight} reduced={reduced} />,
            document.body,
          )
        : null}
      <div
        ref={rootRef}
        data-beatbot-root=""
        role="complementary"
        aria-label={`${BEATBOT.title}, ${BEATBOT.subtitle}`}
        className={`fixed touch-manipulation ${slim ? "z-[70]" : "z-40"} ${
          slim ? "w-auto" : "w-[min(19rem,calc(100vw-1.5rem))]"
        }`}
        style={cornerStyle(corner, slim)}
      >
        <div className="rounded-xl border border-border bg-card text-card-foreground shadow-lg">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Monogram className="h-7 w-7 shrink-0" />
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold leading-tight tracking-[0.02em]">
                {BEATBOT.title}
              </p>
              <p className="text-[11px] leading-tight text-muted-foreground">
                {BEATBOT.subtitle}
              </p>
            </div>
          </div>

          {!slim ? (
            <div className="h-36 w-full" aria-hidden="true">
              <BeatBotScene reduced={reduced} />
            </div>
          ) : null}

          <div className="px-3 pb-2 pt-2">
            <p className="sr-only" aria-live="polite">
              {speech.text}
              {speech.note ? ` ${speech.note}` : ""}
            </p>
            <div
              aria-hidden="true"
              className="max-h-[30vh] overflow-y-auto overscroll-contain text-sm leading-snug break-words sm:max-h-40"
            >
              <p>
                {typed}
                {typed.length < speech.text.length ? (
                  <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 bg-current motion-safe:animate-pulse" />
                ) : null}
              </p>
              {speech.note ? (
                <p className="mt-2 text-neon-yellow">{speech.note}</p>
              ) : null}
            </div>

            {tour && tourStep ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="mr-auto text-xs tabular-nums text-muted-foreground">
                  {Math.max(stepIndex, 0) + 1} of {Math.max(stepsNow.length, 1)}
                </span>
                <button
                  type="button"
                  className={buttonClass(false)}
                  onClick={() => go(-1)}
                  disabled={stepIndex <= 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={buttonClass(false)}
                  onClick={() => endTour(true)}
                >
                  Skip
                </button>
                <button
                  type="button"
                  className={buttonClass(true)}
                  onClick={() => go(1)}
                >
                  {onLast ? "Done" : "Next"}
                </button>
              </div>
            ) : null}

            {showInvite ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={buttonClass(true)}
                  onClick={() => beginTour(BEATBOT.autoTourId)}
                >
                  Show me
                </button>
                <button
                  type="button"
                  className={buttonClass(false)}
                  onClick={() => {
                    unlockFromGesture();
                    setTourCompleted(true);
                    commit({ tourCompleted: true });
                    setNotice(BEATBOT.optedOut);
                  }}
                >
                  Not now
                </button>
              </div>
            ) : null}
          </div>

          <div className="relative flex flex-wrap items-center gap-1 border-t border-border p-2">
            <button
              ref={helpButtonRef}
              type="button"
              className={buttonClass(false)}
              aria-expanded={helpOpen}
              aria-haspopup="menu"
              aria-controls="beatbot-help"
              onClick={() => {
                unlockFromGesture();
                setHelpOpen((open) => !open);
              }}
            >
              Help
            </button>
            {helpOpen ? (
              <div
                ref={helpRef}
                id="beatbot-help"
                role="menu"
                aria-label="BeatBot help topics"
                className={`absolute left-2 z-10 max-h-60 w-[min(16rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md ${
                  corner === "tl" || corner === "tr" || slim
                    ? "top-full mt-1"
                    : "bottom-full mb-1"
                }`}
                onKeyDown={(event) => moveMenu(event, helpRef.current)}
              >
                {BEATBOT.tours.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className="flex w-full flex-col items-start rounded-md px-3 py-2 text-left touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => beginTour(item.id)}
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.summary}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              className={iconButtonClass()}
              aria-pressed={muted}
              aria-label={muted ? "Unmute BeatBot" : "Mute BeatBot"}
              onClick={() => {
                const next = !muted;
                setMuted(next);
                setMutedState(next);
                commit({ muted: next });
                unlockFromGesture();
                if (!next) playCue("confirm");
              }}
            >
              {muted ? <MuteIcon /> : <SoundIcon />}
            </button>
            <button
              type="button"
              className={iconButtonClass()}
              aria-label="Hide BeatBot"
              onClick={() => {
                userHid.current = true;
                setCollapsed(true);
                setHelpOpen(false);
                commit({ collapsed: true });
              }}
            >
              <ChevronIcon />
            </button>
            <button
              type="button"
              className={iconButtonClass()}
              aria-label="Dismiss BeatBot"
              onClick={() => {
                setTourId(null);
                setTourStepId(null);
                setDismissed(true);
                setHelpOpen(false);
                setTourCompleted(true);
                commit({ dismissed: true, tourCompleted: true });
              }}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Highlight({
  target,
  reduced,
}: {
  target: HTMLElement;
  reduced: boolean;
}) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    target.classList.add("beatbot-target");
    const update = () => setRect(target.getBoundingClientRect());
    update();
    target.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      target.classList.remove("beatbot-target");
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [target, reduced]);

  if (!rect) return null;
  const pad = 6;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-30 rounded-lg"
      style={{
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
        boxShadow:
          "0 0 0 2px var(--neon-cyan), 0 0 0 9999px hsl(270 40% 6% / 0.38)",
      }}
    />
  );
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useTypedText(
  text: string,
  reduced: boolean,
  onPulse: () => void,
): string {
  const [count, setCount] = useState(text.length);
  const pulse = useRef(onPulse);
  pulse.current = onPulse;

  useEffect(() => {
    if (reduced || text.length === 0) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setCount(index);
      if (index % 2 === 0) pulse.current();
      if (index >= text.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [text, reduced]);

  return text.slice(0, count);
}

function findTarget(ids: string[]): HTMLElement | null {
  for (const id of ids) {
    const nodes = document.querySelectorAll<HTMLElement>(
      `[data-beatbot="${CSS.escape(id)}"]`,
    );
    for (const node of nodes) {
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") continue;
      const rect = node.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) continue;
      return node;
    }
  }
  return null;
}

function readControl(element: HTMLElement): FieldReading {
  const chain =
    element
      .closest("[data-beatbot-chain]")
      ?.getAttribute("data-beatbot-chain") ?? null;
  const input = controlInput(element);
  const ipfs = document.getElementById("ipfs-upload");
  return {
    value: input?.value ?? "",
    chain,
    min: numberAttr(input, "min"),
    max: numberAttr(input, "max"),
    ipfsOn:
      ipfs?.getAttribute("aria-checked") === "true" ||
      ipfs?.getAttribute("data-state") === "checked",
  };
}

function controlInput(
  element: HTMLElement,
): HTMLInputElement | HTMLTextAreaElement | null {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element;
  }
  const nested = element.querySelector("input, textarea");
  if (
    nested instanceof HTMLInputElement ||
    nested instanceof HTMLTextAreaElement
  ) {
    return nested;
  }
  return null;
}

function numberAttr(
  input: HTMLInputElement | HTMLTextAreaElement | null,
  name: "min" | "max",
): number | undefined {
  if (!(input instanceof HTMLInputElement)) return undefined;
  const raw = input.getAttribute(name);
  if (!raw) return undefined;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : undefined;
}

function pickCorner(
  width: number,
  height: number,
  target: DOMRect | null,
): Corner {
  const margin = 12;
  const spots: Record<Corner, { x: number; y: number }> = {
    bl: { x: margin, y: window.innerHeight - height - margin },
    br: {
      x: window.innerWidth - width - margin,
      y: window.innerHeight - height - margin,
    },
    tl: { x: margin, y: 76 },
    tr: { x: window.innerWidth - width - margin, y: 76 },
  };
  const order: Corner[] = ["bl", "br", "tr", "tl"];
  if (!target) return "bl";
  for (const name of order) {
    const spot = spots[name];
    const overlaps = !(
      spot.x + width < target.left - 8 ||
      spot.x > target.right + 8 ||
      spot.y + height < target.top - 8 ||
      spot.y > target.bottom + 8
    );
    if (!overlaps) return name;
  }
  return "tr";
}

function cornerStyle(corner: Corner, slim: boolean): CSSProperties {
  const x = "max(0.75rem, env(safe-area-inset-right))";
  const y = "max(0.75rem, env(safe-area-inset-bottom))";
  const left = "max(0.75rem, env(safe-area-inset-left))";
  const top = "max(0.75rem, env(safe-area-inset-top))";
  if (slim) return { top, left, right: x };
  if (corner === "br") return { bottom: y, right: x };
  if (corner === "tl") return { top: "4.75rem", left };
  if (corner === "tr") return { top: "4.75rem", right: x };
  return { bottom: y, left };
}

function moveMenu(event: ReactKeyboardEvent, menu: HTMLDivElement | null) {
  if (!menu) return;
  const items = [
    ...menu.querySelectorAll<HTMLButtonElement>("[role='menuitem']"),
  ];
  if (items.length === 0) return;
  const index = items.findIndex((item) => item === document.activeElement);
  if (event.key === "ArrowDown") {
    event.preventDefault();
    items[(index + 1 + items.length) % items.length]?.focus();
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    items[(index - 1 + items.length) % items.length]?.focus();
  } else if (event.key === "Home") {
    event.preventDefault();
    items[0]?.focus();
  } else if (event.key === "End") {
    event.preventDefault();
    items[items.length - 1]?.focus();
  }
}

function buttonClass(primary: boolean): string {
  return [
    "inline-flex h-11 items-center justify-center rounded-md px-3 text-sm font-medium touch-manipulation",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    primary
      ? "bg-primary text-primary-foreground"
      : "border border-border bg-card text-foreground",
  ].join(" ");
}

function iconButtonClass(): string {
  return "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-foreground touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 9h4l5-4v14l-5-4H4V9zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12z"
      />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 9h4l5-4v14l-5-4H4V9zm12.1 3 2.4-2.4 1.4 1.4L17.5 13.4l2.4 2.4-1.4 1.4-2.4-2.4-2.4 2.4-1.4-1.4 2.4-2.4-2.4-2.4 1.4-1.4 2.4 2.4z"
      />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.7 9.3 12 14.6l5.3-5.3 1.4 1.4L12 17.4 5.3 10.7z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"
      />
    </svg>
  );
}

const TARGET_STYLE = `
.beatbot-target {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 4px;
  scroll-margin: 6rem;
}
@media (prefers-reduced-motion: reduce) {
  .beatbot-target { scroll-margin: 4rem; }
}
`;
