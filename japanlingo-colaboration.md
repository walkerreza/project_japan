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

- **Admin Panel Operations (Phase 4)**: Finalizing full CRUD support for Levels, Quizzes, and Questions, including multimedia upload and proper React UI.
- **Paywall & Subscriptions (Phase 5)**: Implementing `SubscriptionMiddleware` to restrict premium content access.
- **Superadmin (Phase 6)**: Actualizing cohort, access key, and payment log logic.

Out of scope for now:
- full N5 to N1 expansion
- SEO refinement
- non-essential public page polish

---

## Phase Goal

The current phase (Phase 4 & 5) is successful when this loop works reliably:

1. Admin can safely Create, Read, Update, Delete questions (`questions`) through a functioning React UI.
2. Premium lessons are blocked by a Middleware for non-premium users, prompting them to upgrade.

---

## Current Known State (Updated)

✅ **Already implemented and stable:**

- **Gamification Mechanics**: `AchievementService.php`, `CertificateService.php`, N3 Certificate generation, XP logs.
- **Auth & Role Foundations (Phase 3.1)**: `username` validaton used, T&C checkbox added, Profile routing dynamic, redirect logic fixed.
- **Dynamic Student Flow (Phase 3.2)**: `Lesson.jsx` fetches real DB objects (HTML, PDF, MP3, Video), `Quiz.jsx` connects to real questions and records actual progress to `ProgressController`.
- **Admin Panel Foundations (Phase 4 partial)**: `ModuleController` & `QuizController` have functioning Validation FormRequests, Pagination, and Search. `QuizBuilder` acts as a preview engine.

⚠️ **Remaining weak points / Next focus:**

- `Admin/Questions/Index.jsx` and `Create/Edit.jsx` need to be connected cleanly and finalized.
- Level/Module lock restrictions are partially bypassed by missing `SubscriptionMiddleware`.
- Superadmin routing and pages (`Users`, `Admins`, `Payments`) exist purely as mockups without controllers.
- Backend payment tables are missing.

---

## Remaining Delivery Order

### Phase 4 - Admin Panel Finalization (CURRENT)

1. Review and finalize `Admin/Questions` React page to ensure questions can be viewed, created, and modified.
2. Assure `Level` management functionality or solidify it purely as Seeder data.
3. Attach JSON/CSV bulk import functionality for Quizzes.

### Phase 5 - Subscriptions & Paywall (NEXT)

1. Introduce `SubscriptionMiddleware` at the router level for `/lessons` and `/quizzes`.
2. Build Upgrade CTA pages/modals that trigger when `student` is `free` but clicks a `premium` object.

### Phase 6 - Superadmin & Payments (NEXT)

1. Create backend schemas for `payment_plans` and `transactions`.
2. Create `SuperAdminController` to manage global Data User & Aktivitas secara real.

---

## Instructions for the Next AI Agent

1. **Start at Phase 4 (Admin Finalization) and Phase 5**. Phase 3.1 & 3.2 are complete.
2. Do not break the pagination logic in Admin controllers.
3. Keep the React components using the Solid/Neo-Brutalism aesthetics that are currently defining the app.
