# Dokumen Kebutuhan: Sistem Gamifikasi

## Pendahuluan

Sistem Gamifikasi meningkatkan keterlibatan pengguna di platform pembelajaran bahasa Jepang Japanlingo melalui poin pengalaman, level, streak, pencapaian, dan sertifikat. Sistem ini memotivasi pelajar dengan menyediakan indikator kemajuan yang nyata dan hadiah untuk kebiasaan belajar yang konsisten serta pencapaian milestone.

## Glosarium

- **XP_System**: Komponen pelacakan poin pengalaman dan progresi level
- **Streak_Tracker**: Komponen yang memantau hari berturut-turut aktivitas pengguna
- **Achievement_Manager**: Komponen yang mengevaluasi dan membuka pencapaian
- **Certificate_Generator**: Komponen yang membuat dan mengelola sertifikat level JLPT
- **User**: Pelajar terdaftar di platform Japanlingo
- **Activity**: Setiap aksi pengguna yang berkontribusi pada XP atau streak (penyelesaian pelajaran, kuis, login harian)
- **Level**: Tingkatan progresi berdasarkan XP yang terkumpul
- **Streak**: Hari berturut-turut aktivitas platform
- **Achievement**: Milestone yang telah ditentukan dengan kondisi pembukaan dan hadiah
- **Certificate**: Dokumen PDF yang diterbitkan setelah menyelesaikan level JLPT
- **JLPT_Level**: Level Japanese Language Proficiency Test (N5, N4, N3, N2, N1)

## Requirements

### Requirement 1: XP Accumulation and Tracking

**User Story:** As a user, I want to earn experience points from my learning activities, so that I can track my overall progress and engagement.

#### Acceptance Criteria

1. WHEN a user completes a lesson, THE XP_System SHALL award 10 XP to the user
2. WHEN a user passes a quiz, THE XP_System SHALL award XP between 20 and 50 based on the quiz score percentage
3. WHEN a user logs in for the first time in a day, THE XP_System SHALL award 5 XP to the user
4. WHEN a user unlocks an achievement, THE XP_System SHALL award the achievement's bonus XP to the user
5. WHEN XP is awarded, THE XP_System SHALL persist the updated XP total to the database immediately
6. THE XP_System SHALL maintain a running total of all XP earned by each user

### Requirement 2: Level Progression System

**User Story:** As a user, I want to advance through levels as I earn XP, so that I can see my learning journey progress.

#### Acceptance Criteria

1. WHEN a user's XP reaches or exceeds a level threshold, THE XP_System SHALL promote the user to the corresponding level
2. THE XP_System SHALL define level thresholds as follows: Level 1 (0 XP), Level 2 (100 XP), Level 3 (300 XP), Level 4 (600 XP)
3. WHEN a user's level increases, THE XP_System SHALL persist the new level to the database immediately
4. THE XP_System SHALL calculate the current level based on total accumulated XP
5. WHEN displaying user progress, THE XP_System SHALL show current level, current XP, and XP required for next level

### Requirement 3: Streak Tracking and Maintenance

**User Story:** As a user, I want my consecutive days of activity tracked, so that I can build and maintain learning habits.

#### Acceptance Criteria

1. WHEN a user performs any activity on a given day, THE Streak_Tracker SHALL record the activity date
2. WHEN a user performs their first activity of the day, THE Streak_Tracker SHALL increment the streak count if the last activity was the previous calendar day
3. WHEN a user performs their first activity of the day, THE Streak_Tracker SHALL maintain the current streak count if the last activity was the same calendar day
4. IF more than 24 hours have elapsed since the last activity date, THEN THE Streak_Tracker SHALL reset the streak count to 1
5. THE Streak_Tracker SHALL persist the streak count and last activity date to the database immediately after any update
6. THE Streak_Tracker SHALL use UTC timezone for all date comparisons to ensure consistency

### Requirement 4: Streak Milestone Rewards

**User Story:** As a user, I want to receive bonus XP for reaching streak milestones, so that I am rewarded for consistent learning habits.

#### Acceptance Criteria

1. WHEN a user reaches a 7-day streak, THE Streak_Tracker SHALL award bonus XP to the user
2. WHEN a user reaches a 30-day streak, THE Streak_Tracker SHALL award bonus XP to the user
3. WHEN a user reaches a 100-day streak, THE Streak_Tracker SHALL award bonus XP to the user
4. THE Streak_Tracker SHALL award milestone bonuses only once per milestone achievement
5. WHEN a streak milestone is reached, THE Streak_Tracker SHALL trigger the XP_System to add the bonus XP

### Requirement 5: Achievement Definition and Storage

**User Story:** As a system administrator, I want to define achievements with unlock conditions, so that users have clear goals to work toward.

#### Acceptance Criteria

1. THE Achievement_Manager SHALL store achievement definitions with name, description, icon, XP reward, and condition type
2. THE Achievement_Manager SHALL support condition types including: lesson completion count, quiz performance, streak milestones, and level attainment
3. WHEN an achievement is created, THE Achievement_Manager SHALL persist it to the achievements table
4. THE Achievement_Manager SHALL maintain a catalog of all available achievements
5. THE Achievement_Manager SHALL provide achievement data for display in the user interface

### Requirement 6: Achievement Unlock Evaluation

**User Story:** As a user, I want achievements to unlock automatically when I meet their conditions, so that I receive recognition for my accomplishments.

#### Acceptance Criteria

1. WHEN a user completes an activity, THE Achievement_Manager SHALL evaluate all achievement conditions that could be affected by that activity
2. WHEN an achievement's unlock condition is satisfied, THE Achievement_Manager SHALL unlock the achievement for the user
3. WHEN an achievement is unlocked, THE Achievement_Manager SHALL record the user_id, achievement_id, and unlock timestamp
4. THE Achievement_Manager SHALL prevent duplicate unlocks of the same achievement for a user
5. WHEN an achievement is unlocked, THE Achievement_Manager SHALL trigger the XP_System to award the achievement's bonus XP
6. THE Achievement_Manager SHALL persist achievement unlocks to the user_achievements table immediately

### Requirement 7: Certificate Generation

**User Story:** As a user, I want to receive a certificate when I complete a JLPT level, so that I have a tangible record of my achievement.

#### Acceptance Criteria

1. WHEN a user completes all requirements for a JLPT level, THE Certificate_Generator SHALL create a PDF certificate
2. THE Certificate_Generator SHALL include the user's name, JLPT level, issue date, and a unique certificate number in the PDF
3. WHEN a certificate is generated, THE Certificate_Generator SHALL store the PDF file in a secure location
4. WHEN a certificate is generated, THE Certificate_Generator SHALL persist the certificate record with user_id, level_id, issued_at, certificate_number, and file_path
5. THE Certificate_Generator SHALL generate unique certificate numbers using a combination of level code, user ID, and timestamp
6. THE Certificate_Generator SHALL use a professional template with appropriate branding for certificate PDFs

### Requirement 8: Certificate Access and Download

**User Story:** As a user, I want to download my earned certificates from my dashboard, so that I can share or print my achievements.

#### Acceptance Criteria

1. WHEN a user views their dashboard, THE Certificate_Generator SHALL display all certificates earned by that user
2. WHEN a user requests to download a certificate, THE Certificate_Generator SHALL serve the PDF file for download
3. THE Certificate_Generator SHALL verify that the requesting user owns the certificate before allowing download
4. WHEN a certificate file is missing, THE Certificate_Generator SHALL return an appropriate error message
5. THE Certificate_Generator SHALL support certificate downloads without requiring re-generation

### Requirement 9: XP Calculation for Quiz Performance

**User Story:** As a user, I want to earn more XP for better quiz performance, so that I am rewarded for mastery.

#### Acceptance Criteria

1. WHEN a user completes a quiz with a score of 100%, THE XP_System SHALL award 50 XP
2. WHEN a user completes a quiz with a score between 80% and 99%, THE XP_System SHALL award 35 XP
3. WHEN a user completes a quiz with a score between 60% and 79%, THE XP_System SHALL award 20 XP
4. WHEN a user completes a quiz with a score below 60%, THE XP_System SHALL award 0 XP
5. THE XP_System SHALL calculate quiz XP based on the percentage of correct answers

### Requirement 10: Data Integrity and Persistence

**User Story:** As a system administrator, I want all gamification data to be reliably stored and consistent, so that user progress is never lost.

#### Acceptance Criteria

1. WHEN any gamification data is updated, THE system SHALL use database transactions to ensure atomicity
2. WHEN XP is awarded from multiple sources simultaneously, THE XP_System SHALL handle concurrent updates without data loss
3. THE system SHALL validate all gamification data before persistence to prevent invalid states
4. WHEN a database operation fails, THE system SHALL roll back the transaction and return an error
5. THE system SHALL maintain referential integrity between users, achievements, and certificates tables

### Requirement 11: Gamification Dashboard Display

**User Story:** As a user, I want to view my gamification progress on my dashboard, so that I can see my achievements and current status at a glance.

#### Acceptance Criteria

1. WHEN a user views their dashboard, THE system SHALL display current XP, level, and progress to next level
2. WHEN a user views their dashboard, THE system SHALL display current streak count and days until next milestone
3. WHEN a user views their dashboard, THE system SHALL display all unlocked achievements with unlock dates
4. WHEN a user views their dashboard, THE system SHALL display locked achievements with progress indicators where applicable
5. WHEN a user views their dashboard, THE system SHALL display all earned certificates with download links
6. THE system SHALL load all dashboard gamification data in a single optimized query to minimize database calls

### Requirement 12: Achievement Progress Tracking

**User Story:** As a user, I want to see my progress toward locked achievements, so that I know how close I am to unlocking them.

#### Acceptance Criteria

1. WHERE an achievement has quantifiable progress, THE Achievement_Manager SHALL calculate and display current progress
2. WHEN displaying achievement progress, THE Achievement_Manager SHALL show both current value and target value
3. THE Achievement_Manager SHALL support progress tracking for achievements based on counts (lessons completed, quizzes passed, streak days)
4. WHEN an achievement has no quantifiable progress, THE Achievement_Manager SHALL display only the unlock condition description
5. THE Achievement_Manager SHALL update progress displays in real-time as users complete activities
