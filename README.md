# Amazing-Grace
Welcome to Amazing Grace Home Living. Providing secure, all-inclusive housing in Tampa and Largo

## Site Sections

### 🏠 Home / Listings (`/`)
The main homepage now serves as the only public listings page for Amazing Grace Home Living.

### 🎮 Arcade (`/arcade/`)
The Nexus Arcade hub — play faith-based games including **Mystery of the Seven Stars**, **Star Matrix**, and **Bible Study Quiz**.

- URL: `https://amazinggracehl.org/arcade/`
- Tracks level progress via `progression.js` (localStorage-backed)
- Includes a Bible Study route under `/arcade/bible-study/`
- Certificate viewer: `https://amazinggracehl.org/arcade/certificates/`

### ✝️ Ministry (`/ministry/`)
Faith-based content and ministry resources.

### 🔎 Matrix subdomain comparison workflow (`matrix.amazinggracehl.org`)
Use this **safe comparison flow** when you need to publish a specific historical commit (for example `5a2704c2cc4aaeac9a40ac0d532bbd9bbb5958a4`) without changing production `amazinggracehl.org`:

1. Create a separate GitHub Pages site (recommended: separate repository dedicated to matrix comparisons).
2. Check out the exact comparison commit in that separate deployment workflow.
3. Build and deploy that snapshot to the separate Pages site.
4. Configure the comparison site `CNAME` as `matrix.amazinggracehl.org`.
5. Add DNS `CNAME` record for `matrix` to the Pages target.
6. Keep this repository’s main Pages deployment unchanged for apex production traffic.

### 📚 Storybook Library (`/stories/`)
Story pages and character dossiers powered by `stories/library.json`.

- To sync `news/articles/*.html` into the Storybook Library, run: `node scripts/sync-story-library-from-news.js`

## ⚠️ Admin Dashboard (`/admin/`) — Experimental

> **Not linked in primary navigation.** This section is intentionally off-nav and isolated
> so that login prompts, 404s, or experimental features do not affect the main site.

The Sovereign Matrix Admin Dashboard provides browser-based tooling for user management,
audit logging, diagnostics, and admin key generation. It uses a localStorage shim for
demo/dev use and is designed to be upgraded to Firebase Auth in production.

If you deploy the Node backend (`server/mail.js`), inventory-management admin API routes
are protected by an `ADMIN_API_KEY` secret. Send either:
- `Authorization: Bearer <ADMIN_API_KEY>` or
- `X-Admin-Api-Key: <ADMIN_API_KEY>`

For Firebase Web SDK setup, copy `.env.example` to `.env` and provide `VITE_FIREBASE_*`
values before using `src/firebase/app.ts`.

- URL: `https://amazinggracehl.org/admin/`
- Login: `https://amazinggracehl.org/admin/login.html`
- **Demo accounts** (active on `localhost` / `*.github.io` only):
  - `owner@matrix.dev` / any password (4+ chars)
  - `superadmin@matrix.dev` / any password
  - `admin@matrix.dev` / any password


---

## 🏠 Property Addresses

| Reference | Full Address | Repo Asset Directory |
|---|---|---|
| 1144 | 1144 7th St NW, Largo, FL 33770 | `assets/images/1144-7th-street/` |
| 1142 | 1142 7th St NW, Largo, FL 33770 | `assets/images/1142-7th-street/` |
| 926 | **926 E Poinsettia Ave, Tampa, FL 33612, United States** | `assets/images/926-poinsettia/` |

> **Note for contributors:** The active listings are `1144`, `1142`, and `926-poinsettia`. The 926 listing is in **Tampa** (not Largo). The old routed gallery pages and Google Drive links were removed in favour of repo-hosted assets referenced directly from the homepage.

---

## 📁 Asset Folder Structure

```
assets/
├── logo.png                     ← Site nav logo (8.7 KB, 120×80 px)
├── icon-192.png                 ← PWA icon
├── icon-512.png                 ← PWA icon
├── icon-512-maskable.png        ← PWA maskable icon
│
├── images/                      ← Property photo sets and supporting illustrations
│   ├── 1144-7th-street/         ← 1144 7th St NW, Largo listing photos
│   ├── 1142-7th-street/         ← 1142 7th St NW, Largo listing photos
│   ├── 926-poinsettia/          ← 926 E Poinsettia Ave, Tampa listing photos
│   ├── ministry/                ← Ministry gallery videos preserved from issue uploads
│   └── supernova_explosion.svg  ← Game illustration
│
├── icons/                       ← Small game-optimised icons & sprite frames
│   ├── star_crystal_gold.svg
│   ├── star_crystal_blue.svg
│   ├── star_crystal_purple.svg
│   ├── star_crystal_red.svg
│   └── <name>_frame_N.png      ← Star Matrix animation sprites (add when ready)
│
├── audio/                       ← MP3 music & SFX served through shared asset paths
│   └── <filename>.mp3           ← served at /assets/audio/<filename>.mp3
│
└── music/                       ← Downloadable MIDI music archive
    └── <filename>.mid
```

The homepage reads listing photos directly from `assets/images/<slug>/`; the old `galleries/` route tree is no longer part of the site.

---

## 🌐 Domain Configuration

| | |
|---|---|
| **Domain** | `amazinggracehl.org` |
| **Repo** | `NicholaiMadias/Amazing-Grace` |
| **Pages** | `https://amazinggracehl.org/` |
| **CNAME** | `amazinggracehl.org` |

### DNS Records

```
A    @      → 185.199.108.153
A    @      → 185.199.109.153
A    @      → 185.199.110.153
A    @      → 185.199.111.153
CNAME www   → nicholaimadias.github.io
```

### Arcade Subdomain (`arcade.amazinggracehl.org`)

```
CNAME arcade → nicholaimadias.github.io
```

Points to the Nexus Arcade hosted on GitHub Pages.
