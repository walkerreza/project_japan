# Backlog Tersaring JapanLingo

Dokumen ini menyimpan backlog yang masih relevan. Untuk roadmap aktif lihat `japanlingo-colaboration.md`. Untuk mapping teknis lihat `project-structure-map.md`.

## Stabilitas & QA

- [ ] Jalankan QA manual end-to-end memakai `project-qa-checklist.md`.
- [ ] Pastikan login manual dan Google OAuth tidak mengganggu role redirect.
- [ ] Pastikan flow admin membuat materi, kuis, dan soal berjalan dari browser.
- [ ] Pastikan flow user belajar, submit kuis, progress, dan redeem access key berjalan dari browser.
- [ ] Pastikan superadmin bisa mengelola news, user/admin, payment, access key, theme, dan activity.

## UX Yang Masih Perlu Dipoles

- [ ] Upgrade prompt/paywall UI saat user free membuka konten premium.
- [ ] Viewer dokumen PDF/DOC/PPT perlu keputusan final yang ringan dan stabil.
- [ ] Admin content workflow: clone lesson, validasi draft sebelum publish, preview, bulk reorder.
- [ ] Pesan error import CSV/XLSX perlu dibuat lebih mudah dipahami sensei.

## Fitur Yang Ditahan

- [ ] OCR/import massal dari PDF/PPT berbasis gambar.
- [ ] Payment gateway real.
- [ ] SEO publik lanjutan.
- [ ] Rename database/migration.
- [ ] Refactor total builder.

## Testing & Maintenance

- [ ] Tambahkan test untuk role access.
- [ ] Tambahkan test untuk quiz submit dan attempt answers.
- [ ] Tambahkan test untuk progress dan certificate.
- [ ] Tambahkan test untuk access key redemption.
- [ ] Cek throttle/rate limit forgot password.
