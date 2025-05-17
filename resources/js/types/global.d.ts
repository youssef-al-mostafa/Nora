import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

export const sidebarNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/pages/home',
    },
        {
        title: 'About',
        href: '/pages/about',
    },
        {
        title: 'Contact',
        href: '/pages/contact',
    },
];
