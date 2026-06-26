# Route Base Context

Route utama ada di `japanlingo/routes/web.php`.
Auth bawaan ada di `japanlingo/routes/auth.php`.

## Public

- `GET /` -> landing
- `GET /about`
- `GET /pricing`
- `GET /roadmap`

Controller: `PageController`

## Authenticated Global

Middleware: `auth`, `verified`

- `GET /dashboard` -> `DashboardRedirectController`
- `GET /profile`, `PATCH /profile`, `DELETE /profile`
- notification read/read-all
- lesson document show/download

## User Routes

Prefix: `/user`
Name: `user.`
Middleware: `role:user`

- `/dashboard`
- `/access-keys/redeem`
- `/news`
- `/lessons`
- `/lessons/{lesson}` with `subscribed`
- `/quizzes`
- `/quizzes/{quiz}` with `subscribed`
- `/flashcards`
- `/flashcards/{flashcardSet}`
- `/flashcards/review/{flashcard}`
- `/leaderboard`
- `/certificates`
- `/progress`
- `/attempts`
- `/lessons/complete`

Important:

- Submit quiz aktif: `POST /user/attempts` -> `ProgressController@storeAttempt`.
- Jangan pakai komentar lama `/user/quiz-attempts`.

## Admin Routes

Prefix: `/admin`
Name: `admin.`
Middleware: `role:admin`

Domain route:

- dashboard
- users
- analytics
- levels
- modules/lessons
- quizzes/questions
- kanji
- vocabulary
- flashcards
- presentations
- boards
- gamification/achievements
- upload
- profile

Admin adalah sensei/pengelola konten.

## Superadmin Routes

Prefix: `/superadmin`
Name: `superadmin.`
Middleware: `role:superadmin`

Domain route:

- dashboard
- users
- admins
- content/news
- gamification
- activity
- payments
- access keys
- system/theme
- profile

Superadmin adalah pengelola platform, bukan pembuat materi utama.

## Aturan

- Route baru harus masuk role group yang benar.
- Jika route render React page, update path `Inertia::render(...)`.
- Jika page React diganti nama, update controller terkait.
- Setelah ubah route, cek `php artisan route:list --except-vendor`.
