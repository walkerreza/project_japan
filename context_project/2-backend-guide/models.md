# Model Base Context

Model berada di `japanlingo/app/Models`.
Model dan tabel memakai English.

## Identity and Access

- `User`: akun user, admin, superadmin.
- `Subscription`: status premium user.
- `AccessKey`: kode akses premium manual.
- `AccessKeyRedemption`: riwayat redeem.

## Learning

- `Level`: JLPT level dan premium flag.
- `Module`: kumpulan lesson.
- `Lesson`: materi/konten.
- `Quiz`: paket kuis.
- `Question`: soal kuis.

## User Activity

- `Attempt`: riwayat pengerjaan quiz.
- `AttemptAnswer`: jawaban per soal.
- `Progress`: progress belajar user.
- `RewardLog`: riwayat XP/reward.
- `Certificate`: sertifikat user.

## Flashcard and Vocabulary

- `FlashcardSet`: kumpulan flashcard.
- `Flashcard`: kartu belajar.
- `FlashcardReview`: status review user.
- `Vocabulary`: bank kosakata.
- `Kanji`: bank kanji.

Flashcard/kosakata adalah fitur inti untuk fase beta.

## Gamification

- `Achievement`: master achievement.
- `UserAchievement`: achievement user.
- `RewardLog`: log XP/reward.

## News

- `News`: berita/konten superadmin.
- `NewsAttachment`: lampiran berita.

## Payment

- `PaymentPlan`
- `Transaction`
- `TransactionLog`
- `Subscription`
- `AccessKey`
- `AccessKeyRedemption`

Payment sekarang manual/QRIS/access key. Payment gateway production belum prioritas.

## Presentation and Board

- `PresentationDeck`
- `PresentationSlide`
- `TeachingBoard`

Presentasi diedit admin. User hanya viewer/share target.

## Audit

- `ActivityLog`
- `LoginHistory`
- `UserStatusHistory`

Dipakai superadmin untuk monitoring dan perubahan status user/admin.

## Future Candidate

Untuk kelas/kloter, kandidat model:

- `Classroom` atau `Cohort`
- `ClassroomUser` atau `CohortUser`
- `ClassroomAssignment`

Pilih nama final sebelum migration dibuat.
