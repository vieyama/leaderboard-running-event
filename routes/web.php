<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventRegisterController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [EventRegisterController::class, 'eventList'])->name('events.list');
Route::get('/leaderboard/event/1', [EventRegisterController::class, 'leaderboard'])->name('leaderboard');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/event/{id}', [DashboardController::class, 'detailEvent'])->name('detail-event');
    Route::get('/event/register/{id}', [EventRegisterController::class, 'register'])->name('event-register');
});

Route::middleware('auth')->group(function () {
    Route::post('/activity/create', [ActivityController::class, 'store'])->name('activity.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
