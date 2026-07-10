# Kloter, Payment, dan Access Key - 2026-07-09

## Keputusan

Kloter dimaknai sebagai batch belajar per kelas/program. Satu kloter punya tanggal mulai, admin pengampu, status, dan bisa dijadikan default untuk auto-assign user setelah payment.

Access key bukan hanya premium key. Untuk kloter, access key berfungsi sebagai kode masuk kloter sekaligus membuka akses kelas. Default pemakaian key kloter adalah 2 user sesuai konteks client.

## Perubahan Implementasi

- Menambahkan tabel `kloter_belajar` dan `anggota_kloter`.
- Menambahkan relasi nullable `kloter_belajar_id` ke subscription, transaction, access key, dan redemption.
- Payment Midtrans/manual yang sukses tetap membuat subscription, lalu otomatis mencari kloter aktif/default sesuai kelas yang dibeli.
- Redeem access key tetap membuat subscription, lalu memasukkan user ke kloter jika key terkait kloter.
- Superadmin mendapat menu `Kloter` untuk membuat kloter, memilih admin, assign user, dan generate access key kloter.
- Roadmap user sekarang menghormati jadwal kloter: jika user punya kloter, week yang belum masuk minggu aktif akan terkunci.
- Kloter punya kapasitas opsional `max_siswa`; auto-assign payment akan menghindari kloter yang sudah penuh.
- User mendapat notifikasi saat masuk kloter.
- Card kelas, checkout success, dan roadmap user menampilkan informasi kloter atau status menunggu kloter.
- Roster superadmin menampilkan progress anggota kloter terhadap total modul kelas.

## Dampak

- Flow payment lama tetap aman karena kloter bersifat nullable.
- Jika belum ada kloter aktif, subscription tetap aktif dan user masih punya akses sesuai plan.
- Untuk demo, `KloterDemoSeeder` membuat kloter default per kelas agar auto-assign payment langsung bekerja.
- Operasional admin lebih jelas karena superadmin bisa melihat kapasitas, anggota, dan progress kloter dalam satu halaman.

## Catatan Lanjutan

- Test lama yang masih menganggap `/user/modul` sebagai halaman utama perlu disesuaikan ke flow baru `/user/kelas`.
- Jika client meminta kloter lebih detail, langkah berikutnya adalah membatasi dashboard admin agar admin hanya melihat kloter yang dia pegang.
