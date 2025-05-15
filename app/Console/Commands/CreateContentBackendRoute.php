<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Filesystem\Filesystem;

class CreateContentBackendRoute extends Command
{
    protected $signature = 'content:create-backend-route {page : The page name}
                            {--controller=PagesController : The controller to use}
                            {--route-prefix=pages : The route URL prefix}
                            {--name-prefix=pages : The route name prefix}';

    protected $description = 'Create a backend content page with route and controller method';
    protected $files;

    public function __construct(Filesystem $files)
    {
        parent::__construct();
        $this->files = $files;
    }

    public function handle()
    {
        $page = $this->argument('page');
        $controller = $this->option('controller');
        $routePrefix = $this->option('route-prefix');
        $namePrefix = $this->option('name-prefix');

        $this->addRoute($page, $controller, $routePrefix, $namePrefix);
        $this->addControllerMethod($page, $controller);

        $this->info("Backend content page '{$page}' has been created successfully!");

        return Command::SUCCESS;
    }

    protected function addRoute($page, $controller, $routePrefix, $namePrefix)
    {
        $routesPath = base_path('routes/pages.php');

        if (!$this->files->exists($routesPath)) {
            $this->error("Routes file 'routes/pages.php' does not exist.");
            return;
        }

        $routeContent = $this->files->get($routesPath);

        $routeDefinition = "Route::get('{$routePrefix}/{$page}', [{$controller}::class, '{$page}'])->name('{$namePrefix}.{$page}');";

        if (Str::contains($routeContent, $routeDefinition)) {
            $this->warn("Route for '{$page}' already exists in pages.php.");
            return;
        }

        $updateRoute = "Route::patch('content/update', [{$controller}::class, 'update'])->name('update.content');";
        $position = strpos($routeContent, $updateRoute);

        if ($position !== false) {
            $updatedContent = substr_replace(
                $routeContent,
                "    {$routeDefinition}\n\n    ",
                $position,
                0
            );

            $this->files->put($routesPath, $updatedContent);
            $this->info("Route added for '{$page}' in pages.php");
        } else {
            $this->error("Update route not found in pages.php. Cannot determine insertion point.");
        }
    }

    protected function addControllerMethod($page, $controller)
    {
        $controllerPath = app_path("Http/Controllers/{$controller}.php");

        if (!$this->files->exists($controllerPath)) {
            $this->error("Controller '{$controller}' does not exist.");
            return;
        }

        $controllerContent = $this->files->get($controllerPath);

        if (preg_match("/public\s+function\s+{$page}\s*\(/", $controllerContent)) {
            $this->warn("Method '{$page}' already exists in {$controller}.");
            return;
        }

        $pattern = '/public\s+function\s+update\s*\(\s*Request\s+\$request\s*\)/';

        if (preg_match($pattern, $controllerContent, $matches, PREG_OFFSET_CAPTURE)) {
            $updateMethodPosition = $matches[0][1];

            $previousChar = $controllerContent[$updateMethodPosition - 1];
            $methodStartPosition = $updateMethodPosition;

            while ($previousChar === ' ' || $previousChar === "\n" || $previousChar === "\r" || $previousChar === "\t") {
                $methodStartPosition--;
                if ($methodStartPosition <= 0) break;
                $previousChar = $controllerContent[$methodStartPosition - 1];
            }

            if (!Str::contains($controllerContent, 'use Illuminate\Http\Request;')) {
                $this->error("Request class import missing in controller.");
                return;
            }

            if (!Str::contains($controllerContent, 'use App\Models\Content;')) {
                $namespaceEnd = strpos($controllerContent, ';');
                if ($namespaceEnd !== false) {
                    $controllerContent = substr_replace(
                        $controllerContent,
                        ";\n\nuse App\Models\Content;",
                        $namespaceEnd,
                        1
                    );
                }
            }

            $methodDefinition = <<<EOT
    public function {$page}(Request \$request): Response
    {
        \${$page}Content = Content::where('ref', 'page.{$page}')->first();
        return Inertia::render('content/{$page}', [
            'initialContent' => [
                'page.{$page}' => \${$page}Content,
            ]
        ]);
    }

EOT;

            $updatedContent = substr_replace(
                $controllerContent,
                $methodDefinition,
                $methodStartPosition,
                0
            );

            $this->files->put($controllerPath, $updatedContent);
            $this->info("Controller method '{$page}' added to {$controller}");
        } else {
            $this->error("Update method not found in {$controller}. Cannot determine insertion point.");
        }
    }
}
