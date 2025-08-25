<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use App\Models\ContactSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    /**
     * Show the contact form.
     */
    public function show(): Response
    {
        $settings = ContactSetting::getActiveSettings();
        
        return Inertia::render('Contact/Show', [
            'settings' => $settings
        ]);
    }

    /**
     * Handle the contact form submission.
     */
    public function submit(ContactFormRequest $request): RedirectResponse
    {
        // Here you can add your logic to handle the contact form submission
        // For example, send an email, save to database, etc.
        
        // Example: Send email (you'll need to configure your mail settings)
        /*
        Mail::send('emails.contact', [
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->subject,
            'message' => $request->message,
        ], function($message) use ($request) {
            $message->to('info@runningevent.com')
                    ->subject('New Contact Form Submission: ' . $request->subject);
        });
        */

        // For now, we'll just return a success message
        return redirect()->back()->with('success', 'Thank you for your message! We will get back to you soon.');
    }

    /**
     * Display a listing of the contact settings.
     */
    public function index()
    {
        $settings = ContactSetting::first();
        
        if (!$settings) {
            $settings = ContactSetting::create([
                'whatsapp1' => '',
                'whatsapp1_label' => 'WhatsApp 1',
                'whatsapp2' => '',
                'whatsapp2_label' => 'WhatsApp 2',
                'email' => '',
                'email_label' => 'Email',
                'contact_text' => 'Feel free to reach out to us through any of the following channels. We\'ll get back to you as soon as possible!',
                'is_active' => true,
            ]);
        }

        return Inertia::render('Admin/Contact/Index', [
            'settings' => $settings
        ]);
    }

    /**
     * Show the form for editing the specified contact settings.
     */
    public function edit($id)
    {
        $settings = ContactSetting::findOrFail($id);
        
        return Inertia::render('Admin/Contact/Edit', [
            'settings' => $settings
        ]);
    }

    /**
     * Update the specified contact settings in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'whatsapp1' => 'nullable|string|max:20',
            'whatsapp1_label' => 'nullable|string|max:50',
            'whatsapp2' => 'nullable|string|max:20',
            'whatsapp2_label' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'email_label' => 'nullable|string|max:50',
            'contact_text' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $settings = ContactSetting::findOrFail($id);
        $settings->update($validated);

        return redirect()->route('admin.contact-settings.index')
            ->with('success', 'Contact settings updated successfully.');
    }
}
