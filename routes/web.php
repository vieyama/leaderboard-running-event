<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventRegisterController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EventRegisterController::class, 'eventList'])->name('events.list');
Route::get('/leaderboard/event/1', [EventRegisterController::class, 'leaderboard'])->name('leaderboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/admin-dashboard', [DashboardController::class, 'admin'])->name('admin-dashboard');
    Route::get('/dashboard/event/{id}', [DashboardController::class, 'detailEvent'])->name('detail-event');
    Route::delete('/activity/{id}', [DashboardController::class, 'destroyActivity'])->name('delete-activity');
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
});

require __DIR__ . '/auth.php';
