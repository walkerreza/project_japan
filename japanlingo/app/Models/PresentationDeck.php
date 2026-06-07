<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PresentationDeck extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_id',
        'module_id',
        'lesson_id',
        'title',
        'description',
        'status',
    ];

    public function level(): BelongsTo
    {
        return $this->belongsTo(Level::class);
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function slides(): HasMany
    {
        return $this->hasMany(PresentationSlide::class)->orderBy('order');
    }
}
