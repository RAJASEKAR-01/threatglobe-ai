# ThreatGlobe AI 🌐⚡

Autonomous planetary cyber threat intelligence platform built with **Next.js (App Router)**, **Tailwind CSS**, **React Three Fiber**, **Three.js**, **drei**, **GSAP ScrollTrigger**, **Lenis**, and **Google Gemini AI**.

---

## 🚀 Key Features

### 1. Sticky Scrub Hero Section
- **Preloaded Frame scrubbing**: Smoothly scrubs through `/public/frames` (`f_0001.webp` to `f_0150.webp`) on desktop and `/public/frames-mobile` (`f_0001.webp` to `f_0100.webp`) on mobile screens.
- **Scroll Scaling**: Scales the canvas from `1.0` to `1.4` across the hero scroll using GSAP ScrollTrigger.
- **Scroll Milestones**: Headlines, HUD telemetry, and subtext smoothly fade in/out at set scroll progress milestones.

### 2. Interactive 3D Cyber Threat Globe
- **React Three Fiber & Drei OrbitControls**: High-performance 3D Earth rendered with latitude/longitude cyber point grids, atmospheric glow, and global node beacon hubs.
- **Glowing 3D Attack Arcs**: Real-time 3D quadratic Bezier curves with traveling photon pulse packets and expanding target impact rings.
- **Dynamic Simulation Engine**: Continuously generates simulated attack data (source, target, vector type: DDoS / Phishing / Malware / Ransomware, severity: Low / Medium / High / Critical, ports, bandwidth, and CVEs) refreshing every few seconds.
- **Vector Filter & Live Ticker**: Filter by vector type or click attacks directly from the live feed ticker.

### 3. Server-Side AI Analyst Panel
- **Slide-Over Cyber HUD**: Clicking any 3D arc or attack ticker item opens an incident analysis panel.
- **Secure Server-Side Route (`/api/analyze`)**: POSTs the attack to the server route handler where **Google Gemini** performs deep threat analysis. **The API key is never exposed to the client**.
- **Structured JSON Intelligence**:
  - `summary`: Strategic threat actor assessment.
  - `risk_level`: Low, Medium, High, or Critical.
  - `likely_attacker_technique`: MITRE ATT&CK reference (e.g., T1498, T1566, T1059, T1486).
  - `defense_steps`: 3 tactical mitigation playbook steps.
- **States**: Includes animated radar scanning loading state and error handling with retry capability (with autonomous heuristic fallback if no API key is provided).

### 4. Telemetry Stats Section
- Animated cyber progress bars for **Top Attack Types** (DDoS, Ransomware, Phishing, Malware).
- Geo-distributed matrix for **Top Targeted Regions** (North America, APAC, Europe, LATAM, MEA).
- Interactive timeframe switcher (`1H`, `24H`, `7D`) and live defense KPIs (DEFCON status, intercept rates, global sensors, triage latency).

### 5. Cyber HUD Design & Accessibility
- Dark cyber aesthetic with scanlines, CRT grids, neon cyan/purple/amber/rose accents, and HUD corner brackets.
- Full `prefers-reduced-motion` compliance plus a manual toggle in the navigation bar to inspect both modes.
- Futuristic boot loading screen with frame buffering progress bar.

---

## 🛠️ Quick Start

### 1. Install dependencies (already installed)
```bash
npm install
```

### 2. (Optional) Configure Gemini API Key
To connect live Google Gemini server-side analysis, create `.env.local`:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If omitted, ThreatGlobe AI automatically activates its built-in cybersecurity heuristic engine with zero disruption).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm start
```
