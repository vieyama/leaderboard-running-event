<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class ContactSetting extends Model
{
    protected $fillable = [
        'whatsapp1',
        'whatsapp1_label',
        'whatsapp2',
        'whatsapp2_label',
        'email',
        'email_label',
        'map_embed',
        'contact_text',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * Get the active contact settings
     */
    public static function getActiveSettings()
    {
        return Cache::remember('contact_settings', now()->addDay(), function () {
            return self::where('is_active', true)->first() ?? new self();
        });
    }
}
