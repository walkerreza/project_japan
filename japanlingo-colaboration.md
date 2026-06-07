# Japanlingo Collaboration Context

Dokumen ini adalah konteks kerja utama agar developer, user, Codex, dan IDE AI eksternal tidak kehilangan arah.

Gunakan dokumen ini untuk roadmap, keputusan produk, dan prioritas kerja. Untuk mapping teknis file/controller/model/database, gunakan `project-structure-map.md`. Untuk QA manual, gunakan `project-qa-checklist.md`.

## Product Direction

Japanlingo adalah platform web pembelajaran bahasa Jepang dengan fokus awal JLPT N3 dan kanji.

Referensi produk:

- Duolingo: progression, streak, XP, quiz loop, habit-forming learning.
- Kanji Senpai: compact kanji practice and repetition.
- Canva-style public homepage reference.
- Riki Jepang hanya sebagai referensi isi/konten, bukan clone teknis.

## Scope Aktif

- Public page: landing, pricing, about, roadmap, login/register.
- User: dashboard, lesson, quiz, progress, news, certificate, premium access.
- Admin/sensei: user monitoring, module/lesson builder, quiz builder, question management, kanji bank, analytics, gamification.
- Superadmin: user/admin management, news portal maker, payments/manual premium, access key, global theme, activity/system monitoring.

## Keputusan Teknis Penting

- Frontend page/folder boleh memakai Bahasa Indonesia agar mudah dimaintain dari UI.
- Backend, model, route name, migration, dan database tetap memakai English standar Laravel.
- Migration yang sudah `Ran` tidak di-rename.
- Premium untuk sekarang memakai manual payment/access key. Payment gateway real ditunda sampai provider dipilih.
- OCR/import massal dari PDF/PPT berbasis gambar ditunda.
- SEO publik belum prioritas sampai flow inti stabil.

## Implemented State

- Auth manual, register, role redirect, profile routing, Google Socialite.
- Role: `user`, `admin`, `superadmin`.
- User dashboard, lesson, quiz, progress, certificate, leaderboard, news.
- Admin CRUD/management untuk level, module, lesson, quiz, question, kanji bank, analytics, achievements.
- Quiz submit menyimpan attempt dan per-question answer via `attempt_answers`.
- Kanji bank CRUD dan sync command `php artisan kanji:sync`.
- Quiz builder mendukung template/import CSV/XLSX dan generate soal dari kanji bank.
- Module builder mendukung import lesson dan import/generate draft lesson dari kanji bank.
- Superadmin dashboard, data user, data admin, news/content, payments, access key, system theme, activity.
- Payment tables: `payment_plans`, `subscriptions`, `transactions`, `transaction_logs`.
- Access key tables: `access_keys`, `access_key_redemptions`.
- `SubscriptionMiddleware` dipasang pada user lesson/quiz show route.
- Global frontend theme disimpan di `app_settings`, bukan localStorage.
- Demo seeders idempotent: `UserSeeder`, `N3CourseSeeder`, `AchievementSeeder`, `DemoDataSeeder`.
- Struktur frontend sudah direfactor dan terdokumentasi di `project-structure-map.md`.

## Current Phase: QA & Demo Readiness

Tujuan fase ini bukan menambah fitur besar, tetapi memastikan flow yang sudah ada stabil.

Checklist utama:

1. Jalankan `php artisan migrate`.
2. Jalankan `php artisan db:seed` jika butuh data demo.
3. Ikuti `project-qa-checklist.md`.
4. Catat bug yang benar-benar muncul di browser.
5. Fix bug kecil/terukur sebelum masuk fitur besar.

## Demo Accounts

Semua password demo: `password`.

- Superadmin: `superadmin@japanlingo.com`
- Admin/sensei: `admin@japanlingo.com`
- Premium user: `student@japanlingo.com`
- Free user: `student2@japanlingo.com`

Demo access key:

```text
DEMO-N3-PREMIUM
```

## Kanji Sync

Source API: `https://kanjiapi.dev`

Commands:

```bash
php artisan kanji:sync --level=N3 --sleep=100
php artisan kanji:sync --level=N3 --limit=10 --sleep=50
```

Catatan:

- API menyediakan Japanese readings dan English meanings.
- Arti Indonesia, contoh kalimat, dan catatan belajar tetap perlu kurasi sensei.
- Reverse search seperti `fire -> 火` dilakukan dari data lokal `kanji_bank`, bukan fetch langsung dari browser.

## Remaining Backlog

Prioritas aman:

- Browser QA end-to-end untuk semua role.
- Upgrade/paywall UI agar user free paham cara redeem/upgrade.
- Admin content workflow kecil: clone lesson, draft validation, preview, bulk reorder.
- Seed/demo data tambahan jika dibutuhkan untuk presentasi.
- Test coverage minimal untuk access key, quiz submit, progress, certificate, dan role access.

Ditahan:

- OCR mass import dari PDF/PPT gambar.
- Payment gateway real.
- Rename database/migration.
- Refactor total builder.
- SEO publik lanjutan.

## Next AI Agent Instructions

1. Baca `project-structure-map.md` sebelum mencari file.
2. Baca `project-qa-checklist.md` sebelum mengubah flow.
3. Jangan rename database table/migration yang sudah berjalan.
4. Jangan menjalankan build jika user meminta tetap development.
5. Saat menemukan dokumen lama yang bertentangan, prioritaskan dokumen ini dan `project-structure-map.md`.
