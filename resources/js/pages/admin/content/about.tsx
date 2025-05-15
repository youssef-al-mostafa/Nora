import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type NavItem } from '@/types';
import { FormEventHandler, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'About - dashboard',
        href: '/pages',
    },
];
const sidebarNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/pages/home',
    },
    {
        title: 'About',
        href: '/pages/about',
    },
];

const getPageNameFromPath = () => {
    const path = window.location.pathname;
    const segments = path.split('/');
    return segments[segments.length - 1];
};
const About = ({ initialContent }: { initialContent: any }) => {
    const currentPath = window.location.pathname;
    const pageName = getPageNameFromPath();

    const { data, setData, patch, processing, errors } = useForm({
        ref: `page.${pageName}`,
        attrs: {
            bannerText: '',
        },
    });

    useEffect(() => {
        console.log("Initial content received:", initialContent);

        if (initialContent && initialContent[`page.${pageName}`]) {
            const existingContent = initialContent[`page.${pageName}`];
            console.log("Existing content for this page:", existingContent);

            setData(prevData => {
                const newData = {
                    ref: `page.${pageName}`,
                    attrs: {
                        ...prevData.attrs,
                        ...existingContent.attrs
                    }
                };
                console.log("Setting form data to:", newData);
                return newData;
            });
        } else {
            console.log("No existing content found for this page");
        }
    }, [initialContent, pageName, setData]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('update.content'), {
            onSuccess: () => {
                console.log('Content updated successfully');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About" />
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

export default About;
