<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PagesController extends Controller
{
    public function home(): Response
    {
        $homeContent = Content::where('ref', 'page.home')->first();
        return Inertia::render('content/home', [
            'initialContent' => [
                'page.home' => $homeContent,
            ]
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
