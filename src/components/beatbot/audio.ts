import { BEATBOT, type SoundCue } from "./config";

/**
 * iOS Safari will not make a sound unless every one of these is true:
 * - `AudioContext` is constructed and `resume()` is called synchronously
 *   inside the tap or key handler. Awaiting first drops the gesture.
 * - Something actually calls `start()` in that same turn (a one-sample
 *   buffer is enough). Later beeps are fine only after that unlock.
 * - The clip is not Ogg. Safari's `decodeAudioData` rejects Vorbis, so each
 *   Kenney file also ships as MP3 and AAC in an m4a.
 * - `navigator.audioSession.type` is `"playback"` where the API exists.
 *   Otherwise the hardware silent switch mutes Web Audio and the page
 *   looks muted even after the visitor taps Unmute.
 *
 * The square-wave oscillator is scheduled in that same turn, before any
 * fetch. If a sample never decodes, the beeps still play.
 */

export type SampleFormat = "ogg" | "mp3" | "m4a";

const MIME: Record<SampleFormat, string> = {
  ogg: 'audio/ogg; codecs="vorbis"',
  mp3: "audio/mpeg",
  m4a: 'audio/mp4; codecs="mp4a.40.2"',
};

type AudioSession = {
  type: "auto" | "playback" | "transient" | "transient-solo" | "ambient";
};

let context: AudioContext | null = null;
let unlocked = false;
let muted = false;
let tickIndex = 0;
let loading: Promise<void> | null = null;
let format: SampleFormat | null = null;
const buffers = new Map<string, AudioBuffer>();

export function chooseFormat(canPlayType: (mime: string) => string): SampleFormat {
  if (isPlayable(canPlayType(MIME.ogg))) return "ogg";
  if (isPlayable(canPlayType(MIME.mp3))) return "mp3";
  return "m4a";
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function unlockFromGesture(): void {
  if (typeof window === "undefined") return;
  unlocked = true;
  enablePlaybackSession();
  try {
    const Ctx = audioContextConstructor();
    if (!Ctx) return;
    if (!context || (context.state as string) === "closed") context = new Ctx();
    const state = context.state as string;
    if (state === "suspended" || state === "interrupted") {
      void context.resume().catch(() => {
        // No output device, or the gesture was already consumed.
      });
    }
    primeContext(context);
    if (!format) format = detectFormat();
    if (!loading) loading = preload(context);
  } catch {
    context = null;
  }
}

export function playCue(cue: SoundCue): void {
  if (!canSchedule()) return;
  schedulePattern(cue);
  const name = cueName(cue);
  if (name) void playSample(name, cue === "open" ? 0.2 : 0.42);
}

export function playTick(): void {
  if (!canSchedule()) return;
  const when = context!.currentTime;
  scheduleBlip(when, 720 + (tickIndex % 5) * 110, 0.045, 0.03);
  if (tickIndex % 4 === 0) {
    const name = BEATBOT.sounds.ticks[tickIndex % BEATBOT.sounds.ticks.length];
    void playSample(name, 0.2);
  }
  tickIndex += 1;
}

function canSchedule(): boolean {
  return unlocked && !muted && !!context && !document.hidden;
}

function schedulePattern(cue: SoundCue): void {
  const start = context!.currentTime;
  if (cue === "greeting" || cue === "confirm") {
    scheduleBlip(start, 660, 0.07, 0.04);
    scheduleBlip(start + 0.08, 880, 0.07, 0.04);
    scheduleBlip(start + 0.16, 1180, 0.09, 0.045);
    return;
  }
  if (cue === "question") {
    scheduleBlip(start, 980, 0.06, 0.035);
    scheduleBlip(start + 0.09, 620, 0.1, 0.035);
    return;
  }
  if (cue === "step" || cue === "open") {
    scheduleBlip(start, 520, 0.05, 0.03);
    scheduleBlip(start + 0.06, 780, 0.07, 0.035);
  }
}

function scheduleBlip(
  when: number,
  frequency: number,
  duration: number,
  level: number,
): void {
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, when);
  gain.gain.setValueAtTime(level, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(when);
  oscillator.stop(when + duration + 0.02);
}

function primeContext(ctx: AudioContext): void {
  const buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  try {
    source.start(0);
  } catch {
    // A second unlock in the same millisecond can overlap this one-sample node.
  }
}

function enablePlaybackSession(): void {
  const session = (
    navigator as Navigator & { audioSession?: AudioSession }
  ).audioSession;
  if (!session) return;
  try {
    session.type = "playback";
  } catch {
    // A WebKit build can expose audioSession and still reject the write.
  }
}

function audioContextConstructor(): typeof AudioContext | null {
  if (typeof window.AudioContext === "function") return window.AudioContext;
  const webkit = (
    window as unknown as { webkitAudioContext?: typeof AudioContext }
  ).webkitAudioContext;
  return typeof webkit === "function" ? webkit : null;
}

function detectFormat(): SampleFormat {
  const probe = document.createElement("audio");
  return chooseFormat((mime) => probe.canPlayType(mime));
}

function isPlayable(answer: string): boolean {
  return answer === "probably" || answer === "maybe";
}

async function preload(ctx: AudioContext): Promise<void> {
  const names = new Set<string>([
    BEATBOT.sounds.greeting,
    BEATBOT.sounds.confirm,
    BEATBOT.sounds.question,
    BEATBOT.sounds.step,
    BEATBOT.sounds.open,
    ...BEATBOT.sounds.ticks,
  ]);
  await Promise.all([...names].map((name) => loadSample(ctx, name)));
}

async function loadSample(ctx: AudioContext, name: string): Promise<void> {
  if (buffers.has(name) || !format) return;
  for (const candidate of formatOrder(format)) {
    try {
      const response = await fetch(
        `${BEATBOT.assetBase}audio/${name}.${candidate}`,
      );
      if (!response.ok) continue;
      const data = await response.arrayBuffer();
      const decoded = await ctx.decodeAudioData(data.slice(0));
      buffers.set(name, decoded);
      return;
    } catch {
      // Try the next container. The oscillator already covered this cue.
    }
  }
}

function formatOrder(preferred: SampleFormat): SampleFormat[] {
  const rest = (["ogg", "mp3", "m4a"] as SampleFormat[]).filter(
    (item) => item !== preferred,
  );
  return [preferred, ...rest];
}

async function playSample(name: string, level: number): Promise<void> {
  if (!canSchedule() || !context) return;
  if (loading) await loading;
  if (!canSchedule() || !context) return;
  const state = context.state as string;
  if (state !== "running") return;
  const buffer = buffers.get(name);
  if (!buffer) return;
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = level;
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(context.destination);
  source.start();
}

function cueName(cue: SoundCue): string | null {
  switch (cue) {
    case "greeting":
      return BEATBOT.sounds.greeting;
    case "confirm":
      return BEATBOT.sounds.confirm;
    case "question":
      return BEATBOT.sounds.question;
    case "step":
      return BEATBOT.sounds.step;
    case "open":
      return BEATBOT.sounds.open;
    default:
      return null;
  }
}
