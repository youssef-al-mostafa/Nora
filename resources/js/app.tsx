import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        try {
            return await resolvePageComponent(
                `./pages/admin/${name}.tsx`,
                import.meta.glob('./pages/admin/**/*.tsx')
            );
        } catch (error) {
            try {
                return await resolvePageComponent(
                    `./pages/website/${name}.tsx`,
                    import.meta.glob('./pages/website/**/*.tsx')
                );
            } catch (secondError) {
                console.error(`Page component "${name}" not found in any directory`)
            }
        }
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
