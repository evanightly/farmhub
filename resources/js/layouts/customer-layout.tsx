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

export default function CustomerLayout({ children, title, icon: Icon = Package, pageTitle, backLink, backLabel = 'Back' }: CustomerLayoutProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            {title && <Head title={title} />}
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/10'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            {backLink && (
                                <>
                                    <Link href={backLink} className='flex items-center gap-2 text-primary hover:text-primary/80'>
                                        <ArrowLeft className='h-5 w-5' />
                                        <span className='hidden sm:inline'>{backLabel}</span>
                                    </Link>
                                    <Separator orientation='vertical' className='h-6' />
                                </>
                            )}
                            <Icon className='h-8 w-8 text-primary' />
                            <h1 className='text-2xl font-bold text-primary'>{pageTitle || title || 'E-Catalog Pertanian'}</h1>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='ghost' size='icon'>
                                <AnimatedThemeToggler />
                            </Button>
                            {auth.user ? (
                                <Button asChild variant='outline'>
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant='outline'>
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>Register</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className='container mx-auto p-6'>{children}</main>
            </div>
        </>
    );
}
