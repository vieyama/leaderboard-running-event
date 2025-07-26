<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ContactSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = ContactSetting::first();
        
        if (!$settings) {
            $settings = ContactSetting::create([
                'whatsapp1_label' => 'WhatsApp 1',
                'whatsapp2_label' => 'WhatsApp 2',
                'email_label' => 'Email Us',
                'is_active' => true
            ]);
        }
        
        return Inertia::render('Admin/Contact/Index', [
            'settings' => $settings
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Contact/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'whatsapp1' => 'nullable|string|max:20',
            'whatsapp1_label' => 'required|string|max:50',
            'whatsapp2' => 'nullable|string|max:20',
            'whatsapp2_label' => 'required|string|max:50',
            'email' => 'nullable|email|max:100',
            'email_label' => 'required|string|max:50',
            'map_embed' => 'nullable|string',
            'contact_text' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $settings = ContactSetting::create($validated);
        
        return redirect()->route('admin.contact-settings.index')
            ->with('success', 'Contact settings created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $settings = ContactSetting::findOrFail($id);
        
        return Inertia::render('Admin/Contact/Show', [
            'settings' => $settings
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $settings = ContactSetting::findOrFail($id);
        
        return Inertia::render('Admin/Contact/Edit', [
            'settings' => $settings
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'whatsapp1' => 'nullable|string|max:20',
            'whatsapp1_label' => 'required|string|max:50',
            'whatsapp2' => 'nullable|string|max:20',
            'whatsapp2_label' => 'required|string|max:50',
            'email' => 'nullable|email|max:100',
            'email_label' => 'required|string|max:50',
            'map_embed' => 'nullable|string',
            'contact_text' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $settings = ContactSetting::findOrFail($id);
        $settings->update($validated);
        
        // Clear the cache
        Cache::forget('contact_settings');
        
        return redirect()->back()->with('success', 'Contact settings updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $settings = ContactSetting::findOrFail($id);
        $settings->delete();
        
        // Clear the cache
        Cache::forget('contact_settings');
        
        return redirect()->route('admin.contact-settings.index')
            ->with('success', 'Contact settings deleted successfully.');
    }
}
