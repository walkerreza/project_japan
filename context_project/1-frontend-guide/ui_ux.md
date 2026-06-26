# Frontend UI/UX Guide

Dokumen ini menjelaskan arah UI/UX Japanlingo.
Gunakan file ini saat mengubah tampilan, memperbaiki responsive issue, atau merombak flow user/admin.

## Product UX Direction

Japanlingo adalah platform belajar bahasa Jepang berbasis gamifikasi.
Pengalaman user harus terasa seperti belajar bertahap, bukan membaca dokumen panjang.

Referensi arah produk:

- Duolingo: progression, streak, XP, quiz loop, habit-forming flow
- Kanji Senpai: flashcard ringkas, repetisi, kanji/kosakata practice
- Quizizz: admin/class/quiz workflow
- Canva: referensi landing page, bukan keseluruhan aplikasi internal

## Core User Experience

Flow utama yang perlu diprioritaskan:

`Beranda -> Flashcard/Kosakata -> Kuis -> Progress -> Upgrade`

Implikasi UX:

- Dashboard user harus memberi next action yang jelas.
- Flashcard dan kuis harus terlihat sebagai fitur utama.
- Materi standalone tidak perlu dipaksa menjadi pusat experience untuk fase beta.
- Premium lock harus menjelaskan apa yang terkunci dan apa langkah user berikutnya.
- Progress, XP, streak, dan certificate harus membantu user memahami perkembangan belajar.

## UI Character by Role

### Public / Guest

Karakter:

- lebih visual dan marketing oriented
- cocok memakai visual Jepang, JLPT, kelas, testimoni, pricing, dan CTA
- landing mengikuti feel Canva-style, tetapi isi tetap Japanlingo

Halaman:

- landing page
- pricing
- about
- roadmap
- login/register

Catatan:

- Branding final, logo, dan copywriting masih menunggu client setelah beta test.
- Jangan mengunci banyak copywriting sebagai final.

### User / Siswa

Karakter:

- playful tetapi tetap jelas
- fokus pada belajar harian dan progres
- boleh lebih gamified dibanding admin

Elemen penting:

- XP
- progress
- streak
- flashcard status
- quiz status
- locked/premium state
- certificate

Catatan:

- Page `Materi` boleh tetap ada, tetapi harus mendukung gamifikasi.
- Jangan membuat user bingung antara `Materi`, `Flashcard`, dan `Kuis`.
- Jika ada konten premium, user free harus tetap melihat preview/ringkasan agar tahu value upgrade.

### Admin / Sensei

Karakter:

- operational dan padat informasi
- mirip tool kerja, bukan landing page
- flow input konten harus cepat dan jelas

Elemen penting:

- tabel data
- builder quiz
- builder materi
- flashcard/kosakata management
- kanji bank
- import CSV/XLSX
- presentasi builder
- analitik user/question performance

Catatan:

- Client pernah menyebut referensi Quizizz dan Google Form untuk admin.
- UI admin harus membantu sensei membuat konten tanpa input satu per satu terlalu banyak.
- Jangan membuat admin page terlalu dekoratif sampai mengganggu pekerjaan.

### Superadmin

Karakter:

- monitoring dan kontrol platform
- lebih utilitarian daripada playful

Elemen penting:

- user/admin management
- news/content
- payment/manual premium
- access key
- global theme
- activity/system monitoring

Catatan:

- Superadmin bukan sensei utama.
- Superadmin fokus pada pengelolaan sistem dan bisnis.

## Responsive Rules

Semua page harus aman di:

- mobile
- tablet
- desktop

Area yang wajib dicek manual:

- sidebar authenticated layout
- admin builder
- superadmin content editor
- quiz builder
- content editor
- flashcard latihan
- user lesson/quiz page
- login/register

Bug historis yang harus dicegah:

- konten tertutup sidebar
- editor terlalu lebar di desktop
- toolbar editor overlap
- teks hilang di light mode atau dark mode
- card terlalu gemuk di mobile
- button text meluber
- table tidak bisa dibaca di mobile

## Dark Mode and Color Contrast

Aturan:

- Teks penting tidak boleh bergantung pada warna theme tanpa fallback.
- Light mode harus dicek terpisah dari dark mode.
- Jika memakai gradient/theme background, letakkan teks di area dengan kontras yang jelas.
- Jangan pakai class dynamic dari token theme jika token tersebut bukan class Tailwind lengkap.

Risiko yang pernah muncul:

- token `heroBg` dan `ctaBg` berupa gradient stops, bukan class lengkap
- token warna hex pernah dipakai sebagai class Tailwind
- light mode pernah membuat teks tampak putih dan tidak terbaca

## Builder UX

Builder adalah area paling rawan bug karena banyak state, form, editor, import, dan item dinamis.

Builder yang perlu perhatian:

- `Admin/ModulMateri/BuilderMateri.jsx`
- `Admin/Kuis/BuilderKuis.jsx`
- `Admin/Flashcard/BuilderFlashcard.jsx`
- `Admin/Presentasi/BuilderPresentasi.jsx`
- `SuperAdmin/Konten/Konten.jsx`

Aturan:

- tambah/hapus item tidak boleh membuat editor crash
- import harus memberi pesan error yang bisa dimengerti admin
- template CSV/XLSX harus jelas
- preview harus dekat dengan hasil yang dilihat user
- action utama harus terlihat tanpa scroll berlebihan
- jangan membuat form terlalu panjang tanpa grouping

## Flashcard UX

Flashcard adalah fitur inti untuk fase berikutnya.

Target UX:

- ringkas
- cepat dipakai
- cocok untuk kosakata dan kanji
- ada status belajar sederhana
- terasa seperti repetisi, bukan hanya daftar data

Status yang ideal:

- belum belajar
- sedang belajar
- paham

Catatan:

- Client meminta cukup kosakata untuk kamus/library awal.
- Kanji tetap relevan karena scope JLPT N3, tetapi library kosakata lebih prioritas untuk beta.
- Flashcard juga bisa muncul sebagai selingan di kuis jika flow sudah stabil.

## Quiz UX

Quiz adalah bagian dari learning loop.

Target UX:

- soal mudah dibaca
- opsi jelas
- progress pengerjaan terlihat
- submit tidak membingungkan
- hasil tersimpan dan terlihat efeknya pada progress/XP

Catatan:

- Jangan membuat quiz hanya sebagai form biasa.
- Quiz harus terasa sebagai aktivitas belajar utama.
- Jika ada flashcard selingan, tampilkan sebagai learning moment singkat, bukan page terpisah yang memutus flow.

## Presentation UX

Client meminta fitur presentasi seperti Quizizz/PowerPoint ringan.

Keputusan:

- admin yang membuat dan mengedit
- user hanya membuka view/share
- fitur share diperlukan

Aturan UX:

- builder presentasi harus fokus pada editing slide
- mode presentasi harus bersih dan fullscreen-friendly
- user view tidak perlu kontrol edit
- board ajar bisa terkait presentasi, tetapi jangan membuat navigasi menjadi rumit

## Premium UX

User free harus tetap mendapat gambaran value.

Aturan:

- tampilkan preview yang tidak lengkap
- jelaskan kenapa konten terkunci
- sediakan CTA upgrade/redeem
- jangan arahkan user ke halaman kosong
- bedakan premium lock dengan locked karena progress

Label yang perlu konsisten:

- `Premium`
- `Preview`
- `Terkunci`
- `Redeem Access Key`
- `Upgrade`

## Admin Data Entry UX

Masalah utama admin adalah input konten terlalu melelahkan.

Prioritas UX:

- mass input CSV/XLSX
- template download yang jelas
- preview hasil import
- error import yang spesifik
- bulk reorder jika dibutuhkan

Catatan:

- OCR PDF/PPT gambar ditahan dulu.
- Import dokumen boleh ada, tetapi jangan dijadikan solusi utama jika hasilnya tidak stabil.

## Known UI Risks

Risiko yang harus dicek sebelum beta:

- route benar tetapi page kosong karena data demo belum ada
- user bingung harus mulai dari materi, flashcard, atau kuis
- admin builder terlalu kompleks
- superadmin terlalu banyak menu tanpa konteks
- premium lock terasa seperti error
- mobile layout memanjang tanpa prioritas aksi
- dark mode dan light mode tidak konsisten

## Beta UI Checklist

Minimal sebelum beta:

- user dashboard jelas
- flashcard user bisa dipakai
- quiz user bisa diselesaikan
- progress user berubah setelah aktivitas
- premium preview terlihat jelas
- admin bisa membuat/mengelola konten inti
- presentasi admin bisa dibuka
- superadmin bisa membuka menu utama tanpa UI pecah
- semua page utama aman di desktop dan mobile

## Design Constraints

Jangan lakukan ini sebelum beta stabil:

- redesign total semua role sekaligus
- mengganti layout authenticated secara besar
- membuat theme system baru
- membuat visual terlalu ramai di admin/superadmin
- menambah animasi yang tidak membantu workflow
- membuat page baru jika page existing bisa diperbaiki

## Source Notes

Dokumen ini disusun dari:

- source code `japanlingo/resources/js`
- `file_md/project-structure-map.md`
- `file_md/japanlingo-colaboration.md`
- `file_md/project-qa-checklist.md`
- chat client di `context_project/Chat WhatsApp dengan Fuad (Jepang)`
