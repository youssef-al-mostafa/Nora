import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AdminsTable } from './adminsTable';
import { Button } from '@/components/common/button';
import { PlusCircle } from 'lucide-react';

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
            <div className='p-4'>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">
                        Admin Management
                    </h1>
                    <Button asChild>
                        <Link href={route('admin.create')}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            <span>Create Admin</span>
                        </Link>
                    </Button>
                </div>
                <AdminsTable />
            </div>
        </AppLayout>
    );
}
