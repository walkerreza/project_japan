<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessKey extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_plan_id',
        'created_by',
        'code',
        'name',
        'duration_days',
        'max_uses',
        'used_count',
        'status',
        'starts_at',
        'expires_at',
        'notes',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function redemptions()
    {
        return $this->hasMany(AccessKeyRedemption::class);
    }

    public function isRedeemable(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->starts_at && $this->starts_at->isFuture()) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        return $this->used_count < $this->max_uses;
    }
}
