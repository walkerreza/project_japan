# Requirements Document

## Pendahuluan

Dokumen ini menjelaskan requirements untuk fitur manajemen pembayaran superadmin di platform Japanlingo. Fitur ini memungkinkan superadmin untuk mengelola transaksi pembayaran, subscription premium user, payment plans, dan menghasilkan laporan revenue. Sistem ini fokus pada tracking dan management pembayaran, bukan integrasi payment gateway (yang akan diimplementasi di fase selanjutnya).

## Glossary

- **System**: Sistem manajemen pembayaran Japanlingo
- **Superadmin**: User dengan role superadmin yang memiliki akses penuh ke payment management
- **User**: Pengguna platform Japanlingo (student atau Admin)
- **Transaction**: Catatan transaksi pembayaran dari user
- **Subscription**: Status langganan premium user dengan periode tertentu
- **Payment_Plan**: Paket langganan yang tersedia (Free, Premium Monthly, Quarterly, Yearly)
- **Payment_Proof**: Bukti pembayaran berupa gambar yang diupload user untuk manual payment
- **Revenue**: Total pendapatan dari transaksi yang berhasil
- **Transaction_Status**: Status transaksi (pending, success, failed, expired)
- **Subscription_Status**: Status subscription (active, expired, cancelled)
- **Payment_Method**: Metode pembayaran (manual, bank_transfer, e-wallet, credit_card)
- **Dashboard**: Halaman utama yang menampilkan statistik dan overview pembayaran
- **Email_Notification**: Notifikasi email yang dikirim ke user terkait pembayaran/subscription

## Requirements

### Requirement 1: Dashboard Pembayaran

**User Story:** Sebagai superadmin, saya ingin melihat dashboard pembayaran dengan statistik dan visualisasi data, sehingga saya dapat memantau performa revenue dan subscription secara real-time.

#### Acceptance Criteria

1. THE System SHALL menampilkan total revenue untuk bulan ini, tahun ini, dan sepanjang waktu
2. THE System SHALL menampilkan chart revenue over time dengan breakdown per bulan
3. THE System SHALL menampilkan chart distribusi subscription (free vs premium users)
4. THE System SHALL menampilkan 10 transaksi terbaru dengan informasi user, amount, status, dan tanggal
5. THE System SHALL menampilkan jumlah pending payments yang belum diproses
6. THE System SHALL menampilkan jumlah active premium users saat ini
7. THE System SHALL memperbarui statistik secara real-time ketika ada perubahan data

### Requirement 2: Transaction Management - List dan Filter

**User Story:** Sebagai superadmin, saya ingin melihat daftar semua transaksi dengan kemampuan filter dan search, sehingga saya dapat menemukan transaksi spesifik dengan mudah.

#### Acceptance Criteria

1. THE System SHALL menampilkan daftar semua transaksi dengan pagination
2. WHERE filter by status dipilih, THE System SHALL menampilkan transaksi dengan status yang sesuai (pending, success, failed, expired)
3. WHERE filter by payment method dipilih, THE System SHALL menampilkan transaksi dengan payment method yang sesuai (manual, bank_transfer, e-wallet, credit_card)
4. WHERE filter by date range dipilih, THE System SHALL menampilkan transaksi dalam rentang tanggal tersebut
5. WHERE filter by user dipilih, THE System SHALL menampilkan transaksi dari user tersebut
6. WHEN superadmin melakukan search dengan transaction ID atau user email, THE System SHALL menampilkan transaksi yang cocok
7. THE System SHALL menampilkan informasi transaction ID, user name, amount, payment method, status, dan created date pada list

### Requirement 3: Transaction Management - Detail dan Update

**User Story:** Sebagai superadmin, saya ingin melihat detail transaksi dan mengupdate statusnya, sehingga saya dapat mengelola transaksi dengan lengkap.

#### Acceptance Criteria

1. WHEN superadmin mengklik transaksi, THE System SHALL menampilkan detail lengkap transaksi
2. THE System SHALL menampilkan transaction ID, user info (name, email), amount, payment method, status, created at, updated at, dan proof of payment
3. WHERE proof of payment tersedia, THE System SHALL menampilkan image viewer untuk melihat bukti pembayaran
4. WHEN superadmin mengupdate transaction status dari pending ke success atau failed, THE System SHALL menyimpan perubahan status
5. WHEN superadmin menambahkan notes ke transaksi, THE System SHALL menyimpan notes tersebut
6. THE System SHALL mencatat semua perubahan status dalam transaction_logs dengan informasi old_status, new_status, changed_by, dan timestamp

### Requirement 4: Manual Payment Processing - Approval

**User Story:** Sebagai superadmin, saya ingin mereview dan approve manual payment dari user, sehingga user dapat mengaktifkan subscription premium mereka.

#### Acceptance Criteria

1. WHEN superadmin approve manual payment, THE System SHALL mengupdate transaction status menjadi success
2. WHEN transaction status diupdate menjadi success, THE System SHALL mengupdate user subscription_status menjadi premium
3. WHEN subscription_status diupdate menjadi premium, THE System SHALL menghitung dan set subscription end_date berdasarkan payment plan duration
4. WHEN subscription berhasil diaktifkan, THE System SHALL mengirim confirmation email ke user
5. THE System SHALL mencatat approval dalam transaction_logs dengan informasi superadmin yang approve
6. WHEN superadmin approve payment, THE System SHALL menampilkan confirmation modal sebelum memproses

### Requirement 5: Manual Payment Processing - Rejection

**User Story:** Sebagai superadmin, saya ingin reject manual payment yang tidak valid, sehingga user mengetahui pembayaran mereka ditolak dan alasannya.

#### Acceptance Criteria

1. WHEN superadmin reject manual payment, THE System SHALL menampilkan form untuk input rejection reason
2. WHEN rejection reason disubmit, THE System SHALL mengupdate transaction status menjadi failed
3. WHEN transaction status diupdate menjadi failed, THE System SHALL menyimpan rejection reason dalam notes
4. WHEN payment direject, THE System SHALL mengirim rejection email ke user dengan rejection reason
5. THE System SHALL mencatat rejection dalam transaction_logs dengan informasi superadmin yang reject
6. WHEN superadmin reject payment, THE System SHALL menampilkan confirmation modal sebelum memproses

### Requirement 6: Subscription Management - List dan Filter

**User Story:** Sebagai superadmin, saya ingin melihat daftar semua subscription dengan filter, sehingga saya dapat memantau status subscription user.

#### Acceptance Criteria

1. THE System SHALL menampilkan daftar semua subscriptions dengan pagination
2. WHERE filter by status dipilih, THE System SHALL menampilkan subscriptions dengan status yang sesuai (active, expired, cancelled)
3. WHERE filter by plan dipilih, THE System SHALL menampilkan subscriptions dengan plan type yang sesuai (free, premium)
4. WHERE filter by expiry date dipilih, THE System SHALL menampilkan subscriptions yang akan expire dalam rentang tanggal tersebut
5. THE System SHALL menampilkan informasi user name, plan type, start date, end date, status, dan auto-renew status pada list
6. THE System SHALL mengurutkan subscriptions berdasarkan end_date secara default (yang akan expire lebih dulu di atas)

### Requirement 7: Subscription Management - Detail dan History

**User Story:** Sebagai superadmin, saya ingin melihat detail subscription dan payment history user, sehingga saya dapat memahami riwayat langganan user.

#### Acceptance Criteria

1. WHEN superadmin mengklik subscription, THE System SHALL menampilkan detail lengkap subscription
2. THE System SHALL menampilkan user info, plan type, start date, end date, auto-renew status, dan current status
3. THE System SHALL menampilkan payment history dari user tersebut dengan informasi transaction ID, amount, payment method, status, dan date
4. THE System SHALL menampilkan total amount yang telah dibayar user sepanjang waktu
5. THE System SHALL menampilkan subscription change logs dengan informasi perubahan status dan timestamp

### Requirement 8: Subscription Management - Manual Operations

**User Story:** Sebagai superadmin, saya ingin melakukan operasi manual pada subscription user, sehingga saya dapat mengelola subscription secara fleksibel.

#### Acceptance Criteria

1. WHEN superadmin create subscription untuk user, THE System SHALL membuat subscription baru dengan plan, start_date, dan end_date yang ditentukan
2. WHEN superadmin extend subscription, THE System SHALL menambah end_date sesuai duration yang ditentukan
3. WHEN superadmin cancel subscription, THE System SHALL mengupdate subscription status menjadi cancelled dan set end_date ke tanggal saat ini
4. WHEN subscription dibuat atau dimodifikasi, THE System SHALL mencatat perubahan dalam subscription logs
5. WHEN subscription operation dilakukan, THE System SHALL menampilkan confirmation modal sebelum memproses
6. IF user sudah memiliki active subscription, THEN THE System SHALL menampilkan warning sebelum create subscription baru

### Requirement 9: Payment Plans Management - List dan Statistics

**User Story:** Sebagai superadmin, saya ingin melihat daftar payment plans dengan statistik, sehingga saya dapat memantau performa setiap plan.

#### Acceptance Criteria

1. THE System SHALL menampilkan daftar semua payment plans (Free, Premium Monthly, Quarterly, Yearly)
2. THE System SHALL menampilkan informasi name, description, price, duration (days), dan is_active status untuk setiap plan
3. THE System SHALL menampilkan total subscribers untuk setiap plan
4. THE System SHALL menampilkan total revenue yang dihasilkan setiap plan
5. THE System SHALL menampilkan features list untuk setiap plan dari JSON field
6. WHERE plan is_active adalah false, THE System SHALL menampilkan visual indicator bahwa plan tidak aktif

### Requirement 10: Payment Plans Management - CRUD Operations

**User Story:** Sebagai superadmin, saya ingin membuat, mengedit, dan mengaktifkan/menonaktifkan payment plans, sehingga saya dapat mengelola paket langganan yang tersedia.

#### Acceptance Criteria

1. WHEN superadmin create payment plan, THE System SHALL menyimpan name, description, price, duration_days, features (JSON), dan is_active status
2. WHEN superadmin edit payment plan, THE System SHALL mengupdate informasi plan yang dipilih
3. WHEN superadmin activate payment plan, THE System SHALL set is_active menjadi true
4. WHEN superadmin deactivate payment plan, THE System SHALL set is_active menjadi false
5. IF payment plan memiliki active subscribers, THEN THE System SHALL menampilkan warning sebelum deactivate
6. THE System SHALL memvalidasi bahwa price adalah numeric dan minimal 0
7. THE System SHALL memvalidasi bahwa duration_days adalah numeric dan minimal 1

### Requirement 11: Revenue Reports - Generation

**User Story:** Sebagai superadmin, saya ingin generate revenue report berdasarkan date range, sehingga saya dapat menganalisis performa revenue dalam periode tertentu.

#### Acceptance Criteria

1. WHEN superadmin memilih date range dan generate report, THE System SHALL menghasilkan revenue report untuk periode tersebut
2. THE System SHALL menampilkan total transactions dalam periode
3. THE System SHALL menampilkan total revenue dalam periode
4. THE System SHALL menampilkan revenue breakdown by payment method
5. THE System SHALL menampilkan revenue breakdown by plan
6. THE System SHALL menampilkan top 10 paying users dalam periode
7. THE System SHALL menampilkan chart visualizations untuk revenue data

### Requirement 12: Revenue Reports - Export

**User Story:** Sebagai superadmin, saya ingin export revenue report ke CSV atau PDF, sehingga saya dapat menyimpan atau membagikan report tersebut.

#### Acceptance Criteria

1. WHEN superadmin klik export to CSV, THE System SHALL generate CSV file dengan semua data report
2. WHEN superadmin klik export to PDF, THE System SHALL generate PDF file dengan format yang readable
3. THE System SHALL menyertakan semua data statistik dan breakdown dalam exported file
4. THE System SHALL menyertakan chart visualizations dalam PDF export
5. THE System SHALL memberikan nama file dengan format "revenue_report_YYYY-MM-DD_to_YYYY-MM-DD.csv" atau ".pdf"
6. WHEN export selesai, THE System SHALL trigger download file ke browser superadmin

### Requirement 13: Subscription Expiry Handling - Automated Job

**User Story:** Sebagai system, saya ingin menjalankan automated job untuk check subscription expiry, sehingga user mendapat reminder dan auto-downgrade setelah expiry.

#### Acceptance Criteria

1. THE System SHALL menjalankan scheduled job setiap hari untuk check subscription expiry
2. WHEN subscription akan expire dalam 7 hari, THE System SHALL mengirim reminder email ke user
3. WHEN subscription akan expire dalam 1 hari, THE System SHALL mengirim reminder email ke user
4. WHEN subscription end_date sudah terlewati, THE System SHALL mengupdate subscription status menjadi expired
5. WHEN subscription expired, THE System SHALL mengupdate user subscription_status menjadi free
6. WHEN subscription status berubah, THE System SHALL mencatat perubahan dalam subscription logs
7. WHEN subscription expired, THE System SHALL mengirim subscription expired notification email ke user

### Requirement 14: Email Notifications

**User Story:** Sebagai user, saya ingin menerima email notifications terkait pembayaran dan subscription, sehingga saya selalu terinformasi tentang status langganan saya.

#### Acceptance Criteria

1. WHEN payment approved, THE System SHALL mengirim payment confirmation email dengan informasi transaction ID, amount, plan, dan subscription end_date
2. WHEN payment rejected, THE System SHALL mengirim payment rejection email dengan rejection reason
3. WHEN subscription akan expire dalam 7 hari, THE System SHALL mengirim reminder email dengan informasi end_date dan link untuk renew
4. WHEN subscription akan expire dalam 1 hari, THE System SHALL mengirim urgent reminder email
5. WHEN subscription expired, THE System SHALL mengirim notification email bahwa subscription telah berakhir dan user di-downgrade ke free plan
6. THE System SHALL menggunakan email template yang professional dan branded dengan Japanlingo
7. THE System SHALL menyertakan call-to-action button dalam email untuk memudahkan user melakukan action

### Requirement 15: Authorization dan Access Control

**User Story:** Sebagai system, saya ingin memastikan hanya superadmin yang dapat akses payment management, sehingga data pembayaran terlindungi.

#### Acceptance Criteria

1. THE System SHALL memvalidasi bahwa user memiliki role superadmin sebelum mengakses payment management routes
2. IF user role bukan superadmin, THEN THE System SHALL redirect ke unauthorized page dengan HTTP status 403
3. THE System SHALL menerapkan RoleMiddleware pada semua payment management routes
4. THE System SHALL memastikan Admin tidak dapat akses payment management panel
5. THE System SHALL memastikan student tidak dapat akses payment management panel
6. THE System SHALL mencatat semua payment management operations dengan informasi superadmin yang melakukan action

### Requirement 16: Data Validation

**User Story:** Sebagai system, saya ingin memvalidasi semua input data pembayaran, sehingga data yang tersimpan selalu valid dan konsisten.

#### Acceptance Criteria

1. WHEN transaction dibuat atau diupdate, THE System SHALL memvalidasi amount adalah numeric dan minimal 0
2. WHEN transaction dibuat atau diupdate, THE System SHALL memvalidasi payment_method adalah salah satu dari (manual, bank_transfer, e-wallet, credit_card)
3. WHEN transaction dibuat atau diupdate, THE System SHALL memvalidasi status adalah salah satu dari (pending, success, failed, expired)
4. WHERE payment method adalah manual, THE System SHALL memvalidasi proof_of_payment adalah required
5. WHERE proof_of_payment diupload, THE System SHALL memvalidasi file format adalah jpg, png, atau pdf
6. WHERE proof_of_payment diupload, THE System SHALL memvalidasi file size maksimal 2MB
7. IF validation gagal, THEN THE System SHALL menampilkan error message yang jelas ke superadmin

### Requirement 17: UI/UX Requirements

**User Story:** Sebagai superadmin, saya ingin interface yang modern, responsive, dan user-friendly, sehingga saya dapat mengelola pembayaran dengan efisien.

#### Acceptance Criteria

1. THE System SHALL menampilkan payment management dengan design modern admin panel
2. THE System SHALL responsive pada desktop, tablet, dan mobile devices
3. THE System SHALL menggunakan chart library (Chart.js atau Recharts) untuk data visualization
4. THE System SHALL menyediakan export functionality dengan button yang jelas
5. THE System SHALL menampilkan image viewer modal untuk proof of payment
6. WHEN superadmin melakukan approve/reject operations, THE System SHALL menampilkan confirmation modal
7. WHEN operation berhasil atau gagal, THE System SHALL menampilkan toast notification
8. THE System SHALL menampilkan breadcrumb navigation untuk memudahkan navigasi
9. THE System SHALL menyediakan advanced filters dengan UI yang intuitive
10. THE System SHALL menampilkan loading state ketika data sedang diproses

### Requirement 18: Database Schema

**User Story:** Sebagai system, saya ingin menyimpan data pembayaran dalam database schema yang terstruktur, sehingga data dapat dikelola dengan efisien.

#### Acceptance Criteria

1. THE System SHALL membuat table payment_plans dengan columns: id, name, description, price, duration_days, features (JSON), is_active, timestamps
2. THE System SHALL membuat table subscriptions dengan columns: id, user_id, plan_id, start_date, end_date, status, auto_renew, timestamps
3. THE System SHALL membuat table transactions dengan columns: id, user_id, plan_id, amount, payment_method, status, proof_of_payment, notes, created_at, updated_at
4. THE System SHALL membuat table transaction_logs dengan columns: id, transaction_id, old_status, new_status, changed_by, notes, created_at
5. THE System SHALL membuat foreign key constraint dari subscriptions.user_id ke users.id
6. THE System SHALL membuat foreign key constraint dari subscriptions.plan_id ke payment_plans.id
7. THE System SHALL membuat foreign key constraint dari transactions.user_id ke users.id
8. THE System SHALL membuat foreign key constraint dari transactions.plan_id ke payment_plans.id
9. THE System SHALL membuat foreign key constraint dari transaction_logs.transaction_id ke transactions.id
10. THE System SHALL membuat index pada columns yang sering diquery (user_id, status, created_at)

### Requirement 19: Parser dan Serializer untuk Features JSON

**User Story:** Sebagai developer, saya ingin parse dan serialize features JSON pada payment plans, sehingga features dapat disimpan dan ditampilkan dengan benar.

#### Acceptance Criteria

1. WHEN payment plan dibuat atau diupdate, THE Parser SHALL parse features JSON string menjadi array
2. IF features JSON tidak valid, THEN THE Parser SHALL return descriptive error message
3. THE Pretty_Printer SHALL format features array kembali menjadi valid JSON string
4. FOR ALL valid features arrays, parsing kemudian printing kemudian parsing SHALL menghasilkan equivalent array (round-trip property)
5. THE System SHALL memvalidasi bahwa setiap feature dalam array adalah string
6. THE System SHALL menampilkan features sebagai bullet list pada UI

### Requirement 20: Send Subscription Expiry Reminder Manual

**User Story:** Sebagai superadmin, saya ingin mengirim subscription expiry reminder secara manual ke user tertentu, sehingga saya dapat mengingatkan user yang akan expire.

#### Acceptance Criteria

1. WHEN superadmin memilih subscription dan klik send reminder, THE System SHALL mengirim expiry reminder email ke user
2. THE System SHALL menampilkan confirmation modal sebelum mengirim email
3. WHEN email berhasil dikirim, THE System SHALL menampilkan success notification
4. IF email gagal dikirim, THEN THE System SHALL menampilkan error notification dengan error message
5. THE System SHALL mencatat email sending activity dalam logs
6. THE System SHALL menampilkan last reminder sent date pada subscription detail
