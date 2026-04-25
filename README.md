# 🚀 Stack Solve — Premium Developer Community

A state-of-the-art developer community platform built with the **MERN Stack** (**MongoDB**, **Express**, **React**, **Node.js**). **Stack Solve** is a rebranded, high-performance evolution of a classic Q&A forum, featuring real-time search, a cinematic UI, secure social authentication, and robust edge-case handling.

---

## ✨ Key Features

- **Rebranded Experience** — Completely evolved from standard templates to the premium **Stack Solve** brand.
- **Cinematic Dark UI** — Built with React 19, Tailwind CSS v4, Framer Motion, and Magic UI for a premium, interactive feel.
- **Real Social Login** — Securely sign in using **Google** or **GitHub** via Firebase Authentication.
- **Intelligent Navigation** — Smart floating navbar that hides on scroll-down and appears on scroll-up for maximum focus.
- **Advanced Search & Filtering** — Global question search by title/content and real-time tag filtering in the sidebar.
- **Dynamic Tags & Users Pages** — Dedicated exploration pages for community-driven tags and top reputable members.
- **Full Q&A Lifecycle** — Ask, edit, and **delete** questions; post answers and comments with rich Markdown support.
- **Gamified Reputation System** — Contribution tracking for active community members.
- **Robust Defensive UX** — 
  - Comprehensive Route Guards (protected private routes, blocked auth pages for logged-in users).
  - Anti-flicker global loading states during auth hydration.
  - Strict form validation (minimum length constraints) and duplicate submission prevention.
  - Graceful "Not Found" handling for deleted content and unknown routes.
  - Self-voting prevention.

---

## 📁 Project Structure

```
Stackoverflow/
├── client/          # React frontend (Vite + TypeScript + Firebase)
│   ├── src/
│   │   ├── components/   # Reusable UI components (Magic UI, Forms, etc.)
│   │   ├── pages/        # Route pages (Home, Questions, Tags, Users, Profile)
│   │   ├── store/        # Zustand state management (Auth)
│   │   └── lib/          # External integrations (Firebase config)
│   └── .env              # Frontend keys (Vite prefixed)
│
├── server/          # Express backend (Node.js + Mongoose)
│   ├── controllers/      # API Logic for Auth, Questions, Tags, Users, etc.
│   ├── middleware/       # JWT Auth protection
│   ├── models/           # Mongoose schemas
│   └── routes/           # Express router definitions
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion, Zustand, Firebase SDK |
| **Backend** | Node.js, Express, Mongoose, JWT, BcryptJS |
| **Database** | MongoDB (Atlas or local) |
| **UI Components** | Magic UI, Tabler Icons, uiw/react-md-editor |

---

## 📡 API Highlights

### Authentication
- `POST /api/v1/auth/register` - Standard email/password registration
- `POST /api/v1/auth/social-login` - Syncs Firebase OAuth users with MongoDB
- `GET /api/v1/auth/me` - Fetches current user profile

### Questions & Tags
- `GET /api/v1/questions?search=...` - Search questions by keyword
- `GET /api/v1/questions?tag=...` - Filter questions by tag
- `GET /api/v1/questions/tags` - List all unique community tags
- `DELETE /api/v1/questions/:id` - Secure deletion for question authors

### Users & Community
- `GET /api/v1/users?search=...` - Search top users by reputation

---

## 🏁 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** instance (Local or Atlas)
- **Firebase Project** (for social login)

### 2. Setup Backend
```bash
cd server
npm install
```
Create `server/.env`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```
Run the backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
```
Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
Run the frontend:
```bash
npm run dev
```

---

## 🌍 Deployment Options

- **Frontend**: Recommended deployment via [Vercel](https://vercel.com/) (using the `client` directory).
- **Backend**: Recommended deployment via [Render](https://render.com/) or Railway (using the `server` directory). 
- *Note: Ensure you update your Firebase Authorized Domains and GitHub OAuth Callback URLs with your live Vercel domain after deployment.*

---

## 📜 License
This project is for educational and community-building purposes.
