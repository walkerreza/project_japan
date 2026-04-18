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

### Temuan Penting
- `japanlingo/README.md` masih README default Laravel, bukan dokumentasi produk Japanlingo.
- Route murid masih memakai `role:user`, padahal requirement memakai role `student`: lihat `japanlingo/routes/web.php`.
- Register masih auto-login dan redirect ke dashboard, padahal spec publik minta redirect ke `/login` dengan success message.
- Register belum punya checkbox terms & conditions.
- Superadmin routes hanya render page placeholder tanpa controller/data real.
- Admin route `questions.index` ada, tetapi file `resources/js/Pages/Admin/Questions/Index.jsx` tidak ada.
- Progress lesson sudah per-lesson dan lebih sesuai spec, tetapi daftar modul/detail modul end-to-end belum ada.
- Quiz/Lesson frontend masih banyak elemen hardcoded dan belum mengikuti semua tipe/hasil kuis yang diminta spec.
- Certificate download ada, tetapi generator PDF sebenarnya belum selesai dan masih fallback kondisional.
- Belum ada domain payment/subscription/transaction/payment plan sama sekali selain field `subscription_status` di user.
- Belum ada domain kloter/cohort, key access, login history, bulk operation superadmin, maupun activity tracking seperti di spec.

### Prioritas Lanjutan
1. Rapikan auth dan role naming: `student/admin/superadmin`, redirect sesuai spec, register flow, terms checkbox.
2. Bangun flow murid end-to-end: modules list, module detail, unlock logic, lesson progress, quiz result, next lesson.
3. Rapikan admin panel agar operasional penuh: level, module, lesson, quiz, question index/show/edit, dependency checks, preview.
4. Bangun superadmin pengguna dan pembayaran dari backend schema sampai UI.
5. Tambahkan test untuk flow utama murid, admin, gamifikasi, superadmin, dan pembayaran.
