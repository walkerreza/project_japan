Ringkasan
  Setelah saya bandingkan .kiro/specs dengan implementasi di backend dan frontend, kondisi JapanLingo saat ini masih
  parsial: fondasi CRUD konten sudah mulai ada, tetapi banyak flow inti masih belum lengkap, belum tersambung end-to-
  end, atau masih berupa UI statis/mock. Area yang paling tertinggal sekarang justru murid/pembelajaran real flow,
  superadmin, dan payment/subscription.

  Temuan Kritis

  - Redirect login/register belum konsisten dengan role. superadmin tidak diarahkan ke dashboard superadmin di
    japanlingo/app/Http/Controllers/Auth/AuthenticatedSessionController.php, dan route user masih memakai role user
    bukan student seperti di spec pada japanlingo/routes/web.php.
  - Form register frontend/backend tidak sinkron. Frontend kirim name, backend minta username, jadi register praktis
    bermasalah di japanlingo/resources/js/Pages/Auth/Register.jsx dan japanlingo/app/Http/Controllers/Auth/
    RegisteredUserController.php.
  - Middleware role belum support multi-role, padahal spec admin minta admin dan superadmin bisa masuk panel admin. Saat
    ini japanlingo/app/Http/Middleware/CheckRole.php cuma cek satu role.
  - Skema progress tidak sesuai spec pembelajaran. Di spec progress itu per-lesson, tapi database sekarang menyimpan
    per-module di japanlingo/database/migrations/2026_02_19_140859_create_progress_table.php dan japanlingo/app/Models/
    Progress.php.
  - Migration user tidak cocok dengan target SQLite dev karena memakai raw Postgres enum di japanlingo/database/
    migrations/0001_01_01_000000_create_users_table.php.
  - Banyak halaman user/superadmin masih mock atau placeholder, misalnya japanlingo/app/Http/Controllers/User/
    LearningController.php, japanlingo/resources/js/Pages/User/Quiz.jsx, japanlingo/resources/js/Pages/SuperAdmin/
    Users.jsx.

  Yang Masih Kurang: Backend & Data

  - Belum ada layer service/event/listener/request class sesuai desain .kiro; sekarang logic masih tipis di controller.
  - Tidak ada SubscriptionMiddleware, unlock logic level, unlock logic module/lesson, dan access restriction free vs
    premium.
  - Tidak ada tabel/payment domain: payment_plans, subscriptions, transactions, transaction_logs, subscription_logs.
  - Tidak ada domain superadmin pengguna: kloter/cohort, key access, activity logs, bulk import/export user.
  - Certificate generation belum ada; controller download ada tapi route-nya tidak dipakai dan file PDF generator belum
    dibuat di japanlingo/app/Http/Controllers/User/CertificateController.php.
  - Gamification baru sebatas tabel achievement/certificate; belum ada XP service, streak service, achievement
    evaluator, login XP, milestone reward, level threshold engine.
  - Seeder belum siap untuk produk. japanlingo/database/seeders/DatabaseSeeder.php cuma bikin 1 test user dan bahkan
    tidak memanggil UserSeeder.

  Yang Masih Kurang: Fitur Murid

  - Belum ada halaman daftar module by level sesuai subscription dan tab JLPT.
  - Belum ada module detail dengan daftar lesson, progress percentage, locked/unlocked/completed logic.
  - Lesson page masih hardcoded visual; belum render content dinamis text/image/audio/video/file dari DB di japanlingo/
    resources/js/Pages/User/Lesson.jsx.
  - Quiz page masih mock questions, belum submit jawaban real, belum hasil kuis per breakdown, belum timer, belum retry/
    next lesson di japanlingo/resources/js/Pages/User/Quiz.jsx.
  - Progress, leaderboard, certificate, lesson lobby, quiz lobby, user dashboard masih dominan dummy/static data.
  - Belum ada route lesson completion per lesson; yang ada justru completeModule, padahal spec minta lesson completion.
  - XP dari quiz ada dua versi logic dan salah satunya malah tidak diroute-kan di japanlingo/app/Http/Controllers/User/
    QuizAttemptController.php.

  Yang Masih Kurang: Admin Panel

  - Level management praktis belum ada. Controller ada, route tidak ada, page file juga tidak ada.
  - Question index route ada, tapi page Admin/Questions/Index.jsx tidak ada, jadi flow manajemen soal belum utuh.
  - Quiz management masih minim: baru list, create, delete. Belum ada show, edit, update, preview, dependency check
    attempts.
  - Module management belum ada show detail, search backend, pagination, recent activity, analytics konten.
  - Lesson management belum ada preview student mode, attach/detach quiz, show detail.
  - Bulk import questions CSV/JSON belum ada.
  - File upload image/audio endpoint khusus admin belum ada; sekarang hanya ada penyimpanan file lesson di builder.
  - Validasi masih inline di controller; belum memakai Form Request dan belum konsisten Bahasa Indonesia sesuai spec.
  - Dashboard admin masih pakai chart dummy dan “popular modules” statis di japanlingo/resources/js/Pages/Admin/
    Dashboard.jsx.
  - Admin users dan gamification page masih dummy/static, belum benar-benar panel operasional.

  Yang Masih Kurang: Superadmin

  - Ini area paling kosong.
  - Dashboard superadmin masih dummy angka dan chart visual, belum data real di japanlingo/resources/js/Pages/
    SuperAdmin/SuperAdminDashboard.jsx.
  - Semua halaman utama superadmin selain dashboard masih placeholder literal: users, admins, content, gamification,
    pricing, system.
  - Belum ada controller backend superadmin untuk user management, admin management, content monitoring, system logs.
  - Belum ada fitur cohort/kloter, key access, bulk actions, export/import, recent activity tracking.
  - Belum ada payment management sama sekali walaupun spec superadmin pembayaran cukup detail.

  Yang Masih Kurang: Public/Auth

  - SEO masih tipis: baru <Head title>, belum ada meta description, Open Graph, JSON-LD, canonical. robots.txt ada,
    sitemap.xml tidak terlihat.
  - Landing/about/pricing sudah lumayan secara visual, tapi belum benar-benar memenuhi requirement SEO/accessibility/
    performance.
  - Register belum ada terms checkbox.
  - Forgot password belum diberi throttle khusus 3/minute sesuai spec; auth route di japanlingo/routes/auth.php belum
    menambah throttle itu.
  - Profile link di layout selalu menuju /user/profile, jadi admin dan superadmin salah arah di japanlingo/resources/js/
    Layouts/AuthenticatedLayout.jsx.

  Yang Masih Kurang: Frontend Quality & Maintenance

  - Banyak page tidak data-driven, jadi UI terlihat jadi tetapi belum produk-ready.
  - Ada mismatch nama page/controller: contoh Admin/GamificationController render Admin/Gamification, padahal file yang
    ada Admin/Gamification/Index.jsx.
  - Belum ada test coverage untuk domain utama. Folder tests masih fokus auth/profile; belum ada test admin, murid,
    gamification, certificate, superadmin, payment.
  - Tidak ada pagination server-side di admin; hampir semua controller masih ->get() semua data.
  - Tidak ada audit trail/logging untuk aksi sensitif admin/superadmin.

  Prioritas Perbaikan Menurut Saya

  1. Rapikan fondasi auth/role/subscription dulu: role naming, redirect, middleware multi-role, register form mismatch.
  2. Ubah model progress jadi per-lesson dan bangun flow murid end-to-end: modules → lessons → quizzes → results.
  3. Selesaikan admin panel inti sampai benar-benar operasional: levels, questions index, quiz edit/show/preview, bulk
     import, uploads.
  6. Baru setelah itu rapikan SEO, analytics, testing, dan UX polishing.



   Berikut versi singkat yang bisa langsung kamu paste:

  - Rapikan auth dan role: samakan user/student, redirect login/register, dukung multi-role untuk admin panel, perbaiki
    mismatch name vs username.
  - Perbaiki struktur progress belajar: ubah progress jadi per-lesson, bukan per-module.
  - Lengkapi flow murid end-to-end: daftar level/module, detail module, unlock logic, lesson real dari database, quiz
    real, hasil quiz, retry, next lesson.
  - Tambahkan pembatasan subscription: free vs premium, middleware akses level, upgrade prompt.
  - Selesaikan gamifikasi inti: XP, level progression, streak, achievement unlock, leaderboard, certificate generation
    dan download.
  - Rapikan admin panel inti: level management, question index, quiz edit/show/preview, lesson preview, attach quiz ke
    lesson, bulk import soal, upload image/audio.
  - Tambahkan validasi yang rapi: pakai Form Request, pesan error Bahasa Indonesia, dependency check saat hapus data.
  - Tambahkan pagination, search, filter, sorting, recent activity, dan analytics dasar di admin.
  - Rapikan frontend murid: banyak page masih dummy/static seperti dashboard, leaderboard, progress, certificate,
    lesson, quiz, lobby.
  - Rapikan frontend admin: beberapa halaman belum lengkap atau belum nyambung ke backend.
  - Bangun superadmin pengguna: user management, admin management, cohort/kloter, access key, activity log, bulk action,
    export/import.
  - Bangun superadmin pembayaran: payment plans, subscriptions, transactions, approval/reject pembayaran, revenue
    dashboard, report export, reminder expiry.
  - Tambahkan scheduled job dan email notification untuk subscription expiry dan status pembayaran.
  - Perbaiki SEO dan public pages: meta description, Open Graph, sitemap, structured data, accessibility.
  - Tambahkan test untuk fitur utama: auth, murid, admin, gamification, certificate, superadmin, payment.