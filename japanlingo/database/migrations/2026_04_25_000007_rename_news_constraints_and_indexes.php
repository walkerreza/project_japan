<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('news') || DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('ALTER TABLE news RENAME CONSTRAINT announcements_pkey TO news_pkey');
        DB::statement('ALTER TABLE news RENAME CONSTRAINT announcements_created_by_foreign TO news_created_by_foreign');
        DB::statement('ALTER TABLE news RENAME CONSTRAINT announcements_updated_by_foreign TO news_updated_by_foreign');
        DB::statement('ALTER INDEX announcements_status_is_pinned_index RENAME TO news_status_is_pinned_index');
        DB::statement('ALTER INDEX announcements_audience_published_at_index RENAME TO news_audience_published_at_index');
    }

    public function down(): void
    {
        if (! Schema::hasTable('news') || DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('ALTER TABLE news RENAME CONSTRAINT news_pkey TO announcements_pkey');
        DB::statement('ALTER TABLE news RENAME CONSTRAINT news_created_by_foreign TO announcements_created_by_foreign');
        DB::statement('ALTER TABLE news RENAME CONSTRAINT news_updated_by_foreign TO announcements_updated_by_foreign');
        DB::statement('ALTER INDEX news_status_is_pinned_index RENAME TO announcements_status_is_pinned_index');
        DB::statement('ALTER INDEX news_audience_published_at_index RENAME TO announcements_audience_published_at_index');
    }
};
