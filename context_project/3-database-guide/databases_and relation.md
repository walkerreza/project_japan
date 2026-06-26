# Database And Relation Base Context

Dokumen ini menjadi patokan relasi database. Ikuti relasi ini saat membuat model, controller, service, migration, dan query.

## User And Access

- `users` adalah akun utama untuk role `user`, `admin`, `superadmin`.
- `users` has many `attempts`.
- `users` has many `progress`.
- `users` has many `subscriptions`.
- `users` has many `transactions`.
- `users` has many `flashcard_reviews`.
- `users` has many `certificates`.
- `users` has many `user_achievements`.
- `users` has many `reward_logs`.

## Learning Path

- `levels` has many `modules`.
- `modules` belongs to `levels`.
- `modules` has many `lessons`.
- `lessons` belongs to `modules`.
- `lessons` has many `quizzes`.
- `quizzes` belongs to `lessons`.
- `quizzes` has many `questions`.
- `questions` belongs to `quizzes`.

Delete rule:

- Hapus `level` akan menghapus `modules`.
- Hapus `module` akan menghapus `lessons`.
- Hapus `lesson` akan menghapus `quizzes`.
- Hapus `quiz` akan menghapus `questions`.

## Quiz Attempt

- `attempts` belongs to `users`.
- `attempts` belongs to `quizzes`.
- `attempts` has many `attempt_answers`.
- `attempt_answers` belongs to `attempts`.
- `attempt_answers` belongs to `questions`.

Aturan:

- Satu attempt hanya boleh punya satu jawaban per question.
- Simpan jawaban mentah di `answer_text` atau `answer_payload`.
- Simpan hasil koreksi di `is_correct` dan `earned_points`.
- Submit quiz aktif memakai `ProgressController@storeAttempt`.

## Progress And Reward

- `progress` belongs to `users`.
- `progress` belongs to `lessons`.
- `reward_logs` belongs to `users`.
- `certificates` belongs to `users`.
- `achievements` has many `user_achievements`.
- `user_achievements` belongs to `users`.
- `user_achievements` belongs to `achievements`.

Aturan:

- Progress lesson dibuat setelah user memenuhi syarat lulus.
- XP dan achievement dihitung lewat service, bukan trigger database.
- Certificate dibuat jika syarat completion terpenuhi.

## Vocabulary And Flashcard

- `vocabulary_bank` adalah master kosakata.
- `flashcard_sets` belongs to optional `levels`, `modules`, `lessons`.
- `flashcard_sets` has many `flashcards`.
- `flashcards` belongs to `flashcard_sets`.
- `flashcards` optionally belongs to `vocabulary_bank`.
- `flashcard_reviews` belongs to `users`.
- `flashcard_reviews` belongs to `flashcards`.

Aturan:

- Flashcard dipakai sebagai selingan/review di quiz dan library kosakata.
- `vocabulary_bank` boleh diimport massal dari CSV/Excel.
- Jika flashcard dari vocabulary, isi `vocabulary_id`.
- Jika custom card, isi langsung `front_text`, `reading`, `back_text`, `hint`, dan contoh kalimat.

## Premium And Payment

- `payment_plans` has many `subscriptions`.
- `payment_plans` has many `transactions`.
- `subscriptions` belongs to `users`.
- `subscriptions` belongs to `payment_plans`.
- `transactions` belongs to `users`.
- `transactions` optionally belongs to `payment_plans`.
- `transactions` optionally belongs to `subscriptions`.
- `transaction_logs` belongs to `transactions`.
- `transaction_logs.changed_by` optionally belongs to `users`.
- `access_keys` optionally belongs to `payment_plans`.
- `access_keys.created_by` optionally belongs to `users`.
- `access_key_redemptions` belongs to `access_keys`.
- `access_key_redemptions` belongs to `users`.
- `access_key_redemptions` optionally belongs to `subscriptions`.

Aturan:

- Untuk beta, premium bisa aktif lewat access key atau transaksi manual.
- QRIS/payment gateway boleh ditambahkan setelah flow manual stabil.
- Free user hanya preview/incomplete content.
- Premium user mendapat full access.

## News

- `news` adalah portal berita yang dibuat superadmin.
- `news` has many `news_attachments`.
- `news_attachments` belongs to `news`.

Aturan:

- Thumbnail berita boleh diambil dari thumbnail field atau gambar pertama dari content.
- Attachment bisa berupa image, document, atau video embed.
- User hanya membaca berita published.

## Presentation And Board

- `presentation_decks` optionally belongs to `levels`, `modules`, `lessons`.
- `presentation_decks` has many `presentation_slides`.
- `presentation_slides` belongs to `presentation_decks`.
- `teaching_boards` optionally belongs to `levels`, `modules`, `lessons`.
- `teaching_boards` optionally belongs to `presentation_slides`.

Aturan:

- Admin membuat deck dan slide.
- User melihat deck yang published/shareable.
- Board ajar digabung ke slide presentasi lewat `presentation_slide_id`.
- Board data disimpan sebagai JSON di `board_data`.
- Snapshot preview boleh disimpan di `snapshot_data`.

## Future Classroom

Jika fitur kelas/kloter dibuat:

- `classrooms` belongs to admin user as teacher.
- `classrooms` has many `classroom_users`.
- `classroom_users` belongs to `classrooms`.
- `classroom_users` belongs to `users`.
- `classroom_assignments` optionally connects classroom to lesson, quiz, flashcard set, or presentation deck.

Aturan:

- Admin hanya mengelola user di classroom miliknya.
- Superadmin tetap bisa melihat semua classroom.
- Jangan campur classroom dengan role user.
