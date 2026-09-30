# Elle Kay — AI Creative Artist & 3D Designer Portfolio & Studio CMS

A bespoke, high-performance portfolio and content management system designed for **Elle Kay** (Architectural Visualization, Interior Design, AI Creative, and 3D Visualization).

---

## 🌟 Key Architecture & Highlights

### 1. Public Portfolio
- **Aesthetic**: Premium editorial, gallery dark mode (`#0c0c0e` canvas with warm typography and smooth interactions).
- **Core Sections**:
  - Hero with category badges, dynamic headline, and call-to-actions.
  - Curated Project Showcase with filterable categories, image galleries, and full-screen media modals.
  - Bespoke Services breakdown with scope deliverables and production stack badges.
  - Interactive Showreel player with custom sound controls and video backdrop.
  - Client & Regional Studies across 20+ countries and global studios.
  - Contact Section with email copy-to-clipboard, WhatsApp link, and consultation booking.
  - Universal Sitemap with direct route navigation.

### 2. Studio CMS (100% Light Mode)
- **Aesthetic**: Clean, high-contrast editorial light theme with gallery white backgrounds (`#f9f8f5` / `#ffffff`), dark charcoal typography (`#18181b`), subtle borders (`#ded7cc`), and shadow cards.
- **Universal Text Editor (`SiteContentEditor`)**:
  - Edit all website text without touching source code:
    - **Hero**: Eyebrow, headline, subheadline, CTA text, status pills.
    - **About**: Section title, biography paragraphs, creative ethos, stats.
    - **Services**: Service titles, descriptions, stack tags, deliverable scopes.
    - **Studies / AI Creative**: Headline, description, project count, client regions.
    - **Contact**: Headline, description, email, phone, direct WhatsApp link.
    - **Footer & Navigation**: Brand statements, copyright notice, social URLs.
- **Project CMS**:
  - Add, edit, duplicate, delete, and reorder projects.
  - Multi-image and multi-video management per project.
  - Custom project metadata: Slug, Category, Year, Location, Client, Role, Short & Long Descriptions.
  - Featured & Homepage visibility toggles.
- **Media Library**:
  - Upload JPG, PNG, WEBP, and MP4/WEBM video files.
  - Search, filter by media type (images vs. videos), preview, copy direct URL, and assign media directly to projects.
- **Persistence & Sync**:
  - Automatic persistence with fallback to local client storage.
  - Single-click **Save & Publish** flow with clear toast notifications.
  - Export & Import entire portfolio database as JSON for backup and versioning.

### 3. CMS Access
- **URL**: Navigate to `/admin` or click the **CMS** button in the header.
- **Passcode**: `redrazai@L12`

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 📦 How to Push to GitHub

To push this complete repository to your personal or organization GitHub account:

```bash
# 1. Create a new repository on GitHub (e.g. "elle-kay-portfolio")

# 2. Add your GitHub repository as the remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 3. Ensure branch is named 'main'
git branch -M main

# 4. Push all commits to GitHub
git push -u origin main
```

---

## 🚢 Deployment Options

This project is a modern Vite + React SPA that deploys in seconds to any static hosting platform:

### Cloudflare Pages
1. Connect your GitHub repository in the **Cloudflare Dashboard** > **Workers & Pages**.
2. Set **Build command**: `npm run build`
3. Set **Build output directory**: `dist`
4. Deploy!

### Vercel
1. Import repository from GitHub.
2. Framework preset: **Vite**.
3. Deploy!

### Netlify
1. Connect GitHub repo.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy!

---

## 🛠 Tech Stack
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: CSS Transitions & Hardware-Accelerated Transforms
- **Persistence**: LocalStorage / IndexedDB with JSON export/import
