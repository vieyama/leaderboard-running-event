<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\EventRegisters;
use App\Models\Events;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $auth = Auth();
        $userType = $auth->guard('web')->user()->type;

        if (!$userType) {
            return redirect('/');
        }

        if ($userType === 'admin') {
            return redirect('/admin-dashboard');
        }

        $events = Events::with('eventRegister')->where('status', 1)->get();
        return Inertia::render('Dashboard/index', [
            'events' => $events
        ]);
    }

    public function admin()
    {
        $auth = Auth();
        $userType = $auth->guard('web')->user()->type;

        if (!$userType) {
            return redirect('/');
        }

        if ($userType !== 'admin') {
            return redirect('/dashboard');
        }

        $events = Events::with('eventRegister')->orderByRaw('status DESC, created_at DESC')->get();
        return Inertia::render('Dashboard/AdminDashboard', [
            'events' => $events
        ]);
    }

    public function detailEvent($eventId)
    {
        $user = Auth::user();
        $eventRegister = EventRegisters::with(['activity' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }, 'user'])
        ->where('user_id', $user->id)
        ->where('event_id', $eventId)
        ->first();

        return Inertia::render('Dashboard/DetailEvent', [
            'eventRegister' => $eventRegister,
            'event' => $eventRegister->event
        ]);
    }
}
