# 🚀 CodeCollab

A real-time collaborative coding platform that lets multiple users code together live, run code in multiple languages, and save their sessions — like Google Docs for developers.

---

## 🧩 Features (MVP)

- 🔁 Real-time collaborative code editor (with multi-user sync)
- 📄 Room creation & sharing with unique links
- ✍️ Live typing sync with cursors
- ⚙️ Code execution in sandbox (Python & JavaScript)
- 🧠 User-entered username (no auth for MVP)
- 💾 Session save for each room (coming soon)

---

## 🏗️ Tech Stack

| Layer        | Tech                        |
|-------------|-----------------------------|
| Frontend     | React, Vite, TailwindCSS, CodeMirror |
| Backend      | Node.js, Express, Socket.IO |
| Code Runner  | Docker (language sandbox)   |
| Database     | MongoDB Atlas               |
| Deployment   | Vercel + Render/Fly.io      |

---

## 📁 Monorepo Structure
codecollab/
├── client/ # React frontend (Vite + Tailwind + CodeMirror)
├── server/ # Node.js backend (REST + WebSocket + Code Runner)
└── README.md

---

## 📦 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/codecollab.git
cd codecollab

cd client
npm install
npm run dev

cd server
npm install
node index.js
```


## 📅 Development Timeline

| Sprint   | Goal                           |
| -------- | ------------------------------ |
| Sprint 0 | Project setup                  |
| Sprint 1 | Editor UI + Room Routing       |
| Sprint 2 | Real-Time Typing Sync          |
| Sprint 3 | Code Execution with Docker     |
| Sprint 4 | Auth & Session Save            |
| Sprint 5 | AI Assistant & Deployment      |


## 🧠 Future Add-ons
✨ AI Assistant (GPT-4) for code explanations

🔐 Google OAuth Login

📊 Room Dashboard & Session History

🗣️ Voice/Video chat with WebRTC
