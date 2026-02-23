# 🎌 Japanlingo

Platform belajar bahasa Jepang yang terstruktur dan gamified, dirancang untuk membantu learners menguasai JLPT N3

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | Laravel 12 |
| Frontend | React + Inertia.js |
| Styling | Tailwind CSS |
| Database | MySQL |
| Server | Laragon (Local Dev) |

## Struktur Project

```
japanlingo/
├── resources/js/
│   ├── Components/
│   │   ├── UI/               # Button, Card, Badge, Modal, Input, etc.
│   │   ├── Form/             # TextInput, SelectInput, Checkbox, etc.
│   │   ├── Table/            # DataTable, Pagination
│   │   ├── Dashboard/        # StatCard, ChartCard, StreakWidget, etc.
│   │   ├── Learning/         # LessonCard, QuizQuestion, LevelBadge, etc.
│   │   ├── Navigation/       # NavLink, SidebarLink, Breadcrumb, etc.
│   │   └── Layout/           # GuestNavbar, GuestFooter, GuestAuthLayout
│   ├── Layouts/
│   │   ├── AuthenticatedLayout.jsx   # Layout untuk user sudah login
│   │   └── GuestLayout.jsx           # Layout default Breeze
│   └── Pages/
│       ├── Auth/             # Login, Register, ForgotPassword, etc.
│       ├── landingPage.jsx   # Halaman utama (public)
│       ├── About.jsx         # Halaman about (public)
│       ├── Pricing.jsx       # Halaman pricing (public)
│       └── MainDashboard.jsx # Dashboard utama (authenticated)
├── routes/
│   └── web.php               # Routing (Inertia)
└── database/
    └── migrations/           # Tabel users, levels, modules, lessons, etc.
```

## Layout System

| Layout | Fungsi | Dipakai di |
|--------|--------|------------|
| `GuestNavbar` | Navbar untuk halaman public | Landing, About, Pricing |
| `GuestFooter` | Footer untuk halaman public | Landing, About, Pricing |
| `GuestAuthLayout` | Split screen branding + form | Login, Register, Forgot Password |
| `AuthenticatedLayout` | Sidebar + navbar + konten | Dashboard, Profile |

## Routes

### Public (Guest)
| Route | Page | Deskripsi |
|-------|------|-----------|
| `/` | `landingPage` | Halaman utama |
| `/about` | `About` | Tentang Japanlingo |
| `/pricing` | `Pricing` | Paket harga |
| `/login` | `Auth/Login` | Halaman login |
| `/register` | `Auth/Register` | Halaman registrasi |

### Authenticated
| Route | Page | Deskripsi |
|-------|------|-----------|
| `/dashboard` | `MainDashboard` | Dashboard utama user |

## Shared Components

### UI (9 komponen)
`Button` · `Input` · `Modal` · `Dropdown` · `Badge` · `Card` · `Avatar` · `ProgressBar` · `Alert`

### Form (6 komponen)
`TextInput` · `SelectInput` · `Checkbox` · `RadioGroup` · `FileUpload` · `FormSection`

### Table (2 komponen)
`DataTable` · `Pagination`

### Dashboard (4 komponen)
`StatCard` · `ChartCard` · `RecentActivity` · `StreakWidget`

### Learning (6 komponen)
`LessonCard` · `QuizQuestion` · `LevelBadge` · `XPBar` · `LeaderboardItem` · `CertificateCard`

### Navigation (5 komponen)
`NavLink` · `SidebarLink` · `Breadcrumb` · `ResponsiveNavLink` · `ApplicationLogo`

## Setup

```bash
# Clone & Install
cd japanlingo
composer install
npm install

# Environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate

# Development
npm run dev
php artisan serve
```

## Tim

Dibuat oleh tim Japanlingo 🇯🇵
