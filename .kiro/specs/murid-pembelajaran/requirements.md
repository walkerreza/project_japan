# Requirements Document: Murid Pembelajaran

## Introduction

Fitur Murid Pembelajaran adalah sistem pembelajaran interaktif untuk platform Japanlingo yang memungkinkan murid mengakses modul pembelajaran bahasa Jepang, menyelesaikan pelajaran, mengerjakan kuis, dan melacak progress mereka. Sistem ini mendukung pembelajaran bertingkat (N5-N1) dengan pembatasan akses berdasarkan status subscription dan terintegrasi dengan sistem gamifikasi untuk meningkatkan engagement.

## Glossary

- **System**: Sistem pembelajaran murid Japanlingo
- **Murid**: Pengguna dengan role student yang mengakses pembelajaran
- **Free_User**: Murid dengan subscription status free
- **Premium_User**: Murid dengan subscription status premium
- **Level**: Tingkat pembelajaran JLPT (N5, N4, N3, N2, N1)
- **Module**: Unit pembelajaran mingguan dalam satu level
- **Lesson**: Materi pembelajaran individual dalam satu module
- **Quiz**: Kuis evaluasi yang terkait dengan lesson
- **Question**: Pertanyaan individual dalam quiz
- **Progress**: Status penyelesaian lesson oleh murid
- **Attempt**: Percobaan mengerjakan quiz oleh murid
- **XP**: Experience points yang diperoleh dari menyelesaikan aktivitas
- **Gamification_System**: Sistem eksternal yang mengelola XP, streak, dan achievement

## Requirements

### Requirement 1: Akses Level Berdasarkan Subscription

**User Story:** Sebagai murid, saya ingin mengakses level pembelajaran sesuai dengan status subscription saya, sehingga saya dapat belajar sesuai dengan hak akses yang saya miliki.

#### Acceptance Criteria

1. WHEN a Free_User mengakses halaman modul, THEN THE System SHALL menampilkan hanya level N3
2. WHEN a Premium_User mengakses halaman modul, THEN THE System SHALL menampilkan semua level (N5, N4, N3, N2, N1)
3. WHEN a Free_User mencoba mengakses level selain N3, THEN THE System SHALL menolak akses dan menampilkan pesan upgrade subscription
4. WHEN a Premium_User mengakses level apapun, THEN THE System SHALL mengizinkan akses tanpa pembatasan

### Requirement 2: Tampilan Daftar Modul

**User Story:** Sebagai murid, saya ingin melihat daftar modul pembelajaran yang tersedia, sehingga saya dapat memilih modul yang ingin saya pelajari.

#### Acceptance Criteria

1. WHEN a Murid mengakses halaman modul, THEN THE System SHALL menampilkan level tabs sesuai hak akses
2. WHEN a Murid memilih level tab, THEN THE System SHALL menampilkan daftar module cards untuk level tersebut
3. WHEN menampilkan module card, THEN THE System SHALL menampilkan title, week_number, description, dan progress indicator
4. WHEN a Murid menggunakan filter atau search, THEN THE System SHALL menampilkan hanya modul yang sesuai dengan kriteria
5. WHEN menampilkan module card, THEN THE System SHALL menampilkan status locked, unlocked, atau completed

### Requirement 3: Status dan Unlock Logic Modul

**User Story:** Sebagai murid, saya ingin modul terbuka secara bertahap berdasarkan progress saya, sehingga pembelajaran saya terstruktur dan tidak overwhelming.

#### Acceptance Criteria

1. WHEN a Murid belum menyelesaikan modul sebelumnya, THEN THE System SHALL menampilkan modul berikutnya dengan status locked
2. WHEN a Murid menyelesaikan semua lesson dalam modul, THEN THE System SHALL mengubah status modul menjadi completed
3. WHEN a Murid menyelesaikan modul, THEN THE System SHALL membuka modul berikutnya (status unlocked)
4. THE System SHALL menampilkan modul pertama dalam level sebagai unlocked secara default

### Requirement 4: Detail Modul dan Daftar Lesson

**User Story:** Sebagai murid, saya ingin melihat detail modul dan daftar lesson di dalamnya, sehingga saya dapat memahami isi modul dan memilih lesson yang ingin dipelajari.

#### Acceptance Criteria

1. WHEN a Murid mengakses detail modul, THEN THE System SHALL menampilkan module header dengan title, description, dan progress percentage
2. WHEN menampilkan detail modul, THEN THE System SHALL menampilkan daftar lesson dengan title, order, duration estimate, XP estimate, dan status
3. WHEN a Lesson belum dimulai dan lesson sebelumnya belum completed, THEN THE System SHALL menampilkan lesson dengan status locked
4. WHEN a Lesson belum dimulai dan lesson sebelumnya sudah completed, THEN THE System SHALL menampilkan lesson dengan status unlocked dan tombol Start
5. WHEN a Lesson sudah dimulai tetapi belum completed, THEN THE System SHALL menampilkan lesson dengan tombol Continue
6. WHEN a Lesson sudah completed, THEN THE System SHALL menampilkan lesson dengan status completed dan checkmark

### Requirement 5: Pembelajaran Lesson

**User Story:** Sebagai murid, saya ingin membaca dan mempelajari konten lesson, sehingga saya dapat memahami materi pembelajaran.

#### Acceptance Criteria

1. WHEN a Murid mengakses lesson page, THEN THE System SHALL menampilkan progress bar yang menunjukkan posisi lesson dalam modul
2. WHEN menampilkan lesson content, THEN THE System SHALL merender text, images, dan audio sesuai dengan format content
3. WHEN a Murid berada di lesson page, THEN THE System SHALL menyediakan tombol navigasi Previous dan Next
4. WHEN a Murid menekan tombol Previous, THEN THE System SHALL menampilkan lesson sebelumnya jika ada
5. WHEN a Murid menekan tombol Next, THEN THE System SHALL menampilkan lesson berikutnya jika ada
6. WHEN a Murid menyelesaikan membaca lesson, THEN THE System SHALL menampilkan tombol Take Quiz
7. WHEN a Murid menekan tombol Mark as Complete, THEN THE System SHALL menyimpan progress dengan completed_at timestamp

### Requirement 6: Kuis Multiple Choice

**User Story:** Sebagai murid, saya ingin mengerjakan kuis multiple choice, sehingga saya dapat menguji pemahaman saya terhadap materi.

#### Acceptance Criteria

1. WHEN a Murid mengakses quiz dengan type multiple_choice, THEN THE System SHALL menampilkan question_text dan 4 options
2. WHEN a Murid memilih satu option, THEN THE System SHALL menandai option tersebut sebagai selected
3. WHEN a Murid menekan tombol Submit, THEN THE System SHALL memvalidasi jawaban dengan correct_answer
4. WHEN jawaban benar, THEN THE System SHALL menandai question sebagai correct
5. WHEN jawaban salah, THEN THE System SHALL menandai question sebagai incorrect dan menampilkan correct_answer

### Requirement 7: Kuis Typing

**User Story:** Sebagai murid, saya ingin mengerjakan kuis typing, sehingga saya dapat melatih kemampuan menulis bahasa Jepang.

#### Acceptance Criteria

1. WHEN a Murid mengakses quiz dengan type typing, THEN THE System SHALL menampilkan question_text dan text input field
2. WHEN a Murid mengetik jawaban, THEN THE System SHALL menyimpan input dalam state
3. WHEN a Murid menekan tombol Submit, THEN THE System SHALL memvalidasi jawaban dengan correct_answer (case-insensitive, trimmed)
4. WHEN jawaban benar, THEN THE System SHALL menandai question sebagai correct
5. WHEN jawaban salah, THEN THE System SHALL menandai question sebagai incorrect dan menampilkan correct_answer

### Requirement 8: Kuis Listening

**User Story:** Sebagai murid, saya ingin mengerjakan kuis listening, sehingga saya dapat melatih kemampuan mendengar bahasa Jepang.

#### Acceptance Criteria

1. WHEN a Murid mengakses quiz dengan type listening, THEN THE System SHALL menampilkan audio player dengan audio_url
2. WHEN a Murid menekan play button, THEN THE System SHALL memutar audio
3. WHEN menampilkan listening quiz, THEN THE System SHALL menampilkan question_text dan text input field
4. WHEN a Murid menekan tombol Submit, THEN THE System SHALL memvalidasi jawaban dengan correct_answer (case-insensitive, trimmed)
5. WHEN jawaban benar, THEN THE System SHALL menandai question sebagai correct
6. WHEN jawaban salah, THEN THE System SHALL menandai question sebagai incorrect dan menampilkan correct_answer

### Requirement 9: Timer Kuis (Optional)

**User Story:** Sebagai murid, saya ingin melihat timer saat mengerjakan kuis, sehingga saya dapat mengelola waktu pengerjaan dengan baik.

#### Acceptance Criteria

1. WHERE quiz memiliki time_limit, WHEN a Murid mengakses quiz, THEN THE System SHALL menampilkan countdown timer
2. WHERE quiz memiliki time_limit, WHEN timer mencapai 0, THEN THE System SHALL otomatis submit quiz
3. WHERE quiz tidak memiliki time_limit, THEN THE System SHALL tidak menampilkan timer

### Requirement 10: Hasil Kuis

**User Story:** Sebagai murid, saya ingin melihat hasil kuis setelah submit, sehingga saya dapat mengetahui performa saya.

#### Acceptance Criteria

1. WHEN a Murid submit quiz, THEN THE System SHALL menghitung score berdasarkan jumlah jawaban benar
2. WHEN menampilkan hasil kuis, THEN THE System SHALL menampilkan total score, XP earned, dan breakdown correct/incorrect per question
3. WHEN menampilkan hasil kuis, THEN THE System SHALL menampilkan explanation untuk setiap question
4. WHEN menampilkan hasil kuis, THEN THE System SHALL menyediakan tombol Retry dan Next Lesson
5. WHEN a Murid menekan Retry, THEN THE System SHALL mengulang quiz dari awal dengan questions yang sama
6. WHEN a Murid menekan Next Lesson, THEN THE System SHALL mengarahkan ke lesson berikutnya jika ada

### Requirement 11: Penyimpanan Progress Lesson

**User Story:** Sebagai murid, saya ingin progress lesson saya tersimpan, sehingga saya dapat melanjutkan pembelajaran dari terakhir kali saya berhenti.

#### Acceptance Criteria

1. WHEN a Murid menyelesaikan lesson, THEN THE System SHALL menyimpan record di tabel progress dengan user_id, lesson_id, completed_at, dan score
2. WHEN a Murid mengakses lesson yang sudah completed, THEN THE System SHALL menampilkan status completed
3. WHEN semua lesson dalam modul completed, THEN THE System SHALL menghitung progress percentage modul sebagai 100%
4. WHEN a Murid mengakses modul, THEN THE System SHALL menghitung dan menampilkan progress percentage berdasarkan jumlah lesson completed

### Requirement 12: Penyimpanan Attempt Kuis

**User Story:** Sebagai murid, saya ingin setiap attempt kuis saya tersimpan, sehingga saya dapat melihat history dan progress saya.

#### Acceptance Criteria

1. WHEN a Murid submit quiz, THEN THE System SHALL menyimpan record di tabel attempts dengan user_id, quiz_id, score, xp_earned, dan attempted_at
2. WHEN menyimpan attempt, THEN THE System SHALL menghitung XP berdasarkan score (contoh: score * 10)
3. WHEN a Murid retry quiz, THEN THE System SHALL menyimpan attempt baru dengan attempted_at terbaru
4. THE System SHALL menyimpan semua attempts tanpa menghapus attempts sebelumnya

### Requirement 13: Integrasi dengan Gamification System

**User Story:** Sebagai murid, saya ingin mendapatkan XP dan reward saat menyelesaikan aktivitas, sehingga saya termotivasi untuk terus belajar.

#### Acceptance Criteria

1. WHEN a Murid menyelesaikan lesson, THEN THE System SHALL dispatch LessonCompleted event dengan user_id dan lesson_id
2. WHEN a Murid menyelesaikan quiz, THEN THE System SHALL dispatch QuizCompleted event dengan user_id, quiz_id, score, dan xp_earned
3. WHEN event di-dispatch, THEN THE Gamification_System SHALL menerima event dan memproses XP award, streak update, dan achievement evaluation
4. THE System SHALL tidak menunggu response dari Gamification_System (asynchronous)

### Requirement 14: Middleware Authorization

**User Story:** Sebagai sistem, saya ingin memastikan hanya murid yang dapat mengakses fitur pembelajaran, sehingga keamanan dan integritas data terjaga.

#### Acceptance Criteria

1. WHEN a user mengakses endpoint pembelajaran, THEN THE System SHALL memverifikasi bahwa user memiliki role student
2. WHEN a user bukan student mengakses endpoint pembelajaran, THEN THE System SHALL menolak akses dengan status 403 Forbidden
3. WHEN a Free_User mengakses level selain N3, THEN THE System SHALL memverifikasi subscription status dan menolak akses
4. WHEN a Premium_User mengakses level apapun, THEN THE System SHALL memverifikasi subscription status dan mengizinkan akses

### Requirement 15: Validasi Data Input

**User Story:** Sebagai sistem, saya ingin memvalidasi semua input dari murid, sehingga data yang tersimpan konsisten dan valid.

#### Acceptance Criteria

1. WHEN a Murid submit quiz answer, THEN THE System SHALL memvalidasi bahwa answer tidak kosong
2. WHEN a Murid mengakses lesson atau modul, THEN THE System SHALL memvalidasi bahwa ID yang diberikan valid dan exists
3. WHEN menyimpan progress atau attempt, THEN THE System SHALL memvalidasi bahwa user_id, lesson_id, dan quiz_id valid
4. IF validasi gagal, THEN THE System SHALL mengembalikan error message yang deskriptif

### Requirement 16: Perhitungan Progress Modul

**User Story:** Sebagai murid, saya ingin melihat progress percentage modul, sehingga saya dapat mengetahui seberapa banyak yang sudah saya selesaikan.

#### Acceptance Criteria

1. WHEN menghitung progress modul, THEN THE System SHALL menghitung jumlah lesson completed dibagi total lesson dalam modul
2. WHEN menampilkan progress, THEN THE System SHALL memformat sebagai percentage (0-100%)
3. WHEN tidak ada lesson completed, THEN THE System SHALL menampilkan progress 0%
4. WHEN semua lesson completed, THEN THE System SHALL menampilkan progress 100%
