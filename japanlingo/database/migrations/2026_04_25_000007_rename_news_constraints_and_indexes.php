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

        $this->renameConstraint('announcements_pkey', 'news_pkey');
        $this->renameConstraint('announcements_created_by_foreign', 'news_created_by_foreign');
        $this->renameConstraint('announcements_updated_by_foreign', 'news_updated_by_foreign');
        $this->renameIndex('announcements_status_is_pinned_index', 'news_status_is_pinned_index');
        $this->renameIndex('announcements_audience_published_at_index', 'news_audience_published_at_index');
    }

    public function down(): void
    {
        if (! Schema::hasTable('news') || DB::getDriverName() !== 'pgsql') {
            return;
        }

        $this->renameConstraint('news_pkey', 'announcements_pkey');
        $this->renameConstraint('news_created_by_foreign', 'announcements_created_by_foreign');
        $this->renameConstraint('news_updated_by_foreign', 'announcements_updated_by_foreign');
        $this->renameIndex('news_status_is_pinned_index', 'announcements_status_is_pinned_index');
        $this->renameIndex('news_audience_published_at_index', 'announcements_audience_published_at_index');
    }

    private function renameConstraint(string $from, string $to): void
    {
        if (! $this->constraintExists($from) || $this->constraintExists($to)) {
            return;
        }

        DB::statement(sprintf('ALTER TABLE news RENAME CONSTRAINT %s TO %s', $from, $to));
    }

    private function renameIndex(string $from, string $to): void
    {
        if (! $this->indexExists($from) || $this->indexExists($to)) {
            return;
        }

        DB::statement(sprintf('ALTER INDEX %s RENAME TO %s', $from, $to));
    }

    private function constraintExists(string $name): bool
    {
        return DB::table('pg_constraint')->where('conname', $name)->exists();
    }

    private function indexExists(string $name): bool
    {
        return DB::table('pg_indexes')
            ->where('schemaname', 'public')
            ->where('indexname', $name)
            ->exists();
    }
};
