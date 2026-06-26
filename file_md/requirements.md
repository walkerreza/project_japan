# Japanlingo

**Konsep:** Seperti Duolingo (https://www.duolingo.com/learn) dengan gamifikasi learning menggunakan konten Rikijepang (https://rikijepang.com/)

**Referensi:**
- Homepage: Canva-style
- Gamifikasi quiz: Aplikasi Kanji Senpai

---

## HALAMAN PUBLIK

### 1. Landing Page (`/`)
**Sections:**
- Hero (tagline, CTA daftar)
- Features/Benefits (icon + text)
- How It Works (3 langkah)
- Pricing Preview (2 paket)
- Testimonials (slider/cards)
- CTA Footer (tombol daftar)

### 2. Pricing Page (`/pricing`)
**Sections:**
- Pricing Cards (Free vs Premium)
- Feature Comparison Table
- FAQ Accordion
- CTA (mulai gratis)

### 3. About / Tentang (`/about` atau `/tentang`)
**Sections:**
- Hero (visi misi)
- Metode Pembelajaran
- Tim (profiles)
- Statistik (users, lessons, dll)
- CTA

### 4. Login / Register
**Login (`/login`):**
- Logo + tagline
- Form email/password
- Social login buttons (optional)
- Link ke register & forgot password

**Register (`/register`):**
- Form (username, email, password, confirm)
- Terms & conditions checkbox
- Link ke login

---

## HALAMAN PRIVATE (SETELAH LOGIN)

### 5. Dashboard Murid (`/dashboard`)
**Widgets:**
- Welcome Banner (nama user)
- XP & Level Progress Bar
- Streak Counter (api + angka)
- Current Module Card
- Recent Activity Timeline
- Quick Quiz Button
- Upcoming Lessons
- Achievements Unlocked

### 6. Modul Page (`/modules`)
**Layout:**
- Level Tabs (N5, N4, N3, N2, N1)
- Module Cards (per minggu)
  - Progress indicator
  - Title
  - Lesson count
  - Start/Continue button
- Filter/Search

### 7. Module Detail (`/modules/{id}`)
**Sections:**
- Module Header (title, progress)
- Lessons List (accordion/cards)
  - Lesson title
  - Status (locked/unlocked/completed)
  - Duration/XP estimate
- Start Module Button

### 8. Lesson Page (`/lessons/{id}`)
**Layout:**
- Progress Bar (top)
- Content Area (text, images, audio)
- Navigation (prev/next)
- Take Quiz Button

### 9. Quiz Page (`/quizzes/{id}`)
**Quiz Types:**
- Multiple Choice (question + 4 options)
- Typing (question/prompt + text input)
- Listening (audio player + question)

**Results:**
- Score display
- XP earned
- Correct/Incorrect breakdown
- Retry/Next Lesson buttons

---

## GAMIFIKASI SYSTEM

### XP & Level
- Lesson completion: +10 XP
- Quiz passed: +20-50 XP (based on score)
- Daily login: +5 XP
- Achievement unlock: +bonus XP

**Level Thresholds:**
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 300 XP
- Level 4: 600 XP

### Streak System
- Increment on daily activity
- Reset if no activity for 24h
- Bonus XP for streak milestones (7, 30, 100 days)

### Certificates
- Issued on level completion
- Generate PDF with user name, level, date
- Unique certificate number
- Downloadable from dashboard

### Achievements
- "First Steps" - Complete first lesson
- "Quiz Master" - Score 100% on 10 quizzes
- "Week Warrior" - 7-day streak
- "N3 Graduate" - Complete N3 level
- "Speed Learner" - Complete 5 lessons in one day

---

## DATABASE SCHEMA

### Tables

**users** (update)
- role: student|admin
- subscription_status: free|premium
- xp: integer
- level: integer
- streak_count: integer
- last_activity_date: date

**levels**
- level_name: N5|N4|N3|N2|N1
- stage: integer

**modules**
- level_id (FK)
- title
- week_number
- description

**lessons**
- module_id (FK)
- title
- content (text/HTML)
- order

**quizzes**
- lesson_id (FK)
- type: multiple_choice|typing|listening

**questions**
- quiz_id (FK)
- question_text
- options (JSON)
- correct_answer
- explanation
- audio_url

**attempts**
- user_id (FK)
- quiz_id (FK)
- score
- xp_earned
- attempted_at

**progress**
- user_id (FK)
- lesson_id (FK)
- completed_at
- score

**certificates**
- user_id (FK)
- level_id (FK)
- issued_at
- certificate_number
- file_path

**achievements**
- name
- description
- icon
- xp_reward
- condition_type

**user_achievements**
- user_id (FK)
- achievement_id (FK)
- unlocked_at

---

## FILE STRUCTURE FRONTEND

```
resources/js/
├── Components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── Accordion.jsx
│   │   └── Tabs.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── GuestLayout.jsx
│   ├── gamification/
│   │   ├── XPBar.jsx
│   │   ├── StreakCounter.jsx
│   │   ├── LevelBadge.jsx
│   │   └── AchievementCard.jsx
│   └── quiz/
│       ├── MultipleChoice.jsx
│       ├── TypingQuestion.jsx
│       ├── ListeningQuestion.jsx
│       └── QuizResult.jsx
├── Pages/
│   ├── Landing.jsx
│   ├── Pricing.jsx
│   ├── About.jsx
│   ├── Dashboard.jsx
│   ├── Modules/
│   │   ├── Index.jsx
│   │   └── Show.jsx
│   ├── Lessons/
│   │   └── Show.jsx
│   ├── Quizzes/
│   │   └── Show.jsx
│   └── Auth/
│       ├── Login.jsx
│       └── Register.jsx
└── Hooks/
    ├── useXP.js
    ├── useStreak.js
    └── useProgress.js
```

---

## BACKEND STRUCTURE

### Models
- User (update with relationships)
- Level
- Module
- Lesson
- Quiz
- Question
- Attempt
- Progress
- Certificate
- Achievement
- UserAchievement

### Controllers
- LandingController
- PricingController
- AboutController
- DashboardController
- ModuleController
- LessonController
- QuizController
- ProfileController (sudah ada)

### Middleware
- RoleMiddleware (cek role: student|admin)
- SubscriptionMiddleware (cek subscription premium)

---

## DEVELOPMENT PHASES

### Phase 1: Backend Foundation
1. Update User model + migration (xp, streak, level)
2. Create all models with relationships
3. Create migrations for new tables
4. Create middleware (role, subscription)
5. Seeders for N3 content sample

### Phase 2: Public Pages
1. Landing Page
2. Pricing Page
3. About Page
4. Custom Login/Register UI

### Phase 3: Private Pages
1. Dashboard Murid
2. Module listing
3. Module detail
4. Lesson page
5. Quiz page

### Phase 4: Gamifikasi
1. XP & Level system
2. Streak system
3. Certificates
4. Achievements

### Phase 5: Admin Panel
1. Admin Dashboard
2. User Management
3. Content Management (CRUD modules, lessons, quizzes)

---

## TECH STACK

**Backend:**
- Laravel 12
- PHP 8.2

**Frontend:**
- React 18
- Inertia.js v2
- Tailwind CSS 3.2
- Vite 7

**Authentication:**
- Laravel Breeze (Inertia + React)

**Payment Gateway:**
- (Belum diimplementasi - phase selanjutnya)

**Zoom Integration:**
- (Belum diimplementasi - phase selanjutnya)
