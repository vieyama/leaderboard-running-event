<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all company IDs
        $companyIds = Company::pluck('id')->toArray();
        
        // Create 10 regular users
        for ($i = 1; $i <= 10; $i++) {
            $user = User::create([
                'name' => 'User ' . $i,
                'email' => 'user' . $i . '@example.com',
                'password' => Hash::make('password'), // Default password is 'password'
                'gender' => $i % 2 === 0 ? 'female' : 'male',
                'company_id' => $companyIds[array_rand($companyIds)], // Assign random company
                'type' => 0, // Regular user
                'email_verified_at' => now(),
                'remember_token' => Str::random(10),
            ]);
            
            $this->command->info("Created user: {$user->email} with password: password");
        }
    }
}
