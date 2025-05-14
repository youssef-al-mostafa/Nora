<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Filesystem\Filesystem;

class CreateContentFrontRoute extends Command
{
    protected $signature = 'content:create-front-route {page : The page name}
                           {--controller=WebsiteController : The controller to use}
                           {--route-prefix=website : The route name prefix}';

    protected $description = 'Create content page with appropriate routes and controller methods';

    protected $files;

    public function __construct(Filesystem $files) {
        parent::__construct();
        $this->files = $files;
    }

    public function handle() {
        $page = $this->argument('page');
        $controller = $this->option('controller');
        $routePrefix = $this->option('route-prefix');

        $this->addRoute($page, $controller, $routePrefix);
        $this->addControllerMethod($page, $controller);

        $this->info("Content page '{$page}' has been created successfully!");

        return Command::SUCCESS;
    }

    protected function addRoute($page, $controller, $routePrefix) {
        $routesPath = base_path('routes/web.php');
        $routeContent = $this->files->get($routesPath);

        $routeDefinition = "Route::get('/{$page}', [{$controller}::class, '{$page}'])->name('{$routePrefix}.{$page}');";

        if (Str::contains($routeContent, $routeDefinition)) {
            $this->warn("Route for '{$page}' already exists.");
            return;
        }

        $showRoute = "Route::get('/content/{ref}', [{$controller}::class, 'show']);";
        $position = strpos($routeContent, $showRoute);

        if ($position !== false) {
            $updatedContent = substr_replace(
                $routeContent,
                $routeDefinition . PHP_EOL . PHP_EOL,
                $position,
                0
            );
        } else {
            $this->warn("Show route not found. Adding to the end of the routes file instead.");
            $lines = explode(PHP_EOL, $routeContent);
            $lastRouteIndex = $this->findLastRouteIndex($lines);
            array_splice($lines, $lastRouteIndex + 1, 0, $routeDefinition);
            $updatedContent = implode(PHP_EOL, $lines);
        }

        $this->files->put($routesPath, $updatedContent);
        $this->info("Route added for '{$page}'");
    }

    protected function findLastRouteIndex(array $lines) {
        $lastRouteIndex = 0;
        foreach ($lines as $index => $line) {
            if (Str::contains($line, 'Route::')) {
                $lastRouteIndex = $index;
            }
        }

        return $lastRouteIndex;
    }

    protected function addControllerMethod($page, $controller) {
        $controllerPath = app_path('Http/Controllers/' . $controller . '.php');

        if (!$this->files->exists($controllerPath)) {
            $this->error("Controller '{$controller}' does not exist. Please create it first.");
            return;
        }

        $controllerContent = $this->files->get($controllerPath);

        if (preg_match("/public function {$page}\(/", $controllerContent)) {
            $this->warn("Method '{$page}' already exists in {$controller}.");
            return;
        }

        $pattern = '/public\s+function\s+show\s*\(\s*\$ref\s*\)\s*\{/';
        if (preg_match($pattern, $controllerContent, $matches, PREG_OFFSET_CAPTURE)) {
            $showMethodPosition = $matches[0][1];

            $methodDefinition = <<<EOT
                public function {$page}() {
                    \$pageContent = \App\Models\Content::where('ref', 'page.{$page}')->first();
                    return inertia('website/{$page}', [
                      'content' => \$pageContent ? \$pageContent->attrs : null
                    ]);
                }
            EOT;

            $updatedContent = substr_replace(
                $controllerContent,
                $methodDefinition,
                $showMethodPosition,
                0
            );
        } else {
            $this->warn("Show method not found. Adding to the end of the controller instead.");
            $lastBrace = strrpos($controllerContent, '}');

            $methodDefinition = <<<EOT
                public function {$page}() {
                    \$pageContent = \App\Models\Content::where('ref', 'page.{$page}')->first();
                    return inertia('website/{$page}', [
                        'content' => \$pageContent ? \$pageContent->attrs : null
                    ]);
                }
            EOT;

            $updatedContent = substr_replace(
                $controllerContent,
                $methodDefinition,
                $lastBrace - 1,
                0
            );
        }

        $this->files->put($controllerPath, $updatedContent);
        $this->info("Controller method '{$page}' added to {$controller}");
    }
}
