import { NavItem } from '@/types';

export const adminSidebarNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/pages/home',
    },
    {
        title: 'About',
        href: '/pages/about',
    },
];

export const contentSidebarNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/pages/home',
    },
    {
        title: 'About',
        href: '/pages/about',
    },
];

export function getActiveNavItems(items: NavItem[], currentPath: string): NavItem[] {
    return items.map(item => ({
        ...item,
        isActive: item.href === currentPath,
    }));
}
