# WildFrames — Vite + TSX + MDX + Framer Motion Design

**Date:** 2026-04-17  
**Status:** Approved

---

## Overview

Four interconnected upgrades to WildFrames:
1. Migrate build tooling from CRA (react-scripts) to Vite
2. Convert all JSX/JS to TSX/TS with strict TypeScript
3. Add Framer Motion full motion system across all pages
4. Build a file-based MDX engine for field notes with per-note routes

---

## 1. Build Tooling Migration

**Remove:** `react-scripts`, `@craco/craco`, `autoprefixer`, `postcss` (if CRA-only)  
**Add:** `vite`, `@vitejs/plugin-react`, `@mdx-js/rollup`, `remark-frontmatter`, `remark-mdx-frontmatter`, `typescript`, `@types/react`, `@types/react-dom`, `framer-motion`

### File changes
- `index.html` moves from `public/` to project root (Vite standard)
- `vite.config.ts` replaces CRA config — includes `@vitejs/plugin-react` and `@mdx-js/rollup`
- `tsconfig.json` added with `"strict": true`, `"jsx": "react-jsx"`, path aliases
- `package.json` scripts: `"start"` → `"vite"`, `"build"` → `"vite build"`, `"preview"` → `"vite preview"`
- `.gitignore` updated: add `.superpowers/`

### vite.config.ts shape
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    react(),
  ],
})
```

---

## 2. TypeScript Migration

All files renamed and typed. Strict mode enforced (`"strict": true`).

### Renames
| Old | New |
|-----|-----|
| `src/index.js` | `src/main.tsx` |
| `src/App.js` | `src/App.tsx` |
| `src/components/Header.jsx` | `src/components/Header.tsx` |
| `src/components/Hero.jsx` | `src/components/Hero.tsx` |
| `src/components/Gallery.jsx` | `src/components/Gallery.tsx` |
| `src/components/Blog.jsx` | `src/components/Blog.tsx` |
| `src/components/About.jsx` | `src/components/About.tsx` |
| `src/setupTests.js` | `src/setupTests.ts` |
| `src/reportWebVitals.js` | deleted (not used) |

### New shared types — `src/types/index.ts`
```ts
export interface Photo {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  species: string;
  location: string;
  featured: boolean;
}

export interface FieldNoteMeta {
  title: string;
  date: string;       // ISO 8601
  meta: string;       // category label e.g. "Composition in the field"
  excerpt: string;
  coverImage?: string;
}

export interface NavItem {
  path: string;
  label: string;
}
```

### Key type constraints
- `Gallery.tsx`: `activeIndex: number | null`
- `Hero.tsx`: `currentPhoto` derived only when `featuredPhotos.length > 0`
- `photos.json` imported with `as { photos: Photo[] }` assertion

---

## 3. Framer Motion — Full Motion System

### 3a. Page transitions
`App.tsx` uses `useLocation` to key `AnimatePresence`. Each page's top-level element becomes `<motion.div>`:

```ts
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}
```

### 3b. Scroll-reveal
Sections in Hero, Gallery, Blog, About use `motion.div` with:
```ts
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.15 }}
transition={{ duration: 0.5, ease: 'easeOut' }}
```

### 3c. Staggered children
Gallery rows and note card grids use container + child variants:
```ts
const container = { animate: { transition: { staggerChildren: 0.07 } } }
const child = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }
```

### 3d. Hero Ken Burns
Each slide's `<img>` is wrapped in `<motion.div>`:
```ts
key={currentSlide}   // resets animation on slide change
initial={{ scale: 1.0 }}
animate={{ scale: 1.08 }}
transition={{ duration: 6, ease: 'easeOut' }}
```
Images have `object-fit: cover; width: 100%; height: 100%` to fill background.

### 3e. Reduced motion
Wrap the entire app in `<MotionConfig reducedMotion="user">` in `App.tsx`. Framer Motion automatically disables all animations when the OS `prefers-reduced-motion` setting is active. No custom context needed.

---

## 4. MDX Field Notes Engine

### File layout
```
content/
  field-notes/
    snake-patience.mdx
    photographing-snakes.mdx
    field-notes-beside-gallery.mdx
src/
  lib/
    fieldNotes.ts          ← glob loader, frontmatter extractor, slug utils
  components/
    FieldNoteLayout.tsx    ← MDX page wrapper: title, date, back link, content
  pages/
    FieldNotePage.tsx      ← dynamic route, lazy-loads MDX module by slug
```

### MDX frontmatter format
```mdx
---
title: How patience changes a wildlife frame
date: 2026-04-01
meta: Observation, ethics, and timing
excerpt: The most memorable reptile photographs often happen after the camera has already been still for a while.
coverImage: /images/snake-patience.jpg
---

Full markdown + JSX content here...
```

### `src/lib/fieldNotes.ts`
Uses `import.meta.glob` to discover all MDX files:
```ts
const modules = import.meta.glob('../../content/field-notes/*.mdx', { eager: true })
```
Exports:
- `getAllNotes(): FieldNoteEntry[]` — sorted by date desc, includes slug + meta
- `getNoteBySlug(slug: string)` — returns lazy import for `FieldNotePage`

`FieldNoteEntry` type:
```ts
interface FieldNoteEntry extends FieldNoteMeta {
  slug: string;
}
```

### Routes
```tsx
<Route path="/blog"        element={<Blog />} />
<Route path="/blog/:slug"  element={<FieldNotePage />} />
```

### Blog.tsx (list view)
Replaces hardcoded array with `getAllNotes()`. Each card links to `/blog/${note.slug}`. Framer Motion staggered grid.

### FieldNotePage.tsx (detail view)
```tsx
const { slug } = useParams<{ slug: string }>();
// lazy import via getNoteBySlug(slug)
// renders <FieldNoteLayout meta={frontmatter}><MDXContent /></FieldNoteLayout>
```

### FieldNoteLayout.tsx
Renders: back link to `/blog`, cover image (if present), title, date, meta tag, MDX children. Framer Motion scroll-reveal on content sections.

---

## Data flow summary

```
content/field-notes/*.mdx
  → remark-frontmatter parses YAML frontmatter
  → remark-mdx-frontmatter exports it as named `frontmatter` export
  → import.meta.glob collects all modules
  → fieldNotes.ts extracts metadata + generates slugs
  → Blog.tsx renders list
  → FieldNotePage.tsx lazy-loads and renders detail
```

---

## Out of scope

- CMS or database backend
- Authentication
- Image optimization pipeline
- Comments or social features
- Search
