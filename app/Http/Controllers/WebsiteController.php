<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteController extends Controller
{
    public function home(): Response
    {
        $homeContent = Content::where('ref', 'page.home')->first();
        return Inertia::render('home/page', [
            'initialContent' => [
                'page.home' => $homeContent,
            ]
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('content/pages');
    }

    public function contact(): Response
    {
        return Inertia::render('content/pages');
    }

    public function show($ref)
    {
        $content = Content::where('ref', $ref)->first();
        return response()->json($content);
    }

}
