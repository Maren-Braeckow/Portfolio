# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A static, dependency-free personal portfolio site (German-first, DE/EN toggle) for showcasing game projects — videos, audio clips, and itch.io links — with a built-in admin area for managing the content. No build step, no framework, no bundler, no package manager: plain HTML + CSS + vanilla JS loaded via `<script>` tags. All UI text and comments are in German; match that when editing.

This folder is **not a git repository**. There is no build, lint, or test tooling — to develop, open the `.html` files in a browser (see below) and edit source directly.

## Running

- **Public site:** open `index.html`.
- **Admin:** open `admin.html` (or click ⚙️ Admin in the nav — see visibility note below).
- Opening via `file://` or on `localhost`/`127.0.0.1` counts as the **local environment**; anything else is "online".

There is nothing to compile — a browser refresh reflects source edits immediately. The only runtime state lives in the browser's `localStorage`, so "resetting" during testing means clearing that (Admin → *Alles auf Standard zurücksetzen*, or clearing site data in devtools).

## Architecture

### Data lives in localStorage, not in files

`js/store.js` is the single data layer, shared by both pages. All content — projects, profile, and the two "about" texts — is read from and written to `localStorage` under the `portfolio.*.v1` keys (`STORE_KEY`, `PROFILE_KEY`, `ABOUT_KEY`, `ABOUT_EN_KEY`). When a key is absent, `Store` falls back to the `DEFAULT_PROJECTS` / `DEFAULT_PROFILE` / `DEFAULT_ABOUT[_EN]` constants at the top of `store.js`.

Key consequence: **edits made in the admin are per-browser and never touch any file.** The only way to persist/transport content is Admin → *Exportieren* (`Store.exportAll()` → `portfolio-data.json`) and *Importieren* (`Store.importAll()`). To change what fresh/online visitors see by default, edit the `DEFAULT_*` constants in `store.js` directly — there is no server or database.

The project data model (documented at the top of `store.js`): `{ id, title, description, kind: 'video'|'audio'|'link', videoUrl, audioUrl, links: [{label, url}] }`, plus `_en` sibling fields for translatable text (`title_en`, `description_en`).

### Two pages, overlapping scripts

- `index.html` loads `store.js` → `i18n.js` → `main.js`. `main.js` renders the public site from `Store` (profile header, about text, filterable project grid).
- `admin.html` loads `store.js` → `admin.js` only. **`admin.js` reuses helpers defined in `store.js`** (`escapeHtml`, `toEmbedUrl`, etc.) — that ordering is load-bearing.

Note the asymmetry: **`admin.html` does NOT load `i18n.js`**, so the admin UI is German-only by design; only the public site is bilingual.

### Internationalization (`i18n.js`, public site only)

Two mechanisms, both in `i18n.js`:
1. **Static UI strings** — the `I18N.de` / `I18N.en` dictionaries. `applyI18n()` walks `[data-i18n]` (textContent) and `[data-i18n-html]` (innerHTML) attributes in the DOM and fills them. Adding a translatable static label means adding both the HTML attribute and a matching key in *both* language maps.
2. **Per-item content** — `langField(obj, field)` returns `obj[field + '_en']` when the language is EN and that field is non-empty, otherwise falls back to the German `obj[field]`. This is how project titles/descriptions and the profile tagline switch language.

Language choice persists in `localStorage` (`portfolio.lang`); the 🌐 toggle re-runs `applyI18n()` + `renderAll()`.

### Media embedding

`videoHtml()` in `main.js` decides how to show a video URL using two helpers from `store.js`: `toEmbedUrl()` regex-matches YouTube/Vimeo IDs and returns an iframe embed URL; `isDirectVideo()` matches `.mp4/.webm/.ogv/.mov` and renders a `<video>`. Anything else falls back to a placeholder. Audio is a plain `<audio>` element. Uploaded files (photo, audio) are converted to **data URLs** via `FileReader` (`fileToDataUrl` in `admin.js`) and stored inline in localStorage — hence the hard size caps (photo 1.5 MB, audio 3 MB) and the "Speicher voll" guard in `persist()`; prefer URLs over uploads for anything large.

### Admin-link visibility

`main.js`'s `isLocalEnv()` / `applyEnvVisibility()` **hide** every `.admin-only` element (the ⚙️ Admin nav/footer links) when the site is served online, so visitors don't see them. This is cosmetic only — `admin.html` is still directly reachable by URL and there is no authentication. Don't treat the admin as access-controlled.

## Conventions

- **Everything runs through `escapeHtml` / `escapeAttr`** before being injected via `innerHTML` — all rendering is string-template based (no framework). Keep that discipline when adding markup so user/imported content can't inject HTML.
- German UI text, comments, and `toast()` messages throughout — stay consistent.
- No modules/imports: scripts share one global scope. Functions and the `Store` / `i18n` objects are globals; rely on script *load order* (store first) rather than imports.
- `README.md` (German) documents the same publish/export/import workflow for the end user.
