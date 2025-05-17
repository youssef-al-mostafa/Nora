<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Illuminate\Filesystem\Filesystem;

class CreateContentBackend extends Command
{
    protected $signature = 'content:create-backend {page : The page name}
                           {--title= : The display title for the page (defaults to capitalized page name)}
                           {--template-file=resources/js/pages/admin/content/home.tsx : Template file to use as base}
                           {--nav-config=resources/js/config/adminNavigation.ts : Navigation configuration file}
                           {--single-field : Create with only one content field instead of multiple fields}';
    protected $description = 'Create backend admin content page with navigation and content form';
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
        $templateFile = $this->option('template-file');
        $navConfigFile = $this->option('nav-config');
        $singleField = $this->option('single-field');

        $outputDir = dirname($templateFile);
        $outputFile = "{$outputDir}/{$page}.tsx";

        if (!$this->files->exists($templateFile)) {
            $this->error("Template file '{$templateFile}' does not exist.");
            return Command::FAILURE;
        }

        if (!$this->files->exists($navConfigFile)) {
            $this->createNavigationConfig($navConfigFile);
        }

        if ($this->files->exists($outputFile)) {
            if (!$this->confirm("File '{$outputFile}' already exists. Do you want to overwrite it?", false)) {
                $this->info('Operation cancelled.');
                return Command::SUCCESS;
            }
        }

        $this->updateNavigationConfig($navConfigFile, $page, $title);

        $this->createContentPage($templateFile, $outputFile, $page, $title, $singleField);

        $this->info("Backend content admin page '{$page}' has been created successfully at {$outputFile}!");

        return Command::SUCCESS;
    }

    protected function createNavigationConfig($navConfigFile)
    {
        $this->info("Creating navigation configuration file at '{$navConfigFile}'...");

        $directory = dirname($navConfigFile);
        if (!$this->files->isDirectory($directory)) {
            $this->files->makeDirectory($directory, 0755, true);
        }

        $navConfigContent = <<<EOT
// File: resources/js/config/adminNavigation.ts

import { NavItem } from '@/types';

/**
 * Content management sidebar navigation
 * Centralized navigation items for content management pages
 */
export const contentSidebarNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/pages/home',
    },
];

/**
 * Helper to get the active state of navigation items
 * @param items - Navigation items to process
 * @param currentPath - Current path to compare against
 * @returns Navigation items with isActive property set
 */
export function getActiveNavItems(items: NavItem[], currentPath: string): NavItem[] {
    return items.map(item => ({
        ...item,
        isActive: item.href === currentPath,
    }));
}
EOT;

        $this->files->put($navConfigFile, $navConfigContent);
        $this->info("Created navigation configuration file.");
    }

    protected function updateNavigationConfig($navConfigFile, $page, $title)
    {
        $configContent = $this->files->get($navConfigFile);

        if (Str::contains($configContent, "href: '/pages/{$page}'")) {
            $this->warn("Navigation item for '{$page}' already exists in the config.");
            return;
        }

        if (preg_match('/export const contentSidebarNavItems: NavItem\[\] = \[(.*?)\];/s', $configContent, $matches)) {
            $navItemsBlock = $matches[1];
            $newNavItem = <<<EOT
    {
        title: '{$title}',
        href: '/pages/{$page}',
    },
EOT;

            if (preg_match('/},\s*$/m', $navItemsBlock, $lastItem, PREG_OFFSET_CAPTURE)) {
                $lastItemEndPosition = $lastItem[0][1] + strlen($lastItem[0][0]);
                $insertPosition = $matches[0][1] + $lastItemEndPosition - strlen($matches[1]);

                $updatedConfig = substr_replace(
                    $configContent,
                    $navItemsBlock . "\n    " . $newNavItem,
                    $matches[0][1] + strlen('export const contentSidebarNavItems: NavItem[] = ['),
                    strlen($navItemsBlock)
                );

                $this->files->put($navConfigFile, $updatedConfig);
                $this->info("Added navigation item for '{$page}' in the navigation config.");
            } else {
                $updatedConfig = str_replace(
                    'export const contentSidebarNavItems: NavItem[] = [',
                    "export const contentSidebarNavItems: NavItem[] = [\n    " . $newNavItem,
                    $configContent
                );

                $this->files->put($navConfigFile, $updatedConfig);
                $this->info("Added navigation item for '{$page}' in the navigation config.");
            }
        } else {
            $this->error("Could not find contentSidebarNavItems array in the config file.");
        }
    }

    protected function createContentPage($templateFile, $outputFile, $page, $title, $singleField)
    {
        $content = $this->files->get($templateFile);

        if (!Str::contains($content, 'import { contentSidebarNavItems }')) {
            $content = str_replace(
                "import { cn } from '@/lib/utils';",
                "import { cn } from '@/lib/utils';\nimport { contentSidebarNavItems } from '@/config/adminNavigation';",
                $content
            );
        }

        if (!Str::contains($content, 'const [navItems, setNavItems] = useState')) {
            $content = str_replace(
                'const pageName = getPageNameFromPath();',
                "const pageName = getPageNameFromPath();\n    const [navItems, setNavItems] = useState<NavItem[]>(contentSidebarNavItems);",
                $content
            );

            if (!Str::contains($content, 'setNavItems(')) {
                $content = str_replace(
                    'useEffect(() => {',
                    "// Set active navigation item based on current path\n    useEffect(() => {\n        setNavItems(contentSidebarNavItems.map(item => ({\n            ...item,\n            isActive: item.href === currentPath\n        })));\n    }, [currentPath]);\n\n    useEffect(() => {",
                    $content
                );
            }
        }

        if (Str::contains($content, 'sidebarNavItems.map(')) {
            $content = str_replace(
                'sidebarNavItems.map(',
                'navItems.map(',
                $content
            );
        }

        $content = str_replace('const Home = ', "const " . Str::studly($page) . " = ", $content);
        $content = str_replace('export default Home;', "export default " . Str::studly($page) . ";", $content);
        $content = preg_replace('/title: \'[^\']*\'/', "title: '{$title}'", $content);
        $content = preg_replace('/<Head title="[^"]*"/', "<Head title=\"{$title}\"", $content);

        if ($singleField) {
            preg_match('/<form onSubmit={handleSubmit}.*?<\/form>/s', $content, $formMatches);

            if (!empty($formMatches[0])) {
                $originalForm = $formMatches[0];

                $simplifiedForm = <<<EOT
<form onSubmit={handleSubmit} className="space-y-6">
    <div className="grid gap-2">
        <label htmlFor="pageContent" className="text-sm font-medium">
            Page Content
        </label>
        <textarea
            id="pageContent"
            rows={10}
            className="p-2 border rounded w-full"
            value={data.attrs.pageContent || ''}
            onChange={(e) => setData('attrs', {
                ...data.attrs,
                pageContent: e.target.value
            })}
        />
    </div>

    {errors.attrs && (
        <p className="text-red-500 text-sm">{errors.attrs}</p>
    )}

    <div className="flex justify-end pt-4">
        <Button type="submit" disabled={processing}>
            {processing ? 'Saving...' : 'Save Content'}
        </Button>
    </div>
</form>
EOT;

                $content = str_replace($originalForm, $simplifiedForm, $content);

                $content = preg_replace(
                    '/attrs: {.*?},/s',
                    "attrs: {\n            pageContent: ''\n        },",
                    $content
                );
            }
        }

        // 3. Write the file
        $this->files->put($outputFile, $content);
        $this->info("Created content page file at {$outputFile}");
    }
}
