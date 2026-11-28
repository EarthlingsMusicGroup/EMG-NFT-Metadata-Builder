"use client";

import { E_LOGO, NAV_LINKS } from "@/components/landing/content";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

const linkClass =
  "inline-flex min-h-11 items-center rounded-md px-1 text-sm font-semibold text-[#E6DFD3] hover:text-white focus-visible:outline-none";

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-30 pt-[22px] min-[900px]:pt-[22px] max-[899px]:pt-4">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-5 min-[900px]:px-8">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3 rounded-md"
          aria-label="Earthlings Music, home"
        >
          <img
            src={E_LOGO.src}
            alt=""
            width={E_LOGO.width}
            height={E_LOGO.height}
            className="h-[38px] w-auto min-[900px]:h-12"
          />
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.14em] min-[900px]:text-sm">
            Earthlings Music
          </span>
        </Link>

        <nav aria-label="Page" className="hidden items-center gap-[30px] min-[900px]:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
          <Link
            href="/builder"
            className="inline-flex min-h-11 items-center rounded-[10px] bg-[#F4A63A] px-[18px] text-sm font-bold text-[#16120B] hover:bg-[#FFC15E] active:bg-[#E0942E]"
          >
            Open the Builder
          </Link>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/25 text-white hover:border-white/50 hover:bg-white/5 min-[900px]:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-[18px] bg-white" />
            <span className="block h-0.5 w-[18px] bg-white" />
            <span className="block h-0.5 w-[18px] bg-white" />
          </span>
        </button>
      </div>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className="mx-5 mt-3 rounded-2xl border border-[#2A2B30] bg-[#121315]/95 p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-md min-[900px]:hidden"
        >
          <nav aria-label="Page" className="flex flex-col">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#E6DFD3] hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/builder"
              className="mt-2 inline-flex min-h-11 items-center justify-center rounded-[10px] bg-[#F4A63A] px-4 text-sm font-bold text-[#16120B] hover:bg-[#FFC15E] active:bg-[#E0942E]"
              onClick={() => setOpen(false)}
            >
              Open the Builder
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
