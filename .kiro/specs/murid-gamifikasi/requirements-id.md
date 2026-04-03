# Dokumen Kebutuhan: Sistem Gamifikasi

## Pendahuluan

Sistem Gamifikasi meningkatkan keterlibatan pengguna di platform pembelajaran bahasa Jepang Japanlingo melalui poin pengalaman, level, streak, pencapaian, dan sertifikat. Sistem ini memotivasi pelajar dengan menyediakan indikator kemajuan yang nyata dan hadiah untuk kebiasaan belajar yang konsisten serta pencapaian milestone.

## Glosarium

- **XP_System**: Komponen pelacakan poin pengalaman dan progresi level
- **Streak_Tracker**: Komponen yang memantau hari berturut-turut aktivitas pengguna
- **Achievement_Manager**: Komponen yang mengevaluasi dan membuka pencapaian
- **Certificate_Generator**: Komponen yang membuat dan mengelola sertifikat level JLPT
- **User**: Pelajar terdaftar di platform Japanlingo
- **Activity**: Setiap aksi pengguna yang berkontribusi pada XP atau streak (penyelesaian pelajaran, kuis, login harian)
- **Level**: Tingkatan progresi berdasarkan XP yang terkumpul
- **Streak**: Hari berturut-turut aktivitas platform
- **Achievement**: Milestone yang telah ditentukan dengan kondisi pembukaan dan hadiah
- **Certificate**: Dokumen PDF yang diterbitkan setelah menyelesaikan level JLPT
- **JLPT_Level**: Level Japanese Language Proficiency Test (N5, N4, N3, N2, N1)

## Kebutuhan

### Kebutuhan 1: Akumulasi dan Pelacakan XP

**User Story:** Sebagai pengguna, saya ingin mendapatkan poin pengalaman dari aktivitas belajar saya, sehingga saya dapat melacak kemajuan dan keterlibatan saya secara keseluruhan.

#### Kriteria Penerimaan

1. KETIKA pengguna menyelesaikan pelajaran, XP_System HARUS memberikan 10 XP kepada pengguna
2. KETIKA pengguna lulus kuis, XP_System HARUS memberikan XP antara 20 dan 50 berdasarkan persentase skor kuis
3. KETIKA pengguna login untuk pertama kalinya dalam sehari, XP_System HARUS memberikan 5 XP kepada pengguna
4. KETIKA pengguna membuka pencapaian, XP_System HARUS memberikan bonus XP pencapaian tersebut kepada pengguna
5. KETIKA XP diberikan, XP_System HARUS menyimpan total XP yang diperbarui ke database segera
6. XP_System HARUS mempertahankan total kumulatif semua XP yang diperoleh setiap pengguna

### Kebutuhan 2: Sistem Progresi Level

**User Story:** Sebagai pengguna, saya ingin naik level seiring saya mendapatkan XP, sehingga saya dapat melihat kemajuan perjalanan belajar saya.

#### Kriteria Penerimaan

1. KETIKA XP pengguna mencapai atau melebihi ambang batas level, XP_System HARUS mempromosikan pengguna ke level yang sesuai
2. XP_System HARUS mendefinisikan ambang batas level sebagai berikut: Level 1 (0 XP), Level 2 (100 XP), Level 3 (300 XP), Level 4 (600 XP)
3. KETIKA level pengguna meningkat, XP_System HARUS menyimpan level baru ke database segera
4. XP_System HARUS menghitung level saat ini berdasarkan total XP yang terkumpul
5. KETIKA menampilkan kemajuan pengguna, XP_System HARUS menunjukkan level saat ini, XP saat ini, dan XP yang diperlukan untuk level berikutnya

### Kebutuhan 3: Pelacakan dan Pemeliharaan Streak

**User Story:** Sebagai pengguna, saya ingin hari berturut-turut aktivitas saya dilacak, sehingga saya dapat membangun dan mempertahankan kebiasaan belajar.

#### Kriteria Penerimaan

1. KETIKA pengguna melakukan aktivitas apa pun pada hari tertentu, Streak_Tracker HARUS mencatat tanggal aktivitas
2. KETIKA pengguna melakukan aktivitas pertama mereka di hari itu, Streak_Tracker HARUS menambah hitungan streak jika aktivitas terakhir adalah hari kalender sebelumnya
3. KETIKA pengguna melakukan aktivitas pertama mereka di hari itu, Streak_Tracker HARUS mempertahankan hitungan streak saat ini jika aktivitas terakhir adalah hari kalender yang sama
4. JIKA lebih dari 24 jam telah berlalu sejak tanggal aktivitas terakhir, MAKA Streak_Tracker HARUS mereset hitungan streak menjadi 1
5. Streak_Tracker HARUS menyimpan hitungan streak dan tanggal aktivitas terakhir ke database segera setelah pembaruan apa pun
6. Streak_Tracker HARUS menggunakan zona waktu UTC untuk semua perbandingan tanggal untuk memastikan konsistensi

### Kebutuhan 4: Hadiah Milestone Streak

**User Story:** Sebagai pengguna, saya ingin menerima bonus XP untuk mencapai milestone streak, sehingga saya dihargai untuk kebiasaan belajar yang konsisten.

#### Kriteria Penerimaan

1. KETIKA pengguna mencapai streak 7 hari, Streak_Tracker HARUS memberikan bonus XP kepada pengguna
2. KETIKA pengguna mencapai streak 30 hari, Streak_Tracker HARUS memberikan bonus XP kepada pengguna
3. KETIKA pengguna mencapai streak 100 hari, Streak_Tracker HARUS memberikan bonus XP kepada pengguna
4. Streak_Tracker HARUS memberikan bonus milestone hanya sekali per pencapaian milestone
5. KETIKA milestone streak tercapai, Streak_Tracker HARUS memicu XP_System untuk menambahkan bonus XP

### Kebutuhan 5: Definisi dan Penyimpanan Pencapaian

**User Story:** Sebagai administrator sistem, saya ingin mendefinisikan pencapaian dengan kondisi pembukaan, sehingga pengguna memiliki tujuan yang jelas untuk dikerjakan.

#### Kriteria Penerimaan

1. Achievement_Manager HARUS menyimpan definisi pencapaian dengan nama, deskripsi, ikon, hadiah XP, dan tipe kondisi
2. Achievement_Manager HARUS mendukung tipe kondisi termasuk: jumlah penyelesaian pelajaran, performa kuis, milestone streak, dan pencapaian level
3. KETIKA pencapaian dibuat, Achievement_Manager HARUS menyimpannya ke tabel achievements
4. Achievement_Manager HARUS mempertahankan katalog semua pencapaian yang tersedia
5. Achievement_Manager HARUS menyediakan data pencapaian untuk ditampilkan di antarmuka pengguna

### Kebutuhan 6: Evaluasi Pembukaan Pencapaian

**User Story:** Sebagai pengguna, saya ingin pencapaian terbuka secara otomatis ketika saya memenuhi kondisinya, sehingga saya menerima pengakuan atas pencapaian saya.

#### Kriteria Penerimaan

1. KETIKA pengguna menyelesaikan aktivitas, Achievement_Manager HARUS mengevaluasi semua kondisi pencapaian yang dapat terpengaruh oleh aktivitas tersebut
2. KETIKA kondisi pembukaan pencapaian terpenuhi, Achievement_Manager HARUS membuka pencapaian untuk pengguna
3. KETIKA pencapaian dibuka, Achievement_Manager HARUS mencatat user_id, achievement_id, dan timestamp pembukaan
4. Achievement_Manager HARUS mencegah pembukaan duplikat pencapaian yang sama untuk pengguna
5. KETIKA pencapaian dibuka, Achievement_Manager HARUS memicu XP_System untuk memberikan bonus XP pencapaian
6. Achievement_Manager HARUS menyimpan pembukaan pencapaian ke tabel user_achievements segera

### Kebutuhan 7: Pembuatan Sertifikat

**User Story:** Sebagai pengguna, saya ingin menerima sertifikat ketika saya menyelesaikan level JLPT, sehingga saya memiliki catatan nyata dari pencapaian saya.

#### Kriteria Penerimaan

1. KETIKA pengguna menyelesaikan semua persyaratan untuk level JLPT, Certificate_Generator HARUS membuat sertifikat PDF
2. Certificate_Generator HARUS menyertakan nama pengguna, level JLPT, tanggal penerbitan, dan nomor sertifikat unik dalam PDF
3. KETIKA sertifikat dibuat, Certificate_Generator HARUS menyimpan file PDF di lokasi yang aman
4. KETIKA sertifikat dibuat, Certificate_Generator HARUS menyimpan catatan sertifikat dengan user_id, level_id, issued_at, certificate_number, dan file_path
5. Certificate_Generator HARUS menghasilkan nomor sertifikat unik menggunakan kombinasi kode level, ID pengguna, dan timestamp
6. Certificate_Generator HARUS menggunakan template profesional dengan branding yang sesuai untuk PDF sertifikat

### Kebutuhan 8: Akses dan Unduhan Sertifikat

**User Story:** Sebagai pengguna, saya ingin mengunduh sertifikat yang saya peroleh dari dashboard saya, sehingga saya dapat membagikan atau mencetak pencapaian saya.

#### Kriteria Penerimaan

1. KETIKA pengguna melihat dashboard mereka, Certificate_Generator HARUS menampilkan semua sertifikat yang diperoleh pengguna tersebut
2. KETIKA pengguna meminta untuk mengunduh sertifikat, Certificate_Generator HARUS menyajikan file PDF untuk diunduh
3. Certificate_Generator HARUS memverifikasi bahwa pengguna yang meminta memiliki sertifikat sebelum mengizinkan unduhan
4. KETIKA file sertifikat hilang, Certificate_Generator HARUS mengembalikan pesan error yang sesuai
5. Certificate_Generator HARUS mendukung unduhan sertifikat tanpa memerlukan pembuatan ulang

### Kebutuhan 9: Perhitungan XP untuk Performa Kuis

**User Story:** Sebagai pengguna, saya ingin mendapatkan lebih banyak XP untuk performa kuis yang lebih baik, sehingga saya dihargai untuk penguasaan.

#### Kriteria Penerimaan

1. KETIKA pengguna menyelesaikan kuis dengan skor 100%, XP_System HARUS memberikan 50 XP
2. KETIKA pengguna menyelesaikan kuis dengan skor antara 80% dan 99%, XP_System HARUS memberikan 35 XP
3. KETIKA pengguna menyelesaikan kuis dengan skor antara 60% dan 79%, XP_System HARUS memberikan 20 XP
4. KETIKA pengguna menyelesaikan kuis dengan skor di bawah 60%, XP_System HARUS memberikan 0 XP
5. XP_System HARUS menghitung XP kuis berdasarkan persentase jawaban yang benar

### Kebutuhan 10: Integritas dan Persistensi Data

**User Story:** Sebagai administrator sistem, saya ingin semua data gamifikasi disimpan dengan andal dan konsisten, sehingga kemajuan pengguna tidak pernah hilang.

#### Kriteria Penerimaan

1. KETIKA data gamifikasi apa pun diperbarui, sistem HARUS menggunakan transaksi database untuk memastikan atomicity
2. KETIKA XP diberikan dari beberapa sumber secara bersamaan, XP_System HARUS menangani pembaruan bersamaan tanpa kehilangan data
3. Sistem HARUS memvalidasi semua data gamifikasi sebelum persistensi untuk mencegah status yang tidak valid
4. KETIKA operasi database gagal, sistem HARUS rollback transaksi dan mengembalikan error
5. Sistem HARUS mempertahankan integritas referensial antara tabel users, achievements, dan certificates

### Kebutuhan 11: Tampilan Dashboard Gamifikasi

**User Story:** Sebagai pengguna, saya ingin melihat kemajuan gamifikasi saya di dashboard, sehingga saya dapat melihat pencapaian dan status saya saat ini sekilas.

#### Kriteria Penerimaan

1. KETIKA pengguna melihat dashboard mereka, sistem HARUS menampilkan XP saat ini, level, dan kemajuan ke level berikutnya
2. KETIKA pengguna melihat dashboard mereka, sistem HARUS menampilkan hitungan streak saat ini dan hari hingga milestone berikutnya
3. KETIKA pengguna melihat dashboard mereka, sistem HARUS menampilkan semua pencapaian yang dibuka dengan tanggal pembukaan
4. KETIKA pengguna melihat dashboard mereka, sistem HARUS menampilkan pencapaian yang terkunci dengan indikator kemajuan jika berlaku
5. KETIKA pengguna melihat dashboard mereka, sistem HARUS menampilkan semua sertifikat yang diperoleh dengan tautan unduhan
6. Sistem HARUS memuat semua data gamifikasi dashboard dalam satu query yang dioptimalkan untuk meminimalkan panggilan database

### Kebutuhan 12: Pelacakan Kemajuan Pencapaian

**User Story:** Sebagai pengguna, saya ingin melihat kemajuan saya menuju pencapaian yang terkunci, sehingga saya tahu seberapa dekat saya untuk membukanya.

#### Kriteria Penerimaan

1. DI MANA pencapaian memiliki kemajuan yang dapat diukur, Achievement_Manager HARUS menghitung dan menampilkan kemajuan saat ini
2. KETIKA menampilkan kemajuan pencapaian, Achievement_Manager HARUS menunjukkan nilai saat ini dan nilai target
3. Achievement_Manager HARUS mendukung pelacakan kemajuan untuk pencapaian berdasarkan hitungan (pelajaran selesai, kuis lulus, hari streak)
4. KETIKA pencapaian tidak memiliki kemajuan yang dapat diukur, Achievement_Manager HARUS menampilkan hanya deskripsi kondisi pembukaan
5. Achievement_Manager HARUS memperbarui tampilan kemajuan secara real-time saat pengguna menyelesaikan aktivitas
