# Superadmin Database and Frontend Changes

Date: 2026-04-25

## Summary

Superadmin pages are no longer only static mockups. The routes now use dedicated `SuperAdmin...Controller` classes that send real platform data where the current database already supports it.

This change intentionally does not implement payment, subscription billing, or cohort/kloter tables. Those remain Phase 6 scope.

## New Database Tables

### `news`

Purpose: portal berita maker and dashboard news for students/admins.

Migration note:
- The original migration filename still contains `announcements` because it had already been created during development.
- Its table definition now creates `news` for fresh installs.
- A follow-up migration renames existing local `announcements` tables to `news`.
- Another follow-up migration renames PostgreSQL constraints and indexes from `announcements_*` to `news_*`.

Primary key:
- `id`

Foreign keys:
- `created_by` references `users.id`, nullable, `nullOnDelete`
- `updated_by` references `users.id`, nullable, `nullOnDelete`

Important columns:
- `title`
- `excerpt`
- `body`
- `status`: default `draft`
- `audience`: default `students`
- `is_pinned`: boolean
- `published_at`
- `starts_at`
- `ends_at`

### `activity_logs`

Purpose: audit trail for sensitive superadmin/admin/system actions.

Primary key:
- `id`

Foreign keys:
- `actor_id` references `users.id`, nullable, `nullOnDelete`

Target reference:
- `target_type`
- `target_id`

This intentionally uses a loose target reference so one log table can point to users, modules, lessons, quizzes, news, and future records without fragile multi-table foreign keys.

### `login_histories`

Purpose: login tracking for the Superadmin `Aktivitas` page.

Primary key:
- `id`

Foreign keys:
- `user_id` references `users.id`, nullable, `nullOnDelete`

Important columns:
- `email`
- `role`
- `status`: default `success`
- `ip_address`
- `user_agent`
- `logged_in_at`

Successful login is now recorded from `AuthenticatedSessionController`.

### `user_status_histories`

Purpose: audit trail for future suspend/activate user workflows.

Primary key:
- `id`

Foreign keys:
- `user_id` references `users.id`, `cascadeOnDelete`
- `changed_by` references `users.id`, nullable, `nullOnDelete`

Important columns:
- `old_status`
- `new_status`
- `reason`

## Updated Existing Table

### `users`

Added:
- `status`: default `active`
- `suspended_at`
- `suspended_reason`

These fields support basic superadmin account control without needing payment or cohort logic.

## Backend Changes

New controllers:
- `SuperAdminDashboardController`
- `SuperAdminUserController`
- `SuperAdminAdminController`
- `SuperAdminContentController`
- `SuperAdminGamificationController`
- `SuperAdminActivityController`
- `SuperAdminSystemController`

Routes now point to controller methods:
- `/superadmin/dashboard`
- `/superadmin/users`
- `/superadmin/admins`
- `/superadmin/content`
- `/superadmin/gamification`
- `/superadmin/activity`
- `/superadmin/system`

Legacy route:
- `/superadmin/pricing` redirects to `/superadmin/activity`

New models:
- `News`
- `ActivityLog`
- `LoginHistory`
- `UserStatusHistory`

Updated model:
- `User`

## Frontend Changes

Superadmin pages now accept backend props with fallback mock data:
- `SuperAdminDashboard.jsx`
- `SuperAdminUsers.jsx`
- `SuperAdminAdmins.jsx`
- `SuperAdminContent.jsx`
- `SuperAdminGamification.jsx`
- `SuperAdminActivity.jsx`
- `SuperAdminSystem.jsx`
- `SuperAdminProfile.jsx`

This keeps pages usable during development while allowing real data to appear once the new tables have records.

User dashboard news integration:
- `UserDashboard.jsx` now receives `news` from the backend.
- `User\DashboardController` reads published rows from the `news` table for the student dashboard news section.

## Current Data Coverage

Real data now available for:
- user and admin counts
- active learners based on `last_activity_date`
- quiz attempt count
- XP distributed from `reward_logs`
- content counts from modules, lessons, quizzes
- news count
- login history after new logins
- activity logs once records are inserted

Still pending:
- CRUD UI for news
- explicit create/update helpers for activity logs
- failed login logging
- suspend/activate workflows
- payment/subscription tables
- cohort/kloter tables

## Relationship Notes

Audit fields use `nullOnDelete` so historical records are not deleted when an actor account is removed.

Ownership records use stronger deletion:
- `user_status_histories.user_id` uses cascade because the record belongs directly to that user.

Activity log targets use `target_type` and `target_id` instead of strict foreign keys because the target can come from many current and future tables.
