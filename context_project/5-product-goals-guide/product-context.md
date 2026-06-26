# Product Goals Base Context

JapanLingo adalah website pembelajaran bahasa Jepang berbasis gamifikasi. Target awal adalah JLPT N3.

Dokumen ini menjadi patokan arah produk. Jangan dipakai sebagai kritik atau saran bebas.

## Visi Produk

Membangun platform belajar bahasa Jepang seperti Duolingo, tetapi fokus pada kebutuhan kelas Jepang milik client.

Referensi utama:

- Duolingo: learning path, progress, streak, XP, gamification.
- Kanji Senpai: flashcard/review kosakata dan kanji.
- Quizizz: admin builder, kuis, presentasi, kelas.
- Canva: gaya landing page/public page.
- Riki Jepang: referensi isi/copy homepage, bukan struktur teknis.

## Target Utama

- Membantu siswa belajar JLPT N3 secara terstruktur.
- Membuat materi N3 dari Drive menjadi pengalaman gamified.
- Mengurangi kebutuhan halaman materi statis yang panjang.
- Membuat admin/sensei mudah membuat konten, kuis, flashcard, dan presentasi.
- Membuat superadmin bisa mengelola platform, user, admin, berita, pembayaran, dan sistem.
- Menyiapkan beta test sebelum rilis penuh.

## Role Produk

Guest:

- Melihat landing page, pricing, about, roadmap.
- Login/register.
- Diarahkan ke WhatsApp atau register jika ingin ikut kelas.

User/Siswa:

- Belajar lewat roadmap/gamified path.
- Mengerjakan kuis.
- Mendapat XP, progress, dan sertifikat.
- Review flashcard/kosakata.
- Melihat berita/platform update.
- Mengakses konten premium jika punya akses.

Admin/Sensei:

- Membuat dan mengelola modul, lesson, quiz, question.
- Import massal CSV/Excel untuk soal/kosakata.
- Membuat flashcard set dan vocabulary library.
- Membuat presentasi seperti Quizizz.
- Share presentasi ke user.
- Melihat analytics siswa.
- Mengelola user dalam scope kelas/kloter jika fitur classroom dibuat.

Superadmin:

- Mengelola semua user dan admin.
- Mengelola berita/news portal.
- Mengelola payment plan, transaksi manual/QRIS, dan access key.
- Mengelola tema global.
- Melihat activity log dan sistem.

## Product Scope Saat Ini

Fokus produk sekarang adalah beta platform belajar N3.

Wajib stabil:

- Auth dan role access.
- Dashboard user.
- Learning path/roadmap.
- Quiz flow dan submit attempt.
- Attempt answers dan analytics dasar.
- XP/progress/certificate.
- Flashcard dan vocabulary library.
- Premium preview vs full access.
- Admin content builder.
- Admin quiz builder.
- Admin import CSV/Excel.
- Admin presentation builder.
- Presentation share/view.
- Superadmin users/admin/news/payment/system.

## Materi Dan Konten

Keputusan client:

- Materi utama dari Google Drive digunakan untuk digamifikasi.
- Tidak perlu fokus ke halaman materi panjang dulu.
- Materi standalone boleh tetap ada, tapi bukan inti produk beta.
- Flashcard dipakai untuk kanji dan kosakata.
- Library yang diminta client cukup kosakata dulu.
- Flashcard harus bisa nyambung ke game/quiz.
- User perlu diberi kosakata baru sebagai selingan sebelum/di tengah kuis.

## Gamification Goal

Gamifikasi harus membuat user belajar bertahap, bukan hanya membaca materi.

Elemen inti:

- XP.
- Progress per lesson/quiz.
- Unlock materi berikutnya setelah lulus.
- Streak jika sudah stabil.
- Flashcard review: `new`, `known`, `learning`.
- Feedback setelah menjawab soal.
- Certificate setelah target selesai.

Aturan produk:

- User lanjut ke materi berikutnya jika syarat sebelumnya lulus.
- Free user hanya mendapat preview tidak lengkap.
- Premium user mendapat akses penuh.

## Flashcard Goal

Flashcard adalah fitur inti, bukan page tambahan yang berdiri sendiri tanpa koneksi.

Harus mendukung:

- Kosakata Jepang.
- Reading/hiragana.
- Arti Indonesia/English jika tersedia.
- Contoh kalimat.
- Audio jika tersedia.
- Status review user.
- Import massal dari CSV/Excel.
- Generate kuis dari vocabulary/flashcard.

UX:

- Simple dan cepat.
- Tidak terlalu gemuk.
- User memilih paham/tidak paham.
- Flashcard dapat muncul sebagai selingan di quiz.

## Presentation Goal

Presentasi dibuat untuk admin/sensei, user hanya melihat.

Keputusan client:

- Editor presentasi cukup admin.
- User tidak perlu edit presentasi.
- Perlu fitur share.
- Modelnya mirip presentasi Quizizz.
- Board/jamboard digabung ke slide presentasi, bukan fitur terpisah yang membingungkan.
- Import PPTX boleh didukung, tetapi editor internal tetap harus bisa dipakai.

## Classroom/Kloter Goal

Client meminta kemungkinan setiap admin punya akses untuk kloterisasi user.

Arah produk:

- Admin bisa punya classroom/kloter.
- Admin hanya mengatur siswa dalam kloternya.
- Classroom bisa berisi user, assignment quiz, flashcard, presentation, atau roadmap tertentu.
- Superadmin bisa melihat semua classroom.

Status:

- Fitur ini penting setelah beta dasar stabil.

## Premium And Payment Goal

Keputusan client:

- Payment gateway penuh belum wajib untuk beta.
- Client ingin coba tanpa payment gateway dulu.
- Pembayaran cukup dalam negeri dan QRIS.
- Access key tetap penting karena client ingin kendali akses ada di tangan admin/superadmin.
- Non-premium hanya preview materi tidak lengkap.

Arah implementasi:

- Beta: manual transaction + access key.
- Setelah stabil: QRIS/payment gateway.
- Hosting, SSL, SMTP, dan payment production dihitung terpisah dari scope fitur.

## Public Pages Goal

Halaman publik harus mendukung penjualan kelas dan branding.

Isi:

- Landing page.
- Pricing page.
- About page.
- Roadmap page.
- Login/register.

Landing page:

- Referensi visual dari Canva.
- Konten/copy mengikuti kebutuhan kelas Jepang client.
- CTA ke register atau WhatsApp.

Roadmap:

- Referensi Duolingo desktop.
- Tema warna bisa disesuaikan: autumn, spring/sakura, winter/snow, summer/festival.

## Admin Experience Goal

Admin harus mudah input konten.

Prioritas UX admin:

- Builder sederhana seperti Quizizz/Google Form.
- Import massal untuk soal dan vocabulary.
- Template resmi untuk CSV/Excel.
- Form tidak terlalu panjang dan tidak membingungkan.
- Preview sebelum publish.
- Error import harus jelas.

## Out Of Scope Untuk Beta

Jangan prioritaskan ini sebelum core stabil:

- SEO penuh.
- Payment gateway production.
- Meeting/Zoom internal.
- OCR massal dari gambar PDF/PPT.
- Full document lesson viewer yang terlalu kompleks.
- Mobile app native.
- N5/N4/N2/N1.

## Beta Target

Client berharap beta test akhir Juni 2026 jika memungkinkan. Deadline besar tetap Agustus 2026.

Beta dianggap siap jika:

- User bisa login dan belajar flow utama.
- Admin bisa membuat quiz/flashcard/presentation tanpa edit database manual.
- Superadmin bisa mengelola akses premium manual.
- Free vs premium berjalan.
- Quiz submit, XP, progress, dan flashcard review stabil.
- Bug blocker tidak muncul pada user flow utama.

## Product Priority Order

1. Stabilkan auth, role, dashboard, dan navigation.
2. Stabilkan quiz submit, attempt answers, progress, XP.
3. Stabilkan flashcard/vocabulary library dan integrasi ke quiz.
4. Stabilkan admin builder dan mass import.
5. Stabilkan premium preview dan access key.
6. Stabilkan presentation builder dan share.
7. Stabilkan superadmin news/payment/system.
8. Tambahkan classroom/kloter admin.
9. Siapkan deployment VPS dan beta test.
