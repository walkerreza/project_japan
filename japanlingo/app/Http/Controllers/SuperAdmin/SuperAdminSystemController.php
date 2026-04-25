<?php

namespace App\Http\Controllers\SuperAdmin;

use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SuperAdminSystemController extends SuperAdminBaseController
{
    public function __invoke()
    {
        return Inertia::render('SuperAdmin/System', [
            'stats' => [
                $this->stat('Status App', 'Stabil', '🟢'),
                $this->stat('Queue', number_format(DB::table('jobs')->count()) . ' job', '📬', '0', 'down'),
                $this->stat('Cache Health', 'Normal', '🧠'),
                $this->stat('Storage Usage', 'Local', '💾'),
            ],
        ]);
    }
}
