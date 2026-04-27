<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'news_id',
        'file_name',
        'file_path',
        'file_type',
        'mime_type',
        'file_size',
        'video_embed_url',
        'sort_order',
    ];

    public function news()
    {
        return $this->belongsTo(News::class);
    }
}
