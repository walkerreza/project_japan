# Dokumen Desain: Sistem Gamifikasi

## Ringkasan

Sistem Gamifikasi diimplementasikan sebagai sekumpulan layanan Laravel dan komponen React yang saling terhubung untuk melacak keterlibatan pengguna, memberikan poin pengalaman, mengelola progresi melalui level, mempertahankan streak aktivitas, membuka pencapaian, dan menghasilkan sertifikat. Sistem ini terintegrasi dengan alur penyelesaian pelajaran dan kuis yang ada untuk secara otomatis memicu event gamifikasi.

Arsitektur mengikuti pola service-oriented Laravel dengan kelas service khusus untuk setiap komponen utama (XP, Streaks, Achievements, Certificates). Service ini dipanggil melalui sistem event Laravel, memastikan loose coupling dengan platform pembelajaran inti. Frontend menggunakan React dengan Inertia.js untuk hidrasi data server-side yang mulus dan pembaruan UI yang reaktif.

## Arsitektur

### Komponen Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Inertia)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │ Achievement  │  │ Certificate  │     │
│  │  Component   │  │   Display    │  │   Viewer     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Inertia.js
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Laravel Controllers)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │ Achievement  │  │ Certificate  │     │
│  │ Controller   │  │  Controller  │  │  Controller  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer (Laravel)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  XPService   │  │ StreakService│  │ Achievement  │     │
│  │              │  │              │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                          │
│  │ Certificate  │                                          │
│  │   Service    │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Event System (Laravel)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ LessonComp-  │  │ QuizComp-    │  │ UserLogin    │     │
│  │ leted Event  │  │ leted Event  │  │    Event     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │ Achievement  │  │ LevelComp-   │                       │
│  │ Unlocked     │  │ leted Event  │                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Eloquent)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    User      │  │ Achievement  │  │ UserAchieve- │     │
│  │    Model     │  │    Model     │  │  ment Model  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐                                          │
│  │ Certificate  │                                          │
│  │    Model     │                                          │
│  └──────────────┘                                          │
└─────────────────────────────────────────────────────────────┘
```

### Arsitektur Event-Driven

Sistem menggunakan sistem event Laravel untuk memisahkan logika gamifikasi dari fitur pembelajaran inti:

1. **Penyelesaian Pelajaran/Kuis**: Ketika pelajaran atau kuis diselesaikan, event di-dispatch
2. **Event Listeners**: Listener gamifikasi merespons event ini
3. **Pemanggilan Service**: Listener memanggil service yang sesuai (XP, Streak, Achievement)
4. **Efek Cascade**: Service dapat memicu event tambahan (misalnya, pembukaan pencapaian memicu pemberian XP)

Pendekatan ini memastikan bahwa menambahkan gamifikasi tidak memerlukan modifikasi kode pelajaran/kuis yang ada.

## Komponen dan Interface

### XPService

**Tanggung Jawab**: Mengelola pemberian poin pengalaman dan perhitungan level

**Method Publik**:

```php
class XPService
{
    /**
     * Berikan XP kepada pengguna dan perbarui level mereka jika perlu
     * 
     * @param User $user Pengguna yang menerima XP
     * @param int $amount Jumlah XP yang diberikan
     * @param string $source Sumber XP (lesson, quiz, login, achievement)
     * @return array ['xp_awarded' => int, 'level_up' => bool, 'new_level' => int]
     */
    public function awardXP(User $user, int $amount, string $source): array

    /**
     * Hitung level untuk total XP tertentu
     * 
     * @param int $xp Total jumlah XP
     * @return int Level yang sesuai
     */
    public function calculateLevel(int $xp): int

    /**
     * Dapatkan XP yang diperlukan untuk level berikutnya
     * 
     * @param int $currentLevel Level pengguna saat ini
     * @return int|null XP yang diperlukan untuk level berikutnya, atau null jika level maksimal
     */
    public function getXPForNextLevel(int $currentLevel): ?int

    /**
     * Hitung XP kuis berdasarkan persentase skor
     * 
     * @param float $scorePercentage Skor kuis sebagai persentase (0-100)
     * @return int Jumlah XP yang diberikan
     */
    public function calculateQuizXP(float $scorePercentage): int
}
```

**Konfigurasi Ambang Batas Level**:
```php
private const LEVEL_THRESHOLDS = [
    1 => 0,
    2 => 100,
    3 => 300,
    4 => 600,
    5 => 1000,
    6 => 1500,
    // ... dapat diperluas untuk level masa depan
];
```

### StreakService

**Tanggung Jawab**: Melacak hari berturut-turut aktivitas dan memberikan bonus milestone

**Method Publik**:

```php
class StreakService
{
    /**
     * Perbarui streak pengguna berdasarkan aktivitas saat ini
     * 
     * @param User $user Pengguna yang melakukan aktivitas
     * @return array ['streak_count' => int, 'milestone_reached' => bool, 'bonus_xp' => int]
     */
    public function updateStreak(User $user): array

    /**
     * Periksa apakah milestone streak tercapai
     * 
     * @param int $oldStreak Hitungan streak sebelumnya
     * @param int $newStreak Hitungan streak baru
     * @return int Bonus XP untuk milestone, atau 0 jika tidak ada milestone
     */
    public function checkMilestone(int $oldStreak, int $newStreak): int

    /**
     * Tentukan apakah streak harus ditambah, dipertahankan, atau direset
     * 
     * @param Carbon|null $lastActivityDate Tanggal aktivitas terakhir yang dicatat
     * @param Carbon $currentDate Tanggal saat ini
     * @return string 'increment', 'maintain', atau 'reset'
     */
    private function determineStreakAction(?Carbon $lastActivityDate, Carbon $currentDate): string
}
```

**Konfigurasi Milestone**:
```php
private const STREAK_MILESTONES = [
    7 => 50,    // 7 hari: 50 bonus XP
    30 => 200,  // 30 hari: 200 bonus XP
    100 => 1000 // 100 hari: 1000 bonus XP
];
```

### AchievementService

**Tanggung Jawab**: Mengevaluasi kondisi pencapaian dan membuka pencapaian

**Method Publik**:

```php
class AchievementService
{
    /**
     * Evaluasi dan buka pencapaian untuk pengguna berdasarkan aktivitas
     * 
     * @param User $user Pengguna yang dievaluasi
     * @param string $activityType Tipe aktivitas (lesson, quiz, streak, level)
     * @param array $context Data konteks tambahan
     * @return array Array pencapaian yang baru dibuka
     */
    public function evaluateAchievements(User $user, string $activityType, array $context = []): array

    /**
     * Buka pencapaian spesifik untuk pengguna
     * 
     * @param User $user Pengguna yang membuka pencapaian
     * @param Achievement $achievement Pencapaian yang akan dibuka
     * @return UserAchievement Catatan user achievement yang dibuat
     */
    public function unlockAchievement(User $user, Achievement $achievement): UserAchievement

    /**
     * Periksa apakah pengguna sudah membuka pencapaian
     * 
     * @param User $user Pengguna yang diperiksa
     * @param Achievement $achievement Pencapaian yang diperiksa
     * @return bool True jika sudah dibuka
     */
    public function hasUnlocked(User $user, Achievement $achievement): bool

    /**
     * Hitung kemajuan menuju pencapaian
     * 
     * @param User $user Pengguna yang diperiksa
     * @param Achievement $achievement Pencapaian yang diperiksa
     * @return array ['current' => int, 'target' => int, 'percentage' => float]
     */
    public function calculateProgress(User $user, Achievement $achievement): array

    /**
     * Dapatkan semua pencapaian dengan status pembukaan untuk pengguna
     * 
     * @param User $user Pengguna yang diperiksa
     * @return Collection Collection pencapaian dengan data 'unlocked' dan 'progress'
     */
    public function getAchievementsWithStatus(User $user): Collection
}
```

**Tipe Kondisi Pencapaian**:
```php
enum AchievementConditionType: string
{
    case LESSON_COUNT = 'lesson_count';
    case QUIZ_PERFECT = 'quiz_perfect';
    case STREAK_DAYS = 'streak_days';
    case LEVEL_REACHED = 'level_reached';
    case TOTAL_XP = 'total_xp';
}
```

### CertificateService

**Tanggung Jawab**: Menghasilkan dan mengelola sertifikat level JLPT

**Method Publik**:

```php
class CertificateService
{
    /**
     * Hasilkan sertifikat untuk pengguna yang menyelesaikan level JLPT
     * 
     * @param User $user Pengguna yang mendapatkan sertifikat
     * @param int $levelId ID level JLPT (N5, N4, N3, N2, N1)
     * @return Certificate Catatan sertifikat yang dibuat
     */
    public function generateCertificate(User $user, int $levelId): Certificate

    /**
     * Hasilkan nomor sertifikat unik
     * 
     * @param User $user Pengguna yang menerima sertifikat
     * @param int $levelId ID level JLPT
     * @return string Nomor sertifikat unik
     */
    private function generateCertificateNumber(User $user, int $levelId): string

    /**
     * Buat file PDF sertifikat
     * 
     * @param User $user Data pengguna untuk sertifikat
     * @param int $levelId Level JLPT
     * @param string $certificateNumber Nomor sertifikat unik
     * @return string Path file ke PDF yang dihasilkan
     */
    private function createPDF(User $user, int $levelId, string $certificateNumber): string

    /**
     * Dapatkan semua sertifikat untuk pengguna
     * 
     * @param User $user Pengguna yang di-query
     * @return Collection Collection sertifikat
     */
    public function getUserCertificates(User $user): Collection

    /**
     * Verifikasi pengguna memiliki sertifikat sebelum mengizinkan unduhan
     * 
     * @param User $user Pengguna yang meminta
     * @param Certificate $certificate Sertifikat yang akan diunduh
     * @return bool True jika pengguna memiliki sertifikat
     */
    public function verifyCertificateOwnership(User $user, Certificate $certificate): bool
}
```

## Model Data

### Ekstensi Model User

```php
class User extends Authenticatable
{
    protected $fillable = [
        // ... field yang ada
        'xp',
        'level',
        'streak_count',
        'last_activity_date',
    ];

    protected $casts = [
        'xp' => 'integer',
        'level' => 'integer',
        'streak_count' => 'integer',
        'last_activity_date' => 'datetime',
    ];

    // Relationships
    public function achievements(): BelongsToMany
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
                    ->withPivot('unlocked_at')
                    ->withTimestamps();
    }

    public function certificates(): HasMany
    {
        return $this->hasMany(Certificate::class);
    }
}
```

### Model Achievement

```php
class Achievement extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
        'xp_reward',
        'condition_type',
        'condition_value',
    ];

    protected $casts = [
        'xp_reward' => 'integer',
        'condition_type' => AchievementConditionType::class,
        'condition_value' => 'integer',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
                    ->withPivot('unlocked_at')
                    ->withTimestamps();
    }
}
```

### Model UserAchievement

```php
class UserAchievement extends Model
{
    protected $fillable = [
        'user_id',
        'achievement_id',
        'unlocked_at',
    ];

    protected $casts = [
        'unlocked_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function achievement(): BelongsTo
    {
        return $this->belongsTo(Achievement::class);
    }
}
```

### Model Certificate

```php
class Certificate extends Model
{
    protected $fillable = [
        'user_id',
        'level_id',
        'issued_at',
        'certificate_number',
        'file_path',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }
}
```

## Migrasi Database

**Modifikasi tabel users**:
```php
Schema::table('users', function (Blueprint $table) {
    $table->integer('xp')->default(0);
    $table->integer('level')->default(1);
    $table->integer('streak_count')->default(0);
    $table->timestamp('last_activity_date')->nullable();
});
```

**Tabel achievements**:
```php
Schema::create('achievements', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->text('description');
    $table->string('icon');
    $table->integer('xp_reward');
    $table->string('condition_type');
    $table->integer('condition_value')->nullable();
    $table->timestamps();
});
```

**Tabel user_achievements**:
```php
Schema::create('user_achievements', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('achievement_id')->constrained()->onDelete('cascade');
    $table->timestamp('unlocked_at');
    $table->timestamps();
    
    $table->unique(['user_id', 'achievement_id']);
});
```

**Tabel certificates**:
```php
Schema::create('certificates', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->foreignId('level_id')->constrained()->onDelete('cascade');
    $table->timestamp('issued_at');
    $table->string('certificate_number')->unique();
    $table->string('file_path');
    $table->timestamps();
});
```

## Strategi Testing

### Pendekatan Testing Ganda

Sistem Gamifikasi memerlukan unit test dan property-based test untuk cakupan yang komprehensif:

- **Unit tests**: Memverifikasi contoh spesifik, edge case, dan kondisi error
- **Property tests**: Memverifikasi properti universal di semua input menggunakan testing acak

Kedua pendekatan testing saling melengkapi dan diperlukan. Unit test menangkap bug konkret dalam skenario spesifik, sementara property test memverifikasi kebenaran umum di berbagai input.

### Property-Based Testing

**Framework**: Gunakan **Pest PHP** dengan **pest-plugin-faker** atau integrasikan **PHPUnit dengan Eris** untuk property-based testing di Laravel.

**Konfigurasi**:
- Setiap property test harus menjalankan minimal 100 iterasi dengan input acak
- Setiap test harus mereferensikan properti dokumen desain yang sesuai
- Format tag: `// Feature: gamification-system, Property {number}: {property_text}`

## Penanganan Error

### Error Sistem XP

- **Jumlah XP Tidak Valid**: Tolak nilai XP negatif atau non-integer dengan validation error
- **User Tidak Ditemukan**: Kembalikan error 404 saat mencoba memberikan XP ke pengguna yang tidak ada
- **Kegagalan Database**: Rollback transaksi XP dan kembalikan error 500 dengan detail yang di-log

### Error Sistem Streak

- **Tanggal Tidak Valid**: Tolak tanggal yang tidak valid atau masa depan dengan validation error
- **Kegagalan Konversi Timezone**: Log error dan gunakan fallback UTC
- **Pembaruan Streak Bersamaan**: Gunakan database locking untuk mencegah race condition

### Error Sistem Achievement

- **Tipe Kondisi Tidak Valid**: Tolak pencapaian dengan tipe kondisi yang tidak didukung
- **Achievement Hilang**: Kembalikan 404 saat mengevaluasi pencapaian yang tidak ada
- **Percobaan Pembukaan Duplikat**: Abaikan secara diam-diam (operasi idempoten)
- **Kegagalan Evaluasi**: Log error tapi jangan blokir aktivitas utama (penyelesaian pelajaran/kuis)

### Error Sistem Certificate

- **Kegagalan Pembuatan PDF**: Kembalikan error 500 dan log informasi error detail
- **Kegagalan Penyimpanan File**: Rollback pembuatan catatan sertifikat dan kembalikan error
- **File Sertifikat Hilang**: Kembalikan 404 dengan pesan "Certificate file not found"
- **Unduhan Tidak Diotorisasi**: Kembalikan error 403 saat pengguna tidak memiliki sertifikat
- **Level Tidak Valid**: Tolak pembuatan sertifikat untuk level JLPT yang tidak ada

### Penanganan Error Umum

- Semua method service harus melempar exception spesifik yang dapat ditangkap controller dan dikonversi ke respons HTTP yang sesuai
- Transaksi database harus digunakan untuk semua operasi multi-langkah
- Operasi yang gagal harus di-log dengan konteks yang cukup untuk debugging
- Pesan error yang dihadapi pengguna harus jelas tapi tidak mengekspos detail sistem internal
