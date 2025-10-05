import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, BarChart3, Calendar, DollarSign, Package, ShoppingCart, Sparkles, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Dashboard' />
            <div className='flex h-full flex-1 flex-col gap-8 overflow-x-auto rounded-xl p-6'>
                {/* Welcome Section */}
                <div className='space-y-2'>
                    <h1 className='bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-bold text-transparent dark:from-slate-100 dark:to-slate-400'>
                        Welcome back! 🌱
                    </h1>
                    <p className='text-lg text-slate-600 dark:text-slate-400'>Here's what's happening with your agricultural business today.</p>
                </div>

                {/* Stats Cards */}
                <div className='grid auto-rows-min gap-6 md:grid-cols-4'>
                    <Card.Card variant='agricultural-glass' className='group relative overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10'></div>
                        <Card.CardContent className='relative p-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-2'>
                                    <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>Total Revenue</p>
                                    <p className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                        $45,231
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <Badge className='border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'>
                                            <TrendingUp className='mr-1 h-3 w-3' />
                                            +20.1%
                                        </Badge>
                                        <span className='text-xs text-slate-500 dark:text-slate-400'>from last month</span>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <DollarSign className='h-12 w-12 text-emerald-600 dark:text-emerald-400' />
                                    <div className='absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-emerald-400'></div>
                                </div>
                            </div>
                        </Card.CardContent>
                    </Card.Card>

                    <Card.Card variant='agricultural-glass' className='group relative overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10'></div>
                        <Card.CardContent className='relative p-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-2'>
                                    <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>Total Orders</p>
                                    <p className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent dark:from-blue-400 dark:to-indigo-400'>
                                        2,350
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <Badge className='border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                                            <TrendingUp className='mr-1 h-3 w-3' />
                                            +18.6%
                                        </Badge>
                                        <span className='text-xs text-slate-500 dark:text-slate-400'>from last month</span>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <ShoppingCart className='h-12 w-12 text-blue-600 dark:text-blue-400' />
                                    <div className='absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-blue-400'></div>
                                </div>
                            </div>
                        </Card.CardContent>
                    </Card.Card>

                    <Card.Card variant='agricultural-glass' className='group relative overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10'></div>
                        <Card.CardContent className='relative p-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-2'>
                                    <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>Total Products</p>
                                    <p className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent dark:from-purple-400 dark:to-pink-400'>
                                        1,254
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <Badge className='border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800 dark:bg-purple-900 dark:text-purple-200'>
                                            <Package className='mr-1 h-3 w-3' />
                                            +12.3%
                                        </Badge>
                                        <span className='text-xs text-slate-500 dark:text-slate-400'>new this month</span>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <Package className='h-12 w-12 text-purple-600 dark:text-purple-400' />
                                    <div className='absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-purple-400'></div>
                                </div>
                            </div>
                        </Card.CardContent>
                    </Card.Card>

                    <Card.Card variant='agricultural-glass' className='group relative overflow-hidden'>
                        <div className='absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10'></div>
                        <Card.CardContent className='relative p-6'>
                            <div className='flex items-center justify-between'>
                                <div className='space-y-2'>
                                    <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>Active Customers</p>
                                    <p className='bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-3xl font-bold text-transparent dark:from-orange-400 dark:to-red-400'>
                                        573
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <Badge className='border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900 dark:text-orange-200'>
                                            <Users className='mr-1 h-3 w-3' />
                                            +8.2%
                                        </Badge>
                                        <span className='text-xs text-slate-500 dark:text-slate-400'>this month</span>
                                    </div>
                                </div>
                                <div className='relative'>
                                    <Users className='h-12 w-12 text-orange-600 dark:text-orange-400' />
                                    <div className='absolute -top-1 -right-1 h-4 w-4 animate-pulse rounded-full bg-orange-400'></div>
                                </div>
                            </div>
                        </Card.CardContent>
                    </Card.Card>
                </div>

                {/* Charts and Analytics */}
                <div className='grid gap-6 lg:grid-cols-2'>
                    <Card.Card variant='agricultural-glass'>
                        <Card.CardHeader className='pb-4'>
                            <Card.CardTitle className='flex items-center gap-3 text-2xl'>
                                <div className='relative'>
                                    <BarChart3 className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                                    <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400'></div>
                                </div>
                                <span className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                    Sales Analytics
                                </span>
                            </Card.CardTitle>
                            <p className='text-slate-600 dark:text-slate-400'>Revenue performance overview</p>
                        </Card.CardHeader>
                        <Card.CardContent className='relative flex min-h-[300px] items-center justify-center'>
                            <div className='space-y-4 text-center'>
                                <Activity className='mx-auto h-16 w-16 animate-pulse text-emerald-600 dark:text-emerald-400' />
                                <p className='text-slate-600 dark:text-slate-400'>Chart visualization will be implemented here</p>
                                <Button variant='agricultural'>
                                    <Sparkles className='mr-2 h-4 w-4' />
                                    View Detailed Reports
                                </Button>
                            </div>
                        </Card.CardContent>
                    </Card.Card>

                    <Card.Card variant='agricultural-glass'>
                        <Card.CardHeader className='pb-4'>
                            <Card.CardTitle className='flex items-center gap-3 text-2xl'>
                                <div className='relative'>
                                    <Calendar className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                                    <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-blue-400'></div>
                                </div>
                                <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400'>
                                    Recent Activity
                                </span>
                            </Card.CardTitle>
                            <p className='text-slate-600 dark:text-slate-400'>Latest business updates</p>
                        </Card.CardHeader>
                        <Card.CardContent className='space-y-4'>
                            <div className='flex items-center gap-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950'>
                                <div className='h-2 w-2 animate-pulse rounded-full bg-emerald-500'></div>
                                <div className='flex-1'>
                                    <p className='font-medium text-slate-900 dark:text-slate-100'>New order received</p>
                                    <p className='text-sm text-slate-600 dark:text-slate-400'>Fresh tomatoes order from Jakarta</p>
                                </div>
                                <span className='text-xs text-slate-500 dark:text-slate-400'>2 min ago</span>
                            </div>
                            <div className='flex items-center gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-950'>
                                <div className='h-2 w-2 animate-pulse rounded-full bg-blue-500'></div>
                                <div className='flex-1'>
                                    <p className='font-medium text-slate-900 dark:text-slate-100'>Product updated</p>
                                    <p className='text-sm text-slate-600 dark:text-slate-400'>Organic carrots stock replenished</p>
                                </div>
                                <span className='text-xs text-slate-500 dark:text-slate-400'>1 hour ago</span>
                            </div>
                            <div className='flex items-center gap-4 rounded-lg bg-purple-50 p-4 dark:bg-purple-950'>
                                <div className='h-2 w-2 animate-pulse rounded-full bg-purple-500'></div>
                                <div className='flex-1'>
                                    <p className='font-medium text-slate-900 dark:text-slate-100'>New customer registered</p>
                                    <p className='text-sm text-slate-600 dark:text-slate-400'>Farm Fresh Market joined</p>
                                </div>
                                <span className='text-xs text-slate-500 dark:text-slate-400'>3 hours ago</span>
                            </div>
                        </Card.CardContent>
                    </Card.Card>
                </div>
            </div>
        </AppLayout>
    );
}
