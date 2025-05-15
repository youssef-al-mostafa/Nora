<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function addAdmin(Request $request): JsonResponse
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
    public function createAdmin(): Response
    {
        return Inertia::render('admins/CreateAdmin');
    }
    public function getAdmins(): JsonResponse
    {
        $admins = User::role('admin')->get(['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at']);

        return response()->json([
            'success' => true,
            'data' => $admins
        ]);
    }
    public function deleteAdmin(int $id): JsonResponse
    {
        try {
            $user = User::role('admin')->findOrFail($id);

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Admin deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
