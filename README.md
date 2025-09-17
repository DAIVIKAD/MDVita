# MDVita — AI-Powered Mental Wellness PWA 🧠✨

**Gen AI Exchange Hackathon 2025 Submission**

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/8656ac55aa64022670c0f9e6b85e4e39/ce122f34-ef49-4ff7-b92c-5de2a3035146/index.html)
[![Firebase](https://img.shields.io/badge/Firebase-Ready-orange?style=for-the-badge)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI%20Powered-green?style=for-the-badge)](https://ai.google.dev/gemini-api)

## 🌟 Overview

MDVita is a **Progressive Web App** designed for youth mental wellness (ages 13-30), combining **Firebase Authentication**, **Gemini AI**, and modern web technologies to deliver personalized mental health support. The app provides real-time sentiment analysis, mood tracking, and gamified wellness experiences accessible on any device, even offline.

### 🎯 Problem Statement
Youth face unprecedented mental health challenges with limited access to personalized, AI-powered wellness tools. Traditional resources lack real-time insights, engagement, and accessibility for digital-native generations who need immediate, stigma-free support.

### 💡 Solution
An AI-powered PWA that transforms youth mental wellness through intelligent journaling, mood tracking, and personalized insights using Google's Gemini API, delivered through a gamified, offline-first experience.

---

## 🚀 Key Features

### 🔐 **Authentication System**
- Firebase Email/Password authentication
- Protected routes for personalized experiences
- Secure user profile management (ages 13-30)

### 📱 **Post-Login Dashboard**
- Quick mood entry with emoji selector
- Real-time streak counters and goal tracking
- Interactive Chart.js mood trend visualization
- Navigation to all app features

### ✍️ **AI-Powered Journaling**
- Real-time sentiment analysis using **Gemini AI**
- Contextual wellness suggestions while typing
- Rich text editor with formatting tools
- Auto-save and manual save functionality

### 📊 **Mood Tracking & Analytics**
- Interactive mood selection interface
- Chart.js visualization of mood patterns
- Historical data analysis and insights
- Streak tracking and achievements

### 🌐 **Discovery Feed**
- Curated health content cards (video/article)
- Social engagement features (like, comment, share, save)
- Verified content with "CURATED" badges
- Infinite scroll and load more functionality

### 🎮 **Wellness Games**
- 4-7-8 Breathing exercises with visual guidance
- Memory Match games for cognitive training
- Focus Timer for attention improvement
- Progress tracking and gamification

### 🌱 **Gamified Wellness Garden**
- Visual progress representation through garden growth
- Seasonal themes and achievements
- Consistency rewards and motivation

---

## 🏗️ Technical Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React PWA     │    │    Firebase      │    │   Gemini AI     │
│                 │    │                  │    │                 │
│ • Service Worker│◄──►│ • Authentication │◄──►│ • Sentiment     │
│ • Offline Cache │    │ • Firestore DB   │    │   Analysis      │
│ • Push Notifs   │    │ • Cloud Functions│    │ • Suggestions   │
│ • Chart.js      │    │ • Hosting        │    │ • Text Gen      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Frontend Stack**
- **React 18+** with functional components and hooks
- **PWA** with service workers and offline capabilities
- **Chart.js** for data visualization
- **CSS Grid & Flexbox** for responsive design
- **Modern ES6+** JavaScript

### **Backend Services**
- **Firebase Authentication** for secure user management
- **Firestore** for real-time data storage
- **Firebase Hosting** for PWA deployment
- **Firebase Security Rules** for data protection

### **AI Integration**
- **Google Gemini API** (gemini-1.5-flash model)
- Real-time text analysis and sentiment detection
- Contextual wellness suggestion generation

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI: `npm install -g firebase-tools`
- Google Cloud account with Gemini API access

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/mdvita-wellness-pwa.git
cd mdvita-wellness-pwa
npm install
```

### 2. Firebase Project Setup
```bash
# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Select: Authentication, Firestore, Hosting
# Choose existing project or create new one
```

### 3. Environment Configuration
Create `.env.local` file:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_GEMINI_MODEL=gemini-1.5-flash
```

### 4. Firebase Services Setup

#### Enable Authentication
```bash
# Go to Firebase Console > Authentication > Sign-in Method
# Enable Email/Password authentication
```

#### Configure Firestore
```bash
# Go to Firebase Console > Firestore Database
# Create database in Native mode
# Choose regional location
```

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Mood entries per user
    match /users/{userId}/moods/{moodId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Journal entries per user
    match /users/{userId}/journal/{entryId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🚦 Development & Deployment

### Local Development
```bash
# Start development server
npm run dev

# Start Firebase emulators (optional)
firebase emulators:start --only auth,firestore

# Build for production
npm run build
```

### Firebase Deployment
```bash
# Build and deploy
npm run build
firebase deploy

# Deploy to preview channel
firebase hosting:channel:deploy preview

# Access deployed app
https://your-project-id.web.app
```

### PWA Features Testing
- Test offline functionality in Chrome DevTools
- Verify service worker registration
- Test "Add to Home Screen" prompt
- Validate push notifications

---

## 🤖 AI Integration (Gemini)

### Sentiment Analysis Implementation
```javascript
// Real-time journal analysis
async function analyzeJournalEntry(text) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Analyze the emotional sentiment of this journal entry and provide supportive insights: "${text}"`
        }]
      }]
    })
  });
  
  return response.json();
}
```

### Wellness Suggestions
```javascript
// Generate contextual suggestions
async function generateWellnessSuggestions(mood, context) {
  const prompt = `Based on current mood "${mood}" and context "${context}", suggest 3 helpful, youth-friendly wellness activities`;
  // Gemini API call implementation
}
```

---

## 📊 Features Demonstration

### Core User Journey
1. **Landing Page** → Sign up with email/password
2. **Dashboard** → Quick mood check-in with emoji selector
3. **AI Journal** → Write entry with real-time Gemini sentiment analysis
4. **Discovery Feed** → Browse curated wellness content
5. **Games** → Play breathing exercises or memory games
6. **Progress** → View mood trends and wellness garden growth

### Key Differentiators
- **Real-time AI Analysis**: Gemini processes journal entries as you type
- **Offline-First PWA**: Works without internet connection
- **Gamified Experience**: Wellness garden grows with consistent use
- **Youth-Focused Design**: Ages 13-30 with appropriate content curation
- **Privacy-First**: Local processing with secure cloud sync

---

## 🏆 Hackathon Compliance

### Gen AI Exchange Requirements ✅

| Requirement | Implementation |
|-------------|----------------|
| **AI Integration** | Gemini API for sentiment analysis, suggestions, and insights |
| **Real-World Impact** | Addresses youth mental health crisis with evidence-based tools |
| **Scalable Architecture** | Firebase backend supports millions of users |
| **Innovation** | First-to-market AI-powered wellness garden visualization |
| **Technical Excellence** | Modern React PWA with offline capabilities |
| **Social Good** | UN SDG 3 (Health & Well-being) for underserved demographics |

---

## 📈 Impact & Metrics

### Target Demographics
- **Primary**: Youth ages 13-30 seeking mental health support
- **Secondary**: Parents, educators, mental health advocates
- **Tertiary**: Healthcare providers needing patient insights

### Success Metrics
- User engagement: Daily check-ins, journal entries, game completions
- AI effectiveness: Sentiment accuracy, suggestion relevance
- Wellness outcomes: Mood trend improvements, streak maintenance
- Technical performance: PWA install rates, offline usage

---

## 🔒 Privacy & Security

### Data Protection
- **End-to-end encryption** for sensitive journal content
- **Per-user Firestore rules** preventing cross-user data access
- **Local-first processing** with optional cloud sync
- **GDPR compliance** with data export and deletion

### Crisis Intervention
- **Pattern detection** algorithms identify concerning trends
- **Resource recommendations** for immediate help
- **Emergency contacts** integration for crisis situations

---

## 🎥 Demo Assets

### Live Prototype
[**https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/8656ac55aa64022670c0f9e6b85e4e39/ce122f34-ef49-4ff7-b92c-5de2a3035146/index.html**](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/8656ac55aa64022670c0f9e6b85e4e39/ce122f34-ef49-4ff7-b92c-5de2a3035146/index.html)

### Demo Credentials
```
Email: demo@mdvita.com
Password: demo123
```

### Video Demo
3-minute walkthrough demonstrating:
- User authentication flow
- Dashboard mood tracking
- AI-powered journaling with Gemini
- Discovery feed interaction
- PWA offline capabilities

---

## 📝 License

This project is submitted for **Gen AI Exchange Hackathon 2025** evaluation. 

### Third-Party Licenses
- Firebase SDK: Apache 2.0
- Chart.js: MIT License
- React: MIT License
- Google Gemini API: Google Cloud Terms

---

## 🙏 Acknowledgments

- **Google Gemini Team** for generative AI capabilities
- **Firebase Team** for backend infrastructure
- **Mental Health Advocates** for problem validation
- **Open Source Community** for development tools

---

## 📞 Contact & Support

**Developer**: [Your Name]  
**Email**: your.email@domain.com  
**LinkedIn**: [Your LinkedIn Profile]  
**Hackathon**: Gen AI Exchange 2025

---

**Built with 💚 for youth mental wellness**