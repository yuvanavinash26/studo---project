# Studo - AI-Enhanced Student Dashboard

A modern, intelligent study platform combining focused work sessions .. Master your study habits with an interactive Pomodoro timer, comprehensive planning tools, and personalized AI insights.And a mini library to store your resources...

---

## ✨ Key Features

### 🔥 Deep Work Protocol
- **Pomodoro Timer** - Animated circular progress indicator
- **Smart Intervals** - Customizable work/break durations
- **AI Motivation** - Real-time motivational quotes via Google Gemini
- **Distraction Mode** - Full-screen focus environment

### 📖 Study Toolkit
| Feature | Purpose |
|---------|---------|
| **Notes** | Capture and organize study notes |
| **Planner** | Structure your study schedule |
| **Exams** | Track and prepare for assessments |
| **Intelligence** | Get your study hours and your due exams |
| **Settings** | Customize your experience |

### 🎨 User Experience
- 🌓 **Dark/Light Mode** - Eye-friendly themes
- ⚡ **Fast & Responsive** - Optimized for all devices
- 🔒 **Privacy First** - Local data storage

---
🔗🔗Live Demo Follow this link..👀
https://studo-project.vercel.app

💢(If your using phone enable desktop mode for better view)

## 🛠️ Technology Stack

```
Frontend:        React 19.2.3 + TypeScript 5.8.2
Build:           Vite 6.2.0
Styling:         Tailwind CSS
Animations:      Framer Motion 11.11.11
Routing:         React Router DOM 7.11.0
Icons:           Lucide React 0.454.0
AI Engine:       Google GenAI (@google/genai 1.34.0)
```

---

## 📦 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager

### Installation

```bash
# 1. Clone repository
git clone <your-repo-url>
cd studo

# 2. Install dependencies
npm install

# 3. Configure environment
echo "VITE_API_KEY=your_gemini_api_key" > .env

# 4. Start development
npm run dev
```

**Application runs on:** `http://localhost:3000`

### Production Build
```bash
npm run build
```

---

## 📁 Project Architecture

```
studo/
├── src/
│   ├── pages/              # Route components
│   │   ├── Dashboard.tsx
│   │   ├── StudyRoom.tsx   ⭐ Main timer page
│   │   ├── Notes.tsx
│   │   ├── Planner.tsx
│   │   ├── Exams.tsx
│   │   ├── Intelligence.tsx
│   │   └── Settings.tsx
│   ├── components/
│   │   └── Layout.tsx      # Navigation & shell
│   ├── context/
│   │   └── TimerContext.tsx  # Timer state
│   ├── services/
│   │   └── gemini.ts       # AI integration
│   ├── lib/
│   │   └── storage.ts      # Data persistence
│   ├── App.tsx
│   └── index.tsx
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 How to Use

### Start a Focus Session
1. Navigate to **Study Room**
2. Select your focus duration
3. Click **Play** to begin
4. Watch the animated progress ring
5. Get motivation with the sparkle button

### Manage Your Studies
- **Sidebar Navigation** - Access all tools easily
- **Local Storage** - Your data stays private
- **Settings** - Adjust intervals and preferences

---
### Features Using AI
- 💭 Motivational quotes
- 🧠 your due exams as per your plan

---

## 🗺️ Navigation Routes

| Route | Purpose |
|-------|---------|
| `/` | Dashboard overview |
| `/study-room` | Pomodoro timer & focus |
| `/notes` | Note management |
| `/planner` | Study scheduling |
| `/exams` | Exam preparation |
| `/intelligence` | your study hours and many more |
| `/settings` | Configuration |

---

## ⚙️ Configuration

### Environment Variables
```env
VITE_API_KEY=your_google_gemini_api_key
```

### Customizable Settings
- Work session duration (default: 25 min)
- Short break duration (default: 5 min)
- Long break duration (default: 15 min)
- Theme preference (light/dark)

---

## 📊 Performance Metrics

- ⚡ **Build Time**: < 500ms with Vite
- 🎯 **Load Time**: < 2 seconds
- 🎨 **60 FPS Animations**: Framer Motion optimized
- 📱 **Mobile Ready**: Fully responsive design

---

## 🌐 Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome/Edge | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |

---

## 🤝 Contributing

We welcome contributions! 

```bash
# Fork → Clone → Create Branch → Commit → Push → Pull Request
```

---
---

## 💡 Tips for Success

1. **Consistency** - Use the same time slots daily
2. **No Distractions** - Enable focus mode
3. **Track Progress** - Monitor your study sessions
4. **Take Breaks** - Honor the break intervals
5. **Customize** - Adjust timings to your rhythm

---

**Ready to transform your study habits? Start with Studo today! 🚀**
Crafted with love--- YUVAN AVINASH🕊️
