<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeachingBoard extends Model
{
    use HasFactory;

    protected $fillable = [
        'level_id',
        'module_id',
        'lesson_id',
        'title',
        'description',
        'board_data',
        'snapshot_data',
        'status',
    ];

    protected $casts = [
        'board_data' => 'array',
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
}
