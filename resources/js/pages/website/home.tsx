import  Footer  from '@/components/website/navigation/Footer';
import  NavBar  from '@/components/website/navigation/NavBar';
import  Banner  from '@/components/website/pages/home/Banner';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Home"/>
            <NavBar/>
            <Banner/>
            <Footer/>
        </>
    );
}
