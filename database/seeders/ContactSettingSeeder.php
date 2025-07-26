<?php

namespace Database\Seeders;

use App\Models\ContactSetting;
use Illuminate\Database\Seeder;

class ContactSettingSeeder extends Seeder
{
    public function run(): void
    {
        ContactSetting::create([
            'whatsapp1' => '1234567890',
            'whatsapp1_label' => 'Customer Service',
            'whatsapp2' => '0987654321',
            'whatsapp2_label' => 'Technical Support',
            'email' => 'info@example.com',
            'email_label' => 'General Inquiries',
            'map_embed' => null,
            'contact_text' => 'Feel free to reach out to us through any of the following channels. We\'ll get back to you as soon as possible!',
            'is_active' => true,
        ]);
    }
}
