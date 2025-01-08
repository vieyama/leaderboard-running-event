<?php

namespace App\Http\Controllers;

use App\Models\EventRegisters;
use App\Models\Events;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class EventRegisterController extends Controller
{
    public function eventList(Request $request)
    {
        // Fetch events with active status
        $events = Events::where('status', 'active')->get();

        // Iterate through events and include paginated eventRegister data
        $events->each(function ($event) use ($request) {
            $event->eventRegister = $event->eventRegister()
                ->with('user') // Eager load the 'user' relationship
                ->paginate(10, ['*'], 'page', $request->input('page', 1));
        });

        // return $events;
        return Inertia::render('Welcome', [
            'eventList' => $events
        ]);
    }

    public function leaderboard()
    {
        $eventRegister = EventRegisters::with('activity')->with('user')->orderBy('total_distance', 'desc')->paginate(25);
        return response()->json([
            'success' => true,
            'data' => $eventRegister,
        ]);
    }

    public function register($eventId)
    {
        $user = Auth::user();
        $eventRegister = EventRegisters::with('activity')->where('user_id', $user->id)
            ->where('event_id', $eventId)->first();

        if (!$eventRegister) {
            $bibId = generateBip();
            // If it does not exist, create a new event register
            $eventRegister = EventRegisters::create([
                'bib' => $bibId,
                'user_id' => $user->id,
                'event_id' => $eventId,
                'total_distance' => 0,
                'total_duration' => 0,
                'total_pace' => 0
            ]);
        }

        return Inertia::render('Dashboard/DetailEvent', [
            'eventRegister' => $eventRegister,
            'event' => $eventRegister->event
        ]);
    }
}

function generateBip()
{
    do {
        $bibId = 'S2P-' . Str::upper(Str::random(8));
    } while (EventRegisters::where('bib', $bibId)->exists());

    return $bibId;
}
