# Luna Atlas

Shared XRift moon observatory with a central lunar model, an equator-line viewing deck, synchronized model rotation/scale, and a procedural starfield.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run typecheck
npm run build
```

## Interaction

- Spawn onto one section of the equator deck and face the shared moon model.
- Drag the moon directly to rotate it.
- Use the mouse wheel to scale the moon.
- Arrow keys also rotate the shared moon, and `-` / `=` scale it without any in-world UI.
- Rotation and scale are synchronized through XRift instance state for multiplayer sessions.

## Texture Workflow

- Keep the original NASA source image in `assets/source/`.
- Regenerate runtime assets with `npm run assets:prepare` after replacing the NASA source files.
- The runtime build only reads `public/moon-surface-runtime.jpg`.
- The runtime height map is generated to `public/moon-height-runtime.png`.
- Replace the runtime image later without touching code when the final download is ready.

## Credits

- Please credit this world's moon texture source to NASA's Scientific Visualization Studio.
- Source page: `CGI Moon Kit`, released September 6, 2019 and updated January 9, 2026.
- Visualizer: Ernie Wright (USRA).
- Scientist: Noah Petro (NASA/GSFC).
- Datasets used: LRO LOLA DEM and LROC WAC Color Mosaic (Natural Color Hapke Normalized WAC Mosaic).
- The NASA source maps are optimized for aesthetics, not scientific analysis.

## Upload To XRift

```bash
xrift login
xrift upload world
```
