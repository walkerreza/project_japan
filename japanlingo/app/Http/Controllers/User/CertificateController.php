<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Certificate;
use App\Models\Level;
use App\Services\CertificateService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CertificateController extends Controller
{
    protected CertificateService $certificateService;

    public function __construct(CertificateService $certificateService)
    {
        $this->certificateService = $certificateService;
    }

    public function index()
    {
        $user = Auth::user();
        $levels = Level::all();

        $certificatesData = $levels->map(function ($level) use ($user) {
            $certificate = Certificate::where('user_id', $user->id)
                ->where('level_id', $level->id)
                ->first();

            $progress = $this->certificateService->getProgressPercentage($user, $level->id);

            if (!$certificate && $progress >= 100) {
                $certificate = $this->certificateService->checkAndIssueCertificate($user, $level->id);
            }

            return [
                'level_id' => $level->id,
                'level_name' => $level->level_name,
                'stage' => $level->stage,
                'progress' => $progress,
                'certificate' => $certificate,
            ];
        });

        return Inertia::render('User/Certificate', [
            'certificates' => $certificatesData,
        ]);
    }

    public function download(Certificate $certificate)
    {
        if ($certificate->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('User/CertificateView', [
            'certificate' => $certificate->load('level'),
            'user' => Auth::user(),
        ]);
    }
}
