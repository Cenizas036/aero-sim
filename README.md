# ✈️ AeroSim

**Corporate-grade flight simulation & atmospheric stress-testing platform**

> A professional multi-page web application for simulating aircraft behavior across environmental conditions, analyzing performance data, and exporting mission reports.

---

## 📸 Screenshots

> Add your screenshots to a `/screenshots` folder in the repo and update the paths below.

| Dashboard | Scenarios |
|-----------|-----------|
| ![Dashboard](screenshots/dashboard.png) | ![Scenarios](screenshots/scenarios.png) |

| Analytics | Login |
|-----------|-------|
| ![Analytics](screenshots/analytics.png) | ![Login](screenshots/login.png) |

---

## 🌟 Features

- **🛩️ Flight Profiles** — Simulate different aircraft types (Commercial Airliner, Cargo Heavy, Business Jet) with unique physics baselines
- **🌪️ Scenario Manager** — Pre-configured environmental stress tests (Winter Storm over Atlantic, High-Altitude Clear Turbulence, etc.)
- **📊 Real-Time Charts** — Live scrolling line charts for G-Force, Altitude, and Airframe Stress using Recharts
- **📁 Analytics Dashboard** — Data-dense reporting of past simulation results — fuel burned, peak G-forces, stress thresholds
- **📤 Export Reports** — Export simulation logs as CSV or PDF
- **🔐 Auth Gateway** — Corporate login page with session management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| Styling | SCSS (scientific glassmorphism theme) |
| Data Viz | Recharts / Chart.js |
| Canvas | Vanilla JS simulation engine via `useEffect` |
| Build Tool | Vite |

---

## 📁 Project Structure

```
aero-sim/
├── public/
├── src/
│   ├── components/        # Reusable UI components (Sidebar, Charts, etc.)
│   ├── pages/
│   │   ├── Login.jsx      # Corporate auth gateway
│   │   ├── Dashboard.jsx  # Main simulation hub
│   │   ├── Scenarios.jsx  # Pre-configured stress test catalog
│   │   └── Analytics.jsx  # Historical simulation reports
│   ├── styles/            # SCSS theme files
│   ├── engine/            # Core physics & simulation logic
│   └── App.jsx
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- NPM or Yarn

### 1. Clone the repo

```bash
git clone https://github.com/Cenizas036/aero-sim.git
cd aero-sim
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) 🎉

### 4. Build for production

```bash
npm run build
```

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Corporate authentication gateway |
| `/` | Dashboard | Main simulation hub with live radar & controls |
| `/scenarios` | Scenarios | Catalog of pre-configured environmental stress tests |
| `/analytics` | Analytics | Historical simulation data, charts & export |

---

## 📤 Exporting Reports

From the Analytics page, click **"Export Simulation Log"** to download your session data as:
- `.csv` — for spreadsheet analysis
- `.pdf` — for formal reporting

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

*Built for aviation engineers, simulation researchers, and anyone who wants to know what happens when you fly a cargo jet through a polar vortex.*
