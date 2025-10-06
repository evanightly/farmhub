import { AgriculturalBackground } from '@/components/ui/agricultural-background';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Package } from 'lucide-react';
import React, { ReactNode } from 'react';

interface CustomerLayoutProps {
    children: ReactNode;
    title?: string;
    icon?: React.ComponentType<{ className?: string }>;
    pageTitle?: string;
    backLink?: string;
    backLabel?: string;
}

export default function CustomerLayout({ children, title, icon: Icon = Package, pageTitle, backLink, backLabel = 'Kembali' }: CustomerLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            {title && <Head title={title} />}
            <div className='min-h-screen'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            {backLink && (
                                <>
                                    <Link
                                        href={backLink}
                                        className='flex items-center gap-2 text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                                    >
                                        <ArrowLeft className='h-5 w-5' />
                                        <span className='hidden sm:inline'>{backLabel}</span>
                                    </Link>
                                    <Separator orientation='vertical' className='h-6' />
                                </>
                            )}
                            <Icon className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                            <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                {pageTitle || title || 'E-Catalog Pertanian'}
                            </h1>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='ghost' size='icon'>
                                <AnimatedThemeToggler />
                            </Button>
                            {auth.user ? (
                                <Button asChild variant='agricultural-outline'>
                                    <Link href={dashboard()}>Dasbor</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant='agricultural-outline'>
                                        <Link href={login()}>Masuk</Link>
                                    </Button>
                                    <Button asChild variant='agricultural'>
                                        <Link href={register()}>Daftar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <AgriculturalBackground variant='subtle'>
                    <main className='container mx-auto p-6'>{children}</main>
                </AgriculturalBackground>
            </div>
        </>
    );
}
