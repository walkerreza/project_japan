# Japanlingo Collaboration Context

## Purpose

This document is the working context for Japanlingo so multiple AI agents and human developers can collaborate without losing direction, repeating decisions, or expanding scope unintentionally.

Treat this file as the temporary source of truth for the current implementation phase.

---

## Current Product Direction

Japanlingo is currently being built as:

- a web-based Japanese learning platform
- focused on JLPT N3 and kanji learning
- inspired by Duolingo for progression and feedback loops
- inspired by Kanji Senpai for compact, habit-forming gamified learning

Current active focus:

- **Phase 2: Achievement System Implementation**
- **Phase 5: N3 Certificate Flow**
- Backend and frontend feedback for newly unlocked achievements
- Audit history UI for users (Optional/Polishing)

Out of scope for now:

- full N5 to N1 expansion
- complete payment system
- advanced superadmin system
- complex cohort or access-key management
- SEO refinement
- non-essential public page polish

---

## Phase Goal

The current phase is successful when this loop works reliably:

1. backend checks achievements after activity
2. backend persists unlocks to `user_achievements`
3. user earns achievement XP automatically
4. frontend shows the result/alert after unlocking an achievement
5. certificate eligibility is determined correctly from real progress

Minimum acceptable result for this phase:

- basic achievements unlock correctly (First Lesson, First Quiz Pass, etc.)
- dashboard/profile shows unlocked achievements
- N3 certificate can be generated upon full completion

---

## Current Known State (Updated)

✅ **Already implemented and stable:**

- **XP & Level Engine**: Backend source of truth at `XPService.php`.
- **Streak Logic**: `StreakService.php` with daily validation and milestones (7, 30, 100).
- **Audit Logging**: `reward_logs` table records every XP transaction (Anti-cheat).
- **Core Connections**: User Dashboard, Leaderboard, Lesson Lobby, and Quiz Lobby all use **real data**.
- **Quiz Engine**: Adaptive UI for multiple choice, Kanji cards, and audio questions.
- **Lock System**: Lessons and Quizzes unlock based on user progress history.

⚠️ **Remaining weak points / Next focus:**

- `AchievementService.php` is still a skeleton/placeholder.
- `ProcessGamificationRewards` listener does not yet trigger achievement evaluations.
- N3 Certificate logic is not yet defined or exposed.
- No user-facing UI to see XP transaction history (*Audit Trail*).

---

## Gamification Rules (Active)

### Initial Achievement Set (To be implemented)

- `First Lesson`: Unlock after 1st completed lesson.
- `First Quiz Pass`: Unlock after 1st passed quiz.
- `7-Day Streak`: Unlock when streak reaches 7.
- `Perfect 10`: Unlock after 10 quizzes with 100% score.
- `N3 Completer`: Unlock after completing all N3 content (linked to Certificate).

---

## Remaining Delivery Order

### Phase 2 - Implement Basic Achievements (CURRENT FOCUS)

1. Complete `AchievementService.php`.
2. Evaluate accomplishments after lesson/quiz completion events.
3. Handle concurrent XP awards from achievements.
4. Show a "Popup/Toast" on frontend when an achievement is unlocked.

### Phase 5 - Finalize N3 Certificate

1. Define N3 completion requirements from real database lessons/quizzes.
2. Determine eligibility from `progress` table.
3. Generate and expose certificate in user-facing UI.

---

## Instructions for the Next AI Agent

1. **Continue to Phase 2 (Achievements)**.
2. Do not backtrack into XP/Streak logic unless bugs are found.
3. Ensure all new logic remains in the Backend.
4. Maintain the "Solid/Bold" UI design for any new Achievement popups.
