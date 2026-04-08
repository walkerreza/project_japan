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
        //superadmin
        User::create([
            'username' => 'SuperAdmin Japanlingo',
            'email' => 'superadmin@japanlingo.com',
            'password' => Hash::make('password'),
            'role'=>'superadmin',
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

        //Create Student 2 
        User::create([
            'username' => 'Student2 Japanlingo',
            'email' => 'student2@japanlingo.com',
            'password'=>Hash::make('password'),
            'role'=>'user',
            'xp'=>100,
            'level'=>1,
            'streak_count'=>1,
            'last_activity_date'=>now(),
        ]);
    }
}
