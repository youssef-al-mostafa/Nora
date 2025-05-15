<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function addAdmin(Request $request): JsonResponse{
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
    public function createAdmin(): Response{
        return Inertia::render('admins/createAdmin');
    }
    public function getAdmins(): JsonResponse{
        $admins = User::role('admin')->get(['id', 'name', 'email', 'email_verified_at', 'created_at', 'updated_at']);

        return response()->json([
            'success' => true,
            'data' => $admins
        ]);
    }
    public function deleteAdmin(Request $request): JsonResponse{
        $request->validate([
            'id' => 'required|exists:users,id',
            'password' => ['required', 'current_password'],
        ]);

        $id = $request->input('id');
        try {
            $user = User::role('admin')->findOrFail($id);

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Admin deleted successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Admin deletion failed', [
                'admin_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete admin',
                'error' => app()->environment('production') ? 'An unexpected error occurred' : $e->getMessage()
            ], 500);
        }
    }
    public function changePasswordAdmin(Request $request): JsonResponse
    {
        $request->validate([
            'id' => 'required|exists:users,id',
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => 'required',
        ]);

        $id = $request->input('id');

        try {
            $user = User::role('admin')->findOrFail($id);
            $user->password = Hash::make($request->input('password'));
            $user->save();

            Log::info('Admin password changed', [
                'admin_id' => $id,
                'changed_by' => Auth::id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin password changed successfully'
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found'
            ], 404);
        } catch (\Exception $e) {
            Log::error('Admin password change failed', [
                'admin_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to change admin password',
                'error' => app()->environment('production') ? 'An unexpected error occurred' : $e->getMessage()
            ], 500);
        }
    }
}
