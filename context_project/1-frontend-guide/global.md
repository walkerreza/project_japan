# Frontend Global Guide

Dokumen ini menjelaskan struktur frontend aktif Japanlingo.
Gunakan file ini sebelum mengubah halaman React/Inertia agar perubahan tetap sesuai dengan arsitektur yang sudah ada.

## Source of Truth

Urutan referensi frontend:

1. Source code aktif di `japanlingo/resources/js`
2. `file_md/project-structure-map.md`
3. `file_md/japanlingo-colaboration.md`
4. Chat client di `context_project/Chat WhatsApp dengan Fuad (Jepang)`

Jika dokumen lama bertentangan dengan source code aktif, ikuti source code aktif.

## Stack Frontend

- React
- Inertia.js
- Tailwind CSS
- Framer Motion untuk beberapa animasi UI
- MUI Icons untuk icon visual
- Vite sebagai dev server
- Laravel route helper `route(...)` dipakai di page React

## Entry Point

Frontend utama berada di:

- `japanlingo/resources/js/app.jsx`
- `japanlingo/resources/js/bootstrap.js`

Halaman Inertia berada di:

- `japanlingo/resources/js/Pages`

Komponen reusable berada di:

- `japanlingo/resources/js/Components`

Layout utama berada di:

- `japanlingo/resources/js/Layouts`

## Struktur Halaman

### Public / Guest

Halaman public adalah halaman yang bisa dibuka sebelum login.

Lokasi:

- `Pages/landingPage.jsx`
- `Pages/About.jsx`
- `Pages/Pricing.jsx`
- `Pages/Roadmap.jsx`
- `Pages/Auth/Login.jsx`
- `Pages/Auth/Register.jsx`

Fungsi:

- landing page memakai referensi arah visual Canva
- pricing menjelaskan paket free/premium
- about menjelaskan konsep belajar dan metode
- roadmap menampilkan gaya progression seperti Duolingo
- login/register menangani auth manual dan Google login

### User / Siswa

Lokasi utama:

- `Pages/User/Beranda.jsx`
- `Pages/User/Materi`
- `Pages/User/Kuis`
- `Pages/User/Flashcard`
- `Pages/User/Progress`
- `Pages/User/Sertifikat`
- `Pages/User/Berita`
- `Pages/User/Leaderboard.jsx`
- `Pages/User/Profil.jsx`

Flow yang sedang diarahkan untuk beta:

`Beranda -> Flashcard/Kosakata -> Kuis -> Progress -> Premium/Upgrade`

Catatan produk:

- `Materi` masih ada, tetapi untuk fase berikutnya bukan pusat pengalaman belajar.
- Client ingin materi dari Google Drive digamifikasi, bukan hanya ditampilkan sebagai halaman materi penuh.
- Flashcard dan kosakata harus dianggap fitur inti, bukan fitur tambahan.
- User free harus melihat preview yang tidak lengkap untuk konten premium.

### Admin / Sensei

Lokasi utama:

- `Pages/Admin/Beranda.jsx`
- `Pages/Admin/DataUser`
- `Pages/Admin/Analitik`
- `Pages/Admin/Level`
- `Pages/Admin/ModulMateri`
- `Pages/Admin/Kuis`
- `Pages/Admin/Flashcard`
- `Pages/Admin/Kosakata`
- `Pages/Admin/KanjiBank`
- `Pages/Admin/Gamifikasi`
- `Pages/Admin/Presentasi`
- `Pages/Admin/BoardAjar`
- `Pages/Admin/Profil.jsx`

Fungsi admin:

- mengelola user/siswa
- membuat module, lesson, quiz, question, flashcard, kosakata, dan kanji bank
- melihat analitik dan performa user
- mengelola gamifikasi
- membuat dan mengedit presentasi
- membuat board ajar jika dibutuhkan

Catatan client:

- Presentasi hanya admin yang bisa edit.
- User cukup menjadi viewer.
- Admin mass input CSV/XLSX diperbolehkan dan penting untuk mengurangi input manual.
- Tampilan admin diharapkan mendekati workflow Quizizz dan Google Form untuk pembuatan materi/kuis.

### Superadmin

Lokasi utama:

- `Pages/SuperAdmin/Beranda.jsx`
- `Pages/SuperAdmin/DataUser`
- `Pages/SuperAdmin/DataAdmin`
- `Pages/SuperAdmin/Konten`
- `Pages/SuperAdmin/Gamifikasi`
- `Pages/SuperAdmin/Pemasukan`
- `Pages/SuperAdmin/Sistem`
- `Pages/SuperAdmin/Aktivitas`
- `Pages/SuperAdmin/Profil.jsx`

Fungsi superadmin:

- mengelola user dan admin
- membuat berita/news
- memantau gamifikasi global
- mengelola payment manual, access key, subscription, dan transaksi
- mengubah global theme dari sistem
- melihat aktivitas dan login history

## Komponen Reusable

Komponen yang sudah aktif:

- `Components/UI`: button, card, modal, badge, input, progress bar, alert, avatar, dropdown
- `Components/Form`: checkbox, radio, select, text input, file upload, form section
- `Components/Table`: data table dan pagination
- `Components/Navigation`: logo, nav link, sidebar link, breadcrumb
- `Components/Dashboard`: stat card, chart card, streak widget, recent activity
- `Components/Learning`: lesson card, quiz question, XP bar, certificate card, leaderboard item
- `Components/Lesson`: lesson article
- `Components/Editor`: Quill editor
- `Components/Document`: document viewer
- `Components/Board`: board canvas dan editable board canvas
- `Components/theme`: theme presets dan efek visual

Gunakan komponen yang sudah ada sebelum membuat komponen baru.

## Layout

Layout aktif:

- `Layouts/AuthenticatedLayout.jsx`
- `Layouts/GuestLayout.jsx`
- `Components/Layout/GuestAuthLayout.jsx`
- `Components/Layout/GuestNavbar.jsx`
- `Components/Layout/GuestFooter.jsx`

Catatan:

- Semua page user/admin/superadmin harus aman terhadap sidebar.
- Bug historis pernah terjadi saat editor atau content tertutup sidebar.
- Jangan membuat layout page yang memakai offset manual tanpa cek desktop dan mobile.

## Theme

Theme frontend berada di:

- `Components/theme/themes.js`

Catatan penting:

- Global theme disimpan dari backend `app_settings`, bukan localStorage.
- Beberapa token theme berupa gradient stops, bukan class Tailwind lengkap.
- Saat memakai token theme, pastikan token dipakai sesuai bentuknya.
- Jangan mengandalkan warna theme untuk teks penting tanpa fallback kontras.

## Naming Convention

Aturan aktif:

- Folder dan file frontend boleh memakai Bahasa Indonesia agar mudah dipahami client/maintainer.
- Backend, route name, model, migration, dan database tetap memakai English.
- Jika rename file page Inertia, controller `Inertia::render(...)` harus ikut diubah.
- Jika menambah menu baru, update dokumentasi mapping project.

## Active Frontend Priorities

Prioritas dekat untuk beta:

1. Stabilkan flow user.
2. Jadikan flashcard/kosakata dan kuis sebagai inti flow belajar.
3. Pastikan premium preview jelas untuk free user.
4. Rapikan presentasi admin dan share/view untuk user.
5. Siapkan dasar kelas/kloter user.
6. Pastikan admin mass input tetap mudah dipahami.

## Held Scope

Jangan diprioritaskan sebelum flow beta stabil:

- redesign total semua halaman
- OCR/import massal PDF/PPT gambar
- SEO publik lanjutan
- payment gateway production penuh
- refactor total builder
- rename struktur besar tanpa kebutuhan langsung
