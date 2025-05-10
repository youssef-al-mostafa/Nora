<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Create a new admin user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function createAdmin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:50',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'])
        ]);

        $user->assignRole('admin');

        return response()->json([
            'success' => true,
            'message' => 'Admin created successfully',
            'data' => $user->only(['id', 'name', 'email', 'created_at'])
        ], 201);
    }
}
