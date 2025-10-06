import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { logout } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, DollarSign, Package, Settings, ShoppingCart, TrendingUp, Truck, Users } from 'lucide-react';

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
            title: 'Total Pesanan',
            value: stats.total_orders,
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Pendapatan',
            value: formatPrice(stats.total_revenue),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Pelanggan',
            value: stats.total_customers,
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Total Produk',
            value: stats.total_products,
            icon: ShoppingCart,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    const orderStatusCards = [
        {
            title: 'Pesanan Menunggu',
            value: stats.pending_orders,
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            title: 'Pesanan Dikonfirmasi',
            value: stats.confirmed_orders,
            icon: CheckCircle,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Pesanan Dikirim',
            value: stats.shipped_orders,
            icon: Truck,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Pesanan Diterima',
            value: stats.delivered_orders,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];

    return (
        <AppLayout>
            <Head title='Dasbor Admin' />

            {/* Page Header */}
            <div className='container mx-auto py-8'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-400'>
                            Dasbor Admin
                        </h1>
                        <p className='text-muted-foreground'>Ringkasan kinerja e-katalog Anda</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className='text-sm text-muted-foreground'>Selamat datang, {auth.user?.name}</span>
                        <Button asChild variant='agricultural-outline'>
                            <Link href={logout()} method='post' as='button'>
                                Keluar
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className='container mx-auto space-y-8 pb-8'>
                {/* Overview Stats */}
                <div>
                    <h2 className='mb-4 text-xl font-semibold'>Ringkasan</h2>
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                        {statCards.map((stat) => (
                            <Card.Card key={stat.title} variant='agricultural-glass'>
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
                    <h2 className='mb-4 text-xl font-semibold'>Status Pesanan</h2>
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
                        {orderStatusCards.map((stat) => (
                            <Card.Card key={stat.title} variant='agricultural-glass'>
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
                    <h2 className='mb-4 text-xl font-semibold'>Aksi Cepat</h2>
                    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                        <Card.Card variant='agricultural-glass'>
                            <Card.CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <Package className='h-8 w-8 text-primary' />
                                    <div className='flex-1'>
                                        <h3 className='font-semibold'>Kelola Pesanan</h3>
                                        <p className='text-sm text-muted-foreground'>Lihat dan perbarui status pesanan</p>
                                    </div>
                                    <Button asChild variant='agricultural'>
                                        <Link href='/admin/orders'>Buka</Link>
                                    </Button>
                                </div>
                            </Card.CardContent>
                        </Card.Card>

                        <Card.Card variant='agricultural-glass'>
                            <Card.CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <ShoppingCart className='h-8 w-8 text-primary' />
                                    <div className='flex-1'>
                                        <h3 className='font-semibold'>Kelola Produk</h3>
                                        <p className='text-sm text-muted-foreground'>Tambah, edit, dan atur produk</p>
                                    </div>
                                    <Button asChild variant='agricultural'>
                                        <Link href='/products'>Buka</Link>
                                    </Button>
                                </div>
                            </Card.CardContent>
                        </Card.Card>

                        <Card.Card variant='agricultural-glass'>
                            <Card.CardContent className='p-6'>
                                <div className='flex items-center gap-4'>
                                    <Settings className='h-8 w-8 text-primary' />
                                    <div className='flex-1'>
                                        <h3 className='font-semibold'>Pengaturan</h3>
                                        <p className='text-sm text-muted-foreground'>Konfigurasi pengaturan sistem</p>
                                    </div>
                                    <Button asChild variant='agricultural'>
                                        <Link href='/settings'>Buka</Link>
                                    </Button>
                                </div>
                            </Card.CardContent>
                        </Card.Card>
                    </div>
                </div>

                {/* Recent Activity */}
                <Card.Card variant='agricultural-glass'>
                    <Card.CardHeader>
                        <Card.CardTitle className='flex items-center gap-2'>
                            <TrendingUp className='h-5 w-5' />
                            Aktivitas Terbaru
                        </Card.CardTitle>
                    </Card.CardHeader>
                    <Card.CardContent>
                        <div className='py-8 text-center'>
                            <p className='text-muted-foreground'>Aktivitas terbaru akan ditampilkan di sini</p>
                        </div>
                    </Card.CardContent>
                </Card.Card>
            </div>
        </AppLayout>
    );
}
