<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kanji extends Model
{
    use HasFactory;

    protected $table = 'kanji_bank';

    protected $fillable = [
        'kanji',
        'onyomi',
        'kunyomi',
        'meaning',
        'indonesian_meaning',
        'jlpt_level',
        'stroke_count',
        'tags',
        'example_word',
        'example_reading',
        'example_meaning',
        'example_sentence',
        'example_sentence_reading',
        'example_sentence_meaning',
        'status',
    ];

    protected $casts = [
        'tags' => 'array',
        'stroke_count' => 'integer',
    ];
}
