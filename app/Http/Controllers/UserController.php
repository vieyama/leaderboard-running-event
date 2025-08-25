<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('page_size', 10);
        
        $users = User::with(['company' => function($query) {
                $query->select('id', 'company_name');
            }])
            ->select('id', 'name', 'email', 'type', 'created_at', 'company_id')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        // Clean pagination output

        return Inertia::render('Users/Index', [
            'users' => $users->toArray(),
            'page_size' => (int)$perPage,
            'page' => $request->input('page', 1)
        ]);
    }
}
