<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flashcard extends Model
{
    use HasFactory;

    protected $fillable = [
        'flashcard_set_id',
        'vocabulary_id',
        'front_text',
        'reading',
        'back_text',
        'hint',
        'example_sentence',
        'example_meaning',
        'audio_url',
        'order',
    ];

    public function set()
    {
        return $this->belongsTo(FlashcardSet::class, 'flashcard_set_id');
    }

    public function vocabulary()
    {
        return $this->belongsTo(Vocabulary::class);
    }

    public function reviews()
    {
        return $this->hasMany(FlashcardReview::class);
    }
}

