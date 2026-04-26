# Project Japan - Memory Notes

## Efek Sakura Jatuh (Tailwind + React)

### 1. tailwind.config.js
```js
theme: {
  extend: {
    keyframes: {
      sakura: {
        '0%':   { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
        '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
      },
    },
    animation: {
      sakura: 'sakura linear infinite',
    },
  },
},
```

### 2. SakuraEffect.jsx
```jsx
const petals = Array.from({ length: 20 });

export default function SakuraEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50">
      {petals.map((_, i) => (
        <span
          key={i}
          className="absolute text-pink-400 animate-sakura"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            fontSize: `${Math.random() * 14 + 10}px`,
            animationDuration: `${Math.random() * 5 + 4}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}
```

### 3. Penggunaan
```jsx
import SakuraEffect from '@/Components/SakuraEffect';

export default function Page() {
  return (
    <>
      <SakuraEffect />
      {/* konten halaman */}
    </>
  );
}
```

### Tips
- Ganti 🌸 dengan SVG petal agar lebih ringan & warna bisa dikontrol
- Bungkus `Math.random()` dengan `useMemo` agar stabil saat re-render
- Tambah `will-change: transform` via inline style untuk performa mobile

---

## Stack Project
- Laravel + Inertia.js + React
- Tailwind CSS
- MUI Material Icons (`@mui/icons-material`)
- Emotion (`@emotion/react`, `@emotion/styled`)

## Struktur Halaman
- `resources/js/Pages/` — halaman utama
- `resources/js/Pages/User/` — halaman user (authenticated)
- `resources/js/Components/UI/` — Card, Badge, Button
- `resources/js/Components/Layout/` — GuestNavbar, GuestFooter, AuthenticatedLayout

## Catatan
- `UserDashboard.jsx` dipindahkan dari `MainDashboard.jsx`
- `Roadmap.jsx` — desain Duolingo-style zigzag path dengan MUI icons
- Route roadmap: `GET /roadmap` → `Roadmap` component

---

## Memory 2026-04-17 - Audit Requirements vs Implementasi

### Ringkasan
- Requirement di `requirements.md`, `tambahan.md`, dan `.kiro/specs/*/requirements.md` jauh lebih lengkap dibanding implementasi `japanlingo` saat ini.
- Fondasi stack, auth dasar, migration inti, CRUD admin parsial, dan sebagian gamifikasi event-driven sudah ada.
- Banyak flow penting masih belum end-to-end, masih statis, atau masih placeholder terutama area murid, superadmin, dan pembayaran/subscription.

### Temuan Penting (Disaring - Sisanya Belum Dikerjakan)
- `japanlingo/README.md` perlu dirombak total di fase akhir deployment.
- Superadmin routes hanya render page placeholder tanpa controller/data real.
- Admin route `questions.index` ada, tetapi komponen React file UI-nya belum solid terintegrasi.
- Progress lesson sudah per-lesson, tetapi daftar modul/detail modul end-to-end dengan _lock indicator_ belum utuh.
- Belum ada domain payment/subscription/transaction/payment plan sama sekali selain field `subscription_status` di user.
- Belum ada domain kloter/cohort, key access, login history, bulk operation superadmin, maupun activity tracking seperti di spec.

### Prioritas Lanjutan
1. Bangun fitur Subscription (Free/Premium) middleware.
2. Rapikan UI admin panel untuk operasional `Question` dan `Levels`.
3. Bangun superadmin pengguna dan pembayaran dari backend schema sampai UI yang utuh.
4. Tambahkan test untuk flow utama.

---

## Memory 2026-04-19 - Superadmin Final Structure

### Navbar Final
- `Beranda`
- `Data User`
- `Data Admin`
- `Konten`
- `Gamifikasi`
- `Aktivitas`
- `Sistem`

### Keputusan Scope
- Menu `Pemasukan` diganti menjadi `Aktivitas` karena backend payment/subscription belum ada dan belum masuk scope aktif.
- `Konten` untuk superadmin mencakup:
  - monitoring module/lesson/quiz
  - news / announcement untuk dashboard user
  - status draft / published / pinned
- Superadmin saat ini difokuskan ke:
  - pengawasan platform
  - pengelolaan user dan admin
  - monitoring gamifikasi global
  - activity log / login history
  - system summary ringan

### Implementasi Frontend
- Halaman `SuperAdmin` sudah diubah dari placeholder menjadi UI operasional statis:
  - `SuperAdminDashboard.jsx`
  - `SuperAdminUsers.jsx`
  - `SuperAdminAdmins.jsx`
  - `SuperAdminContent.jsx`
  - `SuperAdminGamification.jsx`
  - `SuperAdminActivity.jsx`
  - `SuperAdminSystem.jsx`
  - `SuperAdminProfile.jsx`
- Route `/superadmin/pricing` sekarang di-redirect ke `/superadmin/activity`.

---

## Memory 2026-04-26 - Student Flow Finalization & Real Data

### Subscription & Paywall
- Menambah tabel/kolom `is_premium` pada `levels` dan mengaktifkannya di N4-N1.
- Membuat `SubscriptionMiddleware` (`subscribed`) untuk memblokir akses endpoint `lessons.show` dan `quizzes.show` jika level merupakan premium namun status user masih `free`.
- Membedakan tombol pada Lobby (LessonLobby & QuizLobby) menjadi "🔒 Premium" (membuka arah Pricing) dan "🔒 Terkunci" (membuka arah progress requirement).

### Progress & Skill Breakdown Riil
- *Progress Controller* tidak lagi menggunakan *dummy data*.
- *Skill Breakdown* (Grammar, Kanji, Vocabulary, Listening, Reading) dikalkulasi secara dinamis.
- Menggunakan pendekatan **Baseline + Keyword Scanning**: 
  - Setiap Lesson atau Quiz yang diselesaikan menyumbang poin baseline ke seluruh skill.
  - Tambahan multiplier bonus didapat jika `title` materi memiliki keyword spesifik (contoh: "baca", "dokkai", "grammar", "kanji", dsb).
