<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ExpireSubscriptions extends Command
{
    protected $signature = 'subscriptions:expire';

    protected $description = 'Expire premium subscriptions that have passed their end date.';

    public function handle(): int
    {
        $expiredSubscriptions = Subscription::with('user')
            ->where('status', 'active')
            ->whereDate('end_date', '<', now()->toDateString())
            ->get();

        DB::transaction(function () use ($expiredSubscriptions) {
            foreach ($expiredSubscriptions as $subscription) {
                $subscription->update(['status' => 'expired']);

                $hasOtherActiveSubscription = Subscription::where('user_id', $subscription->user_id)
                    ->where('id', '!=', $subscription->id)
                    ->where('status', 'active')
                    ->whereDate('end_date', '>=', now()->toDateString())
                    ->exists();

                if (! $hasOtherActiveSubscription) {
                    $subscription->user?->update(['subscription_status' => 'free']);
                }
            }
        });

        $this->info($expiredSubscriptions->count() . ' subscription(s) expired.');

        return self::SUCCESS;
    }
}
