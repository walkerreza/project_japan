# Pertanyaan Kloterisasi

## Konteks

Di chat client ada beberapa kalimat tentang access key, premium, game, dan kloterisasi:

- Materi sementara premium, tetapi key access masih dipegang Mas Fuad.
- Key access game ada di tangan Mas Fuad.
- Ada kebutuhan admin untuk kloterisasi user.
- Kelas seperti Quizizz masih perlu diperjelas.

Asumsi sementara: access key bukan hanya untuk kuis, tetapi kode akses belajar yang bisa membuka akses premium, program/modul tertentu, atau kloter/kelas tertentu.

## Pertanyaan Untuk Client

Mas, untuk access key itu fungsinya mau sebagai pengganti/bypass pembayaran untuk membuka akses belajar, atau khusus membuka kelas/kloter tertentu?

Detail yang perlu dikonfirmasi:

1. Satu kode dipakai untuk satu siswa, atau satu kode bisa dipakai satu kloter?
2. Access key membuka semua modul premium, atau hanya program/modul/week tertentu?
3. Kloter dibuat berdasarkan tanggal mulai belajar, kelas, batch pembayaran, atau input manual admin?
4. Jika user masuk kloter, apakah semua user dalam kloter punya roadmap/progress yang sama?
5. Apakah access key tetap dipakai setelah Midtrans aktif, atau hanya untuk demo, beta, dan akses manual?

## Keputusan Sementara

Sebelum ada jawaban client, implementasi paling aman:

- Access key tetap dianggap sebagai kode akses belajar.
- Access key bisa dipakai untuk membuka akses premium/manual.
- Struktur backend disiapkan agar nanti bisa dikaitkan ke kloter/program, tetapi tidak dikunci hanya sebagai akses kuis.
