<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EventRegisters extends Model
{
    use HasFactory;

    protected $fillable = [
        'bib',
        'user_id',
        'event_id',
        'total_distance',
        'total_duration',
        'total_pace'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Events::class, 'event_id');
    }

    public function activity(): HasMany
    {
        return $this->hasMany(Activities::class, 'event_register_id', 'id');
    }
}
