<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Filesystem\Filesystem;

class CreateContentBackend extends Command
{
    protected $signature = 'content:create-backend {page : The page name}
                           {--title= : The display title for the page (defaults to capitalized page name)}
                           {--base-nav-file=resources/js/pages/admin/content/home.tsx : Base file to extract nav items from}
                           {--template-file=resources/js/pages/template.tsx : Template file to use for new page}
                           {--output-dir=resources/js/pages/admin/content : Directory to create the new page in}';
    protected $description = 'Create backend admin content page with sidebar navigation';
    protected $files;

    public function __construct(Filesystem $files)
    {
        parent::__construct();
        $this->files = $files;
    }

    public function handle()
    {
        $page = $this->argument('page');
        $title = $this->option('title') ?: Str::headline($page);
        $baseNavFile = $this->option('base-nav-file');
        $templateFile = $this->option('template-file');
        $outputDir = $this->option('output-dir');

        $this->updateNavigation($baseNavFile, $page, $title);

        $this->createContentPage($templateFile, $outputDir, $page, $title);

        $this->info("Backend content admin page '{$page}' has been created successfully!");

        return Command::SUCCESS;
    }

    protected function updateNavigation($baseNavFile, $page, $title)
    {
        if (!$this->files->exists($baseNavFile)) {
            $this->error("Base navigation file '{$baseNavFile}' does not exist.");
            return;
        }

        $content = $this->files->get($baseNavFile);

        if (!preg_match('/const\s+sidebarNavItems\s*:\s*NavItem\[\]\s*=\s*\[(.*?)\];/s', $content, $matches)) {
            $this->error("Could not find sidebarNavItems array in base navigation file.");
            return;
        }

        $navItemsBlock = $matches[1];
        $newNavItem = <<<EOT
    {
        title: '{$title}',
        href: '/pages/{$page}',
    },
EOT;

        if (Str::contains($navItemsBlock, "href: '/pages/{$page}'")) {
            $this->warn("Navigation item for '{$page}' already exists in base file.");
        } else {
            if (preg_match('/},$/', $navItemsBlock, $lastItem, PREG_OFFSET_CAPTURE)) {
                $lastItemPosition = $lastItem[0][1] + 2;

                $updatedNavItems = substr_replace(
                    $navItemsBlock,
                    "\n    " . $newNavItem,
                    $lastItemPosition,
                    0
                );

                $updatedContent = str_replace($navItemsBlock, $updatedNavItems, $content);
                $this->files->put($baseNavFile, $updatedContent);

                $this->info("Navigation item added for '{$page}' in base file.");
            } else {
                $this->error("Could not find suitable position to insert navigation item.");
            }
        }
    }

    protected function createContentPage($templateFile, $outputDir, $page, $title)
    {
        if (!$this->files->exists($templateFile)) {
            $this->error("Template file '{$templateFile}' does not exist.");
            return;
        }

        if (!$this->files->isDirectory($outputDir)) {
            $this->files->makeDirectory($outputDir, 0755, true);
        }

        $outputFile = "{$outputDir}/{$page}.tsx";

        if ($this->files->exists($outputFile)) {
            $this->warn("Content page file '{$outputFile}' already exists.");
            if (!$this->confirm('Do you want to overwrite it?', false)) {
                return;
            }
        }

        $templateContent = $this->files->get($templateFile);

        $templateContent = preg_replace(
            '/(title: \'[^\']*\')/',
            "title: '{$title}'",
            $templateContent
        );

        $templateContent = preg_replace(
            '/const Pages = \(\) => {/',
            "const " . Str::studly($page) . " = () => {",
            $templateContent
        );

        $templateContent = preg_replace(
            '/export default Pages;/',
            "export default " . Str::studly($page) . ";",
            $templateContent
        );

        $templateContent = preg_replace(
            '/<Head title="[^"]*" \/>/',
            "<Head title=\"{$title}\" />",
            $templateContent
        );

        $baseNavFile = $this->option('base-nav-file');
        $baseContent = $this->files->get($baseNavFile);

        if (preg_match('/const\s+sidebarNavItems\s*:\s*NavItem\[\]\s*=\s*\[(.*?)\];/s', $baseContent, $matches)) {
            $navItemsBlock = $matches[1];

            $templateContent = preg_replace(
                '/const\s+sidebarNavItems\s*:\s*NavItem\[\]\s*=\s*\[(.*?)\];/s',
                "const sidebarNavItems: NavItem[] = [{$navItemsBlock}];",
                $templateContent
            );
        }

        $this->files->put($outputFile, $templateContent);
        $this->info("Content page file '{$outputFile}' created successfully.");
    }
}
