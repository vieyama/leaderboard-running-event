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
        $search = $request->query('search') ?? '';
        $gender = $request->query('gender') ?? '';
        // Fetch active events that are currently running (between start and end dates)
        $now = now()->format('Y-m-d');
        $events = Events::where('status', 1)
            ->whereDate('start_date', '<=', $now)
            ->whereDate('end_date', '>=', $now)
            ->orderBy('start_date', 'asc')
            ->get();

        $events->each(function ($event) use ($request, $search, $gender) {
            $event->eventRegister = $event->eventRegister()
                ->with('user') // Eager load the 'user' relationship
                ->when(($search || $gender), function ($query) use ($search, $gender) {
                    $query->whereHas('user', function ($userQuery) use ($search, $gender) {
                        if ($search) {
                            $userQuery->where('name', 'LIKE', "%{$search}%");
                        }
                        if ($gender) {
                            $userQuery->where('gender', $gender);
                        }
                    });
                })
                ->orderBy('total_distance', 'DESC')
                ->paginate(10, ['*'], 'page', $request->input('page', 1));
        });

        // return $events;
        return Inertia::render('Welcome', [
            'eventList' => $events
        ]);
    }

    public function leaderboard()
    {
        $eventRegister = EventRegisters::with('activity')->with('user')->orderBy('total_distance', 'DESC')->paginate(25);
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
        return redirect()->route('detail-event', ['id' => $eventId]);
    }
}

function generateBip()
{
    do {
        $number = mt_rand(10000000, 99999999);
        $bibId = 'S2P-' . $number;
    } while (EventRegisters::where('bib', $bibId)->exists());

    return $bibId;
}
