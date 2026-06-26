# Service Base Context

Service berada di `japanlingo/app/Services`.
Pakai service untuk logic panjang, import/export, progress, XP, certificate, document, atau logic yang dipakai lintas controller.

## Service Aktif

- `AchievementService`: unlock/check achievement.
- `CertificateService`: generate/manage certificate.
- `ExcelTemplateService`: template Excel/CSV.
- `GamificationService`: logic XP/reward/achievement lintas fitur.
- `LessonContentService`: proses konten lesson.
- `LessonDocumentService`: file document lesson.
- `PresentationImportService`: import/konversi presentasi.
- `QuizQuestionService`: builder/import/generate soal.
- `SpreadsheetImportService`: normalisasi CSV/XLSX.
- `StreakService`: daily streak.
- `UserLearningService`: payload lesson/quiz lobby/detail dan lock state.
- `UserProgressSummaryService`: ringkasan progress user.
- `XPService`: hitung dan tambah XP.

## Aturan

- Jangan buat service baru untuk satu query sederhana.
- Buat service jika logic mulai dipakai lintas controller.
- Service jangan bergantung langsung pada request frontend.
- Service menerima model, scalar, atau array tervalidasi.
- Gunakan database transaction jika update banyak tabel.
- Error import harus bisa dibaca admin.

## Candidate Service

Jika fitur baru mulai dibuat:

- `ClassroomService` untuk kelas/kloter.
- `FlashcardReviewService` jika review flashcard makin kompleks.
- `PremiumAccessService` jika logic preview/free/premium tersebar.
- `PresentationShareService` jika share link presentasi ditambahkan.
