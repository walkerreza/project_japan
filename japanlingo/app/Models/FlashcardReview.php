<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlashcardReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'flashcard_id',
        'status',
        'known_count',
        'learning_count',
        'last_reviewed_at',
    ];

    protected $casts = [
        'last_reviewed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function flashcard()
    {
        return $this->belongsTo(Flashcard::class);
    }
}

