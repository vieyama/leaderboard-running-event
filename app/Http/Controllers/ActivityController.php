<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\EventRegisters;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $userId = $request->userId;
        $eventRegisterId = $request->eventRegisterId;

        $eventRegister = EventRegisters::find($eventRegisterId);

        $eventRegister->total_distance = ($eventRegister->total_distance ?? 0) + $request->distance;
        $eventRegister->total_duration = ($eventRegister->total_duration ?? 0) + $request->duration;
        $eventRegister->total_pace = ($eventRegister->total_pace ?? 0) + $request->pace;

        $eventRegister->save();

        Activities::create([
            'user_id' => $userId,
            'activity_name' => $request->activity_name,
            'strava_url' => $request->description ?? '-',
            'distance' => $request->distance,
            'duration' => $request->duration,
            'pace' => $request->pace,
            'event_register_id' => $eventRegisterId
        ]);

        return redirect()->back()->with('success', 'Data saved.');
    }
}
