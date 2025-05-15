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
        $aboutContent = Content::where('ref', 'page.about')->first();
        return Inertia::render('content/about', [
            'initialContent' => [
                'page.about' => $aboutContent,
            ]
        ]);
    }


    public function update(Request $request)
    {
        $validated = $request->validate([
            'ref' => 'required|string',
            'attrs' => 'required|array',
        ]);

        try {
            $content = Content::updateOrCreate(
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
