<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Lesson;
use App\Models\Quiz;

class SubscriptionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Only student accounts use paywall checks; admin/superadmin bypass for content review.
        if (!$user || $user->role !== 'user') {
            return $next($request);
        }

        // Check if the user is a premium user
        $isPremiumUser = $user->subscription_status === 'premium';

        $isPremiumContent = false;

        // Check for Lesson route
        if ($request->routeIs('user.lessons.show')) {
            $lessonParam = $request->route('lesson');
            $lesson = $lessonParam instanceof Lesson
                ? $lessonParam->loadMissing('module.level')
                : Lesson::with('module.level')->find($lessonParam);
            
            if ($lesson && $lesson->module && $lesson->module->level) {
                $isPremiumContent = $lesson->module->level->is_premium;
            }
        }

        // Check for Quiz route
        if ($request->routeIs('user.quizzes.show')) {
            $quizParam = $request->route('quiz');
            $quiz = $quizParam instanceof Quiz
                ? $quizParam->loadMissing('lesson.module.level')
                : Quiz::with('lesson.module.level')->find($quizParam);
            
            if ($quiz && $quiz->lesson && $quiz->lesson->module && $quiz->lesson->module->level) {
                $isPremiumContent = $quiz->lesson->module->level->is_premium;
            }
        }

        // If the content is premium and the user is NOT premium, block access
        // If the content is premium and the user is NOT premium, block access
        if ($isPremiumContent && !$isPremiumUser) {
            // Redirect back to dashboard with an error or to the pricing page
            return redirect()->route('dashboard')->with('error', 'Akses Ditolak: Konten ini memerlukan langganan Premium.');
        }

        return $next($request);
    }
}
