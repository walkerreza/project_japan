# Controller Base Context

Controller berada di `japanlingo/app/Http/Controllers`.
Tugas controller: validasi request, panggil service/model, render Inertia, atau redirect.

## Global

- `PageController`: public pages dan profile page per role.
- `DashboardRedirectController`: redirect setelah login berdasarkan role.
- `ProfileController`: update/delete profile.
- `NotificationController`: mark notification read/read all.
- `LessonDocumentController`: show/download file lesson.

## Auth

Folder: `Controllers/Auth`

- Login/register/logout/password reset/email verification.
- `SocialiteController` untuk Google login.
- User baru dari register/Google harus default role `user`.

## User

Folder: `Controllers/User`

- `DashboardController`: dashboard user dan redeem access key.
- `LearningController`: lesson lobby/detail dan quiz lobby/detail.
- `FlashcardController`: daftar, latihan, review flashcard.
- `ProgressController`: progress, submit quiz attempt, complete lesson.
- `CertificateController`: daftar/download certificate.
- `NewsController`: daftar/detail news.
- `LeaderboardController`: leaderboard.
- `QuizAttemptController`: controller lama; route aktif submit quiz memakai `ProgressController@storeAttempt`.

## Admin

Folder: `Controllers/Admin`

- `AdminDashboardController`: dashboard sensei.
- `AdminUserController`: monitoring user.
- `AdminAnalyticsController`: analytics dan question performance.
- `AdminLevelController`: level/JLPT.
- `AdminModuleController`: module, builder materi, import lesson/document/kanji lesson.
- `AdminLessonController`: lesson CRUD dan reorder.
- `AdminQuizController`: quiz, builder soal, import/generate question.
- `AdminQuestionController`: question CRUD dan reorder.
- `AdminKanjiController`: kanji bank.
- `AdminVocabularyController`: vocabulary.
- `AdminFlashcardController`: flashcard set, builder, generate quiz.
- `AdminPresentationController`: presentation, slide builder, import PPTX, presenter, slide board.
- `AdminTeachingBoardController`: board ajar.
- `AdminGamificationController` dan `AdminAchievementController`: gamifikasi.
- `AdminUploadController`: upload file.

## Superadmin

Folder: `Controllers/SuperAdmin`

- `SuperAdminDashboardController`: dashboard global.
- `SuperAdminUserController`: user status/reset password.
- `SuperAdminAdminController`: admin/superadmin management.
- `SuperAdminContentController`: news/content + attachment.
- `SuperAdminPaymentController`: payment plan, transaction manual, access key.
- `SuperAdminSystemController`: app setting/theme.
- `SuperAdminActivityController`: activity/login history.
- `SuperAdminGamificationController`: monitoring gamifikasi.

## Aturan

- Jangan campur logic user/admin/superadmin dalam satu controller.
- Controller admin pakai prefix `Admin`.
- Controller superadmin pakai prefix `SuperAdmin`.
- Mutation pakai validasi jelas dan redirect/flash message.
- Logic import, generate, XP, progress, certificate, document, dan presentation conversion masuk service.
