# Migration Base Context

Migration project ada di `japanlingo/database/migrations`. Gunakan file ini sebagai patokan saat membuat atau mengubah schema database.

## Aturan Migration

- Jangan rename migration lama.
- Jangan edit migration lama jika sudah pernah dijalankan di local/hosting.
- Untuk perubahan table existing, buat migration baru dengan nama jelas.
- Untuk fitur baru, buat table baru sesuai domain fitur.
- Selalu sediakan `down()` yang aman.
- Untuk PostgreSQL, hindari perubahan enum native. Pakai `string status` agar mudah diubah.
- Jalankan `php artisan migrate` setelah migration dibuat.
- Jika hanya local reset total, boleh pakai `php artisan migrate:fresh --seed` setelah disetujui user.

## Naming

Gunakan format Laravel default:

- `create_xxx_table`
- `add_xxx_to_yyy_table`
- `rename_xxx_to_yyy_table`
- `drop_xxx_from_yyy_table`

Contoh:

- `create_classrooms_table`
- `add_share_token_to_presentation_decks_table`
- `add_premium_fields_to_lessons_table`

## FK Rules

- Relasi parent-child kuat: pakai `cascadeOnDelete()`.
- Relasi opsional: pakai `nullOnDelete()`.
- Data master/payment plan: pakai `restrictOnDelete()`.
- Kolom creator/updater boleh nullable dan `nullOnDelete()`.

Contoh:

```php
$table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
$table->foreignId('lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
$table->foreignId('payment_plan_id')->constrained('payment_plans')->restrictOnDelete();
```

## Index Rules

Tambahkan index untuk query filter/listing.

- `user_id`
- `lesson_id`
- `quiz_id`
- `status`
- `created_at`
- `expires_at`
- `published_at`
- gabungan seperti `['user_id', 'status']`

Contoh:

```php
$table->index(['user_id', 'status']);
$table->index(['status', 'created_at']);
```

## Existing Migration Domains

Core Laravel:

- `users`
- `cache`
- `jobs`
- `notifications`

Learning:

- `levels`
- `modules`
- `lessons`
- `quizzes`
- `questions`
- `progress`

Quiz analytics:

- `attempts`
- `attempt_answers`

Gamification:

- `certificates`
- `achievements`
- `user_achievements`
- `reward_logs`

Superadmin/content:

- `news`
- `news_attachments`
- `activity_logs`
- `login_histories`
- `user_status_histories`
- `app_settings`

Premium/payment:

- `payment_plans`
- `subscriptions`
- `transactions`
- `transaction_logs`
- `access_keys`
- `access_key_redemptions`

Vocabulary/flashcard:

- `vocabulary_bank`
- `flashcard_sets`
- `flashcards`
- `flashcard_reviews`
- `kanji_bank`

Presentation/board:

- `presentation_decks`
- `presentation_slides`
- `teaching_boards`

## Template Create Table

```php
Schema::create('table_name', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('status', 20)->default('draft')->index();
    $table->timestamps();
});
```

## Template Add Column

```php
Schema::table('table_name', function (Blueprint $table) {
    $table->string('new_column')->nullable()->after('existing_column');
});
```

## Template Drop Column

```php
Schema::table('table_name', function (Blueprint $table) {
    $table->dropColumn('column_name');
});
```

## Template New Classroom Feature

Jika fitur kelas/kloter dibuat, gunakan struktur dasar ini:

```php
Schema::create('classrooms', function (Blueprint $table) {
    $table->id();
    $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
    $table->string('name');
    $table->text('description')->nullable();
    $table->string('status', 20)->default('active')->index();
    $table->timestamps();
});

Schema::create('classroom_users', function (Blueprint $table) {
    $table->id();
    $table->foreignId('classroom_id')->constrained('classrooms')->cascadeOnDelete();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->string('status', 20)->default('active')->index();
    $table->timestamps();

    $table->unique(['classroom_id', 'user_id']);
});
```

## Migration Priority

Untuk tahap berikutnya, prioritaskan hanya migration yang mendukung:

- Classroom/kloter user.
- Presentation share token.
- Premium preview rules jika field saat ini belum cukup.
- Import log untuk CSV/Excel jika mass import perlu riwayat.

Jangan tambah table baru jika fitur bisa diselesaikan dengan schema yang sudah ada.
