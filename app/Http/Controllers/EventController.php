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
        try {
            $validated = $request->validate([
                'event_name' => 'required|string|min:5',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $imagePath = $image->storeAs('events', $imageName, 'public');
            }

            Events::create([
                'event_name' => $validated['event_name'],
                'description' => $validated['description'] ?? '-',
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'status' => 1,
                'image_path' => $imagePath
            ]);

            return redirect()->back()->with('success', 'Event created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error creating event: ' . $e->getMessage())
                ->withInput();
        }

        return redirect()->back()->with('success', 'Event created successfully.');
    }

    public function update(Request $request, $eventId): RedirectResponse
    {
        try {
            // Convert string 'true'/'false' to boolean
            $request->merge([
                'status' => filter_var($request->status, FILTER_VALIDATE_BOOLEAN)
            ]);

            $validated = $request->validate([
                'event_name' => 'required|string|min:5',
                'description' => 'nullable|string',
                'status' => 'required|boolean',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            ]);

            $event = Events::findOrFail($eventId);

            $updateData = [
                'event_name' => $validated['event_name'],
                'description' => $validated['description'] ?? '-',
                'status' => $validated['status'] ?? $event->status,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ];

            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($event->image_path) {
                    \Storage::disk('public')->delete($event->image_path);
                }
                
                $image = $request->file('image');
                $imageName = time() . '_' . $image->getClientOriginalName();
                $updateData['image_path'] = $image->storeAs('events', $imageName, 'public');
            }

            $event->update($updateData);

            return redirect()->back()->with('success', 'Event updated successfully.');
        } catch (\Exception $e) {
            dd($e);
            return redirect()->back()
                ->with('error', 'Error updating event: ' . $e->getMessage())
                ->withInput();
        }

        return redirect()->back()->with('success', 'Event updated successfully.');
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
