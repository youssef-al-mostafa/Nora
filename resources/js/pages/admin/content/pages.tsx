import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type NavItem } from '@/types';
import { Button } from '@/components/common/button';
import { Separator } from '@/components/common/separator';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pages',
        href: '/pages',
    },
];

const sidebarNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/pages/home',
    },
];
const Pages = () => {
    const currentPath = window.location.pathname;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pages" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>
                <Separator className="my-6 md:hidden" />

            </div>
        </AppLayout>
    );
}

export default Pages;
