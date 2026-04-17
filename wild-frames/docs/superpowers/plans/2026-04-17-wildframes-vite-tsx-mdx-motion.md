# WildFrames — Vite + TSX + MDX + Framer Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate WildFrames from CRA to Vite, convert all JS/JSX to strict TypeScript, add a full Framer Motion animation system, and build a file-based MDX engine for field notes with per-note routes.

**Architecture:** Vite replaces react-scripts as the build tool, enabling native TypeScript and MDX via `@mdx-js/rollup`. Framer Motion wraps every page in `AnimatePresence` for transitions and uses `whileInView` for scroll-reveal. Field notes live as `.mdx` files in `content/field-notes/`, discovered at build time via `import.meta.glob`.

**Tech Stack:** Vite 5, React 19, TypeScript 5 (strict), Framer Motion 11, @mdx-js/rollup, remark-frontmatter, remark-mdx-frontmatter, Vitest

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `vite.config.ts` | Vite + React + MDX plugin config |
| Create | `tsconfig.json` | TypeScript strict config |
| Create | `tsconfig.node.json` | TypeScript config for vite.config.ts |
| Create | `index.html` (root) | Vite entry HTML (replaces `public/index.html`) |
| Create | `src/vite-env.d.ts` | Vite client type declarations |
| Create | `src/types/index.ts` | Shared TS interfaces: Photo, FieldNoteMeta, FieldNoteEntry, NavItem |
| Create | `src/types/mdx.d.ts` | MDX module type declarations |
| Create | `src/lib/motionVariants.ts` | Shared Framer Motion variant definitions |
| Create | `src/lib/fieldNotes.ts` | MDX glob loader, slug utils, getAllNotes/getNoteModule |
| Create | `src/lib/fieldNotes.test.ts` | Vitest unit tests for fieldNotes utilities |
| Create | `src/components/FieldNoteLayout.tsx` | MDX page wrapper: back link, title, date, body |
| Create | `src/pages/FieldNotePage.tsx` | Dynamic route: loads MDX module by slug |
| Create | `content/field-notes/snake-patience.mdx` | First field note |
| Create | `content/field-notes/photographing-snakes.mdx` | Second field note |
| Create | `content/field-notes/field-notes-beside-gallery.mdx` | Third field note |
| Rename | `src/index.js` → `src/main.tsx` | React entry point |
| Rename | `src/App.js` → `src/App.tsx` | App shell + AnimatePresence + all routes |
| Rename | `src/components/Header.jsx` → `.tsx` | Typed nav component |
| Rename | `src/components/Hero.jsx` → `.tsx` | Hero with Ken Burns + scroll-reveal |
| Rename | `src/components/Gallery.jsx` → `.tsx` | Gallery with staggered animations |
| Rename | `src/components/Blog.jsx` → `.tsx` | Field notes list from MDX glob |
| Rename | `src/components/About.jsx` → `.tsx` | About with scroll-reveal |
| Rename | `src/setupTests.js` → `.ts` | Vitest setup |
| Modify | `package.json` | Replace react-scripts with Vite scripts + new deps |
| Modify | `.gitignore` | Add `.superpowers/`, `dist/` |
| Delete | `src/reportWebVitals.js` | Unused CRA utility |
| Delete | `public/index.html` | Replaced by root `index.html` |

---

## Task 1: Update package.json + install deps

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace scripts and deps in package.json**

Open `package.json` and replace the entire file with:

```json
{
  "name": "wild-frames",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "framer-motion": "^11.0.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^7.8.2"
  },
  "devDependencies": {
    "@mdx-js/rollup": "^3.0.0",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "jsdom": "^24.0.0",
    "remark-frontmatter": "^5.0.0",
    "remark-mdx-frontmatter": "^4.0.0",
    "typescript": "^5.4.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **Step 2: Install**

```bash
npm install
```

Expected: clean install, no peer dep errors. `node_modules/vite`, `node_modules/framer-motion`, `node_modules/@mdx-js` all present.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: migrate to Vite, add TypeScript + Framer Motion + MDX deps"
```

---

## Task 2: Vite config + TypeScript config + root index.html

**Files:**
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html` (project root)
- Modify: `.gitignore`

- [ ] **Step 1: Create vite.config.ts**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
      }),
    },
    react(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
  },
})
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "content"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 3: Create tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create root index.html** (Vite entry point — no `%PUBLIC_URL%`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#2b3d2f" />
    <meta
      name="description"
      content="WildFrames is a wildlife photography journal featuring immersive field encounters, herpetology-inspired storytelling, and atmospheric imagery from India."
    />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>WildFrames | Wildlife Photography Journal</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Update .gitignore**

Add these lines to `.gitignore`:

```
# Vite
/dist

# Superpowers visual companion
.superpowers/
```

- [ ] **Step 6: Delete public/index.html** (replaced by root index.html)

```bash
rm public/index.html
```

- [ ] **Step 7: Verify Vite starts**

```bash
npm start
```

Expected: Vite dev server starts on `http://localhost:5173`. App loads (may have TypeScript errors — that's fine at this stage, we're checking the server starts).

- [ ] **Step 8: Commit**

```bash
git add vite.config.ts tsconfig.json tsconfig.node.json index.html .gitignore
git commit -m "chore: add Vite config, TypeScript config, root index.html"
```

---

## Task 3: Shared types + MDX declarations + Vite env

**Files:**
- Create: `src/types/index.ts`
- Create: `src/types/mdx.d.ts`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Create src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 2: Create src/types/index.ts**

Note: `id` is `number` in `photos.json`. `region`, `style`, `thumbnailUrl` are present but only `imageUrl` is used in components — include them all for correctness.

```ts
export interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  species: string;
  location: string;
  region: string;
  style: string;
  featured: boolean;
}

export interface FieldNoteMeta {
  title: string;
  date: string;
  meta: string;
  excerpt: string;
  coverImage?: string;
}

export interface FieldNoteEntry extends FieldNoteMeta {
  slug: string;
}

export interface NavItem {
  path: string;
  label: string;
}
```

- [ ] **Step 3: Create src/types/mdx.d.ts**

```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react';
  import type { FieldNoteMeta } from './index';

  export const frontmatter: FieldNoteMeta;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/vite-env.d.ts src/types/index.ts src/types/mdx.d.ts
git commit -m "feat: add shared TypeScript types and MDX module declarations"
```

---

## Task 4: Motion variants library

**Files:**
- Create: `src/lib/motionVariants.ts`

- [ ] **Step 1: Create src/lib/motionVariants.ts**

```ts
import type { Variants } from 'framer-motion';

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8,  transition: { duration: 0.2 } },
};

export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const containerVariants: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07 } },
};

export const childVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/motionVariants.ts
git commit -m "feat: add shared Framer Motion variant definitions"
```

---

## Task 5: Convert entry point (index.js → main.tsx)

**Files:**
- Create: `src/main.tsx`
- Create: `src/setupTests.ts`
- Delete: `src/index.js`
- Delete: `src/reportWebVitals.js`
- Delete: `src/setupTests.js`
- Delete: `src/App.test.js`

- [ ] **Step 1: Create src/main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 2: Create src/setupTests.ts**

```ts
import '@testing-library/jest-dom';
```

- [ ] **Step 3: Delete old CRA files**

```bash
rm src/index.js src/reportWebVitals.js src/setupTests.js src/App.test.js
```

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx src/setupTests.ts
git rm src/index.js src/reportWebVitals.js src/setupTests.js src/App.test.js
git commit -m "feat: convert entry point to main.tsx, remove CRA utilities"
```

---

## Task 6: Convert App.tsx with AnimatePresence + MotionConfig + all routes

**Files:**
- Create: `src/App.tsx`
- Delete: `src/App.js`

`AnimatePresence` requires a `key` on the `Routes` element matching the current path so it can detect route changes and animate exits. `AnimatedRoutes` is a child component so it can call `useLocation()` (hooks must be inside `Router`).

- [ ] **Step 1: Create src/App.tsx**

```tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import Blog from './components/Blog';
import About from './components/About';
import FieldNotePage from './pages/FieldNotePage';
import './App.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<Hero />} />
        <Route path="/gallery"    element={<Gallery />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:slug" element={<FieldNotePage />} />
        <Route path="/about"      element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <div className="app-shell">
          <Header />
          <main>
            <AnimatedRoutes />
          </main>
        </div>
      </Router>
    </MotionConfig>
  );
}

export default App;
```

- [ ] **Step 2: Delete old App.js**

```bash
rm src/App.js
```

- [ ] **Step 3: Verify dev server still loads** (FieldNotePage and typed components don't exist yet — that's OK, TypeScript errors are expected)

```bash
npm start
```

Expected: Vite starts. Browser may show TS errors in overlay — that's fine, we're building incrementally.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git rm src/App.js
git commit -m "feat: convert App to TSX with AnimatePresence and MotionConfig"
```

---

## Task 7: Convert Header.tsx

**Files:**
- Create: `src/components/Header.tsx`
- Delete: `src/components/Header.jsx`

- [ ] **Step 1: Create src/components/Header.tsx**

```tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { NavItem } from '../types';

const navItems: NavItem[] = [
  { path: '/',        label: 'Home' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/blog',    label: 'Field Notes' },
  { path: '/about',   label: 'About' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="site-header">
      <nav className="site-nav">
        <Link to="/" className="brand-mark" onClick={() => setIsMenuOpen(false)}>
          <span className="brand-mark__eyebrow">Wildlife Photography</span>
          <span className="brand-mark__name">WildFrames</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-links ${isMenuOpen ? 'nav-links--open' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={location.pathname === item.path ? 'is-active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
```

- [ ] **Step 2: Delete old file**

```bash
rm src/components/Header.jsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git rm src/components/Header.jsx
git commit -m "feat: convert Header to TSX"
```

---

## Task 8: Convert Hero.tsx — Ken Burns + scroll-reveal

**Files:**
- Create: `src/components/Hero.tsx`
- Delete: `src/components/Hero.jsx`

The Ken Burns effect: wrap each slide's `<img>` in a `<motion.img>`. Key the animation to `currentSlide` using `key={currentSlide}` so `initial` resets on every slide change. Images need `object-fit: cover` — enforce this via `style` prop (the CSS class `reference-hero__image` should already have it, but we add it inline to guarantee correctness).

- [ ] **Step 1: Create src/components/Hero.tsx**

```tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import photosData from '../data/photos.json';
import type { Photo } from '../types';
import {
  pageVariants,
  sectionVariants,
  containerVariants,
  childVariants,
} from '../lib/motionVariants';

const photos = (photosData as { photos: Photo[] }).photos;
const featuredPhotos = photos.filter((p) => p.featured);
const reportPhotos = photos.slice(0, 4);

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!featuredPhotos.length) return undefined;
    const id = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPhotos.length);
    }, 5600);
    return () => window.clearInterval(id);
  }, []);

  if (!featuredPhotos.length) {
    return (
      <section className="page-shell page-shell--tight">
        <div className="empty-state">
          <p className="section-kicker">WildFrames</p>
          <h1>No featured photographs are available yet.</h1>
          <p>Add entries to the photo collection to bring the homepage to life.</p>
        </div>
      </section>
    );
  }

  const currentPhoto = featuredPhotos[currentSlide];

  return (
    <motion.div
      className="home-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <section className="reference-hero">
        <div className="reference-hero__media">
          {featuredPhotos.map((photo, index) => (
            <figure
              key={photo.id}
              className={`reference-hero__frame ${index === currentSlide ? 'is-visible' : ''}`}
            >
              <motion.img
                key={index === currentSlide ? `active-${currentSlide}` : photo.id}
                src={photo.imageUrl}
                alt={photo.title}
                className="reference-hero__image"
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                initial={{ scale: 1.0 }}
                animate={index === currentSlide ? { scale: 1.08 } : { scale: 1.0 }}
                transition={{ duration: 6, ease: 'easeOut' }}
              />
            </figure>
          ))}
          <div className="reference-hero__overlay" />
        </div>

        <div className="page-shell reference-hero__content">
          <p className="section-kicker">Wildlife Photography Journal</p>
          <h1>Field encounters, wild spaces, and a darker natural atmosphere.</h1>
          <p className="reference-hero__copy">
            A portfolio of reptiles, birds, and natural history moments photographed across
            India with the calmer editorial mood of a trip report.
          </p>
          <div className="hero-actions">
            <Link to="/gallery" className="button button--primary">Gallery</Link>
            <Link to="/blog"    className="button button--ghost">Stories</Link>
          </div>
        </div>
      </section>

      <motion.section
        className="page-shell reference-intro"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div>
          <p className="section-kicker">Introduction</p>
          <h2>A wildlife portfolio shaped like a trip report instead of a typical gallery.</h2>
        </div>
        <div className="reference-intro__copy">
          <p>
            The layout now follows a more report-like rhythm: long horizontal images,
            measured text blocks, subdued borders, and a dark natural palette that lets the
            photographs lead.
          </p>
          <p>
            This gives you a strong base now, while still leaving room to add richer
            gallery features later.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="page-shell report-preview"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="report-preview__header">
          <p className="section-kicker">Featured Report</p>
          <h2>{currentPhoto.title}</h2>
          <p>{currentPhoto.description}</p>
          <div className="report-preview__meta">
            <span>{currentPhoto.species}</span>
            <span>{currentPhoto.location}</span>
          </div>
        </div>

        <motion.div
          className="report-preview__stack"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {reportPhotos.map((photo) => (
            <motion.article key={photo.id} className="report-photo" variants={childVariants}>
              <img src={photo.imageUrl} alt={photo.title} />
              <div className="report-photo__caption">
                <p>{photo.title}</p>
                <span>{photo.species}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        className="page-shell journey-banner"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="journey-banner__content">
          <p className="section-kicker">Browse More</p>
          <h2>More photographs will slot naturally into this same image-led rhythm.</h2>
          <p>
            As you add more work later, the gallery can grow like an expedition archive
            rather than a card wall.
          </p>
        </div>
        <Link to="/gallery" className="button button--secondary">View Archive</Link>
      </motion.section>
    </motion.div>
  );
};

export default Hero;
```

- [ ] **Step 2: Delete old file**

```bash
rm src/components/Hero.jsx
```

- [ ] **Step 3: Check hero loads and Ken Burns runs**

Open `http://localhost:5173`. Home page should show: hero images filling the frame with a slow zoom, sections fading in on scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git rm src/components/Hero.jsx
git commit -m "feat: convert Hero to TSX with Ken Burns zoom and scroll-reveal"
```

---

## Task 9: Convert Gallery.tsx — staggered animations

**Files:**
- Create: `src/components/Gallery.tsx`
- Delete: `src/components/Gallery.jsx`

`activeIndex` typed as `number | null`. Row patterns typed. `motion.button` replaces `button` for gallery items.

- [ ] **Step 1: Create src/components/Gallery.tsx**

```tsx
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import photosData from '../data/photos.json';
import type { Photo } from '../types';
import {
  pageVariants,
  sectionVariants,
  containerVariants,
  childVariants,
} from '../lib/motionVariants';

interface RowPattern {
  rowClass: string;
  count: number;
  itemClasses: string[];
}

interface GalleryPhoto extends Photo {
  globalIndex: number;
}

interface GalleryRow {
  rowClass: string;
  photos: GalleryPhoto[];
  itemClasses: string[];
}

const rowPatterns: RowPattern[] = [
  {
    rowClass: 'trip-gallery__row trip-gallery__row--hero',
    count: 2,
    itemClasses: ['trip-gallery__item trip-gallery__item--wide', 'trip-gallery__item trip-gallery__item--wide'],
  },
  {
    rowClass: 'trip-gallery__row trip-gallery__row--triple',
    count: 3,
    itemClasses: ['trip-gallery__item', 'trip-gallery__item', 'trip-gallery__item'],
  },
  {
    rowClass: 'trip-gallery__row trip-gallery__row--feature-left',
    count: 3,
    itemClasses: ['trip-gallery__item trip-gallery__item--feature', 'trip-gallery__item', 'trip-gallery__item'],
  },
  {
    rowClass: 'trip-gallery__row trip-gallery__row--feature-right',
    count: 3,
    itemClasses: ['trip-gallery__item', 'trip-gallery__item', 'trip-gallery__item trip-gallery__item--feature'],
  },
];

const photos = (photosData as { photos: Photo[] }).photos;

const galleryRows: GalleryRow[] = (() => {
  const rows: GalleryRow[] = [];
  let photoIndex = 0;
  let patternIndex = 0;

  while (photoIndex < photos.length) {
    const pattern = rowPatterns[patternIndex % rowPatterns.length];
    const slice = photos.slice(photoIndex, photoIndex + pattern.count);
    const adjustedClass =
      slice.length === 1
        ? 'trip-gallery__row trip-gallery__row--single'
        : slice.length === 2
          ? 'trip-gallery__row trip-gallery__row--double'
          : pattern.rowClass;

    rows.push({
      rowClass: adjustedClass,
      photos: slice.map((photo, i) => ({ ...photo, globalIndex: photoIndex + i })),
      itemClasses: pattern.itemClasses,
    });

    photoIndex += slice.length;
    patternIndex += 1;
  }

  return rows;
})();

const Gallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current - 1 + photos.length) % photos.length;
    });
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null;
      return (current + 1) % photos.length;
    });
  }, []);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape')     setActiveIndex(null);
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft')  showPrevious();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, showNext, showPrevious]);

  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <motion.section
      className="page-shell page-shell--top"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="page-intro page-intro--narrow"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <p className="section-kicker">Trip Report Style Gallery</p>
        <h1>A collage-led archive with a proper image viewer.</h1>
        <p>
          The gallery now follows the expedition collage feel you pointed out, with
          clickable images that open into a full-screen lightbox with captions and arrows.
        </p>
      </motion.div>

      <div className="gallery-bleed">
        <motion.div
          className="trip-gallery trip-gallery--rows"
          variants={containerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.05 }}
        >
          {galleryRows.map((row) => (
            <div key={row.photos[0].id} className={row.rowClass}>
              {row.photos.map((photo, itemIndex) => (
                <motion.button
                  key={photo.id}
                  type="button"
                  className={row.itemClasses[itemIndex] ?? 'trip-gallery__item'}
                  onClick={() => setActiveIndex(photo.globalIndex)}
                  aria-label={`Open ${photo.title}`}
                  variants={childVariants}
                >
                  <img src={photo.imageUrl} alt={photo.title} />
                </motion.button>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {activePhoto !== null ? (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close image viewer"
          >
            ×
          </button>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => { e.stopPropagation(); showPrevious(); }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div
            className="lightbox__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={activePhoto.imageUrl} alt={activePhoto.title} className="lightbox__image" />
            <div className="lightbox__caption">
              <h2>{activePhoto.title}</h2>
              <p>{activePhoto.description}</p>
              <span>{activePhoto.species} • {activePhoto.location}</span>
            </div>
          </div>

          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      ) : null}
    </motion.section>
  );
};

export default Gallery;
```

- [ ] **Step 2: Delete old file**

```bash
rm src/components/Gallery.jsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Gallery.tsx
git rm src/components/Gallery.jsx
git commit -m "feat: convert Gallery to TSX with staggered motion animations"
```

---

## Task 10: Convert About.tsx — scroll-reveal

**Files:**
- Create: `src/components/About.tsx`
- Delete: `src/components/About.jsx`

- [ ] **Step 1: Create src/components/About.tsx**

```tsx
import React from 'react';
import { motion } from 'framer-motion';
import { pageVariants, sectionVariants } from '../lib/motionVariants';

const About: React.FC = () => {
  return (
    <motion.section
      className="page-shell page-shell--top"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="about-layout"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.1 }}
      >
        <div className="page-intro">
          <p className="section-kicker">About</p>
          <h1>A wildlife photographer building a slower, more atmospheric archive.</h1>
          <p>
            WildFrames is shaped around close observation, habitat awareness, and a visual
            language that lets wildlife feel rooted in place rather than isolated from it.
          </p>
        </div>

        <div className="about-card">
          <h2>The approach</h2>
          <p>
            The photographs here are meant to feel grounded and generous. That means natural
            light, minimal interference, and compositions that preserve the mood of the
            encounter.
          </p>
          <p>
            The redesign follows the same philosophy: softer contrast, organic spacing,
            earthy color, and typography that feels more like a field publication than a
            software template.
          </p>
        </div>

        <div className="detail-list detail-list--about">
          <div>
            <span>Base region</span>
            <strong>Karnataka, India</strong>
          </div>
          <div>
            <span>Favorite subjects</span>
            <strong>Snakes, forest-edge species, and intimate wildlife portraits</strong>
          </div>
          <div>
            <span>Creative intention</span>
            <strong>To make people feel calmer, more curious, and more protective of wild spaces</strong>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default About;
```

- [ ] **Step 2: Delete old file**

```bash
rm src/components/About.jsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git rm src/components/About.jsx
git commit -m "feat: convert About to TSX with scroll-reveal"
```

---

## Task 11: fieldNotes.ts library + Vitest tests

**Files:**
- Create: `src/lib/fieldNotes.ts`
- Create: `src/lib/fieldNotes.test.ts`

The glob path `'../../content/field-notes/*.mdx'` is relative to `src/lib/fieldNotes.ts`. Two levels up reaches the project root, then into `content/field-notes/`. Correct.

`getAllNotesFromModules` is exported separately so tests can inject a fake modules map without mocking `import.meta.glob`.

- [ ] **Step 1: Write the failing tests first**

Create `src/lib/fieldNotes.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { pathToSlug, getAllNotesFromModules } from './fieldNotes';
import type { FieldNoteMeta } from '../types';

const makeMeta = (overrides: Partial<FieldNoteMeta> = {}): FieldNoteMeta => ({
  title: 'Test Note',
  date: '2026-01-15',
  meta: 'Test category',
  excerpt: 'Test excerpt',
  ...overrides,
});

describe('pathToSlug', () => {
  it('extracts slug from a full MDX path', () => {
    expect(pathToSlug('../../content/field-notes/snake-patience.mdx')).toBe('snake-patience');
  });

  it('handles nested paths', () => {
    expect(pathToSlug('/some/deep/path/my-note.mdx')).toBe('my-note');
  });

  it('returns empty string for path with no filename', () => {
    expect(pathToSlug('')).toBe('');
  });
});

describe('getAllNotesFromModules', () => {
  const mockModules = {
    '../../content/field-notes/newer-note.mdx': {
      frontmatter: makeMeta({ title: 'Newer Note', date: '2026-03-01' }),
      default: () => null,
    },
    '../../content/field-notes/older-note.mdx': {
      frontmatter: makeMeta({ title: 'Older Note', date: '2026-01-01' }),
      default: () => null,
    },
    '../../content/field-notes/middle-note.mdx': {
      frontmatter: makeMeta({ title: 'Middle Note', date: '2026-02-01' }),
      default: () => null,
    },
  } as Parameters<typeof getAllNotesFromModules>[0];

  it('returns one entry per module', () => {
    expect(getAllNotesFromModules(mockModules)).toHaveLength(3);
  });

  it('sorts entries by date descending (newest first)', () => {
    const notes = getAllNotesFromModules(mockModules);
    expect(notes[0].title).toBe('Newer Note');
    expect(notes[1].title).toBe('Middle Note');
    expect(notes[2].title).toBe('Older Note');
  });

  it('maps slug from filename', () => {
    const notes = getAllNotesFromModules(mockModules);
    const slugs = notes.map((n) => n.slug);
    expect(slugs).toContain('newer-note');
    expect(slugs).toContain('older-note');
    expect(slugs).toContain('middle-note');
  });

  it('includes all frontmatter fields in each entry', () => {
    const notes = getAllNotesFromModules(mockModules);
    const note = notes.find((n) => n.slug === 'newer-note');
    expect(note).toMatchObject({
      slug: 'newer-note',
      title: 'Newer Note',
      date: '2026-03-01',
      meta: 'Test category',
      excerpt: 'Test excerpt',
    });
  });
});
```

- [ ] **Step 2: Run tests — expect failure** (module doesn't exist yet)

```bash
npm test
```

Expected: `Error: Failed to resolve import "./fieldNotes"` or similar. Tests cannot find the module.

- [ ] **Step 3: Create src/lib/fieldNotes.ts**

```ts
import type { ComponentType } from 'react';
import type { FieldNoteEntry, FieldNoteMeta } from '../types';

export interface MDXModule {
  frontmatter: FieldNoteMeta;
  default: ComponentType;
}

export function pathToSlug(path: string): string {
  return path.split('/').pop()?.replace('.mdx', '') ?? '';
}

export function getAllNotesFromModules(
  modules: Record<string, MDXModule>,
): FieldNoteEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => ({
      slug: pathToSlug(path),
      ...mod.frontmatter,
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getNoteModuleFromMap(
  modules: Record<string, MDXModule>,
  slug: string,
): MDXModule | undefined {
  const entry = Object.entries(modules).find(
    ([path]) => pathToSlug(path) === slug,
  );
  return entry?.[1];
}

const _modules = import.meta.glob<MDXModule>(
  '../../content/field-notes/*.mdx',
  { eager: true },
);

export function getAllNotes(): FieldNoteEntry[] {
  return getAllNotesFromModules(_modules);
}

export function getNoteModule(slug: string): MDXModule | undefined {
  return getNoteModuleFromMap(_modules, slug);
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

Expected output:
```
✓ src/lib/fieldNotes.test.ts (6)
  ✓ pathToSlug > extracts slug from a full MDX path
  ✓ pathToSlug > handles nested paths
  ✓ pathToSlug > returns empty string for path with no filename
  ✓ getAllNotesFromModules > returns one entry per module
  ✓ getAllNotesFromModules > sorts entries by date descending (newest first)
  ✓ getAllNotesFromModules > maps slug from filename
  ✓ getAllNotesFromModules > includes all frontmatter fields in each entry

Test Files  1 passed (1)
Tests       7 passed (7)
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/fieldNotes.ts src/lib/fieldNotes.test.ts
git commit -m "feat: add fieldNotes MDX glob loader with Vitest tests"
```

---

## Task 12: FieldNoteLayout.tsx

**Files:**
- Create: `src/components/FieldNoteLayout.tsx`

- [ ] **Step 1: Create src/components/FieldNoteLayout.tsx**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { FieldNoteMeta } from '../types';
import { sectionVariants } from '../lib/motionVariants';

interface Props {
  meta: FieldNoteMeta;
  children: React.ReactNode;
}

const FieldNoteLayout: React.FC<Props> = ({ meta, children }) => {
  return (
    <section className="page-shell page-shell--top">
      <div className="page-intro">
        <Link to="/blog" className="text-link">← Field Notes</Link>

        {meta.coverImage !== undefined && (
          <img
            src={meta.coverImage}
            alt={meta.title}
            className="field-note__cover"
            style={{ width: '100%', objectFit: 'cover', marginTop: '1.5rem' }}
          />
        )}

        <p className="section-kicker">{meta.meta}</p>
        <h1>{meta.title}</h1>
        <time className="field-note__date" dateTime={meta.date}>
          {new Date(meta.date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </div>

      <motion.div
        className="field-note__body"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default FieldNoteLayout;
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FieldNoteLayout.tsx
git commit -m "feat: add FieldNoteLayout MDX page wrapper"
```

---

## Task 13: FieldNotePage.tsx

**Files:**
- Create: `src/pages/FieldNotePage.tsx`

- [ ] **Step 1: Create src/pages/ directory and FieldNotePage.tsx**

```bash
mkdir -p src/pages
```

Create `src/pages/FieldNotePage.tsx`:

```tsx
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getNoteModule } from '../lib/fieldNotes';
import FieldNoteLayout from '../components/FieldNoteLayout';
import { pageVariants } from '../lib/motionVariants';

const FieldNotePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (slug === undefined) return <Navigate to="/blog" replace />;

  const mod = getNoteModule(slug);
  if (mod === undefined) return <Navigate to="/blog" replace />;

  const MDXContent = mod.default;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <FieldNoteLayout meta={mod.frontmatter}>
        <MDXContent />
      </FieldNoteLayout>
    </motion.div>
  );
};

export default FieldNotePage;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/FieldNotePage.tsx
git commit -m "feat: add FieldNotePage dynamic MDX route"
```

---

## Task 14: Convert Blog.tsx — MDX-powered list

**Files:**
- Create: `src/components/Blog.tsx`
- Delete: `src/components/Blog.jsx`

- [ ] **Step 1: Create src/components/Blog.tsx**

```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllNotes } from '../lib/fieldNotes';
import {
  pageVariants,
  sectionVariants,
  containerVariants,
  childVariants,
} from '../lib/motionVariants';

const Blog: React.FC = () => {
  const notes = getAllNotes();

  return (
    <motion.section
      className="page-shell page-shell--top"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="page-intro"
        variants={sectionVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <p className="section-kicker">Field Notes</p>
        <h1>Short essays on habitat, behavior, and the craft behind the frame.</h1>
        <p>
          Each note pairs the photograph with the field context — the encounter,
          the light, and the decision that shaped the frame.
        </p>
      </motion.div>

      <motion.div
        className="notes-grid"
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        {notes.map((note) => (
          <motion.article key={note.slug} className="note-card" variants={childVariants}>
            <p className="note-card__meta">{note.meta}</p>
            <h2>{note.title}</h2>
            <p>{note.excerpt}</p>
            <Link to={`/blog/${note.slug}`} className="text-link">
              Read field note →
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Blog;
```

- [ ] **Step 2: Delete old file**

```bash
rm src/components/Blog.jsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Blog.tsx
git rm src/components/Blog.jsx
git commit -m "feat: convert Blog to TSX, load field notes from MDX glob"
```

---

## Task 15: Create MDX content files

**Files:**
- Create: `content/field-notes/snake-patience.mdx`
- Create: `content/field-notes/photographing-snakes.mdx`
- Create: `content/field-notes/field-notes-beside-gallery.mdx`

- [ ] **Step 1: Create content/field-notes/ directory**

```bash
mkdir -p content/field-notes
```

- [ ] **Step 2: Create content/field-notes/snake-patience.mdx**

```mdx
---
title: How patience changes a wildlife frame
date: 2026-04-01
meta: Observation, ethics, and timing
excerpt: The most memorable reptile photographs often happen after the camera has already been still for a while. Field patience shapes composition as much as technique.
---

## Patience as technique

The most memorable reptile photographs often happen after the camera has already been still for a while.

When you arrive at a location and immediately start shooting, you photograph a disturbed animal — tense posture, alert eye, tongue flicking rapidly. Wait fifteen minutes without moving and you photograph something entirely different: an animal at rest inside its own context.

Field patience is not a personality trait. It is a technique with measurable results.

## What you're waiting for

You're waiting for the animal to forget you're there. That usually takes longer than you expect. A snake disturbed by your approach may stay coiled and rigid for ten minutes before the muscles begin to loosen. A lizard startled off a rock won't resume basking for five to eight minutes — and even then, it will check your position every thirty seconds.

The moment it stops checking is the moment worth photographing.

## Composition follows patience

The longer you wait, the more options you have. The animal moves into better light. It orients itself more naturally against the background. The tense, alert posture opens into something that tells you more about the species — the slow eye movement of a chameleon, the deliberate tongue-flick of a viper reading chemical signals, the relaxed coil of a rat snake in afternoon warmth.

Patience doesn't just reduce disturbance. It gives the subject time to become itself again.
```

- [ ] **Step 3: Create content/field-notes/photographing-snakes.mdx**

```mdx
---
title: Photographing snakes without losing the atmosphere
date: 2026-03-15
meta: Composition in the field
excerpt: Habitat matters. Wide negative space, natural textures, and low-contrast light help a frame feel true to the encounter instead of staged.
---

## The habitat is the subject

Most snake photographs fail not because of the snake but because of everything around it.

A tight crop on a cobra removes everything that explains why the cobra is there. A flash-lit frame against dirt erases the ambient mood that made the encounter feel significant in the first place. The habitat is not the background. It is half the subject.

## Negative space and the sense of scale

Forest-floor snakes are often small relative to their environment. Keeping significant negative space around the animal communicates scale and says something true about what it's like to find one — the sudden presence of something small and precise in a large, textured world.

Resist the instinct to fill the frame. A rat snake against a wide spread of leaf litter is more honest than a tight portrait of the same animal.

## Light that matches the encounter

Most herpetology encounters happen in overcast conditions, in shade, or in the soft window of early morning. That light is gentle and directional without being harsh. It's worth waiting for.

If you're working in midday sun, move to where the animal is in open shade rather than positioning yourself so the sun is behind you. High-contrast light on scales tends to read as illustration rather than observation.

## What to avoid

- Flash as primary light source — it flattens scales and removes ambient atmosphere
- Backgrounds that are out of focus to the point of abstraction
- Angles that look downward — side-on or near-ground perspectives feel more like a field encounter
- Backgrounds that include footwear, hands, or any visible human presence unless that's intentional
```

- [ ] **Step 4: Create content/field-notes/field-notes-beside-gallery.mdx**

```mdx
---
title: Why field notes belong beside the gallery
date: 2026-03-01
meta: Storytelling and conservation
excerpt: A photograph can stop someone. A story keeps them there. Pairing the frame with context gives the collection more weight and personality.
---

## The photograph is the beginning

A photograph can stop someone mid-scroll. A good one creates the sensation of being present — the quality of light, the detail on the scales, the suggestion of a real encounter rather than a constructed image.

But it doesn't answer any questions. It only raises them.

The field note answers the questions. Where was this? What time of day? What was the animal doing? Was it dangerous? Is it rare? How long did you wait?

## Context changes how people see

When someone reads that a photograph was taken during a three-hour sit on a forest trail in the Western Ghats at first light, the image becomes different. It has duration, location, decision-making. It stops being a picture and becomes evidence.

This matters for conservation. People protect what they understand, and they understand what they can place in context. A snake with a name, a habitat, and a behavior is harder to dismiss than an anonymous image in a gallery.

## The journal form

This site uses a journal structure deliberately. The gallery is not separate from the notes — they're part of the same thing. A photograph made more legible by its accompanying observation, and an observation made more vivid by the image beside it.

Field notes don't need to be long. A paragraph explaining why you were there, what the conditions were, and what the animal was doing is often enough. The goal is not narration. It's context.
```

- [ ] **Step 5: Verify Blog page loads with real notes**

Open `http://localhost:5173/blog`. Should show 3 note cards loaded from the MDX files. Each card's "Read field note →" link should navigate to `/blog/snake-patience`, etc., and render the MDX content.

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "feat: add three initial MDX field notes with frontmatter"
```

---

## Task 16: Final cleanup + build verification

**Files:**
- Verify no `.jsx` or `.js` source files remain in `src/`
- Verify TypeScript compiles clean
- Verify Vite production build passes

- [ ] **Step 1: Check for remaining JSX/JS source files**

```bash
find src -name "*.jsx" -o -name "*.js" | grep -v node_modules
```

Expected: no output. If any files appear, convert or delete them before continuing.

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors). Common issues to fix if they appear:
- `'x' is possibly 'undefined'` → add null guard or `??` fallback
- `Parameter 'x' implicitly has an 'any' type` → add explicit type annotation
- `Property 'x' does not exist on type 'Y'` → update the interface in `src/types/index.ts`

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected:
```
Test Files  1 passed (1)
Tests       7 passed (7)
```

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: `dist/` created, no errors. Output should show JS and CSS chunks under `dist/assets/`.

- [ ] **Step 5: Smoke-test the production build**

```bash
npm run preview
```

Open `http://localhost:4173`. Verify:
- Home page loads with Ken Burns zoom on hero images
- Sections fade in on scroll
- Gallery loads with staggered animation
- `/blog` shows 3 field note cards
- `/blog/snake-patience` renders full MDX content
- `/about` loads with scroll-reveal
- Page transitions animate between routes

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete Vite + TSX + MDX + Framer Motion migration"
```
