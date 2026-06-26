# Backend Base Context

Project memakai Laravel MVC + Inertia React + PostgreSQL.
Source of truth backend adalah `japanlingo/app`, `japanlingo/routes`, dan `japanlingo/database`.

## Struktur Utama

- Controller: `japanlingo/app/Http/Controllers`
- Middleware: `japanlingo/app/Http/Middleware`
- FormRequest: `japanlingo/app/Http/Requests`
- Model: `japanlingo/app/Models`
- Service: `japanlingo/app/Services`
- Route: `japanlingo/routes/web.php` dan `japanlingo/routes/auth.php`
- Migration/Seeder: `japanlingo/database`

## Aturan Eksekusi

- Ikuti MVC Laravel: route -> controller -> service/model -> Inertia/redirect.
- Controller jangan diisi logic panjang; pindahkan ke `app/Services`.
- Route role wajib memakai middleware role yang benar.
- Backend, model, route name, migration, dan tabel tetap English.
- Frontend boleh Bahasa Indonesia, tapi backend tetap standar Laravel.
- Jangan rename migration atau tabel lama tanpa rencana refactor besar.
- Jangan percaya komentar lama jika beda dengan `routes/web.php`.

## Role dan Prefix

- Guest: `/`
- User: `/user/*`, route name `user.*`, middleware `role:user`
- Admin: `/admin/*`, route name `admin.*`, middleware `role:admin`
- Superadmin: `/superadmin/*`, route name `superadmin.*`, middleware `role:superadmin`

## Middleware Penting

- `CheckRole`: blokir akses role yang salah dengan 403.
- `SubscriptionMiddleware`: blokir lesson/quiz premium untuk user free.
- `HandleInertiaRequests`: share `auth.user`, notifications, dan flash props ke React.

## FormRequest Aktif

- `Auth/LoginRequest`
- `ProfileUpdateRequest`
- `Admin/ModuleRequest`
- `Admin/QuizRequest`
- `Admin/QuestionRequest`

Gunakan FormRequest untuk form besar atau validasi yang dipakai berulang.

## Domain Aktif

- Auth dan profile
- User learning: dashboard, lesson, quiz, flashcard, progress, certificate, news
- Admin content: level, module, lesson, quiz, question, flashcard, vocabulary, kanji, presentation, board
- Superadmin: user/admin management, news, payment manual, access key, theme, activity
- Gamification: XP, streak, achievement, reward log

## Prioritas Backend Dekat

- Stabilkan flow user, admin, superadmin.
- Pastikan quiz attempt, attempt answers, progress, XP, dan flashcard review konsisten.
- Perjelas premium/free access.
- Siapkan presentation share/view.
- Jika membuat kelas/kloter, buat domain baru yang jelas; jangan disisipkan asal ke controller lama.
