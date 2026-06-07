<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PresentationSlide extends Model
{
    use HasFactory;

    protected $fillable = [
        'presentation_deck_id',
        'title',
        'layout',
        'content',
        'media_url',
        'background',
        'accent_color',
        'speaker_notes',
        'order',
    ];

    public function deck(): BelongsTo
    {
        return $this->belongsTo(PresentationDeck::class, 'presentation_deck_id');
    }
}
