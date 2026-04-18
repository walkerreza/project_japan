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

- core gamification
- user learning loop for N3
- backend reward logic
- frontend reward feedback
- stable data flow between lesson, quiz, and gamification

Out of scope for now:

- full N5 to N1 expansion
- complete payment system
- advanced superadmin system
- complex cohort or access-key management
- SEO refinement
- non-essential public page polish

---

## Working Rule for All Agents

Do not broaden scope unless the user explicitly changes it.

When there is uncertainty, optimize for:

1. backend correctness
2. stable reward logic
3. real data integration
4. simple but clear frontend feedback
5. maintainability over visual complexity

---

## Phase Goal

The current phase is successful when this loop works reliably:

1. user finishes a lesson or quiz
2. backend processes XP
3. backend updates streak
4. backend checks achievements
5. all reward changes are saved safely
6. frontend shows the result clearly
7. dashboard reflects real progress

Minimum acceptable result for this phase:

- XP works correctly
- level progression works correctly
- streak works correctly
- basic achievements unlock correctly
- dashboard uses real data
- leaderboard works with real data

---

## Product Constraints

Important clarification:

- this phase is for N3-focused learning only
- current priority is gamification, not full platform completion
- backend and frontend do not need to be fully complete everywhere
- only the gamification loop must become solid first

This means it is acceptable if:

- some admin areas remain partial
- public pages remain unchanged
- payment is not implemented
- superadmin remains incomplete

This is not acceptable:

- XP logic split between frontend and backend
- double rewards
- inconsistent level progression
- streak behaving unpredictably
- UI showing fake gamification data when real data should exist

---

## Current Known State

Already available in the codebase:

- Laravel + Inertia + React structure
- base user, lesson, quiz, attempt, progress, achievement, and certificate models
- user gamification fields:
  - `xp`
  - `level`
  - `streak_count`
  - `last_activity_date`
- core events:
  - `LessonCompleted`
  - `QuizCompleted`
- initial services:
  - `XPService`
  - `StreakService`
- event listener:
  - `ProcessGamificationRewards`

Known weak points:

- backend and frontend are not fully connected
- some frontend pages still rely on static or presentation-first data
- achievements are not fully implemented
- leaderboard is not yet a real gamification surface
- reward history logging is missing
- certificate flow is not yet final

---

## Core Design Decision

Backend is the single source of truth.

That means:

- frontend must not be trusted to calculate final XP
- frontend must not own streak logic
- frontend must not decide achievement unlocks
- frontend may only display processed results returned by backend

All reward rules must live in backend services, listeners, and validated persistence.

---

## Gamification Rules

Use these rules unless the user explicitly changes them.

### XP Rules

- lesson completion: `+10 XP`
- quiz score `100%`: `+50 XP`
- quiz score `80% - 99%`: `+35 XP`
- quiz score `60% - 79%`: `+20 XP`
- quiz score `< 60%`: `0 XP`
- achievement unlock: add `xp_reward` from the achievement

### Level Rules

- Level 1: `0 XP`
- Level 2: `100 XP`
- Level 3: `300 XP`
- Level 4: `600 XP`

If more levels are added later, do not change the first four thresholds unless instructed.

### Streak Rules

- a valid daily activity may increment streak
- the same day must not increment streak twice
- if the gap is more than one day, streak resets to `1`
- valid streak activity currently includes:
  - lesson completion
  - quiz submission
  - daily login only if explicitly enabled later

### Initial Achievement Set

Implement basic achievements first:

- `First Lesson`
  - unlock after first completed lesson
- `First Quiz Pass`
  - unlock after first passed quiz
- `7-Day Streak`
  - unlock when streak reaches 7
- `Perfect 10`
  - unlock after 10 quizzes with 100% score

Do not add complex achievement logic before the engine is stable.

---

## Non-Negotiable Technical Rules

### 1. Prevent Double Rewards

The system must prevent:

- repeated XP for the same lesson completion
- duplicate achievement unlocks
- duplicate milestone streak rewards
- accidental duplicate reward processing caused by retries or repeated requests

### 2. Keep Reward Logic Centralized

All final reward calculations must happen in backend code.

Frontend may show:

- XP earned
- level up state
- streak update
- unlocked achievements

Frontend may not become the final authority for those outcomes.

### 3. Preserve Auditability

Reward history must be traceable.

Recommended addition:

- `reward_logs` or `xp_logs`

Suggested fields:

- `id`
- `user_id`
- `source_type`
- `source_id`
- `xp_amount`
- `description`
- `created_at`

Reason:

- debugging
- recent activity
- user progress transparency
- verification of duplicate-reward issues

---

## Recommended Delivery Order

Do not work randomly across the project. Use this order.

### Phase 1 - Stabilize Backend Reward Engine

Focus:

1. clean and centralize XP rules in `XPService`
2. clean and stabilize streak behavior in `StreakService`
3. verify lesson and quiz events trigger correctly
4. move remaining reward calculations out of frontend
5. add duplicate-reward protection
6. add `reward_logs` or equivalent

Expected outcome:

- stable backend reward engine
- reliable reward persistence

### Phase 2 - Implement Basic Achievements

Focus:

1. complete `AchievementService`
2. evaluate achievements after lesson, quiz, and streak changes
3. persist unlocks to `user_achievements`
4. award achievement XP through backend only

Expected outcome:

- basic achievements unlock automatically and safely

### Phase 3 - Connect Real Gamification Data to User UI

Focus:

1. show real XP on dashboard
2. show real level and next-level progress
3. show real streak
4. show recent achievements
5. show reward feedback after lesson or quiz completion

Expected outcome:

- user sees real gamification state instead of static visuals

### Phase 4 - Build a Simple Leaderboard

Focus:

1. rank users by XP
2. show top users
3. start with `all-time`
4. add `weekly` only if straightforward

Expected outcome:

- leaderboard becomes a real progression surface

### Phase 5 - Finalize N3 Certificate

Focus:

1. define N3 completion requirements clearly
2. determine eligibility from real progress data
3. generate certificate
4. expose certificate in user-facing UI

Expected outcome:

- certificate becomes the final N3 reward layer

---

## Priority Files

These are the first files an AI agent should inspect before making changes.

### Backend

- `japanlingo/app/Services/XPService.php`
- `japanlingo/app/Services/StreakService.php`
- `japanlingo/app/Services/AchievementService.php`
- `japanlingo/app/Listeners/ProcessGamificationRewards.php`
- `japanlingo/app/Http/Controllers/User/ProgressController.php`
- `japanlingo/app/Http/Controllers/User/LearningController.php`
- `japanlingo/app/Models/User.php`
- `japanlingo/app/Models/Attempt.php`
- `japanlingo/app/Models/Progress.php`
- `japanlingo/app/Models/Achievement.php`
- `japanlingo/app/Models/UserAchievement.php`
- `japanlingo/app/Models/Certificate.php`

### Database

- `japanlingo/database/migrations/0001_01_01_000000_create_users_table.php`
- `japanlingo/database/migrations/2026_02_19_143213_add_columns_to_users_table.php`
- `japanlingo/database/migrations/2026_02_19_140859_create_progress_table.php`
- new migration for `reward_logs` or `xp_logs`

### Frontend

- `japanlingo/resources/js/Pages/User/UserDashboard.jsx`
- `japanlingo/resources/js/Pages/User/Lesson.jsx`
- `japanlingo/resources/js/Pages/User/Quiz.jsx`
- `japanlingo/resources/js/Pages/User/Leaderboard.jsx`
- `japanlingo/resources/js/Pages/User/Progress.jsx`

---

## Preferred Backend-to-Frontend Reward Contract

When lesson completion or quiz submission is processed, the backend should ideally return a result like this:

```json
{
  "xp_awarded": 35,
  "total_xp": 240,
  "old_level": 2,
  "new_level": 3,
  "level_up": true,
  "streak_count": 4,
  "streak_milestone_bonus": 0,
  "new_achievements": [
    {
      "id": 1,
      "name": "First Quiz Pass",
      "xp_reward": 20
    }
  ]
}
```

Frontend should only display the reward state.

Frontend should not re-decide the reward state.

---

## Do Not Work On These Yet

Unless the user explicitly changes priorities, avoid spending time on:

- payment plans
- subscriptions
- transaction dashboards
- advanced superadmin tools
- cohort or kloter systems
- gated content access by cohort
- full multi-level expansion beyond N3
- major SEO work
- broad public-page redesign

---

## Default Answers for Ambiguity

If another agent gets blocked and no new instruction exists, use these defaults:

1. Is the current phase N3-only?  
   Yes.

2. Should daily login also award XP now?  
   No, not unless explicitly enabled.

3. Should failed quizzes still create attempts?  
   Yes.

4. Should failed quizzes below 60% award XP?  
   No.

5. Should leaderboard start with total XP or weekly XP?  
   Start with total XP.

6. When should N3 certificate be issued?  
   After all required N3 lessons and quizzes are fully completed by real progress rules.

---

## Definition of Done

This phase is done only when:

- lesson completion awards correct XP
- quiz completion awards correct XP based on score
- streak updates predictably across days
- basic achievements unlock automatically
- dashboard shows real gamification data
- leaderboard shows real ranking data
- reward history is traceable
- duplicate rewards are prevented

---

## Instructions for the Next AI Agent

If you continue from this file:

1. stay inside the N3 gamification scope
2. treat backend as the source of truth
3. prioritize stable reward logic before UI polish
4. do not add complexity before the basic loop is complete
5. do not silently overwrite the decisions in this file
6. if you revise direction, append a dated note explaining why
