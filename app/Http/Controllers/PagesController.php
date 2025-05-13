<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PagesController extends Controller
{
    public function home(Request $request): Response
    {
        return Inertia::render('content/home', [
            'status' => $request->session()->get('status'),
        ]);
    }
    public function about(Request $request): Response
    {
        return Inertia::render('content/pages', [
            'status' => $request->session()->get('status'),
        ]);
    }
    public function contact(Request $request): Response
    {
        return Inertia::render('content/pages', [
            'status' => $request->session()->get('status'),
        ]);
    }
    public function update(Request $request)
    {
        $validated = $request->validate([
            'ref' => 'required|string',
            'attrs' => 'required|array',
        ]);

        try {
            $content = \App\Models\Content::updateOrCreate(
                ['ref' => $validated['ref']],
                [
                    'attrs' => $validated['attrs'],
                ]
            );
            return;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Content operation failed: ' . $e->getMessage());
            return;
        }
    }
}
