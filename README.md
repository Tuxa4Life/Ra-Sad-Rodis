# What? Where? When? (რა? სად? როდის?) 🎲

Multiplayer trivia game inspired by the classic show **“What? Where? When?”**.  
Players compete in real time by answering challenging questions across different topics.

---

## 🚀 Features
- **Multiplayer lobbies** (up to 6 players per room)
- **Real-time chat** inside lobbies
- **Live questions** scraped with [Cheerio](https://cheerio.js.org/)
- **Persistent storage** in [Supabase](https://supabase.com/)
- **Realtime game state** via [Socket.IO](https://socket.io/)

---

## 🛠️ Tech Stack
- **Frontend**: React + React Router  
- **Backend / Data**: Supabase (Postgres + Auth + Realtime)  
- **Scraper**: Node.js + Cheerio  
- **Realtime / Lobbies**: Node.js + Socket.IO  

---

## 📦 Installation

```bash
# Clone repo
git clone https://github.com/tuxa4life/ra-sad-rodis.git
cd ra-sad-rodis

# Install dependencies
npm install

# Start dev server
npm run dev
```

## ⚙️ Environment Variables (Client side)

```bash
# If using create-react-app
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# If using vite
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key