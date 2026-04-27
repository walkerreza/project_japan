<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Models\PaymentPlan;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\TransactionLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SuperAdminPaymentController extends SuperAdminBaseController
{
    public function __invoke(Request $request)
    {
        $filters = [
            'search' => (string) $request->string('search'),
            'status' => $request->string('status')->value() ?: 'all',
            'payment_method' => $request->string('payment_method')->value() ?: 'all',
        ];

        $transactions = Transaction::with(['user:id,username,email', 'paymentPlan:id,name'])
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($inner) use ($search) {
                    $inner->where('transaction_code', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($userQuery) => $userQuery
                            ->where('username', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->when($filters['status'] !== 'all', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['payment_method'] !== 'all', fn ($query) => $query->where('payment_method', $filters['payment_method']))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SuperAdmin/SuperAdminPayments', [
            'stats' => [
                $this->stat('Pending Payments', number_format(Transaction::where('status', 'pending')->count()), 'P'),
                $this->stat('Success Transactions', number_format(Transaction::where('status', 'success')->count()), 'S'),
                $this->stat('Active Premium Users', number_format(Subscription::where('status', 'active')->distinct('user_id')->count('user_id')), 'U'),
                $this->stat('Revenue', 'Rp ' . number_format((int) Transaction::where('status', 'success')->sum('amount')), '$'),
            ],
            'transactions' => $transactions->through(fn (Transaction $transaction) => [
                'id' => $transaction->id,
                'transaction_code' => $transaction->transaction_code,
                'user_name' => $transaction->user?->username ?? '-',
                'user_email' => $transaction->user?->email ?? '-',
                'payment_plan_id' => $transaction->payment_plan_id,
                'plan_name' => $transaction->paymentPlan?->name ?? '-',
                'amount' => $transaction->amount,
                'amount_formatted' => 'Rp ' . number_format($transaction->amount),
                'payment_method' => $transaction->payment_method,
                'status' => $transaction->status,
                'notes' => $transaction->notes,
                'processed_at' => optional($transaction->processed_at)->diffForHumans(),
                'created_at' => optional($transaction->created_at)->format('d M Y H:i'),
                'proof_url' => $transaction->proof_of_payment_path ? asset("storage/{$transaction->proof_of_payment_path}") : null,
            ]),
            'plans' => PaymentPlan::query()
                ->orderBy('price')
                ->get(['id', 'name', 'slug', 'description', 'price', 'duration_days', 'is_active'])
                ->map(fn (PaymentPlan $plan) => [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'description' => $plan->description,
                    'price' => $plan->price,
                    'price_formatted' => 'Rp ' . number_format($plan->price),
                    'duration_days' => $plan->duration_days,
                    'is_active' => $plan->is_active,
                ]),
            'users' => User::where('role', 'user')->orderBy('username')->get(['id', 'username', 'email'])->map(fn (User $user) => [
                'id' => $user->id,
                'label' => "{$user->username} ({$user->email})",
            ]),
            'filters' => $filters,
        ]);
    }

    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:payment_plans,slug'],
            'description' => ['nullable', 'string', 'max:500'],
            'price' => ['required', 'integer', 'min:0'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'features' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $plan = PaymentPlan::create([
            ...$validated,
            'features' => $validated['features']
                ? collect(explode("\n", $validated['features']))->map(fn ($item) => trim($item))->filter()->values()->all()
                : [],
        ]);

        $this->logActivity($request, 'payment.plan_created', 'payment_plan', $plan->id, "Membuat payment plan {$plan->name}");

        return redirect()->back()->with('success', 'Payment plan berhasil dibuat');
    }

    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'payment_plan_id' => ['required', 'exists:payment_plans,id'],
            'amount' => ['required', 'integer', 'min:0'],
            'payment_method' => ['required', 'in:manual,bank_transfer,e-wallet,credit_card'],
            'status' => ['required', 'in:pending,success,failed,expired'],
            'notes' => ['nullable', 'string'],
            'proof_of_payment' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:2048'],
        ]);

        $proofPath = $request->hasFile('proof_of_payment')
            ? $request->file('proof_of_payment')->store('uploads/payments/proofs', 'public')
            : null;

        $transaction = DB::transaction(function () use ($request, $validated, $proofPath) {
            $transaction = Transaction::create([
                'transaction_code' => 'TRX-' . strtoupper(Str::random(10)),
                'user_id' => $validated['user_id'],
                'payment_plan_id' => $validated['payment_plan_id'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'status' => $validated['status'],
                'notes' => $validated['notes'] ?? null,
                'proof_of_payment_path' => $proofPath,
                'processed_at' => $validated['status'] === 'pending' ? null : now(),
            ]);

            if ($validated['status'] === 'success') {
                $this->activateSubscriptionForTransaction($transaction);
            }

            TransactionLog::create([
                'transaction_id' => $transaction->id,
                'changed_by' => $request->user()->id,
                'new_status' => $transaction->status,
                'notes' => $transaction->notes,
            ]);

            return $transaction;
        });

        $this->logActivity($request, 'payment.transaction_created', 'transaction', $transaction->id, "Membuat transaksi {$transaction->transaction_code}");

        return redirect()->back()->with('success', 'Transaksi berhasil dibuat');
    }

    public function approve(Request $request, Transaction $transaction)
    {
        $request->validate([
            'notes' => ['nullable', 'string'],
        ]);

        DB::transaction(function () use ($request, $transaction) {
            $oldStatus = $transaction->status;

            $transaction->update([
                'status' => 'success',
                'processed_at' => now(),
                'notes' => $request->input('notes') ?: $transaction->notes,
            ]);

            $this->activateSubscriptionForTransaction($transaction);

            TransactionLog::create([
                'transaction_id' => $transaction->id,
                'changed_by' => $request->user()->id,
                'old_status' => $oldStatus,
                'new_status' => 'success',
                'notes' => $request->input('notes'),
            ]);
        });

        $this->logActivity($request, 'payment.transaction_approved', 'transaction', $transaction->id, "Approve transaksi {$transaction->transaction_code}");

        return redirect()->back()->with('success', 'Transaksi berhasil di-approve');
    }

    public function reject(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'notes' => ['required', 'string'],
        ]);

        $oldStatus = $transaction->status;

        $transaction->update([
            'status' => 'failed',
            'processed_at' => now(),
            'notes' => $validated['notes'],
        ]);

        TransactionLog::create([
            'transaction_id' => $transaction->id,
            'changed_by' => $request->user()->id,
            'old_status' => $oldStatus,
            'new_status' => 'failed',
            'notes' => $validated['notes'],
        ]);

        $this->logActivity($request, 'payment.transaction_rejected', 'transaction', $transaction->id, "Reject transaksi {$transaction->transaction_code}");

        return redirect()->back()->with('success', 'Transaksi berhasil ditolak');
    }

    private function activateSubscriptionForTransaction(Transaction $transaction): void
    {
        $plan = $transaction->paymentPlan;
        $startDate = now()->toDateString();
        $endDate = now()->addDays($plan?->duration_days ?? 30)->toDateString();

        Subscription::where('user_id', $transaction->user_id)
            ->where('status', 'active')
            ->update(['status' => 'expired']);

        $subscription = Subscription::create([
            'user_id' => $transaction->user_id,
            'payment_plan_id' => $transaction->payment_plan_id,
            'status' => 'active',
            'start_date' => $startDate,
            'end_date' => $endDate,
            'auto_renew' => false,
        ]);

        $transaction->update([
            'subscription_id' => $subscription->id,
        ]);

        $transaction->user->update([
            'subscription_status' => 'premium',
        ]);
    }
}
