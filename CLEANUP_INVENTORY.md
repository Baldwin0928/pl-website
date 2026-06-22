# Cleanup Inventory

This file tracks non-visual cleanup findings before visual or layout changes.

## Completed safe cleanup

- Removed stale/commented-only implementation notes from HTML pages.
- Removed the commented-out `join.html` CTA from `about.html`.
- Removed hidden `.nav__cta` links to nonexistent `join.html`.
- Removed the optional commented PDF download block from the hotfire press post.
- Removed nonexistent `join.html` from `sitemap.xml`.
- Consolidated repeated About page hero/team card rules in `assets/css/about.css`.
- Consolidated repeated homepage scroll quote and typewriter rules in `assets/css/styles.css`.
- Smoothed the homepage scroll quote reveal with eased scroll progress, overlapping word timing, and a longer fade into the Mission section.

## Confirmed structure

- The site is static HTML/CSS/JS.
- Main pages: `index.html`, `about.html`, `project.html`, `sponsors.html`, `press.html`, `contact.html`.
- One nested press post exists at `press/2025-11-09-hotfire.html`.
- Runtime CSS currently lives in `assets/css`.
- Runtime JS currently lives in `assets/js`.

## Cleanup targets that should preserve visuals

- Consolidate duplicated base/header/footer CSS currently repeated across `styles.css`, `contact.css`, `project.css`, and `sponsors.css`.
- Standardize page head/header/footer markup after screenshot comparison.
- Fix missing media references in `project.html` only when replacement images are chosen.

## Archived assets/source

These files were not referenced by current HTML/CSS during the cleanup scan and were moved to `assets/_archive/safe-cleanup-2026-06-20/` without deleting them:

- `assets/scss/`
- `assets/img/automationdirect.webp`
- `assets/img/fallfair.JPG`
- `assets/img/favicon.png`
- `assets/img/groupimage.JPG`
- `assets/img/gtplgrouppic.jpg`
- `assets/img/headshots/aaron.jpg`
- `assets/img/headshots/cosette.jpg`
- `assets/img/headshots/nathan.jpg`
- `assets/img/headshots/raj.jpg`
- `assets/img/headshots/ryan.jpg`
- `assets/img/line.svg`
- `assets/img/logo.jpg`
- `assets/img/sga.svg`
- `assets/img/traco.svg`
- `assets/media/test file`

## Broken references still to resolve

- `project.html` references missing `assets/img/media/media-1.jpg`, `assets/img/media/media-8.jpg`, and `assets/img/media/media-9.jpg`.
