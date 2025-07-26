<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_name',
        'description',
        'website',
        'phone',
        'email',
        'address',
    ];

    /**
     * Get the users associated with the company.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
