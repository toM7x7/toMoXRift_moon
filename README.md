# Luna Drift

Low-gravity moon walk XRift world with a rotating lunar shell, disabled infinite jump, and a procedural starfield.

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

## Texture Workflow

- Keep the original NASA source image in `assets/source/`.
- Regenerate runtime assets with `npm run assets:prepare` after replacing the NASA source files.
- The runtime build only reads `public/moon-surface-runtime.jpg`.
- The runtime height map is generated to `public/moon-height-runtime.png`.
- Replace the runtime image later without touching code when the final download is ready.

## Upload To XRift

```bash
xrift login
xrift upload world
```
