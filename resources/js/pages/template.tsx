import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pages',
        href: '/pages',
    },
];
const Pages = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pages" />

        </AppLayout>
    );
}

export default Pages;
