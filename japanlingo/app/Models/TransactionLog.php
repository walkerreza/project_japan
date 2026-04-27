<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'changed_by',
        'old_status',
        'new_status',
        'notes',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function changer()
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
