# X · O · ARENA — Frontend

A gamer-themed Tic-Tac-Toe frontend built with **Vite + React + Tailwind CSS + TanStack Query**.

## Stack

- **Vite** — build tool
- **React 18** — UI library
- **Tailwind CSS v3** — styling with custom neon theme
- **TanStack Query v5** — server state / data fetching
- **Axios** — HTTP client
- **Lucide React** — icons
- **Google Fonts** — Orbitron + Share Tech Mono (loaded via CDN in `index.html`)

> **shadcn/ui** components (Button, Dialog, Toast) are implemented manually here
> so no CLI setup is required — all UI primitives are self-contained.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend proxy

The `vite.config.js` already proxies `/api` → `http://localhost:5000`.
Make sure your Express backend is running on port **5000** (or update the proxy target).

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for production

```bash
npm run build
```

---

## Backend API Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/session/` | Health check — used for DB status indicator |
| POST | `/api/session/create` | `{ player1, player2 }` → create session |
| GET | `/api/session/all` | List all sessions |
| POST | `/api/session/:id/round` | `{ winner }` → log round result |
| POST | `/api/session/:id/stop` | End session |
| DELETE | `/api/session/:id` | Delete session |

---

## Features

- **Gamer aesthetic** — neon CRT theme with Orbitron font, scanlines, glitch title effect
- **DB status indicator** — live connection badge that shows `CONNECTING`, `ONLINE`, or `OFFLINE` based on real backend health checks (pings every 8s)
- **Session management** — create / end sessions persisted to MongoDB
- **Round tracking** — every round result (win / draw) POSTed to backend
- **Live scoreboard** — player win counts & draws updated in real time
- **Session archive** — expandable history of all sessions with round-by-round breakdown
- **Responsive** — works on mobile and desktop

---

## DB Status Indicator

The status badge in the System panel reflects live backend connectivity:

| State | Trigger | Visual |
|-------|---------|--------|
| 🟡 `CONNECTING` | Initial load or retrying | Yellow pulsing dot |
| 🟢 `ONLINE` | Backend responded successfully | Green pulsing dot |
| 🔴 `OFFLINE` | Request failed after 1 retry | Red ping-ring dot |

It uses the existing `GET /api/session/` route (the one that returns `"Backend is running!"`), so no backend changes are needed. The check runs on mount and re-polls every **8 seconds** automatically.

---

## Project Structure

```
src/
├── components/
│   ├── BoardCell.jsx         # Individual cell with neon states
│   ├── Button.jsx            # Neon button variants
│   ├── DbStatusIndicator.jsx # Live DB connection badge
│   ├── GameBoard.jsx         # 3x3 grid wrapper
│   ├── PlayerSetup.jsx       # Name entry form
│   ├── Scoreboard.jsx        # Win/draw counts
│   ├── SessionHistory.jsx    # All sessions from DB
│   └── TurnIndicator.jsx     # Current turn / winner banner
├── hooks/
│   ├── useDbStatus.js        # Polls backend health, returns 'loading' | 'online' | 'offline'
│   └── useGameLogic.js       # Board state + win detection
├── lib/
│   ├── api.js                # Axios calls — sessionApi + healthApi
│   └── utils.js              # cn() helper
├── pages/
│   └── GamePage.jsx          # Main page, TanStack Query mutations
├── App.jsx                   # QueryClientProvider root
├── main.jsx
└── index.css                 # Tailwind + custom animations
```
