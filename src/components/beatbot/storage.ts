import { BEATBOT } from "./config";

export type BeatBotPrefs = {
  dismissed: boolean;
  collapsed: boolean | null;
  muted: boolean;
  tourCompleted: boolean;
};

const DEFAULTS: BeatBotPrefs = {
  dismissed: false,
  collapsed: null,
  muted: false,
  tourCompleted: false,
};

export function loadPrefs(): BeatBotPrefs {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(BEATBOT.storageKey);
    if (!raw) return { ...DEFAULTS };
    const parsed = JSON.parse(raw) as Partial<BeatBotPrefs>;
    return {
      dismissed: parsed.dismissed === true,
      collapsed:
        typeof parsed.collapsed === "boolean" ? parsed.collapsed : null,
      muted: parsed.muted === true,
      tourCompleted: parsed.tourCompleted === true,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePrefs(prefs: BeatBotPrefs): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BEATBOT.storageKey, JSON.stringify(prefs));
  } catch {
    // Private mode and full storage still leave the widget usable.
  }
}
