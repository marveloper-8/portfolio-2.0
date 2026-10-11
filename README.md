# Joshua Samuel Equere | Senior Software Engineer Portfolio (Next.js)

A dark-themed, minimalist, high-performance portfolio web application built with **Next.js (App Router)** for **Joshua Samuel Equere**, Senior Software Engineer (Mobile, Web, Backend, & Cloud).

## Technology Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Library:** React 19
- **Styling:** Vanilla CSS design system with custom properties, glassmorphism, responsive grids, and `@media print` rules
- **Typography:** Next.js Google Fonts (`Inter`, `Space Grotesk`, `Syne`, and `JetBrains Mono`)
- **Icons & Assets:** Optimized SVGs and high-resolution NexaLabs brand assets

## Core Features

- **Embedded & Fullscreen CV Viewer (No Page Exit)**:
  - View the complete 2-page curriculum vitae inline or in an interactive fullscreen modal dialog without leaving the page.
  - **Download CV (PDF)**: Built-in print/download trigger leveraging `@media print` rules to produce an executive, print-ready PDF resume directly in the browser.
  - **Copy Plain Text ATS Resume**: 1-click clipboard copy for recruitment workflows.
- **Selected Works & NexaLabs Ventures**:
  - **[NexaLabs LTD](https://nexalabs.site)**: Flagship software publishing business & cloud infrastructure.
  - **[DoneThat: Sync](https://donethat.online)**: Real-time mobile task sync with WebSockets and PostgreSQL.
  - **[Bible Words: Play](https://play.lolaschools.com)**: 10k+ concurrent players, 99.9% uptime, AWS CloudFront.
  - **[LOLA - JAMB & WAEC Prep](https://lolaschools.com)**: National exam preparation platform with 65% faster live transmission.
  - **SynOption**, **LifeApp**, **BioCatlog**, **ProDevs**, **GidiJobs**, **Bethesda Child Support Foundation**.
- **Four Core Engineering Pillars**:
  - Backend & Data, Web & Mobile, Cloud & DevOps, Architecture & Patterns.
- **Interactive Go Terminal Snippet**:
  - Live production specification card (`system-spec.go`) demonstrating Go microservices and real-time WebSockets.
- **Direct Reachout**:
  - Interactive email composer, 1-click copy with toast notifications for email and phone, plus verified links to GitHub and LinkedIn.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Build for Production
```bash
npm run build
```
Generates an optimized production build ready for deployment on Vercel, Cloudflare Pages, AWS, or Coolify.
