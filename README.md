
# 🚀 MOCK AI Interview Platform

**MOCK AI Interview Platform** is an all-in-one AI-powered solution designed to help job seekers secure placements by improving their resumes and preparing them for domain-specific interviews. It combines **Resume Analysis**, **Interactive AI-Driven Mock Interviews**, and an **Admin Dashboard** to maximize your chances in the job market.

---

## ✨ Features Overview

| Module                  | Description                                                                 |
|-------------------------|-----------------------------------------------------------------------------|
| **ATS Module**          | 🔍 Analyzes resumes against job descriptions, identifies missing keywords, and scores based on relevance and structure. |
| **Mock AI Interview**   | 🎙️ Conducts HR, Technical & Coding interviews with real-time feedback using AI. |
| **Admin Module**        | ⚙️ Manages users, ATS scores, interview data, and provides analytics. |

---

## 🛠️ Project Structure

| Component          | Tech Stack / Role                                                                  |
|--------------------|-------------------------------------------------------------------------------------|
| **Frontend**       | `Next.js` – Manages UI, form submissions, and feedback display.                    |
| **Backend**        | `Node.js` & `Express` – Handles auth, file processing, ATS logic, and interviews.  |
| **Database**       | `PostgreSQL` – Stores user data, resumes, feedback, and scoring results.           |
| **AI Services**    | `Python` (Whisper & Emotion Detection) – For speech-to-text, emotion recognition. |
| **Authentication** | `Clerk (OAuth)` – Manages secure login and session handling.                      |

---

## ✅ Technologies Used

- **Frontend**: Next.js (React Framework)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **AI Models**: Whisper (Speech-to-Text), Emotion Detection (Python)
- **Authentication**: Clerk (OAuth)
- **Networking**: Axios for API interactions

---

## 📦 API Endpoints

| Endpoint                                 | Method | Description                          |
|------------------------------------------|--------|--------------------------------------|
| `/api/dashboard/ats/ats-score`           | POST   | Analyze and score user resumes.      |
| `/api/dashboard/interview`               | POST   | Conduct AI-driven mock interviews.   |

---

## 🚀 Getting Started

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/Laraibkhan13/FINAL_YEAR_PROJECT_MOCK_AI_INTERVIEW_PLATFORM

# Navigate to the project directory
cd FINAL_YEAR_PROJECT_MOCK_AI_INTERVIEW_PLATFORM

# Install dependencies
npm install
```

### ▶️ Run Development Server

```bash
npm run dev
# OR
yarn dev
# OR
pnpm dev
# OR
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🔗 Platform URLs

| Page            | URL                                     |
|------------------|------------------------------------------|
| **Frontend**     | [http://localhost:3000](http://localhost:3000) |
| **Dashboard**    | [http://localhost:3000/dashboard](http://localhost:3000/dashboard) |
| **ATS Feedback** | [http://localhost:3000/dashboard/Feedback/ATS](http://localhost:3000/dashboard/Feedback/ATS) |

---

## 📈 Future Enhancements

- 🔗 LinkedIn integration for profile insights.
- 📊 Advanced analytics and user progress dashboard.
- 🧠 Real-time AI feedback during interviews.
- 🌐 Multi-language support for international users.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📘 Learn More

- [📚 Next.js Documentation](https://nextjs.org/docs)
- [🎓 Learn Next.js](https://nextjs.org/learn)
- [💻 Next.js GitHub Repository](https://github.com/vercel/next.js)

---

## 🚀 Deployment

Deploy effortlessly using [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), the official platform for Next.js.

📖 Check the [deployment guide](https://nextjs.org/docs/deployment) for full instructions.
