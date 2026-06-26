# Prioritas Pekerjaan Japanlingo

Dokumen ini berisi urutan pekerjaan yang harus dikerjakan lebih dulu.
Fokusnya adalah menyelesaikan hal yang paling penting untuk beta test, bukan menambah fitur acak.

## Aturan Prioritas

Kerjakan dari atas ke bawah.
Jangan lompat ke fitur baru sebelum bagian di atasnya stabil.

Kategori prioritas:

- `P0` = wajib selesai untuk beta
- `P1` = penting, dikerjakan setelah `P0`
- `P2` = bisa ditunda setelah beta

## P0 - Wajib Dikerjakan Dulu

### 1. Stabilkan Flow User

Target:
user bisa memakai platform tanpa bingung dan tanpa error besar.

Yang dikerjakan:

- cek dashboard user
- cek daftar flashcard user
- cek latihan flashcard user
- cek daftar kuis user
- cek kerjakan kuis user
- cek progress user
- cek premium preview user
- cek redirect dan route antar page user

Selesai jika:

- tidak ada error 500
- tidak ada halaman kosong tanpa penjelasan
- user tahu harus klik apa setelah login

### 2. Rapikan Flashcard Sebagai Inti Belajar

Target:
flashcard menjadi salah satu pusat pengalaman belajar.

Yang dikerjakan:

- audit halaman flashcard admin
- audit halaman flashcard user
- pastikan alur dari daftar ke latihan jelas
- pastikan data flashcard tampil konsisten
- tentukan mana yang menjadi library kosakata
- rapikan UI jika masih membingungkan

Selesai jika:

- admin bisa mengelola flashcard
- user bisa membuka dan memakai flashcard
- flow flashcard terasa seperti fitur utama, bukan fitur tempelan

### 3. Rapikan Kuis dan Hubungannya Dengan Progress

Target:
kuis benar-benar menjadi loop latihan utama.

Yang dikerjakan:

- cek daftar kuis
- cek halaman kerjakan kuis
- cek submit attempt
- cek penyimpanan jawaban
- cek update progress, XP, atau status selesai
- pastikan hasil kuis tidak putus dari dashboard/progress

Selesai jika:

- user bisa mengerjakan kuis sampai selesai
- hasil tersimpan
- progress ikut berubah

### 4. Premium Preview Flow

Target:
user gratis dan premium punya perbedaan akses yang jelas.

Yang dikerjakan:

- cek page yang harus terkunci
- cek preview untuk user free
- cek tombol upgrade atau redeem
- cek access key flow
- rapikan pesan locked/premium

Selesai jika:

- user free tidak bisa masuk full content premium
- user premium bisa masuk normal
- user free tahu cara upgrade atau redeem

### 5. Presentasi Admin + Share

Target:
presentasi dipakai admin sebagai alat ajar dan bisa dibagikan.

Yang dikerjakan:

- cek builder presentasi admin
- cek mode presentasi
- tentukan flow share paling sederhana
- pastikan user hanya sebagai viewer
- rapikan UI jika masih tumpang tindih atau membingungkan

Selesai jika:

- admin bisa membuat/mengelola presentasi
- presentasi bisa dibuka lewat link atau akses yang jelas
- user tidak perlu edit presentasi

## P1 - Dikerjakan Setelah P0 Stabil

### 6. Kelas / Kloter User

Target:
admin bisa mengelompokkan user seperti kelas/room.

Yang dikerjakan:

- definisikan bentuk kloter atau kelas
- buat alur assign user ke kelas
- tentukan relasi kelas ke quiz/flashcard/presentasi
- buat monitoring progress sederhana per kelas

Selesai jika:

- admin bisa membuat kelas
- admin bisa memasukkan user ke kelas
- kelas punya isi atau assignment yang jelas

### 7. Mass Input Admin

Target:
mempercepat input konten tanpa satu-satu.

Yang dikerjakan:

- cek import CSV/XLSX yang sudah ada
- rapikan format template
- tentukan mana yang diprioritaskan: flashcard, quiz, atau kosakata
- rapikan feedback error saat import gagal

Selesai jika:

- admin bisa import data tanpa bingung
- format file jelas
- error import mudah dipahami

### 8. Data Demo Untuk Beta

Target:
versi beta tidak terlihat kosong.

Yang dikerjakan:

- isi flashcard demo
- isi quiz demo
- isi presentasi demo
- isi user premium dan free demo
- cek berita/dashboard jika perlu

Selesai jika:

- client bisa test tanpa harus input data dulu
- flow utama terlihat hidup

## P2 - Tahan Dulu

Jangan dikerjakan sebelum `P0` dan `P1` stabil:

- OCR PDF/PPT gambar
- payment gateway production penuh
- redesign semua halaman sekaligus
- refactor total struktur project
- SEO
- branding final
- fitur tambahan di luar flow beta

## Urutan Eksekusi Yang Disarankan

1. `Flow user`
2. `Flashcard`
3. `Kuis`
4. `Premium preview`
5. `Presentasi + share`
6. `Kelas/kloter`
7. `Mass input`
8. `Data demo`

## Cara Pakai Dokumen Ini

Sebelum mengerjakan task baru:

1. cek apakah task masuk `P0`, `P1`, atau `P2`
2. jika tidak mendukung beta, tahan dulu
3. selesaikan satu blok penuh sebelum pindah ke blok berikutnya

Dokumen ini dipakai sebagai filter agar project tidak makin melebar.
