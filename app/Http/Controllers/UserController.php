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
        $search = $request->input('search');

        $users = User::with(['company' => function ($query) {
                $query->select('id', 'company_name');
            }])
            ->select('id', 'name', 'email', 'type', 'created_at', 'company_id')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('company', function ($q) use ($search) {
                        $q->where('company_name', 'like', "%{$search}%");
                    });
                });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return Inertia::render('Users/Index', [
            'users' => $users->toArray(),
            'page_size' => (int) $perPage,
            'page' => $request->input('page', 1),
            'search' => $search
        ]);
    }

}
