# Luna Pro

A playful, single-page profile for Luna the English Cocker Spaniel, built with React, TypeScript, Vite, Tailwind CSS, and SCSS. The page includes interactive sniffing and vacuum demos, a treat-catching canvas game, a photo gallery, and a roan coat parallax background below the hero.

## Project structure

- `src/components/` contains page sections and interactive features.
- `src/shared/` contains reusable buttons, cards, and section headers.
- `src/styles/` contains shared SCSS design tokens and global component styles.
- `src/index.css` loads Tailwind; custom SCSS is loaded separately from `src/main.tsx`.

The page uses section anchors and does not currently need a client-side router.

## Getting started

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the local Vite server.
- `npm run build` creates a production build in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs Oxlint.
- `npm run typecheck` checks the strict TypeScript configuration.
- `node scripts/make_transparent.js` regenerates transparent images from source photos in `public/images/`.

The image processing script uses Jimp, which is listed as a development dependency.
