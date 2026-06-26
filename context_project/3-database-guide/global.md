# Database Base Context

Project menggunakan PostgreSQL. Semua perubahan schema wajib lewat migration Laravel di `japanlingo/database/migrations`.

## Aturan Utama

- Nama table dan column tetap English.
- Jangan rename migration lama yang sudah ada.
- Jangan ubah/drop table lama tanpa kebutuhan jelas.
- Jika perlu ubah schema existing, buat migration baru.
- Gunakan `foreignId()->constrained()->cascadeOnDelete()` untuk data turunan yang harus ikut terhapus.
- Gunakan `nullOnDelete()` untuk relasi opsional.
- Gunakan `restrictOnDelete()` untuk data master yang tidak boleh dihapus saat masih dipakai.
- Tambahkan index untuk kolom yang sering dipakai filter: `status`, `user_id`, `lesson_id`, `quiz_id`, `created_at`, `expires_at`.
- JSON boleh dipakai untuk data fleksibel seperti `features`, `tags`, `board_data`, `answer_payload`.
- File upload simpan path di database, file fisik tetap di storage.

## Primary Key

- Semua table utama memakai `id` sebagai primary key.
- Pivot/riwayat tetap boleh punya `id` agar mudah diaudit.
- Untuk data yang tidak boleh dobel, tambahkan unique constraint.

Contoh unique yang sudah dipakai:

- `attempt_answers`: `attempt_id + question_id`
- `flashcard_reviews`: `user_id + flashcard_id`
- `access_key_redemptions`: `access_key_id + user_id`
- `access_keys`: `code`
- `payment_plans`: `slug`
- `transactions`: `transaction_code`

## Status Field

Gunakan string status pendek dan konsisten.

- Content: `draft`, `published`, `archived`
- Payment: `pending`, `paid`, `failed`, `cancelled`
- Subscription: `active`, `expired`, `cancelled`
- Access key: `active`, `inactive`, `expired`
- Flashcard review: `new`, `known`, `learning`

## Scope Database Saat Ini

- Learning path: `levels`, `modules`, `lessons`, `quizzes`, `questions`
- User progress: `attempts`, `attempt_answers`, `progress`, `reward_logs`, `certificates`
- Gamification: `achievements`, `user_achievements`
- Vocabulary/flashcard: `vocabulary_bank`, `flashcard_sets`, `flashcards`, `flashcard_reviews`, `kanji_bank`
- Premium/payment: `payment_plans`, `subscriptions`, `transactions`, `transaction_logs`, `access_keys`, `access_key_redemptions`
- News: `news`, `news_attachments`
- Presentation/board: `presentation_decks`, `presentation_slides`, `teaching_boards`
- Audit/system: `activity_logs`, `login_histories`, `user_status_histories`, `notifications`, `app_settings`

## Prioritas Fitur Berikutnya

- Jika membuat fitur kelas/kloter, buat table baru `classrooms`, `classroom_users`, dan opsional `classroom_assignments`.
- Jangan pakai trigger dulu kecuali benar-benar perlu. Untuk project ini, logic gamification/progress lebih aman di Service Laravel.
- Untuk beta test, pastikan relasi quiz, flashcard, premium access, dan presentation share stabil lebih dulu.
