<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@japanlingo.com'], [
            'username' => 'Admin Japanlingo',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::updateOrCreate(['email' => 'superadmin@japanlingo.com'], [
            'username' => 'SuperAdmin Japanlingo',
            'password' => Hash::make('password'),
            'role' => 'superadmin',
            'status' => 'active',
        ]);

        User::updateOrCreate(['email' => 'student@japanlingo.com'], [
            'username' => 'Student Japanlingo',
            'password' => Hash::make('password'),
            'role' => 'user',
            'subscription_status' => 'premium',
            'status' => 'active',
            'xp' => 150,
            'level' => 2,
            'streak_count' => 3,
            'last_activity_date' => now(),
        ]);

        User::updateOrCreate(['email' => 'student2@japanlingo.com'], [
            'username' => 'Student2 Japanlingo',
            'password' => Hash::make('password'),
            'role' => 'user',
            'subscription_status' => 'free',
            'status' => 'active',
            'xp' => 100,
            'level' => 1,
            'streak_count' => 1,
            'last_activity_date' => now(),
        ]);
    }
}
