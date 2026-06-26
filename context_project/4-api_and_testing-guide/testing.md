# Testing Base Context

Project memakai Pest/PHPUnit. Test utama ada di `japanlingo/tests`.

## Test Runner

Jalankan dari folder `japanlingo`.

```bash
php artisan test
```

Untuk satu file:

```bash
php artisan test tests/Feature/Admin/PresentationBuilderTest.php
```

## Test Database

Konfigurasi testing ada di `japanlingo/phpunit.xml`.

- Connection: `pgsql`
- Host: `127.0.0.1`
- Port: `5433`
- Database: `japanlingo_test`
- User: `postgres`
- Password: `x`

Pest memakai `RefreshDatabase` untuk Feature test.

## Test Structure

- Feature test: `japanlingo/tests/Feature`
- Unit test: `japanlingo/tests/Unit`
- Admin feature: `japanlingo/tests/Feature/Admin`
- Auth feature: `japanlingo/tests/Feature/Auth`

Gunakan Feature test untuk route/controller/service yang menyentuh database.

## Test Rules

- Buat user sesuai role sebelum hit protected route.
- Pakai `$this->actingAs($user)` untuk auth.
- Assert redirect untuk form submit Inertia.
- Assert validation error untuk input invalid.
- Assert database untuk efek create/update/delete.
- Jangan test detail UI React di backend test.
- Jangan bergantung pada seed global kecuali memang diperlukan.

## Required Test Coverage For Beta

User:

- User bisa melihat dashboard.
- User bisa melihat list news published.
- User tidak bisa akses premium lesson/quiz tanpa subscription.
- User premium bisa akses premium lesson/quiz.
- User bisa submit quiz lewat `POST /user/attempts`.
- Submit quiz menyimpan `attempts` dan `attempt_answers`.
- Submit quiz menambah XP/progress sesuai service.
- User bisa review flashcard.

Admin:

- Admin bisa CRUD module.
- Admin bisa update module builder.
- Admin bisa CRUD quiz.
- Admin bisa update quiz builder.
- Admin bisa import question CSV/XLSX.
- Admin bisa import vocabulary CSV/XLSX.
- Admin bisa CRUD flashcard set dan cards.
- Admin bisa generate quiz dari flashcard/vocabulary.
- Admin bisa CRUD presentation deck.
- Admin bisa simpan board di slide presentation.
- Admin tidak bisa akses route superadmin.

Superadmin:

- Superadmin bisa CRUD news.
- Superadmin bisa upload news editor image.
- Superadmin bisa manage user status.
- Superadmin bisa create admin.
- Superadmin bisa create payment plan.
- Superadmin bisa approve/reject transaction.
- Superadmin bisa create/revoke access key.
- Superadmin bisa update global theme.

Access Control:

- Guest redirect ke login untuk route protected.
- User tidak bisa akses admin/superadmin.
- Admin tidak bisa akses superadmin.
- Superadmin tidak otomatis boleh masuk route admin kecuali route memang dibuat.

## Test Pattern

```php
test('admin can create a resource', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.example.store'), [
        'title' => 'Example',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('examples', [
        'title' => 'Example',
    ]);
});
```

## Import Test Pattern

```php
test('admin import rejects invalid file', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)->post(route('admin.example.import'), [
        'file' => UploadedFile::fake()->create('data.txt', 2, 'text/plain'),
    ]);

    $response->assertSessionHasErrors('file');
});
```

## Bug Regression Rule

Jika memperbaiki bug backend, tambahkan test yang membuktikan bug tidak kembali.

Prioritas regression test:

- Missing column/query mismatch.
- Delete parent data dengan child data.
- Quiz submit dan attempt answers.
- Premium access.
- File upload/delete.
- Presentation board save.
