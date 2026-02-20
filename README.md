# EduAI – The Future of Education

An AI-powered platform that improves classroom quality for both **students** and **faculty** while keeping education human-centered, fair, transparent, and trustworthy. Built for the 2026 AI Hackathon.

## Overview

EduAI connects two sides of the classroom through AI:

- **Students** interact with an AI study agent that guides them through preset comprehension questions and free-form lecture exploration.
- **Faculty** get a real-time dashboard showing which concepts students are struggling with, AI-generated assessment questions, and deep-dive insights into learning gaps.

## Repository Structure

```
AdvI/
├── faculty-web-client/        React app – Faculty Dashboard
├── student-web-client/        React app – Student AI Agent
├── faculty-wireframe.html     Static wireframe – Faculty UI
├── student-wireframe.html     Static wireframe – Student AI Agent UI
└── README.md                  ← You are here
```

## Modules

### Faculty Dashboard (`faculty-web-client/`)

React + Vite application providing instructors with student comprehension analytics, critical concept tracking, suggested questions, and AI-powered dive-deep insights.

```bash
cd faculty-web-client
npm install
npm run dev
```

Opens at **http://localhost:5173**

To build for production:

```bash
npm run build
npm run preview
```

### Student AI Agent (`student-web-client/`)

React + Vite application providing students with an interactive AI study agent. Guides students through preset comprehension questions with back-and-forth discussion, then opens free-form exploration of lecture topics.

```bash
cd student-web-client
npm install
npm run dev
```

Opens at **http://localhost:5174** (or next available port)

To build for production:

```bash
npm run build
npm run preview
```

### Faculty Wireframe (`faculty-wireframe.html`)

Static interactive wireframe of the faculty dashboard. Open directly in any browser:

```bash
open faculty-wireframe.html
```

### Student Wireframe (`student-wireframe.html`)

Static interactive wireframe of the student AI agent chat interface. Open directly in any browser:

```bash
open student-wireframe.html
```

## System Architecture

The platform consists of four core backend components:

| Component | Role |
|---|---|
| **AI Agent** | Chatbot that interacts with students — guides them through preset questions then free-form discussion |
| **Student Database** | Stores chat histories, preset question responses, and interaction data |
| **Faculty Database** | Stores lecture notes and materials imported from Canvas |
| **LLM API** | Analyzes student + faculty data to generate insights and suggested questions |

**Data flow:**

1. Faculty upload lecture materials → stored in Faculty Database
2. LLM API reads Faculty Database + Student Database → generates preset questions (written to Student Database) and faculty insights (displayed in Faculty UI)
3. Student opens AI Agent → agent prompts with preset questions from Student Database, grounded in lecture content from Faculty Database
4. Student completes preset questions → enters free-form mode to explore specific lectures
5. Session ends → full conversation saved to Student Database for future context

## Prerequisites

- [Node.js](https://nodejs.org/) v18+ (for React modules)
- npm (included with Node.js)
- A modern web browser (for static wireframes)
