<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'module_id',
        'title',
        'content',
        'type',
        'video_url',
        'file_url',
        'order',
        'duration_minutes',
        'status',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function quizzes(): HasMany
    {
        return $this->hasMany(Quiz::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
