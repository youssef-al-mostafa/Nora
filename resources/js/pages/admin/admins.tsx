import { AdminsForm } from '@/components/admin/pages/admins/AddAdminForm';
import { AdminsTable } from '@/components/admin/pages/admins/AdminsTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admins',
        href: '/admins',
    },
];

export default function Admins() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admins" />
            <AdminsForm />
        </AppLayout>
    );
}
