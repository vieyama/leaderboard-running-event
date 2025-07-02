<?php

namespace App\Http\Controllers;

use App\Models\EventRegisters;
use App\Models\Events;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        Events::create([
            'description' => $request->description ?? '-',
            'event_name' => $request->event_name,
            'status' => 1
        ]);

        return redirect()->back()->with('success', 'Data saved.');
    }

    public function update(Request $request, $eventId): RedirectResponse
    {
        $event = Events::find($eventId);

        $event->event_name = $request->event_name;
        $event->description = $request->description ?? '-';
        $event->status = (bool) $request->status;

        $event->save();

        return redirect()->back()->with('success', 'Data saved.');
    }

    public function detail($id)
    {
        $event = Events::findOrFail($id);

        $eventRegisters = $event->eventRegister()
            ->where('event_id', $id)
            ->with(['activity', 'user'])
            ->orderBy('total_distance', 'DESC')
            ->paginate(10);

        return Inertia::render('Dashboard/ManageEvent', [
            'event' => $event,
            'eventRegisters' => $eventRegisters
        ]);
    }

    public function detailEvent($eventId, $userId)
    {
        $user = Auth();
        $userType = $user->guard('web')->user()->type;

        if (!$userType) {
            return redirect('/');
        }

        if ($userType !== 'admin') {
            return redirect('/dashboard');
        }

        $eventRegister = EventRegisters::with(['activity' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }, 'user'])
            ->where('user_id', $userId)
            ->where('event_id', $eventId)
            ->first();

        return Inertia::render('Dashboard/DetailEvent', [
            'eventRegister' => $eventRegister,
            'event' => $eventRegister->event,
            'is_admin' => true
        ]);
    }

    public function destroy($id)
    {
        $event = Events::find($id);
        $event->delete();

        $events = Events::with('eventRegister')->orderByRaw('status DESC, created_at DESC')->get();
        return Inertia::render('Dashboard/AdminDashboard', [
            'events' => $events
        ]);
    }
}
