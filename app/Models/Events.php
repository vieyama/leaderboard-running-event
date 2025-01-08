<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Events extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_name',
        'description',
        'status'
    ];

    public function eventRegister(): HasMany
    {
        return $this->hasMany(EventRegisters::class, 'event_id', 'id');
    }
}
