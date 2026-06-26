# Requirements Document

## Pendahuluan

Dokumen ini menjelaskan requirements untuk fitur Manajemen User Superadmin di platform Japanlingo. Fitur ini memungkinkan superadmin untuk mengelola seluruh pengguna, kloter (cohort), key access per kloter, dan melacak aktivitas pengguna dalam platform pembelajaran bahasa Jepang online.

## Glosarium

- **Superadmin**: Role pengguna dengan hak akses tertinggi yang dapat mengelola semua user, kloter, dan konten
- **Admin**: Role pengajar yang dapat mengelola konten pembelajaran (modul, lesson, quiz)
- **Student**: Role pelajar yang mengakses materi pembelajaran
- **Kloter**: Grup pengguna berdasarkan tanggal mulai belajar (cohort)
- **Key_Access**: Sistem whitelist yang menentukan modul/lesson mana yang dapat diakses oleh kloter tertentu
- **Subscription_Status**: Status langganan pengguna (free atau premium)
- **User_Management_System**: Sistem yang mengelola CRUD operasi untuk pengguna
- **Kloter_System**: Sistem yang mengelola kloter dan assignment pengguna ke kloter
- **Dashboard_System**: Sistem yang menampilkan statistik dan visualisasi data
- **Activity_Tracker**: Sistem yang melacak dan mencatat aktivitas pengguna
- **Bulk_Operation_System**: Sistem yang menangani operasi massal terhadap multiple users
- **Export_System**: Sistem yang mengekspor data ke format CSV atau PDF
- **Import_System**: Sistem yang mengimpor data dari file CSV

## Requirements

### Requirement 1: Dashboard Superadmin

**User Story:** Sebagai superadmin, saya ingin melihat dashboard dengan statistik dan visualisasi data pengguna, sehingga saya dapat memantau kondisi platform secara keseluruhan.

#### Acceptance Criteria

1. THE Dashboard_System SHALL menampilkan total users berdasarkan role (student, Admin, superadmin)
2. THE Dashboard_System SHALL menampilkan jumlah active users
3. THE Dashboard_System SHALL menampilkan jumlah new registrations dalam bulan berjalan
4. THE Dashboard_System SHALL menampilkan chart user growth over time
5. THE Dashboard_System SHALL menampilkan chart user distribution by role
6. THE Dashboard_System SHALL menampilkan chart user distribution by subscription status
7. THE Dashboard_System SHALL menampilkan recent user activities (maksimal 10 aktivitas terakhir)

### Requirement 2: List dan Filter Users

**User Story:** Sebagai superadmin, saya ingin melihat daftar users dengan berbagai filter, sehingga saya dapat menemukan user yang spesifik dengan mudah.

#### Acceptance Criteria


1. THE User_Management_System SHALL menampilkan list semua users dengan pagination
2. THE User_Management_System SHALL menyediakan filter by role (student, Admin, superadmin)
3. THE User_Management_System SHALL menyediakan filter by subscription status (free, premium)
4. THE User_Management_System SHALL menyediakan filter by kloter
5. THE User_Management_System SHALL menyediakan search by name atau email
6. WHEN user melakukan search atau filter, THE User_Management_System SHALL menampilkan hasil dalam waktu maksimal 2 detik

### Requirement 3: Create User

**User Story:** Sebagai superadmin, saya ingin membuat user baru, sehingga saya dapat menambahkan pengguna ke platform.

#### Acceptance Criteria

1. THE User_Management_System SHALL menyediakan form untuk create user dengan field: name, email, password, role, subscription_status
2. WHEN superadmin submit form create user dengan data valid, THE User_Management_System SHALL menyimpan user baru ke database
3. WHEN superadmin submit form create user dengan data valid, THE User_Management_System SHALL menampilkan toast notification success
4. IF email sudah terdaftar, THEN THE User_Management_System SHALL menampilkan error message "Email sudah terdaftar"
5. IF password kurang dari 8 karakter, THEN THE User_Management_System SHALL menampilkan error message "Password minimal 8 karakter"
6. THE User_Management_System SHALL memvalidasi format email sebelum menyimpan

### Requirement 4: Edit User

**User Story:** Sebagai superadmin, saya ingin mengedit data user, sehingga saya dapat memperbarui informasi pengguna.

#### Acceptance Criteria

1. THE User_Management_System SHALL menyediakan form untuk edit user dengan field: name, email, role, subscription_status
2. WHEN superadmin submit form edit user dengan data valid, THE User_Management_System SHALL memperbarui data user di database
3. WHEN superadmin submit form edit user dengan data valid, THE User_Management_System SHALL menampilkan toast notification success
4. IF email sudah digunakan oleh user lain, THEN THE User_Management_System SHALL menampilkan error message "Email sudah digunakan"
5. THE User_Management_System SHALL memvalidasi format email sebelum memperbarui

### Requirement 5: Delete User

**User Story:** Sebagai superadmin, saya ingin menghapus user, sehingga saya dapat menghilangkan pengguna yang tidak aktif atau melanggar aturan.

#### Acceptance Criteria

1. WHEN superadmin klik tombol delete user, THE User_Management_System SHALL menampilkan confirmation modal
2. WHEN superadmin konfirmasi delete, THE User_Management_System SHALL melakukan soft delete pada user
3. WHEN superadmin konfirmasi delete, THE User_Management_System SHALL menampilkan toast notification success
4. THE User_Management_System SHALL menyimpan timestamp deleted_at pada user yang dihapus

### Requirement 6: Suspend dan Activate User

**User Story:** Sebagai superadmin, saya ingin suspend atau activate user account, sehingga saya dapat mengontrol akses pengguna ke platform.

#### Acceptance Criteria

1. THE User_Management_System SHALL menyediakan tombol suspend untuk user yang active
2. THE User_Management_System SHALL menyediakan tombol activate untuk user yang suspended
3. WHEN superadmin klik suspend, THE User_Management_System SHALL mengubah status user menjadi suspended
4. WHEN superadmin klik activate, THE User_Management_System SHALL mengubah status user menjadi active
5. WHEN user suspended mencoba login, THE User_Management_System SHALL menampilkan error message "Akun Anda telah disuspend"

### Requirement 7: Reset Password User

**User Story:** Sebagai superadmin, saya ingin reset password user, sehingga saya dapat membantu user yang lupa password.

#### Acceptance Criteria

1. THE User_Management_System SHALL menyediakan tombol reset password pada detail user
2. WHEN superadmin klik reset password, THE User_Management_System SHALL generate password baru secara otomatis
3. WHEN superadmin klik reset password, THE User_Management_System SHALL menampilkan password baru dalam modal
4. WHEN superadmin klik reset password, THE User_Management_System SHALL memperbarui password user di database
5. THE User_Management_System SHALL generate password dengan minimal 8 karakter yang mengandung huruf dan angka

### Requirement 8: List dan Statistik Kloter

**User Story:** Sebagai superadmin, saya ingin melihat daftar kloter dengan statistik, sehingga saya dapat memantau performa setiap kloter.

#### Acceptance Criteria

1. THE Kloter_System SHALL menampilkan list semua kloter dengan pagination
2. THE Kloter_System SHALL menampilkan jumlah user per kloter
3. THE Kloter_System SHALL menampilkan progress rata-rata per kloter
4. THE Kloter_System SHALL menampilkan start_date dan end_date per kloter
5. THE Kloter_System SHALL menyediakan search by name kloter

### Requirement 9: Create Kloter

**User Story:** Sebagai superadmin, saya ingin membuat kloter baru, sehingga saya dapat mengelompokkan user berdasarkan periode belajar.

#### Acceptance Criteria

1. THE Kloter_System SHALL menyediakan form untuk create kloter dengan field: name, start_date, end_date, description
2. WHEN superadmin submit form create kloter dengan data valid, THE Kloter_System SHALL menyimpan kloter baru ke database
3. WHEN superadmin submit form create kloter dengan data valid, THE Kloter_System SHALL menampilkan toast notification success
4. IF start_date lebih besar dari end_date, THEN THE Kloter_System SHALL menampilkan error message "Tanggal mulai harus lebih kecil dari tanggal selesai"
5. IF name kloter sudah ada, THEN THE Kloter_System SHALL menampilkan error message "Nama kloter sudah digunakan"

### Requirement 10: Edit Kloter

**User Story:** Sebagai superadmin, saya ingin mengedit data kloter, sehingga saya dapat memperbarui informasi kloter.

#### Acceptance Criteria

1. THE Kloter_System SHALL menyediakan form untuk edit kloter dengan field: name, start_date, end_date, description
2. WHEN superadmin submit form edit kloter dengan data valid, THE Kloter_System SHALL memperbarui data kloter di database
3. WHEN superadmin submit form edit kloter dengan data valid, THE Kloter_System SHALL menampilkan toast notification success
4. IF start_date lebih besar dari end_date, THEN THE Kloter_System SHALL menampilkan error message "Tanggal mulai harus lebih kecil dari tanggal selesai"

### Requirement 11: Delete Kloter

**User Story:** Sebagai superadmin, saya ingin menghapus kloter, sehingga saya dapat menghilangkan kloter yang tidak digunakan.

#### Acceptance Criteria

1. WHEN superadmin klik tombol delete kloter, THE Kloter_System SHALL menampilkan confirmation modal
2. IF kloter memiliki user, THEN THE Kloter_System SHALL menampilkan error message "Kloter tidak dapat dihapus karena masih memiliki user"
3. IF kloter tidak memiliki user, WHEN superadmin konfirmasi delete, THE Kloter_System SHALL menghapus kloter dari database
4. WHEN kloter berhasil dihapus, THE Kloter_System SHALL menampilkan toast notification success

### Requirement 12: Assign User ke Kloter

**User Story:** Sebagai superadmin, saya ingin assign user ke kloter, sehingga user dapat dikelompokkan berdasarkan periode belajar.

#### Acceptance Criteria

1. THE Kloter_System SHALL menyediakan form untuk assign user ke kloter secara manual
2. THE Kloter_System SHALL menyediakan opsi assign user ke kloter secara otomatis berdasarkan registration date
3. WHEN superadmin assign user ke kloter secara manual, THE Kloter_System SHALL menyimpan relasi user-kloter ke tabel kloter_user
4. WHEN superadmin assign user ke kloter secara otomatis, THE Kloter_System SHALL mengelompokkan user berdasarkan registration date yang sesuai dengan start_date kloter
5. WHEN user berhasil di-assign, THE Kloter_System SHALL menampilkan toast notification success

### Requirement 13: View User List per Kloter

**User Story:** Sebagai superadmin, saya ingin melihat daftar user dalam kloter tertentu, sehingga saya dapat memantau anggota kloter.

#### Acceptance Criteria

1. THE Kloter_System SHALL menampilkan list user yang tergabung dalam kloter tertentu
2. THE Kloter_System SHALL menampilkan informasi user: name, email, role, subscription_status, assigned_at
3. THE Kloter_System SHALL menyediakan tombol remove user dari kloter
4. WHEN superadmin klik remove user, THE Kloter_System SHALL menghapus relasi user-kloter dari tabel kloter_user

### Requirement 14: Kloter Dashboard

**User Story:** Sebagai superadmin, saya ingin melihat dashboard kloter dengan progress tracking, sehingga saya dapat memantau performa user dalam kloter.

#### Acceptance Criteria

1. THE Kloter_System SHALL menampilkan dashboard untuk kloter tertentu
2. THE Kloter_System SHALL menampilkan progress tracking per user dalam kloter (lessons completed, quizzes taken, XP earned)
3. THE Kloter_System SHALL menampilkan chart progress rata-rata kloter over time
4. THE Kloter_System SHALL menampilkan list user dengan progress terendah dalam kloter

### Requirement 15: Assign Modules ke Kloter (Key Access)

**User Story:** Sebagai superadmin, saya ingin assign modules ke kloter, sehingga saya dapat mengontrol akses konten per kloter.

#### Acceptance Criteria

1. THE Kloter_System SHALL menyediakan form untuk assign modules ke kloter
2. THE Kloter_System SHALL menyediakan field accessible_from dan accessible_until untuk setiap module
3. WHEN superadmin assign module ke kloter, THE Kloter_System SHALL menyimpan relasi ke tabel kloter_modules
4. WHEN superadmin assign module ke kloter, THE Kloter_System SHALL menampilkan toast notification success
5. THE Kloter_System SHALL menyediakan opsi bulk assign multiple modules sekaligus

### Requirement 16: Assign Lessons ke Kloter (Key Access)

**User Story:** Sebagai superadmin, saya ingin assign lessons ke kloter, sehingga saya dapat mengontrol akses lesson spesifik per kloter.

#### Acceptance Criteria

1. THE Kloter_System SHALL menyediakan form untuk assign lessons ke kloter
2. THE Kloter_System SHALL menyediakan field accessible_from dan accessible_until untuk setiap lesson
3. WHEN superadmin assign lesson ke kloter, THE Kloter_System SHALL menyimpan relasi ke tabel kloter_lessons
4. WHEN superadmin assign lesson ke kloter, THE Kloter_System SHALL menampilkan toast notification success
5. THE Kloter_System SHALL menyediakan opsi bulk assign multiple lessons sekaligus

### Requirement 17: View Accessible Content per Kloter

**User Story:** Sebagai superadmin, saya ingin melihat konten yang accessible per kloter, sehingga saya dapat memverifikasi key access yang sudah di-set.

#### Acceptance Criteria

1. THE Kloter_System SHALL menampilkan list modules yang accessible untuk kloter tertentu
2. THE Kloter_System SHALL menampilkan list lessons yang accessible untuk kloter tertentu
3. THE Kloter_System SHALL menampilkan accessible_from dan accessible_until untuk setiap module dan lesson
4. THE Kloter_System SHALL menyediakan tombol remove access untuk module atau lesson tertentu

### Requirement 18: Bulk Remove Key Access

**User Story:** Sebagai superadmin, saya ingin bulk remove key access, sehingga saya dapat menghapus akses multiple konten sekaligus.

#### Acceptance Criteria

1. THE Kloter_System SHALL menyediakan checkbox untuk select multiple modules atau lessons
2. THE Kloter_System SHALL menyediakan tombol bulk remove access
3. WHEN superadmin klik bulk remove access, THE Kloter_System SHALL menampilkan confirmation modal
4. WHEN superadmin konfirmasi bulk remove, THE Kloter_System SHALL menghapus relasi dari tabel kloter_modules atau kloter_lessons
5. WHEN bulk remove berhasil, THE Kloter_System SHALL menampilkan toast notification success dengan jumlah item yang dihapus

### Requirement 19: View User Login History

**User Story:** Sebagai superadmin, saya ingin melihat login history user, sehingga saya dapat melacak aktivitas login pengguna.

#### Acceptance Criteria

1. THE Activity_Tracker SHALL mencatat setiap login user ke tabel user_login_history
2. THE Activity_Tracker SHALL menyimpan login_at, ip_address, dan user_agent untuk setiap login
3. THE User_Management_System SHALL menampilkan login history untuk user tertentu dengan pagination
4. THE User_Management_System SHALL menampilkan informasi: login_at, ip_address, user_agent
5. THE User_Management_System SHALL mengurutkan login history dari yang terbaru

### Requirement 20: View User Learning Progress

**User Story:** Sebagai superadmin, saya ingin melihat learning progress user, sehingga saya dapat memantau perkembangan belajar pengguna.

#### Acceptance Criteria

1. THE User_Management_System SHALL menampilkan lessons completed oleh user tertentu
2. THE User_Management_System SHALL menampilkan quizzes taken oleh user tertentu dengan score
3. THE User_Management_System SHALL menampilkan XP dan level progression user
4. THE User_Management_System SHALL menampilkan chart progress over time untuk user tertentu

### Requirement 21: Export User Activity Report

**User Story:** Sebagai superadmin, saya ingin export user activity report, sehingga saya dapat menganalisis data di luar platform.

#### Acceptance Criteria

1. THE Export_System SHALL menyediakan tombol export user activity report
2. THE Export_System SHALL menyediakan opsi format export: CSV atau PDF
3. WHEN superadmin klik export CSV, THE Export_System SHALL generate file CSV dengan data user activity
4. WHEN superadmin klik export PDF, THE Export_System SHALL generate file PDF dengan data user activity
5. THE Export_System SHALL mendownload file hasil export secara otomatis

### Requirement 22: Bulk Assign Role

**User Story:** Sebagai superadmin, saya ingin bulk assign role, sehingga saya dapat mengubah role multiple users sekaligus.

#### Acceptance Criteria

1. THE Bulk_Operation_System SHALL menyediakan checkbox untuk select multiple users
2. THE Bulk_Operation_System SHALL menyediakan dropdown untuk pilih role baru
3. THE Bulk_Operation_System SHALL menyediakan tombol bulk assign role
4. WHEN superadmin klik bulk assign role, THE Bulk_Operation_System SHALL menampilkan confirmation modal
5. WHEN superadmin konfirmasi bulk assign, THE Bulk_Operation_System SHALL memperbarui role untuk semua selected users
6. WHEN bulk assign berhasil, THE Bulk_Operation_System SHALL menampilkan toast notification success dengan jumlah users yang diupdate

### Requirement 23: Bulk Assign Subscription Status

**User Story:** Sebagai superadmin, saya ingin bulk assign subscription status, sehingga saya dapat mengubah subscription multiple users sekaligus.

#### Acceptance Criteria

1. THE Bulk_Operation_System SHALL menyediakan checkbox untuk select multiple users
2. THE Bulk_Operation_System SHALL menyediakan dropdown untuk pilih subscription status baru (free atau premium)
3. THE Bulk_Operation_System SHALL menyediakan tombol bulk assign subscription
4. WHEN superadmin klik bulk assign subscription, THE Bulk_Operation_System SHALL menampilkan confirmation modal
5. WHEN superadmin konfirmasi bulk assign, THE Bulk_Operation_System SHALL memperbarui subscription_status untuk semua selected users
6. WHEN bulk assign berhasil, THE Bulk_Operation_System SHALL menampilkan toast notification success dengan jumlah users yang diupdate

### Requirement 24: Bulk Assign Kloter

**User Story:** Sebagai superadmin, saya ingin bulk assign kloter, sehingga saya dapat mengelompokkan multiple users ke kloter sekaligus.

#### Acceptance Criteria

1. THE Bulk_Operation_System SHALL menyediakan checkbox untuk select multiple users
2. THE Bulk_Operation_System SHALL menyediakan dropdown untuk pilih kloter
3. THE Bulk_Operation_System SHALL menyediakan tombol bulk assign kloter
4. WHEN superadmin klik bulk assign kloter, THE Bulk_Operation_System SHALL menampilkan confirmation modal
5. WHEN superadmin konfirmasi bulk assign, THE Bulk_Operation_System SHALL menyimpan relasi user-kloter untuk semua selected users
6. WHEN bulk assign berhasil, THE Bulk_Operation_System SHALL menampilkan toast notification success dengan jumlah users yang di-assign

### Requirement 25: Bulk Suspend dan Activate Users

**User Story:** Sebagai superadmin, saya ingin bulk suspend atau activate users, sehingga saya dapat mengontrol akses multiple users sekaligus.

#### Acceptance Criteria

1. THE Bulk_Operation_System SHALL menyediakan checkbox untuk select multiple users
2. THE Bulk_Operation_System SHALL menyediakan tombol bulk suspend
3. THE Bulk_Operation_System SHALL menyediakan tombol bulk activate
4. WHEN superadmin klik bulk suspend, THE Bulk_Operation_System SHALL menampilkan confirmation modal
5. WHEN superadmin konfirmasi bulk suspend, THE Bulk_Operation_System SHALL mengubah status menjadi suspended untuk semua selected users
6. WHEN superadmin klik bulk activate, THE Bulk_Operation_System SHALL mengubah status menjadi active untuk semua selected users
7. WHEN bulk operation berhasil, THE Bulk_Operation_System SHALL menampilkan toast notification success dengan jumlah users yang diupdate

### Requirement 26: Bulk Delete Users

**User Story:** Sebagai superadmin, saya ingin bulk delete users, sehingga saya dapat menghapus multiple users sekaligus.

#### Acceptance Criteria

1. THE Bulk_Operation_System SHALL menyediakan checkbox untuk select multiple users
2. THE Bulk_Operation_System SHALL menyediakan tombol bulk delete
3. WHEN superadmin klik bulk delete, THE Bulk_Operation_System SHALL menampilkan confirmation modal
4. WHEN superadmin konfirmasi bulk delete, THE Bulk_Operation_System SHALL melakukan soft delete untuk semua selected users
5. WHEN bulk delete berhasil, THE Bulk_Operation_System SHALL menampilkan toast notification success dengan jumlah users yang dihapus

### Requirement 27: Bulk Export Users

**User Story:** Sebagai superadmin, saya ingin bulk export users, sehingga saya dapat mengekspor data multiple users ke CSV.

#### Acceptance Criteria

1. THE Export_System SHALL menyediakan checkbox untuk select multiple users
2. THE Export_System SHALL menyediakan tombol bulk export
3. WHEN superadmin klik bulk export, THE Export_System SHALL generate file CSV dengan data selected users
4. THE Export_System SHALL menyertakan kolom: name, email, role, subscription_status, xp, level, created_at
5. THE Export_System SHALL mendownload file CSV secara otomatis

### Requirement 28: Bulk Import Users

**User Story:** Sebagai superadmin, saya ingin bulk import users dari CSV, sehingga saya dapat menambahkan multiple users sekaligus.

#### Acceptance Criteria

1. THE Import_System SHALL menyediakan form upload file CSV
2. THE Import_System SHALL menyediakan template CSV untuk download
3. WHEN superadmin upload file CSV dengan format valid, THE Import_System SHALL memproses dan menyimpan users ke database
4. IF file CSV memiliki format invalid, THEN THE Import_System SHALL menampilkan error message dengan detail baris yang error
5. IF email sudah terdaftar, THEN THE Import_System SHALL skip user tersebut dan lanjut ke user berikutnya
6. WHEN import selesai, THE Import_System SHALL menampilkan summary: jumlah users berhasil diimport, jumlah users yang di-skip, jumlah errors

### Requirement 29: View Detailed User Profile

**User Story:** Sebagai superadmin, saya ingin melihat detailed user profile, sehingga saya dapat memahami informasi lengkap pengguna.

#### Acceptance Criteria

1. THE User_Management_System SHALL menampilkan detailed profile untuk user tertentu
2. THE User_Management_System SHALL menampilkan informasi: name, email, phone, address, role, subscription_status, xp, level, streak_count, last_activity_date
3. THE User_Management_System SHALL menampilkan learning history (lessons completed dengan timestamp)
4. THE User_Management_System SHALL menampilkan quiz attempts dengan score dan timestamp
5. THE User_Management_System SHALL menampilkan achievements yang sudah unlocked
6. THE User_Management_System SHALL menampilkan certificates yang sudah diterbitkan

### Requirement 30: Edit User Profile

**User Story:** Sebagai superadmin, saya ingin edit user profile, sehingga saya dapat memperbarui informasi detail pengguna.

#### Acceptance Criteria

1. THE User_Management_System SHALL menyediakan form untuk edit user profile dengan field: name, email, phone, address
2. WHEN superadmin submit form edit profile dengan data valid, THE User_Management_System SHALL memperbarui data user di database
3. WHEN superadmin submit form edit profile dengan data valid, THE User_Management_System SHALL menampilkan toast notification success
4. IF email sudah digunakan oleh user lain, THEN THE User_Management_System SHALL menampilkan error message "Email sudah digunakan"

### Requirement 31: Authorization Superadmin

**User Story:** Sebagai sistem, saya ingin memastikan hanya superadmin yang dapat akses fitur user management, sehingga keamanan platform terjaga.

#### Acceptance Criteria

1. THE User_Management_System SHALL menggunakan RoleMiddleware untuk memverifikasi role superadmin
2. IF user bukan superadmin mencoba akses user management, THEN THE User_Management_System SHALL redirect ke halaman unauthorized
3. THE User_Management_System SHALL menampilkan error message "Anda tidak memiliki akses ke halaman ini"
4. THE Kloter_System SHALL menggunakan RoleMiddleware untuk memverifikasi role superadmin
5. IF user bukan superadmin mencoba akses kloter management, THEN THE Kloter_System SHALL redirect ke halaman unauthorized

### Requirement 32: Check Kloter Access untuk User

**User Story:** Sebagai sistem, saya ingin memverifikasi akses user ke modul/lesson berdasarkan kloter, sehingga key access dapat diterapkan dengan benar.

#### Acceptance Criteria

1. THE Kloter_System SHALL menggunakan CheckKloterAccess middleware untuk memverifikasi akses user
2. WHEN user mencoba akses module, THE Kloter_System SHALL memeriksa apakah module accessible untuk kloter user
3. WHEN user mencoba akses lesson, THE Kloter_System SHALL memeriksa apakah lesson accessible untuk kloter user
4. THE Kloter_System SHALL memeriksa apakah tanggal sekarang berada dalam range accessible_from dan accessible_until
5. IF user tidak memiliki akses, THEN THE Kloter_System SHALL menampilkan error message "Konten ini belum tersedia untuk kloter Anda"

### Requirement 33: Responsive Design

**User Story:** Sebagai superadmin, saya ingin UI yang responsive, sehingga saya dapat mengakses fitur dari berbagai device.

#### Acceptance Criteria

1. THE User_Management_System SHALL menampilkan UI yang responsive untuk desktop (min-width 1024px)
2. THE User_Management_System SHALL menampilkan UI yang responsive untuk tablet (min-width 768px)
3. THE User_Management_System SHALL menampilkan UI yang responsive untuk mobile (min-width 320px)
4. THE Dashboard_System SHALL menyesuaikan layout chart untuk berbagai ukuran layar
5. THE User_Management_System SHALL menyediakan hamburger menu untuk mobile view

### Requirement 34: Data Visualization dengan Charts

**User Story:** Sebagai superadmin, saya ingin melihat data dalam bentuk chart, sehingga saya dapat memahami data dengan lebih mudah.

#### Acceptance Criteria

1. THE Dashboard_System SHALL menggunakan library Chart.js atau Recharts untuk visualisasi data
2. THE Dashboard_System SHALL menampilkan line chart untuk user growth over time
3. THE Dashboard_System SHALL menampilkan pie chart untuk user distribution by role
4. THE Dashboard_System SHALL menampilkan bar chart untuk user distribution by subscription status
5. THE Dashboard_System SHALL menyediakan tooltip pada chart untuk menampilkan detail data

### Requirement 35: Breadcrumb Navigation

**User Story:** Sebagai superadmin, saya ingin breadcrumb navigation, sehingga saya dapat mengetahui posisi saya dalam aplikasi dan navigasi dengan mudah.

#### Acceptance Criteria

1. THE User_Management_System SHALL menampilkan breadcrumb navigation di setiap halaman
2. THE User_Management_System SHALL menampilkan path: Dashboard > User Management > [Current Page]
3. THE Kloter_System SHALL menampilkan path: Dashboard > Kloter Management > [Current Page]
4. WHEN superadmin klik breadcrumb item, THE User_Management_System SHALL navigate ke halaman tersebut

### Requirement 36: Toast Notifications

**User Story:** Sebagai superadmin, saya ingin menerima toast notification, sehingga saya dapat mengetahui hasil operasi yang saya lakukan.

#### Acceptance Criteria

1. WHEN operasi berhasil, THE User_Management_System SHALL menampilkan toast notification success dengan warna hijau
2. WHEN operasi gagal, THE User_Management_System SHALL menampilkan toast notification error dengan warna merah
3. THE User_Management_System SHALL menampilkan toast notification selama 3 detik
4. THE User_Management_System SHALL menyediakan tombol close pada toast notification
5. THE User_Management_System SHALL menampilkan toast notification di pojok kanan atas

### Requirement 37: Confirmation Modals

**User Story:** Sebagai superadmin, saya ingin confirmation modal untuk operasi destructive, sehingga saya dapat mencegah kesalahan yang tidak disengaja.

#### Acceptance Criteria

1. WHEN superadmin melakukan delete operation, THE User_Management_System SHALL menampilkan confirmation modal
2. WHEN superadmin melakukan bulk delete operation, THE Bulk_Operation_System SHALL menampilkan confirmation modal
3. WHEN superadmin melakukan suspend operation, THE User_Management_System SHALL menampilkan confirmation modal
4. THE User_Management_System SHALL menampilkan pesan konfirmasi yang jelas dalam modal
5. THE User_Management_System SHALL menyediakan tombol Cancel dan Confirm dalam modal

### Requirement 38: Advanced Filters

**User Story:** Sebagai superadmin, saya ingin advanced filters, sehingga saya dapat menemukan data dengan kriteria yang kompleks.

#### Acceptance Criteria

1. THE User_Management_System SHALL menyediakan filter panel yang dapat di-toggle
2. THE User_Management_System SHALL menyimpan filter state saat user navigate ke halaman lain
3. THE User_Management_System SHALL menyediakan tombol reset filters
4. WHEN superadmin apply filters, THE User_Management_System SHALL memperbarui URL dengan query parameters
5. THE User_Management_System SHALL memuat filters dari URL query parameters saat halaman di-load

### Requirement 39: Pagination

**User Story:** Sebagai superadmin, saya ingin pagination, sehingga saya dapat melihat data dalam jumlah besar dengan performa yang baik.

#### Acceptance Criteria

1. THE User_Management_System SHALL menampilkan maksimal 20 items per halaman
2. THE User_Management_System SHALL menyediakan pagination controls (previous, next, page numbers)
3. THE User_Management_System SHALL menampilkan total items dan current page
4. WHEN superadmin klik page number, THE User_Management_System SHALL load data untuk halaman tersebut
5. THE User_Management_System SHALL menyediakan dropdown untuk mengubah items per page (10, 20, 50, 100)

### Requirement 40: Search Functionality

**User Story:** Sebagai superadmin, saya ingin search functionality, sehingga saya dapat menemukan user atau kloter dengan cepat.

#### Acceptance Criteria

1. THE User_Management_System SHALL menyediakan search input dengan placeholder yang jelas
2. THE User_Management_System SHALL melakukan search saat user mengetik (debounce 500ms)
3. THE User_Management_System SHALL menampilkan loading indicator saat search sedang diproses
4. THE User_Management_System SHALL menampilkan "No results found" jika search tidak menemukan data
5. THE User_Management_System SHALL highlight search term dalam hasil search
