/* eslint-disable @typescript-eslint/no-explicit-any */
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/common/button';
import { Separator } from '@/components/common/separator';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { FormEventHandler, useEffect, useState } from 'react';
import { contentSidebarNavItems } from '@/config/adminNavigation';
import { NavItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home - dashboard',
        href: '/pages/home',
    },
];

const getPageNameFromPath = () => {
    const path = window.location.pathname;
    const segments = path.split('/');
    return segments[segments.length - 1];
};

const Home = ({ initialContent }: { initialContent: any }) => {
    const currentPath = window.location.pathname;
    const pageName = getPageNameFromPath();
    const [navItems, setNavItems] = useState<NavItem[]>(contentSidebarNavItems);

    const { data, setData, patch, processing, errors } = useForm({
        ref: `page.${pageName}`,
        attrs: {
            bannerText: '',
            bannerSubtitle: '',
            ctaButtonText: '',
            featuredSection: ''
        },
    });

    useEffect(() => {
        setNavItems(contentSidebarNavItems.map(item => ({
            ...item,
            isActive: item.href === currentPath
        })));
    }, [currentPath]);

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
            <Head title="Home" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {navItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': item.isActive || currentPath === item.href,
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

                <div className="flex-1 md:max-w-2xl pt-4">
                    <h2 className="text-2xl font-bold mb-6">{pageName.charAt(0).toUpperCase() + pageName.slice(1)} Content</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <label htmlFor="bannerText" className="text-sm font-medium">
                                Banner Text
                            </label>
                            <input
                                id="bannerText"
                                type="text"
                                className="p-2 border rounded"
                                value={data.attrs.bannerText ?? ''}
                                onChange={(e) => setData('attrs', {
                                    ...data.attrs,
                                    bannerText: e.target.value
                                })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="bannerSubtitle" className="text-sm font-medium">
                                Banner Subtitle
                            </label>
                            <textarea
                                id="bannerSubtitle"
                                rows={3}
                                className="p-2 border rounded"
                                value={data.attrs.bannerSubtitle || ''}
                                onChange={(e) => setData('attrs', {
                                    ...data.attrs,
                                    bannerSubtitle: e.target.value
                                })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="ctaButtonText" className="text-sm font-medium">
                                CTA Button Text
                            </label>
                            <input
                                id="ctaButtonText"
                                type="text"
                                className="p-2 border rounded"
                                value={data.attrs.ctaButtonText || ''}
                                onChange={(e) => setData('attrs', {
                                    ...data.attrs,
                                    ctaButtonText: e.target.value
                                })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="featuredSection" className="text-sm font-medium">
                                Featured Section Content
                            </label>
                            <textarea
                                id="featuredSection"
                                rows={5}
                                className="p-2 border rounded"
                                value={data.attrs.featuredSection || ''}
                                onChange={(e) => setData('attrs', {
                                    ...data.attrs,
                                    featuredSection: e.target.value
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
                </div>
            </div>
        </AppLayout>
    );
};

export default Home;
