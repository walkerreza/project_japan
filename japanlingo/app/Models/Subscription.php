<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'payment_plan_id',
        'status',
        'start_date',
        'end_date',
        'auto_renew',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'auto_renew' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function paymentPlan()
    {
        return $this->belongsTo(PaymentPlan::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
