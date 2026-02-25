<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin
        User::create([
            'username' => 'Admin Japanlingo',
            'email' => 'admin@japanlingo.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Student
        User::create([
            'username' => 'Student Japanlingo',
            'email' => 'student@japanlingo.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'xp' => 150,
            'level' => 2,
            'streak_count' => 3,
            'last_activity_date' => now(),
        ]);
    }
}
