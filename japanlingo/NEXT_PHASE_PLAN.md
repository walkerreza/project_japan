# Japanlingo Next Phase Plan

Dokumen ini dipakai sebagai acuan fase kerja berikutnya agar scope project tidak melebar tanpa arah.
Fokus utamanya adalah merapikan produk menjadi platform belajar Jepang berbasis gamifikasi yang siap beta test.

## Product Direction

Japanlingo bukan lagi sekadar website materi.
Arahnya adalah platform belajar JLPT N3 dengan loop utama:

`dashboard -> flashcard/kosakata -> quiz -> progress -> upgrade`

Materi tetap ada, tetapi untuk fase ini statusnya sebagai pendukung, bukan pusat pengalaman belajar.

## Ringkasan Yang Client Mau

- Beta test diupayakan tersedia akhir Juni.
- Deadline besar tetap Agustus.
- Presentasi hanya admin yang bisa edit.
- Presentasi perlu fitur share.
- Flashcard perlu library kosakata, bukan hanya selingan kuis.
- Perlu fitur kelas/room seperti Quizizz.
- Admin boleh mass input memakai CSV/Excel.
- Materi standalone dipending dulu.
- User non-premium hanya mendapat preview yang tidak lengkap.
- Payment cukup Indonesia dan QRIS untuk fase awal.
- Design dianggap cukup, boleh dirapikan lagi.
- Logo dan copywriting menyusul setelah beta test.
- Setelah client test sendiri, kemungkinan akan ada revisi fitur tambahan.

## Masalah Project Saat Ini

- Scope fitur sudah terlalu lebar: materi, kuis, flashcard, presentasi, board, admin, superadmin, payment, news, theme.
- Beberapa flow sudah ada tetapi belum menyatu menjadi satu pengalaman belajar yang jelas.
- Ada risiko menambah fitur terus tanpa menyelesaikan flow yang paling penting untuk beta.
- Dokumentasi kerja fase aktif belum ada di dalam root project.

## Prioritas Fase Berikutnya

### 1. Beta Stabilization

Tujuan:
menyiapkan versi yang layak diuji client tanpa menambah terlalu banyak fitur baru.

Kerjaan:

- audit route dan halaman untuk role `user`, `admin`, dan `superadmin`
- fix bug UI/UX yang mengganggu flow utama
- pastikan data demo cukup untuk presentasi
- pastikan semua page utama bisa dibuka tanpa error
- rapikan wording yang masih dummy atau membingungkan

### 2. Core Learning Flow

Tujuan:
mengubah user flow agar sesuai keinginan client, yaitu belajar yang menyatu dengan gamifikasi.

Kerjaan:

- jadikan `Flashcard` dan `Kuis` sebagai inti belajar
- jadikan `Materi` sebagai pendukung atau preview, bukan halaman utama yang berdiri sendiri
- sinkronkan progress, XP, dan status selesai dengan aktivitas user
- pastikan dashboard user menampilkan aksi berikutnya dengan jelas

### 3. Flashcard Library

Tujuan:
menyediakan bank kosakata/kanji yang bisa dipakai user untuk belajar berulang.

Kerjaan:

- admin membuat dan mengelola set flashcard
- user melihat daftar flashcard per topik/modul/level
- user bisa review kosakata dengan status sederhana seperti belum belajar, sedang belajar, paham
- hubungkan flashcard ke progress atau reward log bila relevan

### 4. Presentation Sharing

Tujuan:
menjadikan presentasi sebagai alat ajar admin, bukan editor untuk user.

Kerjaan:

- admin membuat dan mengedit presentasi
- user hanya membuka mode view
- tambahkan mekanisme share link atau akses dari kelas
- pastikan presentasi tidak bentrok dengan board ajar

### 5. Class / Cohort System

Tujuan:
memenuhi kebutuhan client tentang kloterisasi user dan kelas seperti Quizizz.

Kerjaan:

- admin bisa membuat kelas/kloter
- admin bisa memasukkan user ke kelas
- kelas bisa punya assignment sederhana: flashcard, quiz, atau presentasi
- admin bisa melihat progress user per kelas

### 6. Premium Preview

Tujuan:
membedakan user free dan premium tanpa menunggu payment gateway penuh.

Kerjaan:

- user free hanya melihat preview konten tertentu
- user premium mendapat akses penuh
- arahkan user free ke upgrade atau redeem access key
- pertahankan payment flow manual atau QRIS sebagai MVP

## Scope Yang Ditahan Dulu

Jangan dikerjakan di fase ini kecuali benar-benar dibutuhkan untuk beta:

- OCR mass import dari PDF/PPT berbasis gambar
- payment gateway production penuh
- refactor total semua builder
- redesign total semua halaman sekaligus
- SEO publik lanjutan
- copywriting dan branding final

## Urutan Kerja Yang Disarankan

1. Stabilkan flow `user` untuk demo dan beta.
2. Rapikan `flashcard` dan `quiz` agar menjadi inti produk.
3. Selesaikan `presentasi + share`.
4. Tambahkan `kelas/kloter`.
5. Kunci `premium preview` dan alur upgrade.
6. Setelah itu baru masuk payment production, deploy, dan hardening.

## Definition of Beta Ready

Versi beta dianggap siap jika kondisi berikut terpenuhi:

- user bisa login, belajar, membuka flashcard, mengerjakan quiz, dan melihat progress
- admin bisa menambah atau mengelola konten inti tanpa error besar
- presentasi bisa dibuka dan dibagikan
- kelas/kloter minimal sudah ada bentuk operasional dasarnya
- premium preview sudah terlihat jelas perbedaannya
- tidak ada error route, 500, atau page kosong pada flow utama

## Catatan Komersial

Harga yang sudah pernah disebut ke client untuk fase ini adalah sekitar `Rp 8-9 juta`.
Harga itu sebaiknya diposisikan untuk:

- scope fase beta/MVP saat ini
- belum termasuk hosting production
- belum termasuk SMTP, SSL, dan hardening deployment
- belum termasuk payment gateway production penuh
- bisa berubah jika ada fitur baru di luar prioritas fase ini

## Prinsip Kerja Lanjutan

- Jangan tambah fitur baru sebelum flow utama selesai.
- Setiap fitur baru harus masuk salah satu kategori: `beta critical`, `post-beta`, atau `pending`.
- Jika client memberi request baru, cek dulu apakah request itu mengubah core flow atau hanya tambahan kosmetik.
- Semua perubahan berikutnya sebaiknya mengikuti dokumen ini agar project tidak kembali melebar.
