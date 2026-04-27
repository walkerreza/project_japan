<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_code',
        'user_id',
        'payment_plan_id',
        'subscription_id',
        'amount',
        'payment_method',
        'status',
        'proof_of_payment_path',
        'notes',
        'processed_at',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }

    public function logs()
    {
        return $this->hasMany(TransactionLog::class);
    }
}
