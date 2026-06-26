# Agents Base Context

File ini adalah patokan untuk AI agent yang mengerjakan JapanLingo.

## Cara Membaca Konteks

Baca context sesuai kebutuhan fitur:

1. `context_project/5-product-goals-guide/product-context.md`
2. `context_project/1-frontend-guide/global.md`
3. `context_project/1-frontend-guide/ui_ux.md`
4. `context_project/2-backend-guide/global.md`
5. `context_project/2-backend-guide/controller.md`
6. `context_project/2-backend-guide/route.md`
7. `context_project/2-backend-guide/models.md`
8. `context_project/2-backend-guide/service.md`
9. `context_project/3-database-guide/global.md`
10. `context_project/3-database-guide/databases_and relation.md`
11. `context_project/3-database-guide/migrations.md`
12. `context_project/4-api_and_testing-guide/api.md`
13. `context_project/4-api_and_testing-guide/testing.md`

Jika ada konflik, ikuti urutan prioritas ini:

1. Kode aktif di `japanlingo`
2. `routes/web.php`
3. Migration dan model aktif
4. Context guide
5. File MD lama

## Project Target

JapanLingo adalah web belajar bahasa Jepang JLPT N3 berbasis gamifikasi.

Fokus utama:

- Duolingo-style learning path.
- Kanji Senpai-style flashcard/review.
- Quizizz-style admin builder, quiz, presentation, classroom.
- Premium preview dan access key.
- Beta test sebelum rilis penuh.

## Role Agent

Agent harus bekerja sebagai engineer, bukan hanya memberi saran.

Saat user meminta implementasi:

- Scan file terkait.
- Buat perubahan kecil dan aman.
- Jangan merombak file yang tidak terkait.
- Jalankan test/lint yang relevan jika memungkinkan.
- Laporkan file yang diubah dan hasil verifikasi.

Saat user meminta audit:

- Temukan bug, risiko, dan gap.
- Prioritaskan temuan berdasarkan dampak.
- Jangan langsung refactor besar tanpa izin.

## Batasan Edit

- Jangan membuat file baru jika tidak diperlukan.
- Jangan rename file/table/migration tanpa alasan kuat.
- Jangan menghapus fitur aktif tanpa izin.
- Jangan mengubah desain desktop besar-besaran jika request hanya mobile/responsive.
- Jangan mengubah route aktif tanpa update semua pemakai route.
- Jangan edit migration lama yang sudah berjalan; buat migration baru.
- Jangan gunakan trigger database untuk gamification/progress jika bisa di Service Laravel.

## Standar Implementasi

Backend:

- Route masuk ke group role yang benar.
- Controller tetap tipis.
- Validasi pakai FormRequest jika payload besar.
- Logic kompleks masuk Service.
- Query list harus eager load relasi yang dipakai.
- Mutasi banyak table pakai transaction.
- Response Inertia pakai redirect/flash untuk form submit.

Frontend:

- Pertahankan React + Inertia pattern yang sudah ada.
- Gunakan komponen existing jika tersedia.
- UI harus responsive desktop, tablet, mobile.
- Light mode dan dark mode harus kontras.
- Jangan pakai localStorage untuk setting global platform.
- Import massal harus punya template dan error yang jelas.

Database:

- Table/column pakai English.
- PK default `id`.
- FK jelas dengan cascade/null/restrict sesuai domain.
- Tambahkan index untuk kolom filter.
- Data fleksibel boleh JSON.

Testing:

- Pakai Pest/PHPUnit.
- Tambahkan regression test untuk bug backend.
- Minimal test role access, validation, dan database effect.

## Product Rules

- Materi Drive client dipakai untuk gamifikasi.
- Flashcard/vocabulary adalah fitur inti.
- Flashcard harus bisa tersambung ke quiz/game.
- User tidak perlu edit presentasi.
- Admin membuat presentasi dan share ke user.
- Board/jamboard digabung ke slide presentasi.
- Free user hanya preview tidak lengkap.
- Premium user mendapat full access.
- Payment gateway penuh bukan prioritas beta.
- Access key/manual payment cukup untuk beta.
- Classroom/kloter penting setelah core stabil.

## Prioritas Kerja

1. Stabilkan bug blocker.
2. Stabilkan quiz submit, attempt answers, progress, XP.
3. Stabilkan flashcard/vocabulary dan integrasi quiz.
4. Stabilkan admin builder dan import.
5. Stabilkan premium access.
6. Stabilkan presentation share.
7. Stabilkan superadmin.
8. Tambahkan classroom/kloter.
9. Siapkan deployment beta.

## Checklist Sebelum Selesai

- Route yang dipakai frontend ada.
- Props Inertia sesuai kebutuhan page.
- Nama column sesuai migration aktif.
- Role middleware benar.
- Empty state ada.
- Error validation tampil.
- Mobile tidak rusak.
- Dark/light mode terbaca.
- Tidak ada file unrelated berubah.
- Jika test tidak dijalankan, jelaskan alasannya.
