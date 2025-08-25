<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventRegisterController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EventRegisterController::class, 'eventList'])->name('events.list');
Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'submit'])->name('contact.submit');
Route::get('/leaderboard/event/1', [EventRegisterController::class, 'leaderboard'])->name('leaderboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/my-events', [DashboardController::class, 'myEvents'])->name('my.events');
    Route::get('/admin-dashboard', [DashboardController::class, 'admin'])->name('admin-dashboard');
    Route::get('/dashboard/event/{id}', [DashboardController::class, 'detailEvent'])->name('detail-event');
    Route::delete('/activity/{id}', [ActivityController::class, 'destroyActivity'])->name('delete-activity');
    Route::get('/event/register/{id}', [EventRegisterController::class, 'register'])->name('event-register');
    Route::post('/activity/create', [ActivityController::class, 'store'])->name('activity.store');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/event/create', [EventController::class, 'store'])->name('event.create');
    Route::post('/event/update/{eventId}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/event/{id}', [EventController::class, 'destroy'])->name('event.destroy');
    Route::get('/manage-event/{id}', [EventController::class, 'detail'])->name('event.detail');
    Route::get('/event/{eventId}/user/{userId}', [EventController::class, 'detailEvent'])->name('admin-event-detail');

    // Users Management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    
    // Contact Settings Management
    Route::get('/admin/contact-settings', [ContactController::class, 'index'])
        ->name('admin.contact-settings.index');
    Route::get('/admin/contact-settings/{id}/edit', [ContactController::class, 'edit'])
        ->name('admin.contact-settings.edit');
    Route::put('/admin/contact-settings/{id}', [ContactController::class, 'update'])
        ->name('admin.contact-settings.update');
    
    // Contact Settings
    Route::prefix('admin/contact-settings')->name('admin.contact-settings.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\ContactSettingController::class, 'index'])->name('index');
        Route::get('/create', [\App\Http\Controllers\Admin\ContactSettingController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\Admin\ContactSettingController::class, 'store'])->name('store');
        Route::get('/{id}', [\App\Http\Controllers\Admin\ContactSettingController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [\App\Http\Controllers\Admin\ContactSettingController::class, 'edit'])->name('edit');
        Route::put('/{id}', [\App\Http\Controllers\Admin\ContactSettingController::class, 'update'])->name('update');
        Route::delete('/{id}', [\App\Http\Controllers\Admin\ContactSettingController::class, 'destroy'])->name('destroy');
    });
});

require __DIR__ . '/auth.php';
