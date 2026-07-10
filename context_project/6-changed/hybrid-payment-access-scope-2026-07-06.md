# Hybrid Payment Access Scope

Tanggal: 2026-07-06

## Konteks

Client belum mengunci apakah pembayaran akan berlaku global untuk semua kelas atau hanya per kelas. Karena website saat ini fokus N3 tetapi struktur kelas/modul bisa berkembang, backend dibuat hybrid agar dua model bisnis bisa dipakai tanpa rewrite ulang.

## Perubahan

- Payment plan sekarang punya `scope_type`: `global` atau `program`.
- Scope `global` membuka semua kelas premium.
- Scope `program` membuka satu kelas/program tertentu dari `program_pembelajaran`.
- Transaksi Midtrans dan transaksi manual menyimpan scope dari payment plan.
- Langganan menyimpan scope yang sama agar akses modul bisa dicek per kelas.
- Access key bisa global atau per kelas, dan tetap bisa dipakai banyak user sesuai `max_uses`.
- Aktivasi akses dipusatkan di `App\Services\AksesLanggananService` supaya Midtrans, approve manual, dan redeem access key tidak punya logika berbeda.
- Halaman Kelas bisa memulai checkout per kelas jika ada payment plan per kelas.
- Pricing public tetap menampilkan paket global agar flow lama tidak rusak.

## Dampak

- Data pembayaran lama tetap dianggap `global`.
- User gratis tetap hanya bisa preview Week 1.
- User dengan akses global bisa membuka semua kelas.
- User dengan akses per kelas hanya membuka kelas tersebut, tetapi tetap terlihat sebagai user dengan akses aktif.
- Jika client nanti meminta pembayaran global saja, cukup pakai payment plan `global`.
- Jika client meminta harga beda per kelas, buat payment plan `program` untuk masing-masing kelas.

## Setting Admin

- Buat plan global: `scope_type = global`, tanpa pilih kelas.
- Buat plan per kelas: `scope_type = program`, pilih kelas/program.
- Buat access key global: kosongkan plan atau pilih plan global.
- Buat access key per kelas: pilih plan per kelas, atau tanpa plan lalu pilih scope `program` dan kelas.

## Catatan Implementasi

- Tidak ada tabel baru untuk pivot akses.
- Kolom scope ditambahkan ke `payment_plans`, `transactions`, `subscriptions`, dan `access_keys`.
- Query akses modul tetap lewat `AksesPremiumService`.
- Source of truth aktivasi akses ada di `AksesLanggananService`.
