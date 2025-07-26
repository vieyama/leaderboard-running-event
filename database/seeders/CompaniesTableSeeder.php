<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CompaniesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $companies = [
            [
                'company_name' => 'Acme Inc.',
                'description' => 'A leading technology company',
                'website' => 'https://acme.com',
                'phone' => '+1234567890',
                'email' => 'info@acme.com',
                'address' => '123 Tech Street, Silicon Valley, CA',
            ],
            [
                'company_name' => 'Globex Corporation',
                'description' => 'Global manufacturing solutions',
                'website' => 'https://globex.com',
                'phone' => '+1987654321',
                'email' => 'contact@globex.com',
                'address' => '456 Industry Ave, New York, NY',
            ],
            [
                'company_name' => 'Initech',
                'description' => 'Software development and consulting',
                'website' => 'https://initech.com',
                'phone' => '+16505551234',
                'email' => 'hello@initech.com',
                'address' => '789 Software Blvd, Austin, TX',
            ],
        ];

        foreach ($companies as $company) {
            Company::create($company);
        }
    }
}
