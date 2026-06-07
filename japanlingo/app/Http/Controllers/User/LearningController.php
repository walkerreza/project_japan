<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Services\UserLearningService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function lessonLobby(UserLearningService $learning)
    {
        return Inertia::render('User/Materi/DaftarMateri', [
            'lessons' => $learning->lessonLobby(Auth::user()),
        ]);
    }

    public function quizLobby(UserLearningService $learning)
    {
        return Inertia::render('User/Kuis/DaftarKuis', [
            'quizzes' => $learning->quizLobby(Auth::user()),
        ]);
    }

    public function showLesson($id, UserLearningService $learning)
    {
        $lesson = Lesson::with(['module.lessons' => fn ($query) => $query
            ->where('status', 'published')
            ->orderBy('order')])
            ->where('status', 'published')
            ->whereHas('module', fn ($query) => $query->where('status', 'published'))
            ->find($id);

        if (! $lesson) {
            abort(404, 'Lesson tidak ditemukan.');
        }

        if (! $learning->canOpenLesson(Auth::user(), $lesson)) {
            return redirect()
                ->route('user.lessons.index')
                ->with('error', 'Selesaikan materi sebelumnya terlebih dahulu.');
        }

        return Inertia::render('User/Materi/DetailMateri', $learning->lessonDetailPayload(Auth::user(), $lesson));
    }

    public function showQuiz($id, UserLearningService $learning)
    {
        $quiz = Quiz::with(['lesson.module', 'questions'])
            ->where('status', 'published')
            ->whereHas('lesson', fn ($query) => $query
                ->where('status', 'published')
                ->whereHas('module', fn ($moduleQuery) => $moduleQuery->where('status', 'published')))
            ->find($id);

        if (! $quiz) {
            abort(404, 'Quiz tidak ditemukan.');
        }

        if (! $learning->hasCompletedLesson(Auth::user(), $quiz->lesson_id)) {
            return redirect()
                ->route('user.lessons.show', $quiz->lesson_id)
                ->with('error', 'Selesaikan materi ini sebelum mengambil kuis.');
        }

        return Inertia::render('User/Kuis/KerjakanKuis', $learning->quizPayload(Auth::user(), $quiz));
    }
}
