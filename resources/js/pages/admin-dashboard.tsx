import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import AppLayout from '@/layouts/app-layout';
import { logout } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle, Clock, DollarSign, Package, Settings, ShoppingCart, TrendingDown, TrendingUp, Truck, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';

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

interface ChartData {
    daily_data: Array<{
        date: string;
        orders: number;
        revenue: number;
    }>;
    status_data: Array<{
        status: string;
        count: number;
        fill: string;
    }>;
    top_products: Array<{
        name: string;
        quantity: number;
    }>;
    comparison: {
        current: {
            orders: number;
            revenue: number;
        };
        previous: {
            orders: number;
            revenue: number;
        };
        orders_change: number;
        revenue_change: number;
    };
}

interface AdminDashboardProps {
    stats: DashboardStats;
}

interface DateRange {
    from: Date;
    to: Date | undefined;
}

const chartConfig = {
    orders: {
        label: 'Pesanan',
        color: '#3b82f6', // blue-500
    },
    revenue: {
        label: 'Pendapatan',
        color: '#10b981', // emerald-500
    },
    quantity: {
        label: 'Kuantitas',
        color: '#8b5cf6', // violet-500
    },
} satisfies ChartConfig;

const statusChartConfig = {
    pending: {
        label: 'Menunggu',
        color: '#f59e0b', // amber-500
    },
    confirmed: {
        label: 'Dikonfirmasi',
        color: '#3b82f6', // blue-500
    },
    shipped: {
        label: 'Dikirim',
        color: '#8b5cf6', // violet-500
    },
    delivered: {
        label: 'Diterima',
        color: '#10b981', // emerald-500
    },
    cancelled: {
        label: 'Dibatalkan',
        color: '#ef4444', // red-500
    },
} satisfies ChartConfig;

export default function AdminDashboard({ stats }: AdminDashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
    });
    console.log(chartData?.top_products);

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(numPrice);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
        });
    };

    const formatTooltipDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const fetchChartData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/admin/dashboard/chart-data', {
                params: {
                    date_from: dateRange.from.toISOString().split('T')[0],
                    date_to: dateRange.to?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
                },
            });
            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching chart data:', error);
            // You could set an error state here if needed
            setChartData(null);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    const handleDateRangeUpdate = ({ range }: { range: DateRange }) => {
        setDateRange(range);
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
                {/* Date Range Filter */}
                <div>
                    <h2 className='mb-4 text-xl font-semibold'>Filter Periode</h2>
                    <div className='max-w-sm'>
                        <DateRangePicker
                            initialDateFrom={dateRange.from}
                            initialDateTo={dateRange.to}
                            onUpdate={handleDateRangeUpdate}
                            locale='id-ID'
                            showCompare={false}
                        />
                    </div>
                </div>

                {/* Comparison Stats */}
                {chartData && (
                    <div>
                        <h2 className='mb-4 text-xl font-semibold'>Perbandingan Periode</h2>
                        <div className='grid gap-6 md:grid-cols-2'>
                            <Card.Card variant='agricultural-glass'>
                                <Card.CardContent className='p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-sm text-muted-foreground'>Pesanan (Periode Ini)</p>
                                            <p className='text-2xl font-bold'>{chartData.comparison.current.orders}</p>
                                            <div className='flex items-center gap-1 text-sm'>
                                                {chartData.comparison.orders_change >= 0 ? (
                                                    <TrendingUp className='h-4 w-4 text-green-600' />
                                                ) : (
                                                    <TrendingDown className='h-4 w-4 text-red-600' />
                                                )}
                                                <span className={chartData.comparison.orders_change >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {Math.abs(chartData.comparison.orders_change)}%
                                                </span>
                                                <span className='text-muted-foreground'>vs periode sebelumnya</span>
                                            </div>
                                        </div>
                                        <div className='rounded-full bg-blue-50 p-3'>
                                            <Package className='h-6 w-6 text-blue-600' />
                                        </div>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>

                            <Card.Card variant='agricultural-glass'>
                                <Card.CardContent className='p-6'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-sm text-muted-foreground'>Pendapatan (Periode Ini)</p>
                                            <p className='text-2xl font-bold'>{formatPrice(chartData.comparison.current.revenue)}</p>
                                            <div className='flex items-center gap-1 text-sm'>
                                                {chartData.comparison.revenue_change >= 0 ? (
                                                    <TrendingUp className='h-4 w-4 text-green-600' />
                                                ) : (
                                                    <TrendingDown className='h-4 w-4 text-red-600' />
                                                )}
                                                <span className={chartData.comparison.revenue_change >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                    {Math.abs(chartData.comparison.revenue_change)}%
                                                </span>
                                                <span className='text-muted-foreground'>vs periode sebelumnya</span>
                                            </div>
                                        </div>
                                        <div className='rounded-full bg-green-50 p-3'>
                                            <DollarSign className='h-6 w-6 text-green-600' />
                                        </div>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>
                        </div>
                    </div>
                )}

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

                {/* Charts Section */}
                {loading ? (
                    <div className='grid gap-6 md:grid-cols-2'>
                        <Card.Card variant='agricultural-glass'>
                            <Card.CardContent className='p-6'>
                                <div className='flex h-80 items-center justify-center'>
                                    <div className='text-muted-foreground'>Memuat data grafik...</div>
                                </div>
                            </Card.CardContent>
                        </Card.Card>
                        <Card.Card variant='agricultural-glass'>
                            <Card.CardContent className='p-6'>
                                <div className='flex h-80 items-center justify-center'>
                                    <div className='text-muted-foreground'>Memuat data grafik...</div>
                                </div>
                            </Card.CardContent>
                        </Card.Card>
                    </div>
                ) : chartData ? (
                    <div className='space-y-6'>
                        {/* Daily Orders and Revenue Chart */}
                        <Card.Card variant='agricultural-glass'>
                            <Card.CardHeader>
                                <Card.CardTitle>Pesanan dan Pendapatan Harian</Card.CardTitle>
                                <Card.CardDescription>Tren pesanan dan pendapatan per hari dalam periode yang dipilih</Card.CardDescription>
                            </Card.CardHeader>
                            <Card.CardContent>
                                <ChartContainer config={chartConfig} className='h-80 w-full'>
                                    <AreaChart data={chartData.daily_data}>
                                        <CartesianGrid strokeDasharray='3 3' />
                                        <XAxis dataKey='date' tickFormatter={formatDate} angle={-45} textAnchor='end' height={80} />
                                        <YAxis yAxisId='orders' orientation='left' />
                                        <YAxis yAxisId='revenue' orientation='right' />
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(value, name) => [
                                                        name === 'revenue' ? formatPrice(value as number) : value,
                                                        name === 'orders' ? 'Pesanan' : 'Pendapatan',
                                                    ]}
                                                    labelFormatter={(value) => `Tanggal: ${formatTooltipDate(value as string)}`}
                                                />
                                            }
                                        />
                                        <Area
                                            yAxisId='orders'
                                            type='monotone'
                                            dataKey='orders'
                                            stackId='1'
                                            stroke='#3b82f6'
                                            fill='#3b82f6'
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            yAxisId='revenue'
                                            type='monotone'
                                            dataKey='revenue'
                                            stackId='2'
                                            stroke='#10b981'
                                            fill='#10b981'
                                            fillOpacity={0.6}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </Card.CardContent>
                        </Card.Card>

                        <div className='grid gap-6 md:grid-cols-2'>
                            {/* Order Status Distribution */}
                            <Card.Card variant='agricultural-glass'>
                                <Card.CardHeader>
                                    <Card.CardTitle>Distribusi Status Pesanan</Card.CardTitle>
                                    <Card.CardDescription>Pembagian pesanan berdasarkan status dalam periode yang dipilih</Card.CardDescription>
                                </Card.CardHeader>
                                <Card.CardContent>
                                    <ChartContainer config={statusChartConfig} className='h-80 w-full'>
                                        <PieChart>
                                            <Pie
                                                data={chartData.status_data}
                                                dataKey='count'
                                                nameKey='status'
                                                cx='50%'
                                                cy='50%'
                                                outerRadius={80}
                                                label={({ status, count }) => `${status}: ${count}`}
                                            >
                                                {chartData.status_data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                        </PieChart>
                                    </ChartContainer>
                                </Card.CardContent>
                            </Card.Card>

                            {/* Top Products */}
                            <Card.Card variant='agricultural-glass'>
                                <Card.CardHeader>
                                    <Card.CardTitle>Produk Terlaris</Card.CardTitle>
                                    <Card.CardDescription>10 produk dengan penjualan terbanyak dalam periode yang dipilih</Card.CardDescription>
                                </Card.CardHeader>
                                <Card.CardContent>
                                    <ChartContainer config={chartConfig} className='h-80 w-full'>
                                        <BarChart
                                            accessibilityLayer
                                            data={chartData.top_products}
                                            layout='horizontal'
                                            margin={{
                                                left: 20,
                                                right: 20,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray='3 3' horizontal={true} vertical={false} />
                                            <YAxis type='number' dataKey='quantity' width={120} tickLine={false} axisLine={false} tickMargin={8} />
                                            <XAxis type='category' dataKey='name' tickLine={false} axisLine={false} tickMargin={8} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey='quantity' fill='#10b981' radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ChartContainer>
                                </Card.CardContent>
                            </Card.Card>
                        </div>
                    </div>
                ) : (
                    <Card.Card variant='agricultural-glass'>
                        <Card.CardContent className='p-6'>
                            <div className='flex h-80 items-center justify-center'>
                                <div className='text-muted-foreground'>Gagal memuat data grafik</div>
                            </div>
                        </Card.CardContent>
                    </Card.Card>
                )}

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
            </div>
        </AppLayout>
    );
}
