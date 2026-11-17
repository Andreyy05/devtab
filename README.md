# 🚀 DevTab — Developer Startpage

> **Ultra-fast, minimalist, and aesthetic new tab startpage crafted for developers.**  
> Keep your daily GitHub streak alive, access project workspaces instantly, take scratchpad notes, and search across developer engines in milliseconds.

![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)
![Vite](https://img.shields.io/badge/Vite-8-purple.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-black.svg)

---

## ✨ Features

- ⚡ **Aesthetic Header & Clock**: Real-time digital clock (24h/12h formats), localized date, and dynamic developer greeting.
- 🔍 **Omni Quick Search**: Switch seamlessly between **Google**, **GitHub**, **DuckDuckGo**, **Stack Overflow**, **MDN Web Docs**, and **Perplexity AI**.
  - Direct URL auto-detection: type `localhost:3000` or `ray.so` and jump right in!
  - Press `/` anywhere to immediately focus.
- 📌 **Categorized Bookmarks & Favicon Resolver**:
  - Organized by `Daily Dev`, `Reference`, `Tools`, `Cloud`, and custom tags.
  - Automatic high-resolution favicon resolution with fallback.
  - Add, edit, and delete bookmarks on the fly.
- 🐾 **Live GitHub Streak & Activity Rhythm**:
  - Real-time GitHub public API integration (no API key required).
  - Current streak counter, today's push count, and 14-day contribution rhythm dots.
  - Highlights top active repository.
- 📝 **Scratchpad & Daily Focus Tasks**:
  - **Scratchpad**: Monospace scratch area for code snippets, JWT tokens, or scratch notes with instant copy & character counter.
  - **Daily Tasks**: Checkbox list with progress bar and celebratory confetti when you finish your day's work!
  - Everything auto-saved to `localStorage`.
- 🎨 **Accent Themes & Preferences**:
  - 5 developer themes: Emerald, Cyber Cyan, Electric Violet, Neon Amber, Retro Rose.
  - Full data backup & restore (JSON export/import).
- ⌨️ **Keyboard First**:
  - `/` Focus search
  - `?` Shortcuts cheat sheet
  - `S` Preferences & Settings
  - `Esc` Blur / Close dialogs

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **CI/CD**: GitHub Actions workflow for zero-config GitHub Pages hosting

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/Andreyy05/devtab.git
cd devtab
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### 3. Build for Production

```bash
npm run build
```

---

## 🌐 Deploy to GitHub Pages (1-Click)

1. Push this repository to GitHub under your account (`Andreyy05/devtab`).
2. Go to **Settings** > **Pages** in your repository.
3. Under **Source**, choose **GitHub Actions**.
4. Push to `main` — the bundled `.github/workflows/deploy.yml` workflow will automatically build and publish your startpage live!

---

## 🧩 Use as Chrome / Edge New Tab

You can use DevTab as your default browser "New Tab" page:

### Method A: Browser Extension (Unpacked)
1. Run `npm run build` to generate the `/dist` directory.
2. In Chrome / Edge / Brave, open `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked** and select the `dist` folder.
5. Every time you open a new tab, DevTab loads instantly!

### Method B: Custom New Tab Redirector
If hosting on GitHub Pages, simply install any lightweight new-tab redirect extension (like *Custom New Tab URL*) and set it to your GitHub Pages URL:
`https://andreyy05.github.io/devtab/`

---

## 📄 License

MIT License © 2026 [Andrej Pavliščak](https://github.com/Andreyy05)
