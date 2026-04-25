<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;

abstract class SuperAdminBaseController extends Controller
{
    protected function stat(string $title, string $value, string $icon, string $change = '0', string $changeType = 'up'): array
    {
        return compact('title', 'value', 'icon', 'change', 'changeType');
    }

    protected function displayStatus(?string $status): string
    {
        return match ($status) {
            'active', null => 'Aktif',
            'suspended' => 'Suspended',
            default => ucfirst($status),
        };
    }
}
