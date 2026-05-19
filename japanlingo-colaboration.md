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
- **Kanji Bank Sync (Phase 4 extension)**: `kanji_bank` table, Admin Kanji Bank CRUD, single-kanji auto-fill, and Artisan bulk sync command are implemented.

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
4. Maintain Kanji Bank data locally through `php artisan kanji:sync --level=N3`.

### Phase 4A - Kanji Bank & Question Analytics (IMPLEMENTED)

Purpose:

- Provide a local kanji dictionary for JLPT N3 learning flows.
- Avoid depending on external API calls during normal student usage.
- Let admin/sensei review, edit, and publish kanji entries before they are used in lessons or quizzes.

Implemented backend:

- `kanji_bank` database table.
- `App\Models\Kanji`.
- `App\Http\Controllers\Admin\AdminKanjiController`.
- `App\Console\Commands\SyncKanjiBank`.
- `attempt_answers` database table for per-question quiz attempt tracking.
- `App\Models\AttemptAnswer`.

Implemented frontend:

- `resources/js/Pages/Admin/Kanji/AdminKanjiIndex.jsx`.
- Admin sidebar menu item: `Kanji Bank`.
- Quiz Builder import button for CSV/Excel question import.
- Quiz Builder `Generate Kanji` modal for creating questions from `kanji_bank`.
- Module Content Builder `Import Kanji Bank` modal for creating draft lesson blocks from `kanji_bank`.
- Admin Analytics question-performance table.

Kanji API source:

- Base API: `https://kanjiapi.dev`.
- N3 list endpoint: `https://kanjiapi.dev/v1/kanji/jlpt-3`.
- Detail endpoint: `https://kanjiapi.dev/v1/kanji/{kanji}`.

How to sync Kanji N3:

```bash
cd japanlingo
php artisan kanji:sync --level=N3 --sleep=100
```

Useful dictionary sync commands:

```bash
cd japanlingo
php artisan kanji:sync --level=N5 --sleep=100
php artisan kanji:sync --level=N4 --sleep=100
php artisan kanji:sync --level=N3 --sleep=100
```

Safe test command:

```bash
cd japanlingo
php artisan kanji:sync --level=N3 --limit=10 --sleep=50
```

Notes:

- N3 currently returns 367 kanji from `kanjiapi.dev`.
- Sync stores entries with `status = draft` so admin can review before publishing.
- API provides Japanese readings and English meanings only.
- Indonesian meaning, example sentences, and learning-specific notes still need manual curation by admin/sensei.
- `kanjiapi.dev` does not provide direct reverse search like `fire -> 火`; Japanlingo solves this by syncing API data into `kanji_bank`, then searching locally by English meaning, Indonesian meaning, onyomi, kunyomi, example word, and example meaning.
- Example: searching `fire` requires N5 data because `火` is JLPT N5, not N3.
- Do not fetch the whole API from the browser. Use the Artisan command or a backend job.
- If full sync is moved to UI later, trigger the same backend logic via a queued job instead of synchronous request.

Question analytics status:

- User quiz submit now sends and stores per-question answers into `attempt_answers`.
- Admin Analytics can identify low-performing questions based on answer accuracy.
- Old quiz submit payload remains backward compatible.

Kanji-to-builder automation:

- Quiz endpoint: `POST /admin/quizzes/{quiz}/questions/generate-kanji`.
- Module endpoint: `POST /admin/modules/{module}/kanji-lessons/import`.
- Quiz generation modes:
- `meaning`: asks the meaning of a kanji.
- `reading`: asks the main onyomi/kunyomi reading.
- `kanji_from_meaning`: asks the user to choose kanji from a meaning.
- Module import creates new `Lesson` records as `draft`, appending them to the end of the selected module.
- These features depend on `kanji_bank`; run `kanji:sync` first, then curate/publish entries as needed.

Global frontend theme control:

- Superadmin can edit frontend theme from `Superadmin > Sistem`.
- Theme settings are stored globally in `app_settings` with key `frontend_theme`.
- Root Blade injects the global theme into `window.__JAPANLINGO_THEME__` before Vite loads React.
- `resources/js/Components/theme/themes.js` reads that global setting, so changes affect user-facing pages after reload.
- This is no longer stored in browser-only `localStorage`.

Google OAuth / Socialite:

- `laravel/socialite` is installed.
- Google login routes:
- `GET /auth/google/redirect`
- `GET /auth/google/callback`
- Controller: `App\Http\Controllers\Auth\SocialiteController`.
- User fields added: `auth_provider`, `google_id`, `avatar`.
- Facebook auth UI has been removed from login/register.
- Required environment values:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI="${APP_URL}/auth/google/callback"
```

- In Google Cloud Console, add the same callback URL as an Authorized redirect URI.
- On hosting, set `APP_URL` to the production domain before setting `GOOGLE_REDIRECT_URI`.

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
