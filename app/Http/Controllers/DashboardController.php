<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\EventRegisters;
use App\Models\Events;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $events = Events::with('eventRegister')->where('status', 'active')->get();
        return Inertia::render('Dashboard/index', [
            'events' => $events
        ]);
    }

    public function detailEvent($eventId)
    {
        $user = Auth::user();
        $eventRegister = EventRegisters::with('activity')->where('user_id', $user->id)
            ->where('event_id', $eventId)->first();

        return Inertia::render('Dashboard/DetailEvent', [
            'eventRegister' => $eventRegister,
            'event' => $eventRegister->event
        ]);
    }
}
