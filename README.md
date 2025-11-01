# 🧩 Task Management Client

This is the **frontend** of the Task Management System — a React + TypeScript application built with **Vite**.  
It provides a modern, responsive, and role-based interface for managing projects, tasks, and activity logs.

The app connects to a backend API (deployed on Render) and handles authentication, real-time updates, and secure session management.

---

## 🚀 Tech Stack

- ⚛️ **React 19** (with TypeScript)
- ⚙️ **Vite 7** for lightning-fast builds
- 🧭 **React Router DOM v7** for routing
- 🧱 **Redux Toolkit + Redux Persist** for global state management
- 🧩 **React Hook Form** for form validation
- 🌈 **Tailwind CSS** for styling
- 🔥 **React Hot Toast** for notifications
- 💬 **Socket.io Client** for real-time features
- 📦 **Axios** for API requests
- 🎨 **Lucide React** for icons

---

## ⚙️ Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:3001/api

# Optional: base URL without /api
VITE_API_URL=http://localhost:3001
```

When deploying to production (e.g., Vercel), replace these with your live backend URLs:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🧠 Features

- 🔐 Secure authentication (Access + Refresh Tokens)
- 👤 Role-based access (Admin / User)
- 🧾 Task & Project management dashboard
- 🪄 Real-time task updates via Socket.io
- 🧰 Form validation using React Hook Form
- 💾 Persisted authentication with Redux Persist
- 📅 Automated reminders (via backend cron jobs)
- 🧾 Activity logs for every update
- 🌗 Fully responsive and clean UI with Tailwind CSS

---

## 📁 Project Structure

```
src/
├── apis/                # Axios API functions
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── pages/               # Route-level pages (Auth, Admin, User)
├── redux/               # Redux store, slices, and reducers
├── types/               # TypeScript interfaces and types
├── utils/               # Helper and utility functions
└── main.tsx             # Entry point
```

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/MohamedSinanP/task-management-client.git
cd task-management-client
```

### 2️⃣ Install dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Create `.env` file

Copy the environment variables above into a `.env` file at the project root.

### 4️⃣ Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173)

---

## 🧱 Build for Production

```bash
npm run build
```

To preview the build locally:

```bash
npm run preview
```

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. In the project settings → **Environment Variables**, add:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. Click **Deploy** 🎉

---

## 👨‍💻 Author

**Mohamed Sinan P**  
MERN Stack Developer  
📧[mohamedsinanp8@gmail.com]

---

## 🪪 License

This project is licensed under the **MIT License** — feel free to modify and use it.

---
