# Interpretasi Terbaru Request Client - Japanlingo V2

Tanggal catatan: 2026-06-30

## Ringkasan Inti

Client mengarah ke konsep belajar mingguan seperti Duolingo/Quizizz, bukan LMS dengan halaman materi baca terpisah. Istilah "modul" lebih tepat dimaknai sebagai program mingguan yang menggabungkan flashcard sebagai materi, kuis sebagai evaluasi, dan gamifikasi sebagai progress.

Alur utama user:

```text
Dashboard user
-> roadmap modul mingguan
-> flashcard materi
-> kuis/game
-> feedback, XP/poin, progress
-> unlock modul/week berikutnya
```

## Private Page User

- Progress belajar.
- Modul terbaru.
- Jadwal Zoom: hold.
- Quick access quiz.
- Modul page.

## Request Client Yang Baru Dipahami

### Modul dan Kuis Mingguan

- Modul dan kuis dibuat berdasarkan intensitas mingguan.
- Materi/modul direcap menjadi satu minggu.
- Satu minggu dianggap satu tier/modul.
- Asumsi saat ini: "modul" = Week 1, Week 2, dst, berisi flashcard materi dan kuis.

### Roadmap dan Tampilan

- Roadmap setelah login dibuat seperti Duolingo.
- Entry awal user masuk ke module/roadmap.
- Gradasi visual disamakan dengan `theme.js` pada landing page.

### Gamifikasi dan Akses

- Key access/game dikendalikan oleh Mas Fuad.
- Repetisi belajar mengambil referensi Kanji Senpai dan Duolingo.
- Perlu XP/poin.
- Perlu feedback untuk menentukan user bisa lanjut materi berikutnya atau tidak.
- Free user hanya preview Week 1, bukan trial 7 hari.
- Premium/key access membuka konten lanjutan sesuai kloter.

### Admin

- Display admin untuk tambah modul mengarah ke Quizizz/Google Form.
- Admin perlu edit soal dan materi.
- Admin perlu membuat key access untuk membuka materi per kloter.
- Kloterisasi user berdasarkan tanggal dan bulan mulai belajar.
- Perlu mass input via Excel/CSV.

### Flashcard dan Kosakata

- Flashcard adalah bentuk materi.
- Materi dari Drive dipakai untuk digamifikasi.
- Flashcard berlaku untuk kosakata, bukan hanya kanji.
- Perlu library kosakata.
- Asumsi saat ini: kosakata fokus Jepang N3.
- Kanji Bank tidak dipakai sebagai menu utama; diganti/diarahkan ke library kosakata Jepang.

### PPT / Presentasi

- Fitur PPT seperti Quizizz: keep, tetapi sebagian masih mayland/deferred.
- Admin perlu bisa share PPT ke web user.
- User tidak perlu edit PPT.

### Kelas

- Perlu fitur kelas seperti Quizizz.
- Detail isi kelas belum jelas.
- Asumsi sementara: kelas dipakai untuk grouping/kloter user dan akses materi.

### Pembayaran

- Payment gateway dalam negeri dan QRIS.
- Implementasi teknis memakai Midtrans.

## Tugas Yang Harus Jadi

- Hilangkan page materi dari pengalaman user utama, tetapi backend/frontend lama boleh keep hidden/deferred sementara.
- Modul user harus menjadi roadmap mingguan yang menggabungkan flashcard materi dan kuis.
- Admin ditambahkan flow tambah/edit flashcard materi yang lebih mudah.
- Tambahkan library kosakata Jepang N3.
- Gabungkan page flashcard materi dan modul menjadi satu experience.
- Desain roadmap setelah login mengikuti arah `Roadmap.jsx`.
- Tambahkan page kelas seperti Quizizz.
- Buang/hidden Kanji Bank dari admin/user utama, replace dengan kosakata library.
- Perbaiki admin untuk membuat key access yang membuka materi per kloter.
- Tambahkan fitur share PPT dari admin ke user.

## Asumsi Saat Ini

- Modul = minggu belajar.
- Satu modul/week berisi flashcard materi dan kuis.
- Kosakata awal hanya N3.
- PPT bisa dibuat/dikelola admin lalu dibagikan ke user.
- Fitur kelas kemungkinan untuk kloter/group belajar, tetapi detail isi masih perlu dikonfirmasi.

## Hal Yang Masih Perlu Dikonfirmasi

- Aturan unlock modul berikutnya: cukup selesai kuis atau harus skor minimal.
- Detail "kelas" seperti Quizizz: grouping user, live room, tugas, atau dashboard kelas.
- Format mass input Excel/CSV untuk modul, flashcard, kuis, dan kosakata.
- Apakah key access per kloter membuka semua Week setelah kloter dimulai atau hanya modul tertentu.
- Apakah PPT share bersifat public link, hanya user login, atau hanya user dalam kloter tertentu.
