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
