<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        if (!DB::table('users')->where('email', 'superadmin@s2p.com')->exists()) {
            // Insert a single admin user
            DB::table('users')->insert([
                'name' => 'Superadmin',
                'email' => 'superadmin@s2p.com',
                'password' => Hash::make('qwerty123'),
                'gender' => 'male',
                'type' => 1, // 1 for admin
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            $this->command->info('Admin user created successfully!');
        } else {
            $this->command->info('Admin user already exists.');
        }
    }
}
