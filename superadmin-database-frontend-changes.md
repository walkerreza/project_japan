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

### `news_attachments`

Purpose: file attachments and video embed entries for `news`.

Primary key:
- `id`

Foreign keys:
- `news_id` references `news.id`, `cascadeOnDelete`

Important columns:
- `file_name`
- `file_path`
- `file_type`
- `mime_type`
- `file_size`
- `video_embed_url`
- `sort_order`

### `payment_plans`

Purpose: master data paket langganan premium.

Important columns:
- `name`
- `slug`
- `price`
- `duration_days`
- `features`
- `is_active`

### `subscriptions`

Purpose: status langganan premium per user.

Important columns:
- `user_id`
- `payment_plan_id`
- `status`
- `start_date`
- `end_date`
- `auto_renew`

### `transactions`

Purpose: manual payment records with `pending/success/failed/expired` flow.

Important columns:
- `transaction_code`
- `user_id`
- `payment_plan_id`
- `subscription_id`
- `amount`
- `payment_method`
- `status`
- `proof_of_payment_path`
- `notes`
- `processed_at`

### `transaction_logs`

Purpose: audit trail perubahan status transaksi pembayaran.

Important columns:
- `transaction_id`
- `changed_by`
- `old_status`
- `new_status`
- `notes`

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

Operational routes added:
- `PATCH /superadmin/users/{user}/status`
- `POST /superadmin/users/{user}/reset-password`
- `POST /superadmin/admins`
- `PATCH /superadmin/admins/{user}/status`
- `POST /superadmin/admins/{user}/reset-password`
- `POST /superadmin/content/news`
- `PUT /superadmin/content/news/{news}`
- `DELETE /superadmin/content/news/{news}`
- `POST /superadmin/content/news/{news}/attachments`
- `DELETE /superadmin/content/news/{news}/attachments/{attachment}`
- `GET /superadmin/payments`
- `POST /superadmin/payments/plans`
- `POST /superadmin/payments/transactions`
- `PATCH /superadmin/payments/transactions/{transaction}/approve`
- `PATCH /superadmin/payments/transactions/{transaction}/reject`

Legacy route:
- `/superadmin/pricing` redirects to `/superadmin/activity`

New models:
- `News`
- `ActivityLog`
- `LoginHistory`
- `UserStatusHistory`

Updated model:
- `User`
- `News`

Auth behavior:
- Suspended accounts are blocked after credential validation.
- Blocked login attempts are recorded in `login_histories` with `status = failed`.
- Generated passwords from superadmin reset/create operations are shared to Inertia through `flash.generated_password`.

## Frontend Changes

Superadmin pages now accept backend props:
- `SuperAdminDashboard.jsx`
- `SuperAdminUsers.jsx`
- `SuperAdminAdmins.jsx`
- `SuperAdminContent.jsx`
- `SuperAdminPayments.jsx`
- `SuperAdminGamification.jsx`
- `SuperAdminActivity.jsx`
- `SuperAdminSystem.jsx`
- `SuperAdminProfile.jsx`

Operational UI added:
- `SuperAdminUsers.jsx`: search, status filter, pagination, suspend/activate, reset password
- `SuperAdminAdmins.jsx`: search, role/status filters, pagination, create admin, suspend/activate, reset password
- `SuperAdminContent.jsx`: search/status/audience/pinned filters, pagination, rich text news editor, attachment upload, video embed, pending review status
- `SuperAdminPayments.jsx`: plan creation, manual transaction creation, pending approval, reject flow

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
- broader activity logging outside the newly implemented superadmin actions
- payment export/reporting
- automated subscription expiry jobs
- user-submitted payment proof flow from the student side
- cohort/kloter tables

## Relationship Notes

Audit fields use `nullOnDelete` so historical records are not deleted when an actor account is removed.

Ownership records use stronger deletion:
- `user_status_histories.user_id` uses cascade because the record belongs directly to that user.

Activity log targets use `target_type` and `target_id` instead of strict foreign keys because the target can come from many current and future tables.
