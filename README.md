# Lensight — AI Video Intelligence Platform

[![React](https://img.shields.io/badge/React-19.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3.5-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7.18.5-CA4245?logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Recharts](https://img.shields.io/badge/Recharts-v3.10.1-22C55E)](https://recharts.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Lensight** is a security-operations-grade frontend web dashboard engineered for enterprise surveillance monitoring, AI detection review (Person, Vehicle, Motion, Restricted Area), camera health management, and real-time alert triage in a centralized, responsive workspace.

---

## ⚠️ Important Project Transparency Notice ("Honesty Rule")

> **Demo Data & Simulation Disclaimer:**  
> This application is a **frontend-focused engineering implementation**. All video feeds, alert logs, camera metrics, and AI detection events are generated via structured mock datasets and simulated latency API services (`src/services/mockApi.ts`).  
> **No live computer vision inference or active RTSP/WebRTC backend stream is running.** All bounding-box detection tags and video feeds are simulated to showcase production-grade UI/UX workflows for security operators without misleading claims.

---

## 📑 Table of Contents

1. [Platform Overview](#-platform-overview)
2. [Key Modules & Features](#-key-modules--features)
3. [UI/UX & Design System](#-uiux--design-system)
4. [System Architecture & Data Flow](#-system-architecture--data-flow)
5. [Team Contributions & Section Breakdown](#-team-contributions--section-breakdown)
6. [Tech Stack](#-tech-stack)
7. [Getting Started & Installation](#-getting-started--installation)
8. [Project Structure](#-project-structure)
9. [Evaluation Criteria Matrix](#-evaluation-criteria-matrix)
10. [Submission & Deliverables](#-submission--deliverables)

---

## 🔭 Platform Overview

Security and surveillance teams routinely struggle with fragmented interfaces: disparate CCTV video matrixes, cluttered event spreadsheets, and overwhelming alarm noise. 

**Lensight** solves this operational bottleneck by consolidating live surveillance, automated detection analytics, and incident escalation into a unified SecOps console.

### Core Objectives Delivered:
- **Centralized Surveillance:** Monitor multi-channel camera feeds in responsive 1x1 single-focus or 3x3 multi-view grids.
- **AI Event Intelligence:** Tabulate, filter, and inspect AI detections (Person, Vehicle, Motion, Restricted Area) with millisecond timestamps and confidence scores.
- **Triage & Escalation:** Prioritize critical security breaches via an Alert Center with bulk acknowledgments and cross-app state synchronization.
- **System Telemetry & Health:** Visualize historical event frequencies, camera uptime, and operational distributions via interactive charts.
- **Responsive Operability:** Fully accessible and operable on mobile phones (collapsible drawer), tablets, and high-resolution multi-monitor desktop setups.

---

## 🚀 Key Modules & Features

### 1. Overview Dashboard (`/`)
- **Real-Time KPI Metrics:** Four live-computed stat cards displaying *Total Cameras*, *Active Feeds*, *Events Today*, and *Critical Alerts*.
- **Urgent Alert Strip:** High-visibility notification banner alerting operators to pending critical incidents with instant jump-to-triage.
- **Live Surveillance Preview Grid:** Synchronized multi-camera viewport preview directly on the main dashboard for immediate situational awareness.
- **Recent AI Detections Feed:** Chronological activity stream showcasing recent detection timestamps, confidence levels, and severity tags.

### 2. Live Monitoring Console (`/live`)
- **Flexible Grid Matrix:** Seamless switching between **1x1 Focused Inspection** and **3x3 Multi-Camera Matrix**.
- **CCTV Player Controls:** Independent Play/Pause controls per camera tile with preserved frozen-frame rendering upon pausing.
- **Connectivity Badging:** Clear visual indicators for **ONLINE** (green) and **OFFLINE** (crimson with last-seen timestamps).
- **Simulated AI Overlays:** Live HUD bounding boxes and classification tags over video feeds.
- **Fullscreen Focus Modal:** Double-click or expand any feed into an immersive camera inspection modal with detailed telemetry metadata.

### 3. AI Detection Events (`/events`)
- **Multi-Class Detection Engine:**
  - 👤 **Person Detected:** Foot-traffic, perimeter breaches, and unauthorized personnel.
  - 🚗 **Vehicle Detected:** Vehicle ingress/egress, license plate recognition zones.
  - ⚡ **Motion Detected:** Off-hours movement anomalies across interior zones.
  - 🚫 **Restricted Area Entry:** Geofence violations and sensitive facility infractions.
- **Detailed Event Table:** Sortable columns covering Event ID, Type, Camera Source, Timestamp, Confidence Score, and Severity.
- **Event Detail Drawer/Modal:** In-depth event analysis modal showing simulated video snapshots, camera specs, and trigger coordinates.
- **Client-Side Pagination:** Smooth tabular pagination preventing UI lag on high-volume event logs.

### 4. Advanced Event Search & Filtering
- **Debounced Text Search:** Instant search across camera IDs, camera locations, and detection tags without typing lag.
- **Multi-Facet Filter Pills:** Quick filters for Event Types (Person, Vehicle, Motion, Restricted Area) and Severity (Critical, High, Medium, Low).
- **Temporal Date Presets:** Instant selection between *Today*, *Past 24 Hours*, *Last 7 Days*, and *Last 30 Days*.
- **Active Filter Chips:** Visual chips displaying active filters with individual dismissal and a master "Clear Filters" action.
- **Stateful Empty States:** Purpose-built zero-result screens offering 1-click filter resets.

### 5. Analytics & System Telemetry (`/analytics`)
- **Hourly Detection Trends:** Area chart showing peak event spikes throughout a 24-hour surveillance cycle.
- **Category Distribution:** Donut chart showing detection breakdown by classification type.
- **Camera Incident Ranking:** Bar chart ranking camera locations by total alert frequency to identify surveillance hotspots.
- **Severity Breakdown:** Visual breakdown of Low, Medium, High, and Critical incidents.

### 6. Camera Fleet Management (`/cameras`)
- **Fleet Inventory List:** Centralized table tracking Camera ID (`CAM-001`), model name, IP address, location, connection state, and uptime.
- **Add Camera Modal:** Validated operator workflow for onboarding new hardware feeds (ID, location, RTSP stream URL, resolution) with client-side form validation.
- **Fleet Maintenance Actions:** Toggle camera connectivity states, edit camera parameters, or decommission hardware with destructive confirmation safeguards.

### 7. Alert Triage Center (`/alerts`)
- **Tri-State Workflow:** Segment alerts by **All**, **Unread**, and **Acknowledged** queues.
- **Severity Prioritization:** Visually distinct capsule geometry and color coding for *Critical* (#EF4444), *High* (#F97316), and *Medium* (#F59E0B) alerts.
- **Single & Bulk Acknowledgment:** Operators can triage individual alarms or execute bulk acknowledgments with immediate UI feedback.
- **Universal Synchronization:** Alert acknowledgments update the sidebar badge, header notification bell, and Overview KPI cards simultaneously.

### 8. System Settings & Operator Profile (`/settings`)
- **Compliance & Security Specs:** System storage quota indicators, audit logging toggles, and SOC2 / GDPR compliance specifications.
- **Theme Configuration:** Dark theme default with light mode support.
- **Operator Profile Menu:** Header avatar menu displaying operator credentials, current shift status, role badges, and logout handlers.
- **Global OmniSearch Modal:** Quick command palette modal (`Ctrl+K` / search trigger) for instant navigation across cameras, events, and pages.

---

## 🎨 UI/UX & Design System

The application's interface follows an industrial SecOps design philosophy:

| Token / Concept | Specification | Implementation Purpose |
|---|---|---|
| **Primary Brand Accent** | Heat Orange (`#fa5d19`) | Focused primary actions, active indicators, and high-priority callouts |
| **Dark Base Surfaces** | `#0a0a0a` / `#141414` / `#171717` | Eye-strain reduction for 8+ hour security monitoring shifts |
| **Status Semantics** | Green (`#22C55E`), Amber (`#F59E0B`), Red (`#EF4444`) | Instant, unambiguous visual triage of camera health & alarm severity |
| **Typography** | `Inter` (UI) & `Geist / Roboto Mono` (Data) | Jitter-free tabular numbers for live clocks, coordinates, and camera IDs |
| **Optical Geometry** | Pill & Capsule badges, 8px/12px border radii | Modern, polished, and structured visual hierarchy |
| **Responsive Shell** | Breakpoints: Mobile (<768px), Tablet, Desktop | Adaptive drawer navigation on phones; pinned static sidebar on desktop |

---

## 🏗️ System Architecture & Data Flow

```
+------------------------------------------------------------------------------------+
|                                 LENSIGHT APPLICATION                               |
|                                                                                    |
|  +------------------------------------------------------------------------------+  |
|  |                             Global Shell (Layout.jsx)                        |  |
|  |  +------------------------+  +--------------------------------------------+  |  |
|  |  |   Responsive Sidebar   |  |  Header: Live Clock | Global Search        |  |  |
|  |  |   - Overview           |  |          Notification Bell | Unread Badges |  |  |
|  |  |   - Live Monitoring    |  |          Operator Profile Menu             |  |  |
|  |  |   - AI Events          |  +--------------------------------------------+  |  |
|  |  |   - Analytics          |  |                                            |  |  |
|  |  |   - Cameras            |  |             Main Viewport Space            |  |  |
|  |  |   - Alert Center       |  |     (React Router v7 / Feature Pages)      |  |  |
|  |  |   - Settings           |  |                                            |  |  |
|  |  +------------------------+  +--------------------------------------------+  |  |
|  +------------------------------------------------------------------------------+  |
|                                         ▲                                          |
|                                         │ Context & Custom Hooks                   |
|  +------------------------------------------------------------------------------+  |
|  |                                Global State Layer                            |  |
|  |  - AlertStore (unread triage, bulk acknowledge, badge sync)                  |  |
|  |  - CameraStore (inventory state, add/remove, play/pause isolation)           |  |
|  |  - EventFilterStore (search queries, date presets, type/severity filters)   |  |
|  |  - ToastStore (operator action feedback toasts)                              |  |
|  +------------------------------------------------------------------------------+  |
|                                         ▲                                          |
|                                         │ Simulated Promises (300-600ms latency)   |
|  +------------------------------------------------------------------------------+  |
|  |                               Data Provider Layer                            |  |
|  |  - Mock API Service (`src/services/mockApi.ts`)                              |  |
|  |  - Local CCTV assets (`public/demo-videos/`, `public/snapshots/`)            |  |
|  |  - Static Datasets (`cameras.json`, `events.json`, `alerts.json`)            |  |
|  |  - Supabase client integration layer ready for production DB connect        |  |
|  +------------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------------+
```

---

## 👥 Team Contributions & Section Breakdown

This project was engineered collaboratively across distinct functional domains by **Ganesh Bhaktaraj Beldar** and **Soniya Pangatte**:

### 👨‍💻 Ganesh Bhaktaraj Beldar ([@Ganeshbeldar015](https://github.com/Ganeshbeldar015))
**Role:** Architecture Lead & Core Systems Engineer

* **Platform Scaffolding & Core Architecture:**
  - Bootstrapped React 19 + Vite 6 + Tailwind CSS environment with modular feature architecture.
  - Configured Git version control workflows, repository guidelines, and build pipelines.
* **Global Application Shell & Navigation:**
  - Implemented the static, pinned sidebar navigation and responsive layout wrapper.
  - Engineered the Header component with optical alignment, live jitter-free monospace clock, and breadcrumbs.
  - Built the interactive **Operator Profile Dropdown Menu** and session management triggers.
* **Camera Management & CCTV Feed Controls:**
  - Built the CCTV camera card layout and grid layout selector (**1x1 focus mode** and **3x3 matrix**).
  - Engineered isolated camera play/pause mechanics ensuring video feeds preserve frozen frames upon pausing.
  - Created the **Add Camera Modal** with full client-side validation and decommission confirmation.
* **Alert Center Engine:**
  - Designed the capsule-geometry severity badges (*Critical, High, Medium*).
  - Implemented the tri-tab alert filtering system (*All, Unread, Acknowledged*) and bulk acknowledgment actions.
  - Synchronized real-time unread counts across the sidebar pill, header bell, and Overview KPI cards.
* **Settings & Compliance:**
  - Implemented enterprise compliance specifications, storage quota indicators, and audit logging settings.
* **Refactoring & Code Optimization:**
  - Modularized components, standardized TypeScript interfaces, and resolved build warnings.

---

### 👩‍💻 Soniya Pangatte ([@Soniya-Pangatte](https://github.com/Soniya-Pangatte))
**Role:** UI/UX Lead, CCTV Integration & Event Systems Engineer

* **Responsive Design & Mobile Ergonomics:**
  - Engineered cross-device responsive styling ensuring full operability across mobile phones, tablets, and desktops.
  - Implemented the slide-out mobile drawer navigation and touch-friendly controls.
* **Enterprise Theme & Visual Design:**
  - Refined the application styling with the **Teal and Cool Grey** enterprise SecOps palette and balanced dark/light theme tokens.
  - Polished micro-interactions, hover states, card elevation shadows, and empty-state illustrations.
* **CCTV Video & Simulated AI Integration:**
  - Sourced and integrated local CCTV demo video files (`entrance.mp4`, `outside.mp4`, `reception.mp4`, `parking.mp4`, `corridor.mp4`).
  - Implemented the live surveillance preview grid on the Overview dashboard.
  - Engineered the simulated AI bounding-box HUD overlays on CCTV video feeds.
* **AI Detection Events Engine:**
  - Implemented the four-category AI detection classification (*Person, Vehicle, Motion, Restricted Area*).
  - Built the multi-criteria search and filter engine with text normalization and severity matching.
  - Created the **EventDetailModal** with full metadata inspection, coordinates, and snapshot previews.
  - Implemented clean client-side table pagination for smooth browsing of high-volume detection logs.
* **Error Handling & Runtime Stability:**
  - Implemented the global `ErrorBoundary` component to safeguard the application against unhandled runtime crashes.
  - Resolved component state lifecycles and modal hook dependencies.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | [React 19.3.1](https://react.dev/) | Component architecture, state management & hooks |
| **Bundler & Tooling** | [Vite 8.3.6](https://vitejs.dev/) | Lightning-fast HMR and optimized production builds |
| **Routing** | [React Router v7.18.5](https://reactrouter.com/) | Client-side routing, query parameter sync & 404 handling |
| **Styling** | [Tailwind CSS v4.3.5](https://tailwindcss.com/) | Utility-first styling with custom CSS variables and dark theme |
| **Icons** | [Lucide React v1.72.0](https://lucide.dev/) | Clean, consistent enterprise security iconography |
| **Data Visualization** | [Recharts v3.10.1](https://recharts.org/) | Responsive SVG charts (Area, Bar, Pie, Scatter) |
| **Utilities** | `clsx`, `tailwind-merge`, `date-fns` | Dynamic className composition and date formatting |
| **BaaS / Client** | `@supabase/supabase-js v2.49.1` | Cloud backend client ready for Postgres & Realtime |

---

## 💻 Getting Started & Installation

### Prerequisites
- **Node.js:** `v18.0.0` or higher (Node `v20+` recommended)
- **Package Manager:** `npm` (included with Node) or `yarn` / `pnpm`

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ganeshbeldar015/Lensight.git
   cd Lensight
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The optimized production bundle will be output to the `dist/` folder.

5. **Preview the production build locally:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
lensight/
├── public/
│   ├── demo-videos/         # Local CCTV MP4 demo video feeds
│   ├── snapshots/           # Camera snapshot images for events
│   └── vite.svg
├── src/
│   ├── assets/              # Static branding and hero assets
│   ├── components/
│   │   ├── cameras/         # CCTVVideoFeed, AddCameraModal, CameraFocusModal
│   │   ├── charts/          # Analytics chart components
│   │   ├── events/          # EventDetailModal, DetectionBadge
│   │   ├── layout/          # Layout, Header, Sidebar, OmniSearchModal
│   │   └── ui/              # Button, Card, Skeleton, Badges, ErrorBoundary
│   ├── context/             # Global application state stores
│   ├── data/                # Mock datasets (cameras.json, events.json, alerts.json)
│   ├── features/            # Feature route pages
│   │   ├── alerts/          # AlertsPage.jsx
│   │   ├── analytics/       # AnalyticsPage.jsx
│   │   ├── cameras/         # CamerasPage.jsx
│   │   ├── events/          # EventsPage.jsx
│   │   ├── live/            # LiveMonitoringPage.jsx
│   │   ├── overview/        # OverviewPage.jsx
│   │   ├── settings/        # SettingsPage.jsx
│   │   └── NotFoundPage.jsx # 404 handler
│   ├── hooks/               # Custom hooks (useCameras, useAlerts, useDebounce)
│   ├── services/            # Simulated async API client layer (mockApi.ts)
│   ├── styles/              # Global CSS & Tailwind design tokens
│   ├── App.jsx              # Application router & provider root
│   ├── main.jsx             # React DOM entry point
│   └── index.css            # Custom CSS properties and theme definitions
├── .env.example             # Environment template
├── .gitignore               # Git exclusion rules
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite build configuration
```

---

## 📊 Evaluation Criteria Matrix

| Evaluation Criterion | Standard Expected | Implementation in Lensight | Status |
|---|---|---|:---:|
| **UI Quality & Layout** | Professional SecOps aesthetic, visual hierarchy, dark theme, responsive grid | Industrial dark theme, Firecrawl tokens, optical alignment, 1x1 & 3x3 grids | ✅ Complete |
| **Functionality** | Working navigation, camera toggles, event search/filters, alert triage, add camera | All 7 core modules fully interactive with zero broken links or unhandled actions | ✅ Complete |
| **Code Quality** | Modular React architecture, clean state handling, reusable UI components | Feature-first folder structure, custom hooks, reusable atomic UI components | ✅ Complete |
| **Data Presentation** | Clear telemetry, informative analytics charts, consistent status badges | Recharts visualizations, capsule badges, debounced search, clear empty states | ✅ Complete |
| **Completion & Demo** | Ready to run locally, transparent demo notice, comprehensive docs | Immediate `npm run dev` startup, complete README, and executive PDF dossier | ✅ Complete |

---

## 📄 Submission & Deliverables

- **GitHub Repository:** [https://github.com/Ganeshbeldar015/Lensight](https://github.com/Ganeshbeldar015/Lensight)
- **Executive PDF Dossier:** `Lensight_Project_Overview_and_Team_Contributions.pdf` (Attached with submission email — contains complete technical requirements, architecture, and team contribution breakdown)
- **Project Archive:** Clean project zip archive containing source code and dependencies ready for immediate offline evaluation.

---

*Engineered with precision for the AI Video Intelligence Platform Frontend Challenge.*
