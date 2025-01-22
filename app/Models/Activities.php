<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activities extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_register_id',
        'activity_name',
        'distance',
        'duration',
        'pace',
        'strava_url',
        'date'
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(EventRegisters::class, 'event_id');
    }
}
