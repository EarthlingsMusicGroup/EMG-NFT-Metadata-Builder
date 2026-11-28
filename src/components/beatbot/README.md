# BeatBot

Self-contained guide widget for Earthlings / SpaceBar sites. Copy this folder into another app, publish the model, audio, and Draco decoder at the `assetBase` URL, and mount `<BeatBotLoader />` once in the root layout. In this repo those files are real files in `public/beatbot/` (not a symlink), so Next and Vercel serve them at `/beatbot/`.

BeatBot (Beat “BB” Bot) is your Earthlings guide. He explains the page he is mounted on. He does not call a model or a backend.

## What lives here

- `config.ts` — model URL, Draco path, sound map, tour steps, field tips, storage key
- `checks.ts` — plain-language checks aligned with this app's validation
- `beatbot-widget.tsx` — bubble, tour, help menu, mute, dismiss
- `beatbot-scene.tsx` — lazy 3D view (three.js / react-three-fiber)

Static files live in `public/beatbot/`, one copy, no symlink:

- `public/beatbot/beatbot.glb` — Draco-compressed mesh (`KHR_draco_mesh_compression`)
- `public/beatbot/draco/` — decoder from three.js (`draco_wasm_wrapper.js`, `draco_decoder.wasm`)
- `public/beatbot/audio/` — Kenney CC0 beeps as `.ogg`, `.mp3`, and `.m4a`. See `public/beatbot/audio/LICENSES.md`

## Wire-up

1. Import `BeatBotLoader` in the root layout.
2. Mark highlight targets with `data-beatbot="id"` (ids are the `targets` arrays in `config.ts`).
3. Mark inputs with `data-beatbot-field="id"` (ids are the keys of `fields`).
4. Put `data-beatbot-chain` on a parent when a tip changes per chain.
5. Put `data-beatbot-step` on the visible builder step (`collection`, `images`, `metadata`, `export`).

Content Security Policy needs `'wasm-unsafe-eval'` in `script-src` so the Draco decoder can compile, and `worker-src 'self' blob:` so its worker can start. Keep the decoder on the same origin. A CDN host is blocked by this app's `connect-src`.

## Behavior

- Corner widget. Collapse hides the body. Dismiss leaves a Help button. Both are remembered, along with mute and whether the tour was finished (`localStorage` key `beatbot.prefs.v1`).
- No sound until a click or keypress. That tap creates and resumes the `AudioContext` synchronously, starts a one-sample buffer (required by iOS), and sets `navigator.audioSession.type = "playback"` when the browser has it, so the silent switch does not mute the beeps. Mute stops them. `confirmation_002` is the greeting trill. The page plays Ogg where the browser can decode it, otherwise MP3, otherwise AAC in m4a. A square-wave oscillator is scheduled in the same tap, so a failed sample still beeps. Unmute plays the confirm cue immediately.
- Motion is procedural (bob, tilt, hop while the line is typing, goggle glow). `prefers-reduced-motion` shows the full line at once and holds a still pose.
- The canvas loads only while the panel is open, and it unmounts while the keyboard or a dialog is up so the bubble can sit out of the way.

## Dropping this into spacebar.music

Copy this folder and publish `public/beatbot/` (the glb, `audio/`, and `draco/`) as real files at the `assetBase` URL. Do not symlink that folder into the component directory; Vercel cannot copy a symlink into a subdirectory of itself. Point `assetBase`, `modelUrl`, and `dracoPath` at those URLs. Replace the strings in `config.ts` with that site's pages and fields. `checks.ts` can stay or be swapped for the other app's rules. Peers: `react`, `react-dom`, `three`, `@react-three/fiber`, `@react-three/drei`.

The mesh and texture are SpaceBar's Earthlings assets. The audio files are Kenney CC0, with MP3 and AAC transcodes for iOS Safari (see the license file). The Draco decoder is Apache-2.0, shipped with three.js.
