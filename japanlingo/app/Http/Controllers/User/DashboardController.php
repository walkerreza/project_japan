<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Level;
use App\Models\Module;
use App\Models\News;
use App\Models\RewardLog;
use App\Models\AccessKey;
use App\Models\AccessKeyRedemption;
use App\Models\ActivityLog;
use App\Models\PaymentPlan;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $news = News::query()
            ->with('attachments')
            ->where('status', 'published')
            ->whereIn('audience', ['all', 'students'])
            ->where(function ($query) {
                $query->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($query) {
                $query->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            })
            ->orderByDesc('is_pinned')
            ->orderByDesc('published_at')
            ->take(3)
            ->get()
            ->map(function (News $news) {
                $thumbnailUrl = $news->thumbnailUrl();

                return [
                    'id' => $news->id,
                    'title' => $news->title,
                    'excerpt' => $news->excerpt,
                    'body' => $news->body,
                    'is_pinned' => $news->is_pinned,
                    'published_at' => optional($news->published_at)->toIso8601String(),
                    'thumbnail_url' => $thumbnailUrl,
                    'cover_url' => $thumbnailUrl,
                ];
            });

        return Inertia::render('User/Beranda', [
            'user' => $user,
            'recentProgress' => $user->progress()->with('lesson.module')->latest()->take(5)->get(),
            'availableLevels' => Level::with('modules')->get(),
            'rewardHistory' => RewardLog::where('user_id', $user->id)->latest()->take(10)->get(),
            'news' => $news,
            'activeSubscription' => $user->subscriptions()
                ->with('paymentPlan:id,name')
                ->where('status', 'active')
                ->latest('end_date')
                ->first(),
        ]);
    }

    public function redeemAccessKey(Request $request)
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:64'],
        ]);

        $user = $request->user();
        $code = strtoupper(trim($validated['code']));

        try {
            DB::transaction(function () use ($request, $user, $code) {
                $accessKey = AccessKey::where('code', $code)->lockForUpdate()->first();

                if (! $accessKey || ! $accessKey->isRedeemable()) {
                    abort(422, 'Access key tidak valid, sudah habis, atau sudah kedaluwarsa.');
                }

                $alreadyRedeemed = AccessKeyRedemption::where('access_key_id', $accessKey->id)
                    ->where('user_id', $user->id)
                    ->exists();

                if ($alreadyRedeemed) {
                    abort(422, 'Access key ini sudah pernah digunakan oleh akun Anda.');
                }

                $plan = $accessKey->paymentPlan ?: $this->accessKeyPlan();
                $startDate = now()->toDateString();
                $endDate = now()->addDays($accessKey->duration_days)->toDateString();

                Subscription::where('user_id', $user->id)
                    ->where('status', 'active')
                    ->update(['status' => 'expired']);

                $subscription = Subscription::create([
                    'user_id' => $user->id,
                    'payment_plan_id' => $plan->id,
                    'status' => 'active',
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'auto_renew' => false,
                ]);

                AccessKeyRedemption::create([
                    'access_key_id' => $accessKey->id,
                    'user_id' => $user->id,
                    'subscription_id' => $subscription->id,
                    'redeemed_at' => now(),
                    'ip_address' => $request->ip(),
                ]);

                $accessKey->increment('used_count');

                $user->update(['subscription_status' => 'premium']);

                ActivityLog::create([
                    'actor_id' => $user->id,
                    'action' => 'access_key.redeemed',
                    'target_type' => 'access_key',
                    'target_id' => $accessKey->id,
                    'description' => "Redeem access key {$accessKey->code}",
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ]);
            });
        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $exception) {
            return back()->withErrors(['access_key' => $exception->getMessage()]);
        }

        return back()->with('success', 'Access key berhasil digunakan. Akses premium sudah aktif.');
    }

    private function accessKeyPlan(): PaymentPlan
    {
        return PaymentPlan::firstOrCreate(
            ['slug' => 'access-key-premium'],
            [
                'name' => 'Access Key Premium',
                'description' => 'Akses premium manual via kode akses',
                'price' => 0,
                'duration_days' => 30,
                'features' => ['Premium content via access key'],
                'is_active' => true,
            ]
        );
    }
}
