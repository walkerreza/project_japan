# Dokumen Requirements: Halaman Publik Japanlingo

## Pendahuluan

Halaman Publik Japanlingo adalah kumpulan halaman yang dapat diakses oleh pengguna yang belum login (guest users) pada platform pembelajaran bahasa Jepang online. Halaman-halaman ini mencakup landing page, pricing, about, dan halaman autentikasi (login, register, forgot password, reset password). Tujuan utama adalah untuk menarik calon pengguna, menjelaskan value proposition platform, dan memfasilitasi proses registrasi dan login dengan pengalaman yang modern, responsif, dan mudah digunakan.

## Glosarium

- **Guest_User**: Pengguna yang mengakses platform tanpa melakukan login
- **Landing_Page**: Halaman utama yang pertama kali dilihat oleh Guest_User saat mengakses platform
- **Hero_Section**: Bagian utama di halaman yang menampilkan tagline dan call-to-action utama
- **CTA_Button**: Call-to-Action button yang mendorong pengguna untuk melakukan aksi tertentu
- **Pricing_Card**: Komponen UI yang menampilkan informasi paket harga
- **Authentication_Form**: Form untuk login, register, atau reset password
- **Validation_Error**: Pesan error yang ditampilkan ketika input pengguna tidak valid
- **Password_Reset_Token**: Token unik yang dikirim via email untuk proses reset password
- **Throttle_Middleware**: Middleware yang membatasi jumlah request dalam periode waktu tertentu
- **Guest_Middleware**: Middleware yang memastikan hanya Guest_User yang dapat mengakses halaman tertentu
- **Responsive_Design**: Desain yang menyesuaikan tampilan berdasarkan ukuran layar perangkat
- **SEO_Meta_Tags**: Tag HTML yang membantu mesin pencari memahami konten halaman
- **WCAG_2_1_AA**: Standar aksesibilitas web level AA dari Web Content Accessibility Guidelines 2.1

## Requirements

### Requirement 1: Landing Page

**User Story:** Sebagai Guest_User, saya ingin melihat landing page yang menarik dan informatif, sehingga saya dapat memahami value proposition Japanlingo dan tertarik untuk mendaftar.

#### Acceptance Criteria

1. WHEN Guest_User mengakses root URL `/`, THE Landing_Page SHALL menampilkan Hero_Section dengan tagline, CTA_Button "Mulai Belajar Gratis", dan hero image
2. THE Landing_Page SHALL menampilkan Features Section dengan 4 hingga 6 fitur utama yang masing-masing memiliki icon dan deskripsi
3. THE Landing_Page SHALL menampilkan How It Works Section dengan 3 langkah visual (Daftar, Pilih Level, Mulai Belajar)
4. THE Landing_Page SHALL menampilkan Pricing Preview Section dengan 2 paket (Free dan Premium) dan CTA_Button "Lihat Detail Harga"
5. THE Landing_Page SHALL menampilkan Testimonials Section dengan slider atau cards yang berisi foto, nama, rating, dan review pengguna
6. THE Landing_Page SHALL menampilkan CTA Footer dengan call-to-action untuk mendaftar dan link ke social media
7. THE Landing_Page SHALL memuat dalam waktu kurang dari 3 detik pada koneksi 3G
8. THE Landing_Page SHALL menyertakan SEO_Meta_Tags untuk title, description, dan Open Graph tags

### Requirement 2: Pricing Page

**User Story:** Sebagai Guest_User, saya ingin melihat detail harga dan perbandingan fitur antara paket Free dan Premium, sehingga saya dapat memutuskan paket mana yang sesuai dengan kebutuhan saya.

#### Acceptance Criteria

1. WHEN Guest_User mengakses URL `/pricing`, THE Pricing_Page SHALL menampilkan 2 Pricing_Card untuk paket Free dan Premium
2. THE Pricing_Card untuk Free Plan SHALL menampilkan fitur: N3 only, Full gamification, Community support
3. THE Pricing_Card untuk Premium Plan SHALL menampilkan fitur: All levels (N5-N1), Full gamification, Priority support, Certificates
4. THE Pricing_Page SHALL menampilkan Feature Comparison Table dengan side-by-side comparison semua fitur
5. THE Pricing_Page SHALL menampilkan FAQ Accordion dengan pertanyaan umum tentang pricing dan subscription
6. WHEN Guest_User mengklik item FAQ, THE FAQ_Accordion SHALL expand untuk menampilkan jawaban
7. THE Pricing_Page SHALL menampilkan CTA_Button "Mulai Gratis" dan "Upgrade ke Premium"
8. THE Pricing_Page SHALL menyertakan SEO_Meta_Tags untuk title dan description

### Requirement 3: About Page

**User Story:** Sebagai Guest_User, saya ingin mengetahui lebih lanjut tentang Japanlingo, metode pembelajaran, dan tim di baliknya, sehingga saya dapat membangun kepercayaan terhadap platform.

#### Acceptance Criteria

1. WHEN Guest_User mengakses URL `/about` atau `/tentang`, THE About_Page SHALL menampilkan Hero_Section dengan visi, misi, dan tagline inspiratif
2. THE About_Page SHALL menampilkan Metode Pembelajaran Section yang menjelaskan metode pembelajaran yang digunakan
3. THE About_Page SHALL menampilkan Tim Section dengan profile cards untuk team members yang berisi foto, nama, role, dan bio singkat
4. THE About_Page SHALL menampilkan Statistik Section dengan total users, total lessons, dan total quizzes
5. THE About_Page SHALL menampilkan animated counters untuk statistik yang increment dari 0 ke nilai aktual
6. THE About_Page SHALL menampilkan CTA_Button "Bergabung Sekarang"
7. THE About_Page SHALL menyertakan SEO_Meta_Tags untuk title dan description

### Requirement 4: Login Page

**User Story:** Sebagai Guest_User yang sudah memiliki akun, saya ingin login ke platform, sehingga saya dapat mengakses dashboard dan fitur pembelajaran.

#### Acceptance Criteria

1. WHEN Guest_User mengakses URL `/login`, THE Login_Page SHALL menampilkan Authentication_Form dengan field email dan password
2. THE Login_Page SHALL menampilkan checkbox "Ingat Saya" dan link "Lupa Password?"
3. WHEN Guest_User mengisi email dan password yang valid dan mengklik "Masuk", THE System SHALL mengautentikasi pengguna dan redirect ke dashboard sesuai role
4. WHEN pengguna dengan role student berhasil login, THE System SHALL redirect ke `/dashboard`
5. WHEN pengguna dengan role admin berhasil login, THE System SHALL redirect ke `/admin/dashboard`
6. WHEN pengguna dengan role superadmin berhasil login, THE System SHALL redirect ke `/superadmin/dashboard`
7. IF Guest_User mengisi credentials yang tidak valid, THEN THE Login_Page SHALL menampilkan Validation_Error "Email atau password salah"
8. THE Login_Page SHALL menampilkan link "Belum punya akun? Daftar" yang mengarah ke `/register`
9. THE Login_Page SHALL dilindungi oleh Throttle_Middleware yang membatasi maksimal 5 login attempts per menit per IP address
10. WHEN pengguna yang sudah login mengakses `/login`, THE Guest_Middleware SHALL redirect ke dashboard sesuai role

### Requirement 5: Register Page

**User Story:** Sebagai Guest_User yang belum memiliki akun, saya ingin mendaftar ke platform, sehingga saya dapat mulai belajar bahasa Jepang.

#### Acceptance Criteria

1. WHEN Guest_User mengakses URL `/register`, THE Register_Page SHALL menampilkan Authentication_Form dengan field username, email, password, dan confirm password
2. THE Register_Page SHALL menampilkan checkbox Terms & Conditions yang harus dicentang sebelum submit
3. WHEN Guest_User mengisi form dengan data valid dan mengklik "Daftar", THE System SHALL membuat user baru di database dengan role student
4. WHEN user baru berhasil dibuat, THE System SHALL redirect ke `/login` dengan success message
5. THE System SHALL memvalidasi bahwa email memiliki format valid dan unique di database
6. THE System SHALL memvalidasi bahwa password minimal 8 karakter dan match dengan confirm password
7. THE System SHALL memvalidasi bahwa username minimal 3 karakter dan unique di database
8. IF validasi gagal, THEN THE Register_Page SHALL menampilkan Validation_Error di bawah field yang bermasalah
9. THE Register_Page SHALL menampilkan link "Sudah punya akun? Masuk" yang mengarah ke `/login`
10. WHEN pengguna yang sudah login mengakses `/register`, THE Guest_Middleware SHALL redirect ke dashboard sesuai role

### Requirement 6: Forgot Password Page

**User Story:** Sebagai Guest_User yang lupa password, saya ingin meminta link reset password, sehingga saya dapat membuat password baru.

#### Acceptance Criteria

1. WHEN Guest_User mengakses URL `/forgot-password`, THE Forgot_Password_Page SHALL menampilkan Authentication_Form dengan field email
2. WHEN Guest_User mengisi email yang terdaftar dan mengklik "Kirim Link Reset", THE System SHALL membuat Password_Reset_Token dan menyimpannya di tabel password_reset_tokens
3. WHEN Password_Reset_Token berhasil dibuat, THE System SHALL mengirim email berisi link reset password ke email pengguna
4. WHEN email berhasil dikirim, THE Forgot_Password_Page SHALL menampilkan success message "Link reset password telah dikirim ke email Anda"
5. IF email tidak terdaftar di database, THEN THE System SHALL tetap menampilkan success message untuk alasan keamanan
6. THE Forgot_Password_Page SHALL menampilkan link "Kembali ke Login"
7. THE Forgot_Password_Page SHALL dilindungi oleh Throttle_Middleware yang membatasi maksimal 3 requests per menit per IP address

### Requirement 7: Reset Password Page

**User Story:** Sebagai Guest_User yang menerima link reset password, saya ingin membuat password baru, sehingga saya dapat login kembali ke akun saya.

#### Acceptance Criteria

1. WHEN Guest_User mengakses URL `/reset-password` dengan valid token, THE Reset_Password_Page SHALL menampilkan Authentication_Form dengan field email (pre-filled), new password, dan confirm new password
2. WHEN Guest_User mengisi password baru yang valid dan mengklik "Reset Password", THE System SHALL memvalidasi Password_Reset_Token
3. IF Password_Reset_Token valid dan belum expired, THEN THE System SHALL update password pengguna di database
4. WHEN password berhasil diupdate, THE System SHALL menghapus Password_Reset_Token dari database
5. WHEN password berhasil diupdate, THE System SHALL redirect ke `/login` dengan success message "Password berhasil direset"
6. THE System SHALL memvalidasi bahwa new password minimal 8 karakter dan match dengan confirm new password
7. IF Password_Reset_Token invalid atau expired, THEN THE Reset_Password_Page SHALL menampilkan error message "Link reset password tidak valid atau sudah expired"
8. THE Password_Reset_Token SHALL expired setelah 60 menit sejak dibuat

### Requirement 8: Responsive Design

**User Story:** Sebagai Guest_User yang mengakses platform dari berbagai perangkat, saya ingin semua halaman publik tampil dengan baik di perangkat saya, sehingga saya dapat mengakses informasi dengan nyaman.

#### Acceptance Criteria

1. THE System SHALL menerapkan Responsive_Design pada semua halaman publik dengan breakpoints: mobile (< 640px), tablet (640px - 1024px), desktop (> 1024px)
2. WHEN Guest_User mengakses halaman dari mobile device, THE System SHALL menampilkan layout single-column dengan navigation menu yang collapsible
3. WHEN Guest_User mengakses halaman dari tablet device, THE System SHALL menampilkan layout yang optimal untuk ukuran layar tablet
4. WHEN Guest_User mengakses halaman dari desktop device, THE System SHALL menampilkan layout multi-column dengan full navigation menu
5. THE System SHALL memastikan semua interactive elements (buttons, links, form fields) memiliki touch target minimal 44x44 pixels pada mobile device
6. THE System SHALL memastikan font size minimal 16px untuk body text pada semua perangkat
7. THE System SHALL memastikan images dan media menggunakan lazy loading untuk optimasi performa

### Requirement 9: Animations dan Transitions

**User Story:** Sebagai Guest_User, saya ingin melihat animasi dan transisi yang smooth pada halaman publik, sehingga pengalaman browsing saya lebih menyenangkan.

#### Acceptance Criteria

1. THE System SHALL menerapkan smooth transitions dengan durasi 200ms hingga 300ms pada hover states untuk buttons dan links
2. THE System SHALL menerapkan fade-in animation pada sections saat Guest_User scroll ke section tersebut
3. THE System SHALL menerapkan slide animation pada Testimonials Section slider
4. THE System SHALL menerapkan counter animation pada Statistik Section di About_Page
5. THE System SHALL menerapkan expand/collapse animation pada FAQ_Accordion dengan durasi 300ms
6. THE System SHALL memastikan semua animations dapat di-disable oleh pengguna yang mengaktifkan "prefers-reduced-motion" di browser settings

### Requirement 10: Accessibility Compliance

**User Story:** Sebagai Guest_User dengan disabilitas, saya ingin dapat mengakses dan menggunakan semua halaman publik dengan assistive technologies, sehingga saya tidak terkecualikan dari menggunakan platform.

#### Acceptance Criteria

1. THE System SHALL memenuhi standar WCAG_2_1_AA untuk semua halaman publik
2. THE System SHALL menyediakan alt text yang deskriptif untuk semua images
3. THE System SHALL memastikan color contrast ratio minimal 4.5:1 untuk normal text dan 3:1 untuk large text
4. THE System SHALL menyediakan keyboard navigation untuk semua interactive elements dengan visible focus indicators
5. THE System SHALL menggunakan semantic HTML elements (header, nav, main, section, footer, article)
6. THE System SHALL menyediakan ARIA labels untuk interactive elements yang tidak memiliki visible text
7. THE System SHALL memastikan form fields memiliki associated labels yang proper
8. THE System SHALL menampilkan error messages yang dapat diakses oleh screen readers
9. THE System SHALL memastikan modal dan dropdown dapat ditutup dengan keyboard (ESC key)

### Requirement 11: SEO Optimization

**User Story:** Sebagai pemilik platform, saya ingin halaman publik mudah ditemukan di search engines, sehingga lebih banyak calon pengguna dapat menemukan Japanlingo.

#### Acceptance Criteria

1. THE System SHALL menyertakan unique SEO_Meta_Tags (title, description) untuk setiap halaman publik
2. THE System SHALL menyertakan Open Graph tags untuk social media sharing pada semua halaman publik
3. THE System SHALL menggunakan semantic HTML structure dengan proper heading hierarchy (h1, h2, h3)
4. THE System SHALL menyertakan structured data (JSON-LD) untuk Organization dan WebSite pada Landing_Page
5. THE System SHALL generate sitemap.xml yang mencakup semua halaman publik
6. THE System SHALL menyertakan robots.txt yang mengizinkan crawling untuk halaman publik
7. THE System SHALL menggunakan canonical URLs untuk menghindari duplicate content
8. THE System SHALL memastikan semua internal links menggunakan descriptive anchor text

### Requirement 12: Performance Optimization

**User Story:** Sebagai Guest_User dengan koneksi internet terbatas, saya ingin halaman publik memuat dengan cepat, sehingga saya tidak perlu menunggu lama untuk melihat konten.

#### Acceptance Criteria

1. THE System SHALL memastikan First Contentful Paint (FCP) kurang dari 1.8 detik
2. THE System SHALL memastikan Largest Contentful Paint (LCP) kurang dari 2.5 detik
3. THE System SHALL memastikan Cumulative Layout Shift (CLS) kurang dari 0.1
4. THE System SHALL menggunakan image optimization dengan format modern (WebP) dan fallback ke JPEG/PNG
5. THE System SHALL menerapkan lazy loading untuk images yang berada di bawah fold
6. THE System SHALL minify CSS dan JavaScript files untuk production
7. THE System SHALL menggunakan code splitting untuk memuat hanya JavaScript yang diperlukan per halaman
8. THE System SHALL menggunakan browser caching dengan appropriate cache headers

### Requirement 13: Error Handling

**User Story:** Sebagai Guest_User, saya ingin melihat pesan error yang jelas dan helpful ketika terjadi kesalahan, sehingga saya tahu apa yang harus saya lakukan untuk memperbaikinya.

#### Acceptance Criteria

1. WHEN validation error terjadi pada Authentication_Form, THE System SHALL menampilkan Validation_Error di bawah field yang bermasalah dengan warna merah
2. THE Validation_Error SHALL menjelaskan secara spesifik apa yang salah (contoh: "Email sudah terdaftar", "Password minimal 8 karakter")
3. WHEN network error terjadi, THE System SHALL menampilkan error message "Terjadi kesalahan koneksi. Silakan coba lagi."
4. WHEN server error terjadi, THE System SHALL menampilkan error message "Terjadi kesalahan pada server. Silakan coba lagi nanti."
5. IF Guest_User mengakses halaman yang tidak ada, THEN THE System SHALL menampilkan 404 page dengan link kembali ke Landing_Page
6. THE System SHALL log semua errors ke server untuk debugging purposes
7. THE System SHALL tidak menampilkan technical error details kepada Guest_User untuk alasan keamanan

### Requirement 14: Security

**User Story:** Sebagai pemilik platform, saya ingin memastikan halaman autentikasi aman dari serangan, sehingga data pengguna terlindungi.

#### Acceptance Criteria

1. THE System SHALL menggunakan CSRF protection pada semua Authentication_Form
2. THE System SHALL hash password menggunakan bcrypt sebelum menyimpan ke database
3. THE System SHALL menggunakan Throttle_Middleware pada Login_Page untuk mencegah brute force attacks
4. THE System SHALL menggunakan Throttle_Middleware pada Forgot_Password_Page untuk mencegah email flooding
5. THE System SHALL generate Password_Reset_Token yang cryptographically secure dan unique
6. THE System SHALL memvalidasi dan sanitize semua user input untuk mencegah XSS attacks
7. THE System SHALL menggunakan HTTPS untuk semua komunikasi antara client dan server
8. THE System SHALL set secure dan httpOnly flags pada session cookies
9. THE System SHALL implement rate limiting pada API endpoints yang digunakan oleh halaman publik
