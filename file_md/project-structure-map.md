# JapanLingo Project Structure Map

Dokumen ini menjadi kamus struktur proyek agar nama menu frontend yang memakai Bahasa Indonesia tetap mudah dilacak ke backend Laravel dan tabel database yang memakai standar English.

## Prinsip

- Frontend memakai nama yang dekat dengan UI agar mudah dicari oleh client/maintainer.
- Backend, model, route name, dan database tetap memakai English standar Laravel agar stabil dan tidak merusak relasi.
- Jika ingin mencari fitur, mulai dari nama menu di dokumen ini.
- Jangan rename tabel database atau migration yang sudah `Ran` kecuali sedang melakukan refactor besar dengan backup database.

## Guest/Public

| Menu/Fitur | Frontend | Controller/Route | Model | Database |
| --- | --- | --- | --- | --- |
| Landing Page | `japanlingo/resources/js/Pages/landingPage.jsx` | `GET /` / `home` | - | - |
| About | `japanlingo/resources/js/Pages/About.jsx` | `GET /about` / `about` | - | - |
| Pricing | `japanlingo/resources/js/Pages/Pricing.jsx` | `GET /pricing` / `pricing` | - | - |
| Roadmap | `japanlingo/resources/js/Pages/Roadmap.jsx` | `GET /roadmap` / `roadmap` | - | - |
| Login | `japanlingo/resources/js/Pages/Auth/Login.jsx` | `AuthenticatedSessionController` | `User` | `users` |
| Register | `japanlingo/resources/js/Pages/Auth/Register.jsx` | `RegisteredUserController` | `User` | `users` |
| Google Login | `japanlingo/resources/js/Pages/Auth/Login.jsx` | `SocialiteController` | `User` | `users` |

## User/Siswa

| Menu/Fitur | Frontend | Controller | Model | Database |
| --- | --- | --- | --- | --- |
| Beranda | `japanlingo/resources/js/Pages/User/Beranda.jsx` | `User/DashboardController` | `User`, `Level`, `Progress`, `RewardLog`, `News`, `Subscription` | `users`, `levels`, `progress`, `reward_logs`, `news`, `subscriptions` |
| Redeem Access Key | `User/Beranda.jsx` | `User/DashboardController@redeemAccessKey` | `AccessKey`, `AccessKeyRedemption`, `Subscription` | `access_keys`, `access_key_redemptions`, `subscriptions` |
| Daftar Materi | `japanlingo/resources/js/Pages/User/Materi/DaftarMateri.jsx` | `User/LearningController@lessonLobby` | `Lesson`, `Module`, `Level` | `lessons`, `modules`, `levels` |
| Detail Materi | `japanlingo/resources/js/Pages/User/Materi/DetailMateri.jsx` | `User/LearningController@showLesson` | `Lesson`, `Progress` | `lessons`, `progress` |
| Daftar Kuis | `japanlingo/resources/js/Pages/User/Kuis/DaftarKuis.jsx` | `User/LearningController@quizLobby` | `Quiz`, `Question` | `quizzes`, `questions` |
| Kerjakan Kuis | `japanlingo/resources/js/Pages/User/Kuis/KerjakanKuis.jsx` | `User/LearningController@showQuiz`, `User/ProgressController@storeAttempt` | `Quiz`, `Question`, `Attempt`, `AttemptAnswer` | `quizzes`, `questions`, `attempts`, `attempt_answers` |
| Progress | `japanlingo/resources/js/Pages/User/Progress/Progress.jsx` | `User/ProgressController@index` | `Progress`, `Attempt`, `RewardLog`, `Certificate` | `progress`, `attempts`, `reward_logs`, `certificates` |
| Sertifikat | `japanlingo/resources/js/Pages/User/Sertifikat/Sertifikat.jsx` | `User/CertificateController@index` | `Certificate` | `certificates` |
| Detail Sertifikat | `japanlingo/resources/js/Pages/User/Sertifikat/DetailSertifikat.jsx` | `User/CertificateController@download` | `Certificate` | `certificates` |
| Berita | `japanlingo/resources/js/Pages/User/Berita/DaftarBerita.jsx` | `User/NewsController@index` | `News` | `news` |
| Detail Berita | `japanlingo/resources/js/Pages/User/Berita/DetailBerita.jsx` | `User/NewsController@show` | `News`, `NewsAttachment` | `news`, `news_attachments` |
| Leaderboard | `japanlingo/resources/js/Pages/User/Leaderboard.jsx` | inline route `/user/leaderboard` | `User` | `users` |
| Profil | `japanlingo/resources/js/Pages/User/Profil.jsx` | `ProfileController`, inline route `/profile` | `User` | `users` |

## Admin/Sensei

| Menu/Fitur | Frontend | Controller | Model | Database |
| --- | --- | --- | --- | --- |
| Beranda Admin | `japanlingo/resources/js/Pages/Admin/Beranda.jsx` | `Admin/AdminDashboardController` | `User`, `Level`, `Module`, `Lesson`, `Quiz`, `Attempt` | `users`, `levels`, `modules`, `lessons`, `quizzes`, `attempts` |
| Data User | `japanlingo/resources/js/Pages/Admin/DataUser/DataUser.jsx` | `Admin/AdminUserController@index` | `User`, `Progress`, `Attempt` | `users`, `progress`, `attempts` |
| Detail User | `japanlingo/resources/js/Pages/Admin/DataUser/DetailUser.jsx` | `Admin/AdminUserController@show` | `User`, `Progress`, `Attempt`, `Certificate`, `RewardLog` | `users`, `progress`, `attempts`, `certificates`, `reward_logs` |
| Analitik | `japanlingo/resources/js/Pages/Admin/Analitik/Analitik.jsx` | `Admin/AdminAnalyticsController` | `Attempt`, `AttemptAnswer`, `Question`, `Module`, `User` | `attempts`, `attempt_answers`, `questions`, `modules`, `users` |
| Manajemen Level | `japanlingo/resources/js/Pages/Admin/Level/ManajemenLevel.jsx` | `Admin/AdminLevelController` | `Level` | `levels` |
| Manajemen Modul & Materi | `japanlingo/resources/js/Pages/Admin/ModulMateri/ManajemenModulMateri.jsx` | `Admin/AdminModuleController@index` | `Module`, `Level`, `Lesson` | `modules`, `levels`, `lessons` |
| Builder Materi | `japanlingo/resources/js/Pages/Admin/ModulMateri/BuilderMateri.jsx` | `Admin/AdminModuleController@builder`, `updateContent` | `Module`, `Lesson` | `modules`, `lessons` |
| Import Materi CSV/XLSX | `Admin/ModulMateri/BuilderMateri.jsx` | `Admin/AdminModuleController@importLessons` | `Module`, `Lesson` | `modules`, `lessons` |
| Import Dokumen Materi | `Admin/ModulMateri/BuilderMateri.jsx` | `Admin/AdminModuleController@importDocument` | `Module`, `Lesson` | `modules`, `lessons` |
| Import Kanji Lessons | `Admin/ModulMateri/BuilderMateri.jsx` | `Admin/AdminModuleController@importKanjiLessons` | `Kanji`, `Module`, `Lesson` | `kanji_bank`, `modules`, `lessons` |
| Daftar Materi | `japanlingo/resources/js/Pages/Admin/ModulMateri/DaftarMateri.jsx` | `Admin/AdminLessonController@index` | `Lesson`, `Module` | `lessons`, `modules` |
| Tambah Materi | `japanlingo/resources/js/Pages/Admin/ModulMateri/TambahMateri.jsx` | `Admin/AdminLessonController@create/store` | `Lesson`, `Module` | `lessons`, `modules` |
| Edit Materi | `japanlingo/resources/js/Pages/Admin/ModulMateri/EditMateri.jsx` | `Admin/AdminLessonController@edit/update` | `Lesson`, `Module` | `lessons`, `modules` |
| Manajemen Kuis | `japanlingo/resources/js/Pages/Admin/Kuis/ManajemenKuis.jsx` | `Admin/AdminQuizController@index` | `Quiz`, `Level` | `quizzes`, `levels` |
| Builder Kuis | `japanlingo/resources/js/Pages/Admin/Kuis/BuilderKuis.jsx` | `Admin/AdminQuizController@builder`, `updateQuestions` | `Quiz`, `Question` | `quizzes`, `questions` |
| Import Soal CSV/XLSX | `Admin/Kuis/BuilderKuis.jsx` | `Admin/AdminQuizController@importQuestions` | `Quiz`, `Question` | `quizzes`, `questions` |
| Generate Soal Kanji | `Admin/Kuis/BuilderKuis.jsx` | `Admin/AdminQuizController@generateKanjiQuestions` | `Quiz`, `Question`, `Kanji` | `quizzes`, `questions`, `kanji_bank` |
| Daftar Soal | `japanlingo/resources/js/Pages/Admin/Kuis/DaftarSoal.jsx` | `Admin/AdminQuestionController@index` | `Question`, `Quiz` | `questions`, `quizzes` |
| Tambah Soal | `japanlingo/resources/js/Pages/Admin/Kuis/TambahSoal.jsx` | `Admin/AdminQuestionController@create/store` | `Question`, `Quiz` | `questions`, `quizzes` |
| Edit Soal | `japanlingo/resources/js/Pages/Admin/Kuis/EditSoal.jsx` | `Admin/AdminQuestionController@edit/update` | `Question`, `Quiz` | `questions`, `quizzes` |
| Kanji Bank | `japanlingo/resources/js/Pages/Admin/KanjiBank/KanjiBank.jsx` | `Admin/AdminKanjiController` | `Kanji` | `kanji_bank` |
| Gamifikasi | `japanlingo/resources/js/Pages/Admin/Gamifikasi/Gamifikasi.jsx` | `Admin/AdminGamificationController`, `AdminAchievementController` | `Achievement` | `achievements`, `user_achievements` |
| Upload | komponen admin terkait | `Admin/AdminUploadController` | - | storage public |
| Profil Admin | `japanlingo/resources/js/Pages/Admin/Profil.jsx` | inline route `/admin/profile`, `ProfileController` | `User` | `users` |

## Superadmin

| Menu/Fitur | Frontend | Controller | Model | Database |
| --- | --- | --- | --- | --- |
| Beranda | `japanlingo/resources/js/Pages/SuperAdmin/Beranda.jsx` | `SuperAdmin/SuperAdminDashboardController` | `User`, `News`, `ActivityLog`, `Transaction` | `users`, `news`, `activity_logs`, `transactions` |
| Data User | `japanlingo/resources/js/Pages/SuperAdmin/DataUser/DataUser.jsx` | `SuperAdmin/SuperAdminUserController` | `User`, `UserStatusHistory` | `users`, `user_status_histories` |
| Data Admin | `japanlingo/resources/js/Pages/SuperAdmin/DataAdmin/DataAdmin.jsx` | `SuperAdmin/SuperAdminAdminController` | `User`, `UserStatusHistory` | `users`, `user_status_histories` |
| Konten/Berita | `japanlingo/resources/js/Pages/SuperAdmin/Konten/Konten.jsx` | `SuperAdmin/SuperAdminContentController` | `News`, `NewsAttachment` | `news`, `news_attachments` |
| Upload Gambar Berita | `SuperAdmin/Konten/Konten.jsx` | `SuperAdminContentController@storeEditorImage` | `News` | `news`, storage public |
| Lampiran Berita | `SuperAdmin/Konten/Konten.jsx` | `SuperAdminContentController@storeAttachment` | `NewsAttachment` | `news_attachments` |
| Gamifikasi | `japanlingo/resources/js/Pages/SuperAdmin/Gamifikasi/Gamifikasi.jsx` | `SuperAdmin/SuperAdminGamificationController` | `Achievement`, `RewardLog` | `achievements`, `reward_logs`, `user_achievements` |
| Pemasukan | `japanlingo/resources/js/Pages/SuperAdmin/Pemasukan/Pemasukan.jsx` | `SuperAdmin/SuperAdminPaymentController` | `PaymentPlan`, `Transaction`, `Subscription`, `AccessKey` | `payment_plans`, `transactions`, `transaction_logs`, `subscriptions`, `access_keys` |
| Access Key Premium | `SuperAdmin/Pemasukan/Pemasukan.jsx` | `SuperAdminPaymentController@storeAccessKey/revokeAccessKey` | `AccessKey`, `AccessKeyRedemption` | `access_keys`, `access_key_redemptions` |
| Sistem/Tema Global | `japanlingo/resources/js/Pages/SuperAdmin/Sistem/Sistem.jsx` | `SuperAdmin/SuperAdminSystemController` | `AppSetting` | `app_settings` |
| Aktivitas | `japanlingo/resources/js/Pages/SuperAdmin/Aktivitas/Aktivitas.jsx` | `SuperAdmin/SuperAdminActivityController` | `ActivityLog`, `LoginHistory` | `activity_logs`, `login_histories` |
| Profil Superadmin | `japanlingo/resources/js/Pages/SuperAdmin/Profil.jsx` | inline route `/superadmin/profile`, `ProfileController` | `User` | `users` |

## Route Prefix Penting

| Role | Prefix URL | Route Name Prefix | Middleware |
| --- | --- | --- | --- |
| Guest | `/` | bervariasi | - |
| User | `/user/*` | `user.*` | `auth`, `verified`, `role:user` |
| Admin | `/admin/*` | `admin.*` | `auth`, `verified`, `role:admin` |
| Superadmin | `/superadmin/*` | `superadmin.*` | `auth`, `verified`, `role:superadmin` |

## Tabel Database Aktif

| Tabel | Fungsi |
| --- | --- |
| `users` | Akun user, admin, dan superadmin. |
| `levels` | Level belajar/JLPT dan status premium. |
| `modules` | Modul besar pembelajaran. |
| `lessons` | Materi/detail lesson di dalam module. |
| `quizzes` | Paket kuis. |
| `questions` | Soal kuis. |
| `attempts` | Riwayat pengerjaan kuis. |
| `attempt_answers` | Jawaban detail per soal saat attempt. |
| `progress` | Progress lesson user. |
| `kanji_bank` | Bank data kanji N3. |
| `achievements` | Master achievement/lencana. |
| `user_achievements` | Achievement yang sudah didapat user. |
| `reward_logs` | Riwayat XP/poin/reward. |
| `certificates` | Sertifikat user. |
| `news` | Berita/portal berita dari superadmin. |
| `news_attachments` | Lampiran berita. |
| `payment_plans` | Paket pembayaran/premium. |
| `transactions` | Transaksi pembayaran. |
| `transaction_logs` | Log perubahan transaksi. |
| `subscriptions` | Status langganan user. |
| `access_keys` | Kode akses premium/manual. |
| `access_key_redemptions` | Riwayat redeem access key. |
| `activity_logs` | Log aktivitas sistem. |
| `login_histories` | Riwayat login. |
| `user_status_histories` | Riwayat perubahan status user/admin. |
| `app_settings` | Setting global aplikasi, termasuk tema. |
| `notifications` | Notifikasi user. |
| `sessions` | Session Laravel. |
| `cache`, `cache_locks` | Cache Laravel. |
| `jobs`, `job_batches`, `failed_jobs` | Queue Laravel. |
| `password_reset_tokens` | Token reset password. |
| `migrations` | History migration yang sudah dijalankan. |

## Aturan Maintenance

1. Jika mengubah nama file frontend, update `Inertia::render(...)` di controller terkait.
2. Jika menambah menu baru, tambahkan mapping di dokumen ini.
3. Jika menambah tabel baru, buat migration baru. Jangan edit migration lama yang sudah `Ran`.
4. Jika butuh rename database, lakukan sebagai refactor besar dengan backup DB, update model, controller, relation, dan test semua flow.
5. Jalankan validasi ringan setelah perubahan struktur:

```bash
php -l routes/web.php
php artisan route:list --except-vendor
php artisan migrate:status
```

