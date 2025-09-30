# 🎲 რა? სად? როდის? (What? Where? When?)

A real-time online trivia game inspired by the classic Georgian show **"რა? სად? როდის?"**, built with **React**, **Socket.IO**, **Cheerio**, and **Google Login** authentication.

Players join rooms, chat in real time, and work together to solve questions scraped live from trivia sources.

---

## 🚀 Features

* 👥 **Up to 6-player rooms** – create or join game sessions
* 💬 **Realtime chat** – discuss with teammates before submitting answers
* ❓ **Dynamic questions** – fetched and scraped in real time with Cheerio
* ⏱ **Timed rounds** – limited discussion window before answers must be locked in
* 🔑 **Google login** – secure and quick authentication
* 🌐 **Hosting** –

  * Backend: [Render](https://render.com)
  * Frontend: [Netlify](https://www.netlify.com)

---

## 🛠 Tech Stack

* **Frontend:** React, Netlify
* **Backend:** Node.js, Socket.IO, Render
* **Scraping:** Cheerio
* **Authentication:** Google OAuth

---

## 🎮 How It Works

1. **Login** with your Google account
2. **Join or create a room** (max 6 players)
3. A **question is scraped in real time** and shown to all players
4. Players use **chat to discuss** possible answers
5. Within the timer limit, the team **submits their final answer**
6. Game continues with new questions until session ends

---

## 📦 Installation & Setup

```bash
# Clone repo
git clone https://github.com/tuxa4life/ra-sad-rodis.git
cd ra-sad-rodis

# Install dependencies
npm install

# Run server
cd server
npm run dev

# Run client
cd client
npm start
```

Make sure you add your Google OAuth credentials and environment variables for both frontend and backend.

---