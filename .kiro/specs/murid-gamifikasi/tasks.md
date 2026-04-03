# Implementation Plan: Gamification System

## Overview

This implementation plan breaks down the Gamification System into incremental coding tasks. The approach follows a bottom-up strategy: first establishing database structure and models, then building core services, adding event-driven integration, implementing API endpoints, and finally creating the React frontend components. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [ ] 1. Database setup and migrations
  - [ ] 1.1 Create migration to add gamification columns to users table
    - Add columns: xp (integer, default 0), level (integer, default 1), streak_count (integer, default 0), last_activity_date (timestamp, nullable)
    - _Requirements: 1.5, 2.3, 3.5_
  
  - [ ] 1.2 Create achievements table migration
    - Columns: id, name, description, icon, xp_reward, condition_type, condition_value, timestamps
    - _Requirements: 5.1, 5.3_
  
  - [ ] 1.3 Create user_achievements pivot table migration
    - Columns: id, user_id (foreign key), achievement_id (foreign key), unlocked_at (timestamp), timestamps
    - Add unique constraint on [user_id, achievement_id]
    - Add cascade delete on foreign keys
    - _Requirements: 6.3, 6.4_
  
  - [ ] 1.4 Create certificates table migration
    - Columns: id, user_id (foreign key), level_id (foreign key), issued_at (timestamp), certificate_number (string, unique), file_path (string), timestamps
    - Add cascade delete on foreign keys
    - _Requirements: 7.4, 10.5_

- [ ] 2. Create Eloquent models and relationships
  - [ ] 2.1 Update User model with gamification fields
    - Add fillable fields: xp, level, streak_count, last_activity_date
    - Add casts: xp (integer), level (integer), streak_count (integer), last_activity_date (datetime)
    - Add relationships: achievements() (belongsToMany), certificates() (hasMany)
    - _Requirements: 1.5, 2.3, 3.5_
  
  - [ ] 2.2 Create Achievement model
    - Add fillable fields: name, description, icon, xp_reward, condition_type, condition_value
    - Add casts: xp_reward (integer), condition_value (integer)
    - Add relationship: users() (belongsToMany)
    - _Requirements: 5.1, 5.3_
  
  - [ ] 2.3 Create UserAchievement model
    - Add fillable fields: user_id, achievement_id, unlocked_at
    - Add casts: unlocked_at (datetime)
    - Add relationships: user() (belongsTo), achievement() (belongsTo)
    - _Requirements: 6.3_
  
  - [ ] 2.4 Create Certificate model
    - Add fillable fields: user_id, level_id, issued_at, certificate_number, file_path
    - Add casts: issued_at (datetime)
    - Add relationships: user() (belongsTo), level() (belongsTo)
    - _Requirements: 7.4_

- [ ] 3. Implement XPService
  - [ ] 3.1 Create XPService class with level threshold configuration
    - Define LEVEL_THRESHOLDS constant array
    - Implement calculateLevel(int $xp): int method
    - Implement getXPForNextLevel(int $currentLevel): ?int method
    - _Requirements: 2.1, 2.2, 2.4, 2.5_
  
  - [ ]* 3.2 Write property test for level calculation
    - **Property 6: Level calculation is deterministic**
    - **Validates: Requirements 2.1, 2.4**
  
  - [ ]* 3.3 Write unit tests for level thresholds
    - Test specific thresholds: 0 XP = Level 1, 100 XP = Level 2, 300 XP = Level 3, 600 XP = Level 4
    - **Property 7: Level thresholds are correctly defined**
    - **Validates: Requirements 2.2**
  
  - [ ] 3.4 Implement calculateQuizXP method
    - Calculate XP based on score percentage: 100% = 50 XP, 80-99% = 35 XP, 60-79% = 20 XP, <60% = 0 XP
    - _Requirements: 1.2, 9.5_
  
  - [ ]* 3.5 Write property test for quiz XP calculation
    - **Property 2: Quiz XP scales with performance**
    - **Validates: Requirements 1.2, 9.1, 9.2, 9.3, 9.4, 9.5**
  
  - [ ] 3.6 Implement awardXP method with database transaction
    - Accept User, amount, and source parameters
    - Update user XP, calculate new level, persist to database
    - Return array with xp_awarded, level_up (bool), new_level
    - Use DB transaction for atomicity
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 2.1, 2.3_
  
  - [ ]* 3.7 Write property test for XP accumulation
    - **Property 5: XP accumulation is monotonic**
    - **Validates: Requirements 1.6**
  
  - [ ]* 3.8 Write property test for concurrent XP awards
    - **Property 9: Concurrent XP awards are handled correctly**
    - **Validates: Requirements 10.2**

- [ ] 4. Implement StreakService
  - [ ] 4.1 Create StreakService class with milestone configuration
    - Define STREAK_MILESTONES constant array (7 => 50, 30 => 200, 100 => 1000)
    - Implement determineStreakAction private method
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [ ] 4.2 Implement updateStreak method
    - Accept User parameter
    - Determine action (increment, maintain, reset) based on last_activity_date
    - Update streak_count and last_activity_date using UTC timezone
    - Check for milestone and return bonus XP
    - Use DB transaction
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 4.3 Write property test for consecutive day streak increment
    - **Property 11: Consecutive day activity increments streak**
    - **Validates: Requirements 3.2**
  
  - [ ]* 4.4 Write property test for same-day idempotence
    - **Property 12: Same-day activities are idempotent**
    - **Validates: Requirements 3.3**
  
  - [ ]* 4.5 Write property test for streak reset
    - **Property 13: Activity gaps reset streak**
    - **Validates: Requirements 3.4**
  
  - [ ] 4.3 Implement checkMilestone method
    - Compare old and new streak counts
    - Return bonus XP if milestone reached and not previously awarded
    - Track awarded milestones to prevent duplicate awards
    - _Requirements: 4.4, 4.5_
  
  - [ ]* 4.7 Write property test for milestone bonuses
    - **Property 14: Streak milestones award bonus XP once**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ] 5. Implement AchievementService
  - [ ] 5.1 Create AchievementService class with condition evaluation logic
    - Implement hasUnlocked method to check if user already has achievement
    - Implement unlockAchievement method to create user_achievement record
    - Use DB transaction for unlock
    - _Requirements: 6.2, 6.3, 6.4, 6.6_
  
  - [ ]* 5.2 Write property test for achievement unlock idempotence
    - **Property 18: Achievement unlocks are idempotent**
    - **Validates: Requirements 6.4**
  
  - [ ] 5.3 Implement evaluateAchievements method
    - Accept User, activityType, and context parameters
    - Query achievements matching activityType
    - Evaluate each achievement's condition
    - Unlock satisfied achievements
    - Return array of newly unlocked achievements
    - _Requirements: 6.1, 6.2_
  
  - [ ]* 5.4 Write property test for achievement evaluation
    - **Property 16: Activity triggers achievement evaluation**
    - **Property 17: Satisfied conditions unlock achievements**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ] 5.5 Implement calculateProgress method
    - Accept User and Achievement parameters
    - Calculate current progress based on condition_type
    - Return array with current, target, and percentage
    - _Requirements: 12.1, 12.2, 12.3_
  
  - [ ]* 5.6 Write property test for achievement progress calculation
    - **Property 19: Achievement progress is accurate**
    - **Validates: Requirements 12.1, 12.2, 12.3**
  
  - [ ] 5.7 Implement getAchievementsWithStatus method
    - Load all achievements with user's unlock status
    - Include progress data for locked achievements
    - Eager load relationships to minimize queries
    - _Requirements: 5.4, 5.5, 12.1_

- [ ] 6. Implement CertificateService
  - [ ] 6.1 Create CertificateService class with PDF generation
    - Install and configure Laravel PDF library (e.g., barryvdh/laravel-dompdf)
    - Implement generateCertificateNumber private method
    - Format: {LEVEL_CODE}-{USER_ID}-{TIMESTAMP}
    - _Requirements: 7.5_
  
  - [ ]* 6.2 Write property test for certificate number uniqueness
    - **Property 24: Certificate numbers are unique**
    - **Validates: Requirements 7.5**
  
  - [ ] 6.3 Create certificate PDF template blade file
    - Design professional certificate layout with branding
    - Include placeholders for: user name, JLPT level, date, certificate number
    - _Requirements: 7.2, 7.6_
  
  - [ ] 6.4 Implement createPDF private method
    - Accept User, levelId, and certificateNumber parameters
    - Render blade template with data
    - Generate PDF and save to storage
    - Return file path
    - _Requirements: 7.1, 7.2, 7.3_
  
  - [ ] 6.5 Implement generateCertificate method
    - Accept User and levelId parameters
    - Generate certificate number
    - Create PDF file
    - Create Certificate model record with all fields
    - Use DB transaction
    - Return Certificate model
    - _Requirements: 7.1, 7.3, 7.4_
  
  - [ ]* 6.6 Write property test for certificate generation
    - **Property 21: Level completion generates certificate**
    - **Property 23: Certificate records are complete**
    - **Validates: Requirements 7.1, 7.3, 7.4**
  
  - [ ] 6.7 Implement getUserCertificates method
    - Query certificates for specific user
    - Eager load level relationship
    - _Requirements: 8.1_
  
  - [ ] 6.8 Implement verifyCertificateOwnership method
    - Check if certificate belongs to requesting user
    - Return boolean
    - _Requirements: 8.3_
  
  - [ ]* 6.9 Write property test for certificate authorization
    - **Property 26: Certificate downloads are authorized**
    - **Validates: Requirements 8.3**

- [ ] 7. Create Laravel events and listeners
  - [ ] 7.1 Create LessonCompleted event
    - Include User and Lesson properties
    - _Requirements: 1.1_
  
  - [ ] 7.2 Create QuizCompleted event
    - Include User, Quiz, and score properties
    - _Requirements: 1.2_
  
  - [ ] 7.3 Create UserLoggedIn event (or use existing Laravel event)
    - Include User property
    - _Requirements: 1.3_
  
  - [ ] 7.4 Create AchievementUnlocked event
    - Include User and Achievement properties
    - _Requirements: 6.5_
  
  - [ ] 7.5 Create GamificationEventListener class
    - Listen to LessonCompleted: award 10 XP, update streak, evaluate achievements
    - Listen to QuizCompleted: calculate and award quiz XP, update streak, evaluate achievements
    - Listen to UserLoggedIn: award 5 XP (first login of day), update streak
    - Listen to AchievementUnlocked: award achievement bonus XP
    - Inject XPService, StreakService, AchievementService
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 6.1_
  
  - [ ] 7.6 Register events and listeners in EventServiceProvider
    - Map events to GamificationEventListener methods
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Create API controllers and routes
  - [ ] 9.1 Create DashboardController with gamification data endpoint
    - Implement index method to load user's gamification data
    - Load XP, level, progress to next level
    - Load streak count and days to next milestone
    - Load achievements with unlock status and progress
    - Load certificates with download URLs
    - Use single optimized query with eager loading
    - Return Inertia response with data
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [ ]* 9.2 Write property test for dashboard data completeness
    - **Property 31: Dashboard data is complete**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
  
  - [ ]* 9.3 Write property test for dashboard query efficiency
    - **Property 32: Dashboard loads efficiently**
    - **Validates: Requirements 11.6**
  
  - [ ] 9.4 Create AchievementController with list endpoint
    - Implement index method to return all achievements with user's status
    - Use AchievementService->getAchievementsWithStatus
    - Return Inertia response
    - _Requirements: 5.4, 5.5, 12.1_
  
  - [ ] 9.5 Create CertificateController with download endpoint
    - Implement download method
    - Verify certificate ownership using CertificateService
    - Check if file exists
    - Return file download response or 404/403 error
    - _Requirements: 8.2, 8.3, 8.4_
  
  - [ ]* 9.6 Write unit test for certificate download errors
    - Test missing file returns 404
    - Test unauthorized access returns 403
    - **Validates: Requirements 8.3, 8.4**
  
  - [ ] 9.7 Define routes in web.php
    - GET /dashboard - DashboardController@index
    - GET /achievements - AchievementController@index
    - GET /certificates/{certificate}/download - CertificateController@download
    - Apply auth middleware to all routes
    - _Requirements: 8.2, 11.1_

- [ ] 10. Create React frontend components
  - [ ] 10.1 Create GamificationDashboard component
    - Display XP progress bar with current XP and level
    - Display streak counter with milestone progress
    - Display grid of unlocked achievements
    - Display grid of locked achievements with progress bars
    - Display list of earned certificates with download buttons
    - Use Inertia props for data
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 10.2 Create XPProgressBar component
    - Accept currentXP, level, nextLevelXP props
    - Display level number and progress bar
    - Show XP text: "{currentXP} / {nextLevelXP} XP"
    - _Requirements: 2.5, 11.1_
  
  - [ ] 10.3 Create StreakCounter component
    - Accept streakCount, nextMilestone props
    - Display flame icon with streak count
    - Show days until next milestone
    - _Requirements: 11.2_
  
  - [ ] 10.4 Create AchievementCard component
    - Accept achievement, unlocked, progress props
    - Display achievement icon, name, description
    - Show unlock date if unlocked
    - Show progress bar if locked and has progress
    - Apply visual styling for locked vs unlocked state
    - _Requirements: 11.3, 11.4, 12.1, 12.2_
  
  - [ ] 10.5 Create CertificateCard component
    - Accept certificate prop
    - Display certificate level and issue date
    - Include download button with link to download endpoint
    - _Requirements: 11.5, 8.2_
  
  - [ ] 10.6 Integrate GamificationDashboard into main Dashboard page
    - Import and render GamificationDashboard component
    - Pass Inertia props from controller
    - _Requirements: 11.1_

- [ ] 11. Create database seeders for initial achievements
  - [ ] 11.1 Create AchievementSeeder class
    - Seed predefined achievements:
      - "First Steps" (complete 1 lesson, 10 XP)
      - "Quiz Master" (100% on 10 quizzes, 100 XP)
      - "Week Warrior" (7-day streak, 50 XP)
      - "Month Master" (30-day streak, 200 XP)
      - "Century Club" (100-day streak, 1000 XP)
      - Additional achievements as needed
    - _Requirements: 5.1, 5.2_
  
  - [ ] 11.2 Update DatabaseSeeder to call AchievementSeeder
    - Add AchievementSeeder to run in development and production
    - _Requirements: 5.1_

- [ ] 12. Add real-time progress updates (optional enhancement)
  - [ ] 12.1 Implement achievement progress update on activity completion
    - After lesson/quiz completion, refresh achievement progress
    - Use Inertia partial reloads or websockets for real-time updates
    - _Requirements: 12.5_
  
  - [ ]* 12.2 Write property test for immediate progress updates
    - **Property 33: Achievement progress updates immediately**
    - **Validates: Requirements 12.5**

- [ ] 13. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- All gamification logic is event-driven to maintain loose coupling with core features
- Database transactions ensure data integrity across all operations
