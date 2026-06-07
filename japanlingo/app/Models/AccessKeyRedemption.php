<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessKeyRedemption extends Model
{
    use HasFactory;

    protected $fillable = [
        'access_key_id',
        'user_id',
        'subscription_id',
        'redeemed_at',
        'ip_address',
    ];

    protected $casts = [
        'redeemed_at' => 'datetime',
    ];

    public function accessKey()
    {
        return $this->belongsTo(AccessKey::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
