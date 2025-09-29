import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { logout } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, CheckCircle, Clock, DollarSign, Package, Settings, ShoppingCart, TrendingUp, Truck, Users } from 'lucide-react';

interface DashboardStats {
    total_orders: number;
    pending_orders: number;
    confirmed_orders: number;
    shipped_orders: number;
    delivered_orders: number;
    total_revenue: number;
    total_customers: number;
    total_products: number;
}

interface AdminDashboardProps {
    stats: DashboardStats;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const { auth } = usePage<SharedData>().props;

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(numPrice);
    };

    const statCards = [
        {
            title: 'Total Orders',
            value: stats.total_orders,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Revenue',
            value: formatPrice(stats.total_revenue),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Customers',
            value: stats.total_customers,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Total Products',
            value: stats.total_products,
            icon: ShoppingCart,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    const orderStatusCards = [
        {
            title: 'Pending Orders',
            value: stats.pending_orders,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Confirmed Orders',
            value: stats.confirmed_orders,
            icon: CheckCircle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Shipped Orders',
            value: stats.shipped_orders,
            icon: Truck,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Delivered Orders',
            value: stats.delivered_orders,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <AppLayout>
            <Head title='Admin Dashboard' />
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/10'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <BarChart3 className='h-8 w-8 text-primary' />
                            <h1 className='text-2xl font-bold text-primary'>Admin Dashboard</h1>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='ghost' size='icon'>
                                <AnimatedThemeToggler />
                            </Button>
                            <span className='text-sm text-muted-foreground'>Welcome, {auth.user?.name}</span>
                            <Button asChild variant='ghost'>
                                <Link href={logout()} method='post' as='button'>
                                    Logout
                                </Link>
                            </Button>
                        </nav>
                    </div>
                </header>

                <main className='container mx-auto p-6'>
                    {/* Overview Stats */}
                    <div className='mb-8'>
                        <h2 className='mb-4 text-xl font-semibold'>Overview</h2>
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                            {statCards.map((stat) => (
                                <Card.Card key={stat.title}>
                                    <Card.CardContent className='p-6'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-sm text-muted-foreground'>{stat.title}</p>
                                                <p className='text-2xl font-bold'>{stat.value}</p>
                                            </div>
                                            <div className={`rounded-full p-3 ${stat.bgColor}`}>
                                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </Card.CardContent>
                                </Card.Card>
                            ))}
                        </div>
                    </div>

                    {/* Order Status */}
                    <div className='mb-8'>
                        <h2 className='mb-4 text-xl font-semibold'>Order Status</h2>
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                            {orderStatusCards.map((stat) => (
                                <Card.Card key={stat.title}>
                                    <Card.CardContent className='p-6'>
                                        <div className='flex items-center justify-between'>
                                            <div>
                                                <p className='text-sm text-muted-foreground'>{stat.title}</p>
                                                <p className='text-2xl font-bold'>{stat.value}</p>
                                            </div>
                                            <div className={`rounded-full p-3 ${stat.bgColor}`}>
                                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </Card.CardContent>
                                </Card.Card>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className='mb-8'>
                        <h2 className='mb-4 text-xl font-semibold'>Quick Actions</h2>
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            <Card.Card>
                                <Card.CardContent className='p-6'>
                                    <div className='flex items-center gap-4'>
                                        <Package className='h-8 w-8 text-primary' />
                                        <div className='flex-1'>
                                            <h3 className='font-semibold'>Manage Orders</h3>
                                            <p className='text-sm text-muted-foreground'>View and update order statuses</p>
                                        </div>
                                        <Button asChild>
                                            <Link href='/admin/orders'>Go</Link>
                                        </Button>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>

                            <Card.Card>
                                <Card.CardContent className='p-6'>
                                    <div className='flex items-center gap-4'>
                                        <ShoppingCart className='h-8 w-8 text-primary' />
                                        <div className='flex-1'>
                                            <h3 className='font-semibold'>Manage Products</h3>
                                            <p className='text-sm text-muted-foreground'>Add, edit, and organize products</p>
                                        </div>
                                        <Button asChild variant='outline'>
                                            <Link href='/products'>Go</Link>
                                        </Button>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>

                            <Card.Card>
                                <Card.CardContent className='p-6'>
                                    <div className='flex items-center gap-4'>
                                        <Settings className='h-8 w-8 text-primary' />
                                        <div className='flex-1'>
                                            <h3 className='font-semibold'>Settings</h3>
                                            <p className='text-sm text-muted-foreground'>Configure system settings</p>
                                        </div>
                                        <Button asChild variant='outline'>
                                            <Link href='/settings'>Go</Link>
                                        </Button>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <Card.Card>
                        <Card.CardHeader>
                            <Card.CardTitle className='flex items-center gap-2'>
                                <TrendingUp className='h-5 w-5' />
                                Recent Activity
                            </Card.CardTitle>
                        </Card.CardHeader>
                        <Card.CardContent>
                            <div className='py-8 text-center'>
                                <p className='text-muted-foreground'>Recent activity will be displayed here</p>
                            </div>
                        </Card.CardContent>
                    </Card.Card>
                </main>
            </div>
        </AppLayout>
    );
}
