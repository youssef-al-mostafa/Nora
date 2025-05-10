import { AppContent } from '@/components/admin/core/app-content';
import { AppShell } from '@/components/admin/core/app-shell';
import { AppSidebar } from '@/components/admin/core/app-sidebar';
import { AppSidebarHeader } from '@/components/admin/core/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
