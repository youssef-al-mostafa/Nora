import { usePageContent } from '@/hooks/usePageContent';
import { contentService } from '@/services/ContentSevice';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

const Banner = () => {
    const { initialContent } = usePage().props as any;

    useEffect(() => {
      if (initialContent) {
        contentService.initialize(initialContent);
      }
    }, [initialContent]);
    const { attrs, loading } = usePageContent('home');

    if (loading) {
        return <div className="min-h-[300px] flex items-center justify-center">Loading...</div>;
    }

    return (
        <>
            <div className="hero bg-base-200 min-h-screen text-white">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">{attrs.bannerText || 'Hello there'}</h1>
                        <p className="py-6">{attrs.bannerSubtitle || 'Welcome to our website'}</p>
                        <button className="btn btn-primary">{attrs.ctaButtonText || 'Get Started'}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner
