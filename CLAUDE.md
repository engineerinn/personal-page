# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start            # Dev server (Vite, http://localhost:5173)
npm run build        # Production build to /dist
npm run preview      # Preview the production build locally
npm run deploy       # Build + deploy to GitHub Pages (dist/ via gh-pages)
```

`src/App.test.tsx` exists but there is no `test` script and no Jest/Vitest configured — tests are not currently runnable.

## Stack

- React 19 + TypeScript (strict, ES2020 target, ESNext modules) via Vite (`@vitejs/plugin-react`)
- `react-router` v8 (`BrowserRouter`/`Routes`/`Route`) for client-side routing
- SCSS for all styling — component SCSS files live in `src/assets/styles/`
- MUI 9 for UI components (AppBar, Drawer, TextField, Chip) — **not** wrapped in MUI ThemeProvider
- FontAwesome for icons, `react-vertical-timeline-component` for the experience section
- `react-markdown` + `remark-gfm`/`remark-math`/`rehype-highlight`/`rehype-katex` for rendering blog posts from `public/posts/`
- `gh-pages` for deployment

## Architecture

Portfolio app with client-side routing via `react-router` (`BrowserRouter` in `App.tsx`). Two routes: `/` (home — `Main`, `Expertise`, `Timeline`, `Articles`, wrapped in `FadeIn`) and `/articles-list` (`ArticlesList`). Within the home view, section navigation still uses `scrollIntoView` targeting section IDs (`expertise`, `professional-experience`, `projects`, `publication`, `contact`).

**Blog/articles:** `public/posts/` holds Markdown files plus an `index.json` manifest; `Articles`, `ArticlesList`, and `Post` components render them via `react-markdown`.

**Theme:** `App.tsx` holds `mode` state (`"dark"` | `"light"`), and derives the `dark-mode`/`light-mode` class applied to `.main-container`. Both themes are defined in `src/index.scss` using descendant selectors — MUI components are styled via inline `sx` props, not ThemeProvider.

**Props:** Navigation receives `parentToChild` (containing `mode`) and `modeChange` callback as `any` typed props — old prop-drilling pattern, no Context.

**FadeIn wrapper** (`src/components/FadeIn.tsx`): Staggered entrance animation using `maxIsVisible` state counter. Wraps page sections.

**Barrel export:** All components are re-exported from `src/components/index.ts`.

## Key Patterns

- Dark/light mode is purely CSS class–based; toggle by swapping `.dark-mode` / `.light-mode` on `.main-container`
- Responsive breakpoints at 768px and 567px in SCSS; mobile navigation uses an MUI Drawer
- `Expertise` and `Publication` components share identical structure — they are intentional duplicates, not shared abstractions
- EmailJS integration in `Contact.tsx` is commented out; the form validates but does not send
