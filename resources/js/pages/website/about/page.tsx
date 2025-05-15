import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import NavBar from '@/components/website/navigation/NavBar';
import Footer from '@/components/website/navigation/Footer';
import { contentService } from '@/services/ContentSevice';

export default function About() {
  const { content } = usePage().props as never;

  useEffect(() => {
    if (content) {
      contentService.initialize({ ['page.about']: content });
    }
  }, [content]);

  return (
    <>
      <Head title="About" />
      <NavBar />
      <div className="h-100"></div>
      <Footer />
    </>
  );
}
