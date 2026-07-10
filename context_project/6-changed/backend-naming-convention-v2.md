# JapanLingo V2 Backend Naming Convention

Tanggal keputusan: 2026-06-27

## Prinsip Utama

Gunakan konsistensi berdasarkan lapisan, bukan memaksa semua nama menjadi satu bahasa.

- Folder framework Laravel tetap memakai English.
- File dan class domain backend memakai Indonesia atau semi Indonesia.
- Database table dan column tetap memakai schema lawas berbahasa English.
- Route URL dan route name lawas tetap dipertahankan sampai frontend selesai direfactor.

Pendekatan ini dipilih agar backend lebih mudah dibaca programmer Indonesia, tetapi tetap kompatibel dengan database, migration, frontend, route, dan behavior lawas `japanlingo`.

## Aturan Folder

Folder Laravel tetap mengikuti struktur framework:

- `app/Http/Controllers`
- `app/Http/Controllers/Auth`
- `app/Http/Controllers/Admin`
- `app/Http/Controllers/Pengguna`
- `app/Http/Controllers/SuperAdmin`
- `app/Models`
- `app/Services`
- `app/Http/Requests`
- `database/migrations`
- `database/seeders`
- `routes`

Folder jangan diterjemahkan menjadi `Kontroller`, `Model`, `Layanan`, dll karena berisiko membuat struktur Laravel sulit dikenali dan membingungkan programmer baru.

## Aturan File dan Class Domain

File dan class domain boleh memakai bahasa Indonesia atau semi Indonesia.

Contoh model:

- `Pengguna` untuk tabel `users`
- `Kuis` untuk tabel `quizzes`
- `Soal` untuk tabel `questions`
- `Materi` untuk tabel `lessons`
- `Modul` untuk tabel `modules`
- `Kosakata` untuk tabel `vocabulary_bank`
- `Langganan` untuk tabel `subscriptions`
- `Transaksi` untuk tabel `transactions`
- `Pencapaian` untuk tabel `achievements`

Contoh controller:

- `AdminKuisController`
- `AdminSoalController`
- `AdminMateriController`
- `AdminKosakataController`
- `SuperAdminPembayaranController`
- `RegistrasiPenggunaController`
- `SesiAutentikasiController`

## Aturan Database

Database table dan column tetap memakai schema lawas berbahasa English.

Contoh:

- `users`
- `quizzes`
- `questions`
- `lessons`
- `modules`
- `attempts`
- `attempt_answers`
- `subscriptions`
- `transactions`
- `payment_plans`

Foreign key juga tetap memakai English schema:

- `user_id`
- `quiz_id`
- `question_id`
- `lesson_id`
- `module_id`
- `level_id`
- `payment_plan_id`
- `subscription_id`

Jangan rename table/column ke Indonesia untuk fase refactor sekarang. Rename schema database akan berdampak besar ke migration, seeder, query, relasi Eloquent, route model binding, dan frontend.

## Aturan Model Eloquent

Karena class model memakai nama Indonesia, setiap model yang nama class-nya tidak mengikuti convention Laravel wajib punya `$table` eksplisit.

Contoh:

```php
class Kuis extends Model
{
    protected $table = 'quizzes';
}
```

Relasi Eloquent juga wajib menulis foreign key eksplisit jika nama class tidak sama dengan nama table/foreign key lawas.

Contoh:

```php
public function lesson()
{
    return $this->belongsTo(Materi::class, 'lesson_id');
}

public function questions()
{
    return $this->hasMany(Soal::class, 'quiz_id');
}
```

Jangan mengandalkan tebakan default Eloquent setelah model direname ke Indonesia, karena Eloquent bisa menebak foreign key seperti `materi_id`, `kuis_id`, atau `pengguna_id`, padahal database memakai `lesson_id`, `quiz_id`, dan `user_id`.

## Aturan Route

Route URL dan route name untuk sementara tetap mengikuti FE lawas.

Contoh yang dipertahankan:

- `/user/quizzes` dengan name `user.quizzes.index`
- `/admin/quizzes` dengan name `admin.quizzes.index`
- `/admin/questions` dengan name `admin.questions.index`
- `/admin/lessons` dengan name `admin.lessons.index`
- `/superadmin/payments` dengan name `superadmin.payments`

Jika nanti ingin URL Indonesia, gunakan alias route dulu agar frontend tidak langsung rusak.

Contoh ide alias nanti:

- `/admin/kuis` alias dari `/admin/quizzes`
- `/admin/soal` alias dari `/admin/questions`
- `/admin/materi` alias dari `/admin/lessons`
- `/admin/kosakata` alias dari `/admin/vocabulary`

## Aturan Migration

Nama file migration boleh memakai Indonesia atau semi Indonesia, tetapi isi schema tetap menggunakan table/column English lawas.

Contoh file:

- `create_kuis_table.php`
- `create_soal_table.php`
- `create_materi_table.php`
- `create_kosakata_flashcard_table.php`

Namun isi migration tetap:

```php
Schema::create('quizzes', function (Blueprint $table) {
    $table->foreignId('lesson_id')->constrained('lessons');
});
```

## Kesimpulan

Standar v2 saat ini:

- Folder Laravel: English
- File/class backend domain: Indonesia/semi Indonesia
- Database schema: English lawas
- Route URL/name: English lawas sampai FE selesai direfactor
- Model: wajib `$table` eksplisit
- Relasi: wajib foreign key eksplisit

Keputusan ini menjaga kerapihan nama backend tanpa memutus kompatibilitas dengan project lawas `japanlingo` dan frontend v2 yang masih membawa route lawas.