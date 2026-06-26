<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role', 30)->default('user')->after('password')->index();
            $table->string('subscription_status', 30)->default('free')->after('role')->index();
            $table->string('status', 30)->default('active')->after('subscription_status')->index();
            $table->string('auth_provider', 30)->default('email')->after('status');
            $table->string('google_id')->nullable()->after('auth_provider')->unique();
            $table->string('avatar')->nullable()->after('google_id');
            $table->unsignedInteger('xp')->default(0)->after('avatar');
            $table->unsignedInteger('level')->default(1)->after('xp');
            $table->unsignedInteger('streak_count')->default(0)->after('level');
            $table->date('last_activity_date')->nullable()->after('streak_count');
            $table->timestamp('suspended_at')->nullable()->after('last_activity_date');
            $table->text('suspended_reason')->nullable()->after('suspended_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['google_id']);
            $table->dropColumn([
                'role',
                'subscription_status',
                'status',
                'auth_provider',
                'google_id',
                'avatar',
                'xp',
                'level',
                'streak_count',
                'last_activity_date',
                'suspended_at',
                'suspended_reason',
            ]);
        });
    }
};