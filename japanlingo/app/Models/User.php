<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
        'subscription_status',
        'status',
        'suspended_at',
        'suspended_reason',
        'xp',
        'level',
        'streak_count',
        'last_activity_date',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_activity_date' => 'date',
            'suspended_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function attempts(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Attempt::class);
    }

    public function progress(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Progress::class);
    }

    public function certificates(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Certificate::class);
    }

    public function achievements(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Achievement::class, 'user_achievements')
            ->withPivot('unlocked_at')
            ->withTimestamps();
    }

    public function createdNews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(News::class, 'created_by');
    }

    public function activityLogs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ActivityLog::class, 'actor_id');
    }

    public function loginHistories(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LoginHistory::class);
    }

    public function statusHistories(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(UserStatusHistory::class);
    }

    public function subscriptions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
