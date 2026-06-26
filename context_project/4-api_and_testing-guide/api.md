# API Base Context

Project ini memakai Laravel + Inertia React. Mayoritas endpoint adalah route web, bukan REST API murni.

## Source Of Truth

- Route utama: `japanlingo/routes/web.php`
- Auth route: `japanlingo/routes/auth.php`
- Controller: `japanlingo/app/Http/Controllers`
- Request validation: `japanlingo/app/Http/Requests`

## Response Rules

- Page render memakai `Inertia::render()`.
- Form submit memakai redirect back/route dengan flash message.
- Upload/import error harus balik sebagai validation error.
- Endpoint AJAX kecil boleh return JSON jika memang dipakai komponen frontend.
- Jangan campur response JSON dan Inertia pada endpoint yang sama tanpa alasan jelas.

## Auth And Role

- Public: `/`, `/about`, `/pricing`, `/roadmap`
- Authenticated: `/dashboard`, `/profile`, notifications, lesson document viewer/download
- User prefix: `/user/*`
- Admin prefix: `/admin/*`
- Superadmin prefix: `/superadmin/*`

Middleware:

- `auth`
- `verified`
- `role:user`
- `role:admin`
- `role:superadmin`
- `subscribed` untuk konten premium user

## User Endpoints

- `GET /user/dashboard`: dashboard murid.
- `POST /user/access-keys/redeem`: redeem premium access key.
- `GET /user/news`: daftar berita published.
- `GET /user/news/{news}`: detail berita.
- `GET /user/lessons`: lobby materi.
- `GET /user/lessons/{lesson}`: detail materi premium/allowed.
- `GET /user/quizzes`: lobby kuis.
- `GET /user/quizzes/{quiz}`: halaman kuis premium/allowed.
- `POST /user/attempts`: submit quiz aktif.
- `POST /user/lessons/complete`: tandai lesson selesai.
- `GET /user/flashcards`: library flashcard.
- `GET /user/flashcards/{flashcardSet}`: review flashcard set.
- `POST /user/flashcards/review/{flashcard}`: simpan status flashcard.
- `GET /user/progress`: ringkasan progress.
- `GET /user/leaderboard`: leaderboard.
- `GET /user/certificates`: sertifikat.

Catatan penting:

- Submit quiz aktif adalah `POST /user/attempts` ke `ProgressController@storeAttempt`.
- Jangan gunakan route lama `/user/quiz-attempts` kecuali memang diaktifkan lagi.

## Admin Endpoints

Admin bertindak sebagai sensei/content manager.

- Levels: CRUD via `/admin/levels`
- Modules: CRUD, builder, import lesson, import document, import kanji lesson
- Lessons: CRUD dan reorder
- Quizzes: CRUD, status, builder, import questions, template CSV/XLSX, generate kanji questions
- Questions: CRUD dan reorder
- Kanji: CRUD, import, autofill
- Vocabulary: CRUD, import, template
- Flashcards: CRUD, builder, generate quiz
- Presentations: CRUD, builder, import PPTX, presenter, save slide board
- Boards: CRUD/editor legacy
- Analytics: read-only analytics
- Users: read-only student list/detail
- Upload: generic admin upload endpoint

## Superadmin Endpoints

Superadmin mengatur platform.

- Dashboard: overview platform.
- Users: manage user status/reset password.
- Admins: create/manage admin.
- Content/news: CRUD berita, editor image, attachment.
- Gamification: overview gamification.
- Payments: plan, transaction, approve/reject, access key.
- Activity: activity/log monitoring.
- System: theme setting global.

## Upload And Document Rules

- Semua upload harus validasi mime, size, dan field required.
- Simpan file di storage Laravel.
- Simpan hanya path/metadata di database.
- Viewer dokumen memakai route `lesson.documents.show`.
- Download memakai route `lesson.documents.download`.

## Naming Rules

- Route name pakai prefix role: `user.*`, `admin.*`, `superadmin.*`.
- Controller admin pakai prefix `Admin`.
- Controller superadmin pakai prefix `SuperAdmin`.
- Jangan membuat endpoint baru di luar role group jika fiturnya milik role tertentu.

## New Endpoint Checklist

- Tentukan role pemilik endpoint.
- Tambahkan route dengan name jelas.
- Buat controller method singkat.
- Validasi input dengan FormRequest jika payload besar.
- Pindahkan logic kompleks ke Service.
- Return Inertia/redirect/JSON sesuai kebutuhan frontend.
- Tambahkan Feature test minimal untuk auth, role, validasi, dan hasil database.
