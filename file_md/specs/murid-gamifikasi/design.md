# Design Document: Gamification System

## Overview

The Gamification System is implemented as a set of interconnected Laravel services and React components that track user engagement, award experience points, manage progression through levels, maintain activity streaks, unlock achievements, and generate certificates. The system integrates with existing lesson and quiz completion flows to automatically trigger gamification events.

The architecture follows Laravel's service-oriented pattern with dedicated service classes for each major component (XP, Streaks, Achievements, Certificates). These services are invoked through Laravel events, ensuring loose coupling with the core learning platform. The frontend uses React with Inertia.js for seamless server-side data hydration and reactive UI updates.

## Architecture

### System Components

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

### Event-Driven Architecture

The system uses Laravel's event system to decouple gamification logic from core learning features:

1. **Lesson/Quiz Completion**: When a lesson or quiz is completed, an event is dispatched
2. **Event Listeners**: Gamification listeners respond to these events
3. **Service Invocation**: Listeners invoke appropriate services (XP, Streak, Achievement)
4. **Cascade Effects**: Services may trigger additional events (e.g., achievement unlocks trigger XP awards)

This approach ensures that adding gamification doesn't require modifying existing lesson/quiz code.

## Components and Interfaces

### XPService

**Responsibility**: Manage experience point awards and level calculations

**Public Methods**:

```php
class XPService
{
    /**
     * Award XP to a user and update their level if necessary
     * 
     * @param User $user The user receiving XP
     * @param int $amount The amount of XP to award
     * @param string $source The source of XP (lesson, quiz, login, achievement)
     * @return array ['xp_awarded' => int, 'level_up' => bool, 'new_level' => int]
     */
    public function awardXP(User $user, int $amount, string $source): array

    /**
     * Calculate the level for a given XP total
     * 
     * @param int $xp Total XP amount
     * @return int The corresponding level
     */
    public function calculateLevel(int $xp): int

    /**
     * Get XP required for the next level
     * 
     * @param int $currentLevel The user's current level
     * @return int|null XP required for next level, or null if max level
     */
    public function getXPForNextLevel(int $currentLevel): ?int

    /**
     * Calculate quiz XP based on score percentage
     * 
     * @param float $scorePercentage Quiz score as percentage (0-100)
     * @return int XP amount to award
     */
    public function calculateQuizXP(float $scorePercentage): int
}
```

**Level Thresholds Configuration**:
```php
private const LEVEL_THRESHOLDS = [
    1 => 0,
    2 => 100,
    3 => 300,
    4 => 600,
    5 => 1000,
    6 => 1500,
    // ... extensible for future levels
];
```

### StreakService

**Responsibility**: Track consecutive days of activity and award milestone bonuses

**Public Methods**:

```php
class StreakService
{
    /**
     * Update user's streak based on current activity
     * 
     * @param User $user The user performing activity
     * @return array ['streak_count' => int, 'milestone_reached' => bool, 'bonus_xp' => int]
     */
    public function updateStreak(User $user): array

    /**
     * Check if a streak milestone was reached
     * 
     * @param int $oldStreak Previous streak count
     * @param int $newStreak New streak count
     * @return int Bonus XP for milestone, or 0 if no milestone
     */
    public function checkMilestone(int $oldStreak, int $newStreak): int

    /**
     * Determine if streak should be incremented, maintained, or reset
     * 
     * @param Carbon|null $lastActivityDate Last recorded activity date
     * @param Carbon $currentDate Current date
     * @return string 'increment', 'maintain', or 'reset'
     */
    private function determineStreakAction(?Carbon $lastActivityDate, Carbon $currentDate): string
}
```

**Milestone Configuration**:
```php
private const STREAK_MILESTONES = [
    7 => 50,    // 7 days: 50 bonus XP
    30 => 200,  // 30 days: 200 bonus XP
    100 => 1000 // 100 days: 1000 bonus XP
];
```

### AchievementService

**Responsibility**: Evaluate achievement conditions and unlock achievements

**Public Methods**:

```php
class AchievementService
{
    /**
     * Evaluate and unlock achievements for a user based on activity
     * 
     * @param User $user The user to evaluate
     * @param string $activityType Type of activity (lesson, quiz, streak, level)
     * @param array $context Additional context data
     * @return array Array of newly unlocked achievements
     */
    public function evaluateAchievements(User $user, string $activityType, array $context = []): array

    /**
     * Unlock a specific achievement for a user
     * 
     * @param User $user The user unlocking the achievement
     * @param Achievement $achievement The achievement to unlock
     * @return UserAchievement The created user achievement record
     */
    public function unlockAchievement(User $user, Achievement $achievement): UserAchievement

    /**
     * Check if user has already unlocked an achievement
     * 
     * @param User $user The user to check
     * @param Achievement $achievement The achievement to check
     * @return bool True if already unlocked
     */
    public function hasUnlocked(User $user, Achievement $achievement): bool

    /**
     * Calculate progress toward an achievement
     * 
     * @param User $user The user to check
     * @param Achievement $achievement The achievement to check
     * @return array ['current' => int, 'target' => int, 'percentage' => float]
     */
    public function calculateProgress(User $user, Achievement $achievement): array

    /**
     * Get all achievements with unlock status for a user
     * 
     * @param User $user The user to check
     * @return Collection Collection of achievements with 'unlocked' and 'progress' data
     */
    public function getAchievementsWithStatus(User $user): Collection
}
```

**Achievement Condition Types**:
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

**Responsibility**: Generate and manage JLPT level certificates

**Public Methods**:

```php
class CertificateService
{
    /**
     * Generate a certificate for a user completing a JLPT level
     * 
     * @param User $user The user earning the certificate
     * @param int $levelId The JLPT level ID (N5, N4, N3, N2, N1)
     * @return Certificate The created certificate record
     */
    public function generateCertificate(User $user, int $levelId): Certificate

    /**
     * Generate a unique certificate number
     * 
     * @param User $user The user receiving the certificate
     * @param int $levelId The JLPT level ID
     * @return string Unique certificate number
     */
    private function generateCertificateNumber(User $user, int $levelId): string

    /**
     * Create PDF certificate file
     * 
     * @param User $user The user data for the certificate
     * @param int $levelId The JLPT level
     * @param string $certificateNumber The unique certificate number
     * @return string File path to the generated PDF
     */
    private function createPDF(User $user, int $levelId, string $certificateNumber): string

    /**
     * Get all certificates for a user
     * 
     * @param User $user The user to query
     * @return Collection Collection of certificates
     */
    public function getUserCertificates(User $user): Collection

    /**
     * Verify user owns a certificate before allowing download
     * 
     * @param User $user The requesting user
     * @param Certificate $certificate The certificate to download
     * @return bool True if user owns the certificate
     */
    public function verifyCertificateOwnership(User $user, Certificate $certificate): bool
}
```

## Data Models

### User Model Extensions

```php
class User extends Authenticatable
{
    protected $fillable = [
        // ... existing fields
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

### Achievement Model

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

### UserAchievement Model

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

### Certificate Model

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

### Database Migrations

**users table modification**:
```php
Schema::table('users', function (Blueprint $table) {
    $table->integer('xp')->default(0);
    $table->integer('level')->default(1);
    $table->integer('streak_count')->default(0);
    $table->timestamp('last_activity_date')->nullable();
});
```

**achievements table**:
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

**user_achievements table**:
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

**certificates table**:
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


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### XP System Properties

**Property 1: Lesson completion awards fixed XP**
*For any* user and lesson, when the user completes the lesson, the user's XP should increase by exactly 10.
**Validates: Requirements 1.1**

**Property 2: Quiz XP scales with performance**
*For any* quiz score percentage, the calculated XP should be 50 for 100%, 35 for 80-99%, 20 for 60-79%, and 0 for below 60%.
**Validates: Requirements 1.2, 9.1, 9.2, 9.3, 9.4, 9.5**

**Property 3: Daily login awards fixed XP**
*For any* user performing their first activity of the day, the user should receive exactly 5 XP for the daily login bonus.
**Validates: Requirements 1.3**

**Property 4: Achievement unlocks award bonus XP**
*For any* user and achievement, when the achievement is unlocked, the user's XP should increase by the achievement's xp_reward value.
**Validates: Requirements 1.4, 6.5**

**Property 5: XP accumulation is monotonic**
*For any* user and sequence of XP awards, the user's total XP should never decrease and should equal the sum of all awards.
**Validates: Requirements 1.6**

**Property 6: Level calculation is deterministic**
*For any* XP value, calculating the level should always return the same level, and that level should be the highest level whose threshold is less than or equal to the XP value.
**Validates: Requirements 2.1, 2.4**

**Property 7: Level thresholds are correctly defined**
*For any* user, when their XP is 0 they should be level 1, at 100 XP they should be level 2, at 300 XP they should be level 3, and at 600 XP they should be level 4.
**Validates: Requirements 2.2**

**Property 8: Progress to next level is accurate**
*For any* user at a given level, the displayed progress should show current XP, current level, and the correct XP threshold for the next level.
**Validates: Requirements 2.5**

**Property 9: Concurrent XP awards are handled correctly**
*For any* user receiving multiple XP awards simultaneously, the final XP total should equal the initial XP plus the sum of all awards, with no awards lost.
**Validates: Requirements 10.2**

### Streak System Properties

**Property 10: Activity date is recorded**
*For any* user performing an activity, the last_activity_date should be updated to the current date in UTC.
**Validates: Requirements 3.1, 3.6**

**Property 11: Consecutive day activity increments streak**
*For any* user whose last activity was exactly one calendar day ago, performing an activity today should increment their streak_count by 1.
**Validates: Requirements 3.2**

**Property 12: Same-day activities are idempotent**
*For any* user performing multiple activities on the same calendar day, the streak_count should remain unchanged after the first activity.
**Validates: Requirements 3.3**

**Property 13: Activity gaps reset streak**
*For any* user whose last activity was more than 24 hours ago (not the previous calendar day), performing an activity should reset their streak_count to 1.
**Validates: Requirements 3.4**

**Property 14: Streak milestones award bonus XP once**
*For any* user reaching a streak milestone (7, 30, or 100 days), bonus XP should be awarded exactly once for that milestone, and reaching the same milestone again should not award additional bonus XP.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Achievement System Properties

**Property 15: Achievement data is complete**
*For any* achievement created in the system, it should have a name, description, icon, xp_reward, condition_type, and be retrievable from the achievements catalog.
**Validates: Requirements 5.1, 5.3, 5.4, 5.5**

**Property 16: Activity triggers achievement evaluation**
*For any* user completing an activity, all achievements with conditions related to that activity type should be evaluated for unlock.
**Validates: Requirements 6.1**

**Property 17: Satisfied conditions unlock achievements**
*For any* user and achievement, when the user satisfies the achievement's unlock condition and has not previously unlocked it, the achievement should be unlocked with a record containing user_id, achievement_id, and unlocked_at timestamp.
**Validates: Requirements 6.2, 6.3**

**Property 18: Achievement unlocks are idempotent**
*For any* user and achievement, attempting to unlock the same achievement multiple times should result in exactly one user_achievement record.
**Validates: Requirements 6.4**

**Property 19: Achievement progress is accurate**
*For any* user and quantifiable achievement, the calculated progress should show the current count, target count, and percentage, all accurately reflecting the user's actual progress.
**Validates: Requirements 12.1, 12.2, 12.3**

**Property 20: Non-quantifiable achievements show description only**
*For any* achievement without quantifiable progress, the display should show only the unlock condition description without progress values.
**Validates: Requirements 12.4**

### Certificate System Properties

**Property 21: Level completion generates certificate**
*For any* user completing all requirements for a JLPT level, a certificate should be generated with a PDF file stored at a valid file path.
**Validates: Requirements 7.1, 7.3**

**Property 22: Certificate content is complete**
*For any* generated certificate, the PDF should contain the user's name, JLPT level, issue date, and a unique certificate number.
**Validates: Requirements 7.2**

**Property 23: Certificate records are complete**
*For any* generated certificate, the database record should contain user_id, level_id, issued_at, certificate_number, and file_path.
**Validates: Requirements 7.4**

**Property 24: Certificate numbers are unique**
*For any* set of generated certificates, all certificate numbers should be unique across the entire system.
**Validates: Requirements 7.5**

**Property 25: User certificates are retrievable**
*For any* user with earned certificates, requesting their certificates should return all certificates belonging to that user and no certificates belonging to other users.
**Validates: Requirements 8.1**

**Property 26: Certificate downloads are authorized**
*For any* certificate download request, the download should succeed if and only if the requesting user owns the certificate.
**Validates: Requirements 8.3**

**Property 27: Certificate downloads use existing files**
*For any* certificate, downloading it multiple times should serve the same file without regenerating the PDF.
**Validates: Requirements 8.5**

### Data Integrity Properties

**Property 28: Gamification data persists immediately**
*For any* gamification data update (XP, level, streak, achievement unlock), the changes should be immediately visible in the database after the operation completes.
**Validates: Requirements 1.5, 2.3, 3.5, 6.6**

**Property 29: Invalid data is rejected**
*For any* attempt to persist invalid gamification data (negative XP, invalid level, null required fields), the system should reject the data and return an error.
**Validates: Requirements 10.3**

**Property 30: Referential integrity is maintained**
*For any* user_achievement or certificate record, the referenced user_id and achievement_id/level_id must exist in their respective tables, and orphaned records should be prevented.
**Validates: Requirements 10.5**

### Dashboard Properties

**Property 31: Dashboard data is complete**
*For any* user viewing their dashboard, the response should include current XP, level, progress to next level, streak count, days to next milestone, all unlocked achievements with dates, all locked achievements with progress, and all earned certificates with download links.
**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

**Property 32: Dashboard loads efficiently**
*For any* user dashboard request, all gamification data should be loaded with a minimal number of database queries (ideally a single optimized query with eager loading).
**Validates: Requirements 11.6**

**Property 33: Achievement progress updates immediately**
*For any* user completing an activity that affects achievement progress, the progress values should be updated and reflect the new state immediately.
**Validates: Requirements 12.5**

## Error Handling

### XP System Errors

- **Invalid XP Amount**: Reject negative or non-integer XP values with validation error
- **User Not Found**: Return 404 error when attempting to award XP to non-existent user
- **Database Failure**: Roll back XP transaction and return 500 error with logged details

### Streak System Errors

- **Invalid Date**: Reject invalid or future dates with validation error
- **Timezone Conversion Failure**: Log error and use UTC fallback
- **Concurrent Streak Updates**: Use database locking to prevent race conditions

### Achievement System Errors

- **Invalid Condition Type**: Reject achievements with unsupported condition types
- **Missing Achievement**: Return 404 when evaluating non-existent achievement
- **Duplicate Unlock Attempt**: Silently ignore (idempotent operation)
- **Evaluation Failure**: Log error but don't block primary activity (lesson/quiz completion)

### Certificate System Errors

- **PDF Generation Failure**: Return 500 error and log detailed error information
- **File Storage Failure**: Roll back certificate record creation and return error
- **Missing Certificate File**: Return 404 with message "Certificate file not found"
- **Unauthorized Download**: Return 403 error when user doesn't own certificate
- **Invalid Level**: Reject certificate generation for non-existent JLPT levels

### General Error Handling

- All service methods should throw specific exceptions that controllers can catch and convert to appropriate HTTP responses
- Database transactions should be used for all multi-step operations
- Failed operations should be logged with sufficient context for debugging
- User-facing error messages should be clear but not expose internal system details

## Testing Strategy

### Dual Testing Approach

The Gamification System requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs using randomized testing

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Framework**: Use **Pest PHP** with the **pest-plugin-faker** or integrate **PHPUnit with Eris** for property-based testing in Laravel.

**Configuration**:
- Each property test must run a minimum of 100 iterations with randomized inputs
- Each test must reference its corresponding design document property
- Tag format: `// Feature: gamification-system, Property {number}: {property_text}`

**Example Property Test Structure**:

```php
test('Property 1: Lesson completion awards fixed XP', function () {
    // Feature: gamification-system, Property 1: Lesson completion awards fixed XP
    
    // Run 100 iterations with random users and lessons
    for ($i = 0; $i < 100; $i++) {
        $user = User::factory()->create(['xp' => fake()->numberBetween(0, 10000)]);
        $lesson = Lesson::factory()->create();
        $initialXP = $user->xp;
        
        // Complete lesson
        app(XPService::class)->awardXP($user, 10, 'lesson');
        
        // Verify XP increased by exactly 10
        $user->refresh();
        expect($user->xp)->toBe($initialXP + 10);
    }
})->group('property-test', 'xp-system');
```

### Unit Testing

**Focus Areas**:
- Specific examples from requirements (level thresholds, quiz XP tiers, streak milestones)
- Edge cases (zero XP, max level, streak reset boundary conditions)
- Error conditions (invalid inputs, missing data, database failures)
- Integration points between services (achievement unlock triggering XP award)

**Balance**:
- Avoid writing too many unit tests for scenarios covered by property tests
- Focus unit tests on concrete examples that demonstrate correct behavior
- Use unit tests for error handling and edge cases that are difficult to generate randomly

### Test Coverage Goals

- **Services**: 100% coverage of public methods
- **Models**: Test relationships, scopes, and custom methods
- **Controllers**: Test HTTP responses, authorization, and error handling
- **Events/Listeners**: Test that events are dispatched and listeners respond correctly

### Integration Testing

- Test complete flows: lesson completion → XP award → level up → achievement unlock
- Test dashboard data loading with realistic user data
- Test certificate generation end-to-end including PDF creation
- Test concurrent operations (multiple users earning XP simultaneously)

### Performance Testing

- Dashboard query performance with large datasets (1000+ achievements, certificates)
- Concurrent XP updates (simulate 100 simultaneous lesson completions)
- Achievement evaluation performance (test with 50+ achievements)
- Certificate PDF generation time (should complete within 2 seconds)
