# EduAI – Student AI Agent

Student-facing chat interface for the EduAI platform (2026 AI Hackathon – "The Future of Education"). An interactive AI study agent that guides students through preset comprehension questions and free-form lecture exploration.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

## Getting Started

```bash
cd student-web-client
npm install
npm run dev
```

The app will be available at **http://localhost:5174** (or the next available port).

## Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── WireframeBanner       – Hackathon header banner
│   ├── LeftPanel             – Student profile, preset question progress, lecture topics
│   ├── ChatHeader            – AI agent header with mode indicator
│   ├── ChatMessages          – Scrollable message thread with typing indicator
│   ├── ChatInput             – Text input with Enter-to-send
│   └── RightPanel            – Lecture context, key concepts, confidence, session stats
├── data/
│   └── mockData.js           – Centralized mock data (swap for API later)
├── App.jsx                   – Root layout and chat state management
├── index.css                 – CSS variables and global reset
└── main.jsx                  – React entry point
```
