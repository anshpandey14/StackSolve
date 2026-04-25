# 🚀 Stack Solve 

A state-of-the-art developer community platform built with the **MERN Stack** (**MongoDB**, **Express**, **React**, **Node.js**). **Stack Solve** is a high-performance evolution of a classic Q&A forum, featuring real-time search, a cinematic UI, secure social authentication.

---

## ✨ Key Features

<!-- - **Rebranded Experience** — Completely evolved from standard templates to the premium **Stack Solve** brand. -->
- **Cinematic Dark UI** — Built with React 19, Tailwind CSS v4, Framer Motion, and Magic UI for a premium, interactive feel.
- **Real Social Login** — Securely sign in using **Google** or **GitHub** via Firebase Authentication.
- **Production-Ready Auth Security** — Required email verification via Nodemailer, brute-force protection with rate-limiting, and strict input validation via `express-validator`.
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
| **Backend** | Node.js, Express, Mongoose, JWT, BcryptJS, Nodemailer, Express-Validator, Rate-Limit |
| **Database** | MongoDB (Atlas or local) |
| **UI Components** | Magic UI, Tabler Icons, uiw/react-md-editor |

---

## 📡 API Highlights

### Authentication
- `POST /api/v1/auth/register` - Standard email/password registration (sends verification email)
- `POST /api/v1/auth/login` - Rate-limited secure login
- `GET /api/v1/auth/verifyemail/:token` - Validates the email confirmation token
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

# Email Verification (SMTP config)
SMTP_HOST=smtp.your-email-provider.com
SMTP_PORT=587
SMTP_EMAIL=your-email@example.com
SMTP_PASSWORD=your-secure-password
FROM_NAME=StackSolve
FROM_EMAIL=noreply@stacksolve.com
```

> **🔒 Why do you need a custom domain?** Modern professional email providers (like Resend, SendGrid, or AWS) require you to cryptographically verify ownership of a custom domain (e.g., `@stacksolve.com`) to prevent spam. Without a verified domain, these services place tight restrictions on your account, such as only allowing you to send test emails to your own personal email address.

> **💡 Tip for Free Testing without a Custom Domain:** If you want to send emails to anyone for free without purchasing a custom domain, you can use a personal Gmail account. Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and use your Gmail address for both `SMTP_EMAIL` and `FROM_EMAIL`. For the `SMTP_PASSWORD`, you must generate a 16-character **App Password** from your Google Account's Security settings (2FA required).

> **🚀 Tip for Production (Resend):** If you are deploying to production, [Resend](https://resend.com) is highly recommended. Set `SMTP_HOST=smtp.resend.com`, `SMTP_PORT=465`, and `SMTP_EMAIL=resend`. The `SMTP_PASSWORD` is your Resend API key. (Note: On Resend's free tier, you must use `FROM_EMAIL=onboarding@resend.dev` and you can only send emails to yourself until you verify a custom domain).

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
