# Luna Atlas

Shared XRift moon observatory with a central lunar model, dual equator ring walkways, synchronized model rotation/scale, and a NASA-backed space backdrop.

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
- Vertical drag and the up/down keys now follow the same "push the sphere" direction.
- Rotation and scale are synchronized through XRift instance state for multiplayer sessions.
- The moon now has a physical collider, so close fly-bys and jump landings can make contact with the model.

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
- Space backdrop source: NASA SVS `An Elsewhere Starfield` (ID 4856), released September 9, 2020.
- `An Elsewhere Starfield` visualizers: Ernie Wright (USRA) and Tom Bridgman (Global Science and Technology, Inc.).

## Upload To XRift

```bash
xrift login
xrift upload world
```
