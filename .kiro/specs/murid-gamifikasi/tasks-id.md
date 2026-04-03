# Rencana Implementasi: Sistem Gamifikasi

## Ringkasan

Rencana implementasi ini memecah Sistem Gamifikasi menjadi tugas-tugas coding yang incremental. Pendekatan mengikuti strategi bottom-up: pertama membangun struktur database dan model, kemudian membangun service inti, menambahkan integrasi event-driven, mengimplementasikan API endpoint, dan akhirnya membuat komponen frontend React. Setiap tugas dibangun di atas pekerjaan sebelumnya untuk memastikan tidak ada kode yang terlantar.

## Tugas

- [ ] 1. Setup database dan migrasi
  - [ ] 1.1 Buat migrasi untuk menambahkan kolom gamifikasi ke tabel users
    - Tambahkan kolom: xp (integer, default 0), level (integer, default 1), streak_count (integer, default 0), last_activity_date (timestamp, nullable)
    - _Kebutuhan: 1.5, 2.3, 3.5_
  
  - [ ] 1.2 Buat migrasi tabel achievements
    - Kolom: id, name, description, icon, xp_reward, condition_type, condition_value, timestamps
    - _Kebutuhan: 5.1, 5.3_
  
  - [ ] 1.3 Buat migrasi tabel pivot user_achievements
    - Kolom: id, user_id (foreign key), achievement_id (foreign key), unlocked_at (timestamp), timestamps
    - Tambahkan unique constraint pada [user_id, achievement_id]
    - Tambahkan cascade delete pada foreign key
    - _Kebutuhan: 6.3, 6.4_
  
  - [ ] 1.4 Buat migrasi tabel certificates
    - Kolom: id, user_id (foreign key), level_id (foreign key), issued_at (timestamp), certificate_number (string, unique), file_path (string), timestamps
    - Tambahkan cascade delete pada foreign key
    - _Kebutuhan: 7.4, 10.5_

- [ ] 2. Buat model Eloquent dan relationship
  - [ ] 2.1 Update model User dengan field gamifikasi
    - Tambahkan fillable field: xp, level, streak_count, last_activity_date
    - Tambahkan cast: xp (integer), level (integer), streak_count (integer), last_activity_date (datetime)
    - Tambahkan relationship: achievements() (belongsToMany), certificates() (hasMany)
    - _Kebutuhan: 1.5, 2.3, 3.5_
  
  - [ ] 2.2 Buat model Achievement
    - Tambahkan fillable field: name, description, icon, xp_reward, condition_type, condition_value
    - Tambahkan cast: xp_reward (integer), condition_value (integer)
    - Tambahkan relationship: users() (belongsToMany)
    - _Kebutuhan: 5.1, 5.3_
  
  - [ ] 2.3 Buat model UserAchievement
    - Tambahkan fillable field: user_id, achievement_id, unlocked_at
    - Tambahkan cast: unlocked_at (datetime)
    - Tambahkan relationship: user() (belongsTo), achievement() (belongsTo)
    - _Kebutuhan: 6.3_
  
  - [ ] 2.4 Buat model Certificate
    - Tambahkan fillable field: user_id, level_id, issued_at, certificate_number, file_path
    - Tambahkan cast: issued_at (datetime)
    - Tambahkan relationship: user() (belongsTo), level() (belongsTo)
    - _Kebutuhan: 7.4_

- [ ] 3. Implementasi XPService
  - [ ] 3.1 Buat class XPService dengan konfigurasi ambang batas level
    - Definisikan constant array LEVEL_THRESHOLDS
    - Implementasi method calculateLevel(int $xp): int
    - Implementasi method getXPForNextLevel(int $currentLevel): ?int
    - _Kebutuhan: 2.1, 2.2, 2.4, 2.5_
  
  - [ ]* 3.2 Tulis property test untuk perhitungan level
    - **Property 6: Perhitungan level bersifat deterministik**
    - **Validasi: Kebutuhan 2.1, 2.4**
  
  - [ ]* 3.3 Tulis unit test untuk ambang batas level
    - Test ambang batas spesifik: 0 XP = Level 1, 100 XP = Level 2, 300 XP = Level 3, 600 XP = Level 4
    - **Property 7: Ambang batas level didefinisikan dengan benar**
    - **Validasi: Kebutuhan 2.2**
  
  - [ ] 3.4 Implementasi method calculateQuizXP
    - Hitung XP berdasarkan persentase skor: 100% = 50 XP, 80-99% = 35 XP, 60-79% = 20 XP, <60% = 0 XP
    - _Kebutuhan: 1.2, 9.5_
  
  - [ ]* 3.5 Tulis property test untuk perhitungan XP kuis
    - **Property 2: XP kuis berskala dengan performa**
    - **Validasi: Kebutuhan 1.2, 9.1, 9.2, 9.3, 9.4, 9.5**
  
  - [ ] 3.6 Implementasi method awardXP dengan transaksi database
    - Terima parameter User, amount, dan source
    - Update XP pengguna, hitung level baru, simpan ke database
    - Kembalikan array dengan xp_awarded, level_up (bool), new_level
    - Gunakan transaksi DB untuk atomicity
    - _Kebutuhan: 1.1, 1.3, 1.4, 1.5, 2.1, 2.3_
  
  - [ ]* 3.7 Tulis property test untuk akumulasi XP
    - **Property 5: Akumulasi XP bersifat monoton**
    - **Validasi: Kebutuhan 1.6**
  
  - [ ]* 3.8 Tulis property test untuk pemberian XP bersamaan
    - **Property 9: Pemberian XP bersamaan ditangani dengan benar**
    - **Validasi: Kebutuhan 10.2**

- [ ] 4. Implementasi StreakService
  - [ ] 4.1 Buat class StreakService dengan konfigurasi milestone
    - Definisikan constant array STREAK_MILESTONES (7 => 50, 30 => 200, 100 => 1000)
    - Implementasi method private determineStreakAction
    - _Kebutuhan: 4.1, 4.2, 4.3_
  
  - [ ] 4.2 Implementasi method updateStreak
    - Terima parameter User
    - Tentukan aksi (increment, maintain, reset) berdasarkan last_activity_date
    - Update streak_count dan last_activity_date menggunakan timezone UTC
    - Periksa milestone dan kembalikan bonus XP
    - Gunakan transaksi DB
    - _Kebutuhan: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 4.3 Tulis property test untuk increment streak hari berturut-turut
    - **Property 11: Aktivitas hari berturut-turut menambah streak**
    - **Validasi: Kebutuhan 3.2**
  
  - [ ]* 4.4 Tulis property test untuk idempotence hari yang sama
    - **Property 12: Aktivitas hari yang sama bersifat idempoten**
    - **Validasi: Kebutuhan 3.3**
  
  - [ ]* 4.5 Tulis property test untuk reset streak
    - **Property 13: Jeda aktivitas mereset streak**
    - **Validasi: Kebutuhan 3.4**
  
  - [ ] 4.6 Implementasi method checkMilestone
    - Bandingkan hitungan streak lama dan baru
    - Kembalikan bonus XP jika milestone tercapai dan belum pernah diberikan
    - Lacak milestone yang telah diberikan untuk mencegah pemberian duplikat
    - _Kebutuhan: 4.4, 4.5_
  
  - [ ]* 4.7 Tulis property test untuk bonus milestone
    - **Property 14: Milestone streak memberikan bonus XP sekali**
    - **Validasi: Kebutuhan 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ] 5. Implementasi AchievementService
  - [ ] 5.1 Buat class AchievementService dengan logika evaluasi kondisi
    - Implementasi method hasUnlocked untuk memeriksa apakah pengguna sudah memiliki pencapaian
    - Implementasi method unlockAchievement untuk membuat catatan user_achievement
    - Gunakan transaksi DB untuk unlock
    - _Kebutuhan: 6.2, 6.3, 6.4, 6.6_
  
  - [ ]* 5.2 Tulis property test untuk idempotence pembukaan pencapaian
    - **Property 18: Pembukaan pencapaian bersifat idempoten**
    - **Validasi: Kebutuhan 6.4**
  
  - [ ] 5.3 Implementasi method evaluateAchievements
    - Terima parameter User, activityType, dan context
    - Query pencapaian yang cocok dengan activityType
    - Evaluasi kondisi setiap pencapaian
    - Buka pencapaian yang terpenuhi
    - Kembalikan array pencapaian yang baru dibuka
    - _Kebutuhan: 6.1, 6.2_
  
  - [ ]* 5.4 Tulis property test untuk evaluasi pencapaian
    - **Property 16: Aktivitas memicu evaluasi pencapaian**
    - **Property 17: Kondisi yang terpenuhi membuka pencapaian**
    - **Validasi: Kebutuhan 6.1, 6.2, 6.3**
  
  - [ ] 5.5 Implementasi method calculateProgress
    - Terima parameter User dan Achievement
    - Hitung kemajuan saat ini berdasarkan condition_type
    - Kembalikan array dengan current, target, dan percentage
    - _Kebutuhan: 12.1, 12.2, 12.3_
  
  - [ ]* 5.6 Tulis property test untuk perhitungan kemajuan pencapaian
    - **Property 19: Kemajuan pencapaian akurat**
    - **Validasi: Kebutuhan 12.1, 12.2, 12.3**
  
  - [ ] 5.7 Implementasi method getAchievementsWithStatus
    - Muat semua pencapaian dengan status pembukaan pengguna
    - Sertakan data kemajuan untuk pencapaian yang terkunci
    - Eager load relationship untuk meminimalkan query
    - _Kebutuhan: 5.4, 5.5, 12.1_

- [ ] 6. Implementasi CertificateService
  - [ ] 6.1 Buat class CertificateService dengan pembuatan PDF
    - Install dan konfigurasi library PDF Laravel (misalnya, barryvdh/laravel-dompdf)
    - Implementasi method private generateCertificateNumber
    - Format: {LEVEL_CODE}-{USER_ID}-{TIMESTAMP}
    - _Kebutuhan: 7.5_
  
  - [ ]* 6.2 Tulis property test untuk keunikan nomor sertifikat
    - **Property 24: Nomor sertifikat unik**
    - **Validasi: Kebutuhan 7.5**
  
  - [ ] 6.3 Buat file blade template PDF sertifikat
    - Desain layout sertifikat profesional dengan branding
    - Sertakan placeholder untuk: nama pengguna, level JLPT, tanggal, nomor sertifikat
    - _Kebutuhan: 7.2, 7.6_
  
  - [ ] 6.4 Implementasi method private createPDF
    - Terima parameter User, levelId, dan certificateNumber
    - Render template blade dengan data
    - Hasilkan PDF dan simpan ke storage
    - Kembalikan path file
    - _Kebutuhan: 7.1, 7.2, 7.3_
  
  - [ ] 6.5 Implementasi method generateCertificate
    - Terima parameter User dan levelId
    - Hasilkan nomor sertifikat
    - Buat file PDF
    - Buat catatan model Certificate dengan semua field
    - Gunakan transaksi DB
    - Kembalikan model Certificate
    - _Kebutuhan: 7.1, 7.3, 7.4_
  
  - [ ]* 6.6 Tulis property test untuk pembuatan sertifikat
    - **Property 21: Penyelesaian level menghasilkan sertifikat**
    - **Property 23: Catatan sertifikat lengkap**
    - **Validasi: Kebutuhan 7.1, 7.3, 7.4**
  
  - [ ] 6.7 Implementasi method getUserCertificates
    - Query sertifikat untuk pengguna spesifik
    - Eager load relationship level
    - _Kebutuhan: 8.1_
  
  - [ ] 6.8 Implementasi method verifyCertificateOwnership
    - Periksa apakah sertifikat milik pengguna yang meminta
    - Kembalikan boolean
    - _Kebutuhan: 8.3_
  
  - [ ]* 6.9 Tulis property test untuk otorisasi sertifikat
    - **Property 26: Unduhan sertifikat diotorisasi**
    - **Validasi: Kebutuhan 8.3**

- [ ] 7. Buat event dan listener Laravel
  - [ ] 7.1 Buat event LessonCompleted
    - Sertakan properti User dan Lesson
    - _Kebutuhan: 1.1_
  
  - [ ] 7.2 Buat event QuizCompleted
    - Sertakan properti User, Quiz, dan score
    - _Kebutuhan: 1.2_
  
  - [ ] 7.3 Buat event UserLoggedIn (atau gunakan event Laravel yang ada)
    - Sertakan properti User
    - _Kebutuhan: 1.3_
  
  - [ ] 7.4 Buat event AchievementUnlocked
    - Sertakan properti User dan Achievement
    - _Kebutuhan: 6.5_
  
  - [ ] 7.5 Buat class GamificationEventListener
    - Listen ke LessonCompleted: berikan 10 XP, update streak, evaluasi pencapaian
    - Listen ke QuizCompleted: hitung dan berikan XP kuis, update streak, evaluasi pencapaian
    - Listen ke UserLoggedIn: berikan 5 XP (login pertama hari itu), update streak
    - Listen ke AchievementUnlocked: berikan bonus XP pencapaian
    - Inject XPService, StreakService, AchievementService
    - _Kebutuhan: 1.1, 1.2, 1.3, 1.4, 3.1, 6.1_
  
  - [ ] 7.6 Daftarkan event dan listener di EventServiceProvider
    - Petakan event ke method GamificationEventListener
    - _Kebutuhan: 1.1, 1.2, 1.3, 1.4_

- [ ] 8. Checkpoint - Pastikan semua test lulus
  - Pastikan semua test lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 9. Buat controller API dan route
  - [ ] 9.1 Buat DashboardController dengan endpoint data gamifikasi
    - Implementasi method index untuk memuat data gamifikasi pengguna
    - Muat XP, level, kemajuan ke level berikutnya
    - Muat hitungan streak dan hari hingga milestone berikutnya
    - Muat pencapaian dengan status pembukaan dan kemajuan
    - Muat sertifikat dengan URL unduhan
    - Gunakan single optimized query dengan eager loading
    - Kembalikan respons Inertia dengan data
    - _Kebutuhan: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ]* 9.2 Tulis property test untuk kelengkapan data dashboard
    - **Property 31: Data dashboard lengkap**
    - **Validasi: Kebutuhan 11.1, 11.2, 11.3, 11.4, 11.5**
  
  - [ ]* 9.3 Tulis property test untuk efisiensi query dashboard
    - **Property 32: Dashboard dimuat dengan efisien**
    - **Validasi: Kebutuhan 11.6**
  
  - [ ] 9.4 Buat AchievementController dengan endpoint list
    - Implementasi method index untuk mengembalikan semua pencapaian dengan status pengguna
    - Gunakan AchievementService->getAchievementsWithStatus
    - Kembalikan respons Inertia
    - _Kebutuhan: 5.4, 5.5, 12.1_
  
  - [ ] 9.5 Buat CertificateController dengan endpoint download
    - Implementasi method download
    - Verifikasi kepemilikan sertifikat menggunakan CertificateService
    - Periksa apakah file ada
    - Kembalikan respons unduhan file atau error 404/403
    - _Kebutuhan: 8.2, 8.3, 8.4_
  
  - [ ]* 9.6 Tulis unit test untuk error unduhan sertifikat
    - Test file hilang mengembalikan 404
    - Test akses tidak diotorisasi mengembalikan 403
    - **Validasi: Kebutuhan 8.3, 8.4**
  
  - [ ] 9.7 Definisikan route di web.php
    - GET /dashboard - DashboardController@index
    - GET /achievements - AchievementController@index
    - GET /certificates/{certificate}/download - CertificateController@download
    - Terapkan middleware auth ke semua route
    - _Kebutuhan: 8.2, 11.1_

- [ ] 10. Buat komponen frontend React
  - [ ] 10.1 Buat komponen GamificationDashboard
    - Tampilkan progress bar XP dengan XP saat ini dan level
    - Tampilkan counter streak dengan kemajuan milestone
    - Tampilkan grid pencapaian yang dibuka
    - Tampilkan grid pencapaian yang terkunci dengan progress bar
    - Tampilkan list sertifikat yang diperoleh dengan tombol unduh
    - Gunakan props Inertia untuk data
    - _Kebutuhan: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 10.2 Buat komponen XPProgressBar
    - Terima props currentXP, level, nextLevelXP
    - Tampilkan nomor level dan progress bar
    - Tampilkan teks XP: "{currentXP} / {nextLevelXP} XP"
    - _Kebutuhan: 2.5, 11.1_
  
  - [ ] 10.3 Buat komponen StreakCounter
    - Terima props streakCount, nextMilestone
    - Tampilkan ikon api dengan hitungan streak
    - Tampilkan hari hingga milestone berikutnya
    - _Kebutuhan: 11.2_
  
  - [ ] 10.4 Buat komponen AchievementCard
    - Terima props achievement, unlocked, progress
    - Tampilkan ikon pencapaian, nama, deskripsi
    - Tampilkan tanggal pembukaan jika dibuka
    - Tampilkan progress bar jika terkunci dan memiliki kemajuan
    - Terapkan styling visual untuk status terkunci vs dibuka
    - _Kebutuhan: 11.3, 11.4, 12.1, 12.2_
  
  - [ ] 10.5 Buat komponen CertificateCard
    - Terima props certificate
    - Tampilkan level sertifikat dan tanggal penerbitan
    - Sertakan tombol unduh dengan link ke endpoint download
    - _Kebutuhan: 11.5, 8.2_
  
  - [ ] 10.6 Integrasikan GamificationDashboard ke halaman Dashboard utama
    - Import dan render komponen GamificationDashboard
    - Teruskan props Inertia dari controller
    - _Kebutuhan: 11.1_

- [ ] 11. Buat seeder database untuk pencapaian awal
  - [ ] 11.1 Buat class AchievementSeeder
    - Seed pencapaian yang telah ditentukan:
      - "Langkah Pertama" (selesaikan 1 pelajaran, 10 XP)
      - "Master Kuis" (100% pada 10 kuis, 100 XP)
      - "Pejuang Minggu" (streak 7 hari, 50 XP)
      - "Master Bulan" (streak 30 hari, 200 XP)
      - "Klub Seratus" (streak 100 hari, 1000 XP)
      - Pencapaian tambahan sesuai kebutuhan
    - _Kebutuhan: 5.1, 5.2_
  
  - [ ] 11.2 Update DatabaseSeeder untuk memanggil AchievementSeeder
    - Tambahkan AchievementSeeder untuk dijalankan di development dan production
    - _Kebutuhan: 5.1_

- [ ] 12. Tambahkan pembaruan kemajuan real-time (peningkatan opsional)
  - [ ] 12.1 Implementasi pembaruan kemajuan pencapaian pada penyelesaian aktivitas
    - Setelah penyelesaian pelajaran/kuis, refresh kemajuan pencapaian
    - Gunakan partial reload Inertia atau websocket untuk pembaruan real-time
    - _Kebutuhan: 12.5_
  
  - [ ]* 12.2 Tulis property test untuk pembaruan kemajuan segera
    - **Property 33: Kemajuan pencapaian diperbarui segera**
    - **Validasi: Kebutuhan 12.5**

- [ ] 13. Checkpoint akhir - Pastikan semua test lulus
  - Pastikan semua test lulus, tanyakan kepada pengguna jika ada pertanyaan.

## Catatan

- Tugas yang ditandai dengan `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap tugas mereferensikan kebutuhan spesifik untuk traceability
- Checkpoint memastikan validasi incremental
- Property test memvalidasi properti kebenaran universal dengan 100+ iterasi
- Unit test memvalidasi contoh spesifik dan edge case
- Semua logika gamifikasi bersifat event-driven untuk mempertahankan loose coupling dengan fitur inti
- Transaksi database memastikan integritas data di semua operasi
