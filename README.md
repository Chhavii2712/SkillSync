<div align="center">

# ⚡ SkillSync
### Peer Learning, Reimagined.

> *Connect. Teach. Learn. Grow — 100% free, peer-to-peer.*

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-skill--sync--nu--nine.vercel.app-black?style=for-the-badge)](https://skill-sync-nu-nine.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## 🎯 The Problem

University students are full of skills — but locked inside rigid curriculums. A student who's mastered React has no platform to teach it. A student who needs UI/UX help has no way to find a peer who can.

Paid tutoring is expensive. Office hours are overloaded. YouTube gets you halfway.

**The gap between what students know and what they need to learn has no structured solution.**

---

## ✅ The Solution

**SkillSync** is a peer-to-peer skill exchange platform built exclusively for university students.

The model is simple:

> Teach Python for 2 hours → Get mentored in UI/UX Design for 2 hours.

No money. No middlemen. Just students helping students — organized into real campus hubs, with real accountability.

| Problem | How SkillSync Solves It |
|--------|--------------------------|
| No platform to teach peers | Skill exchange hubs at every campus |
| Paid tutoring is inaccessible | 100% free, token-based exchange model |
| Learning feels isolated | Collaborative spaces, workshops & team projects |
| Hard to find the right mentor | Browse hubs by skill, campus, or city |

---

## 🌐 Live Demo

🔗 **[https://skill-sync-nu-nine.vercel.app](https://skill-sync-nu-nine.vercel.app)**

---

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)

### Find a Hub
![Find a Hub](screenshots/find-hub.png)

### List Your Space
![List Your Space](screenshots/list-space.png)

### About
![About](screenshots/about.png)

### Careers
![Careers](screenshots/careers.png)

---

## ⚙️ Features

**🌍 Interactive 3D Globe Menu**
WebGL-powered InfiniteMenu on the home page — drag and spin a globe of skill cards, each linking to a hub category.

**🏛️ Hub Directory**
Browse active SkillSync hubs across the US. Filter by state, city, or campus. See live member counts and exchange stats per hub.

**🔐 Firebase Authentication**
Email/password sign up and login. Protected actions — users must be authenticated to join a hub or submit a space inquiry. Profile avatar visible after login.

**🗺️ FlowingMenu Navigation**
GSAP-powered marquee hover animation on the nav menu — each link reveals a scrolling image strip on hover.

**💫 Animated Stat Cards**
Count-up animations triggered on scroll across hub stats, member counts, and platform metrics.

**📋 Space Partner Inquiry**
Campus partners and landlords can apply to host a SkillSync hub — with a full animated performance dashboard showing hub metrics and earning estimates.

**🎨 Brutalist Design System**
Consistent visual identity — 2px black borders, grid accent patterns, yellow/orange/blue color system, serif headings, and bold uppercase type throughout.

**♻️ SPA Routing**
React Router v6 with Vercel rewrite rules — all routes work correctly on refresh and direct navigation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 + TypeScript |
| **Styling** | Tailwind CSS v3 |
| **Build Tool** | Vite 8 |
| **3D / WebGL** | gl-matrix — custom InfiniteMenu globe |
| **Animation** | GSAP — FlowingMenu, count-up, scroll reveal |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Deployment** | Vercel |
| **Routing** | React Router v6 |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/Chhavii2712/SkillSync.git
cd SkillSync

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Firebase config to .env

# Start the dev server
npm run dev
```

Open `http://localhost:5173`

### Environment Variables

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Structure

```
SkillSync/
├── public/
├── screenshots/             # README screenshots
├── src/
│   ├── components/
│   │   ├── InfiniteMenu.tsx     # WebGL 3D globe menu
│   │   ├── FlowingMenu.tsx      # GSAP marquee nav
│   │   ├── Navbar.tsx           # Top navigation
│   │   ├── Footer.tsx
│   │   ├── AuthModal.tsx        # Login / signup modal
│   │   └── ProtectedAction.tsx  # Auth gate wrapper
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── FindHub.tsx
│   │   ├── CampusSpace.tsx
│   │   ├── About.tsx
│   │   ├── History.tsx
│   │   └── Careers.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── firebase/
│   │   ├── config.ts
│   │   └── firestore.ts
│   └── data/
├── vercel.json
├── tailwind.config.js
└── package.json
```

---

## 👥 Team

<div align="center">

### 🏷️ Team InnovateX

| Name |
|------|
| **Chhavi Dubey** |
| **Aditi Choudhary** |

</div>

---

<div align="center">

Made with ☕ and a lot of `git push` by **Team InnovateX**

⭐ **Star this repo if you found it useful!**

</div>
