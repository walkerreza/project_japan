<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashcardSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_id',
        'module_id',
        'lesson_id',
        'title',
        'description',
        'source_type',
        'status',
    ];

    public function level()
    {
        return $this->belongsTo(Level::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function flashcards()
    {
        return $this->hasMany(Flashcard::class)->orderBy('order');
    }
}

