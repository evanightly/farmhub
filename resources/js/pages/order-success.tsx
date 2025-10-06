import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, Leaf, Mail, MapPin, Package, Phone } from 'lucide-react';
import React from 'react';

interface OrderSuccessProps {
    order: App.Data.OrderData;
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
    const { auth } = usePage<SharedData>().props;

    const formatPrice = (price: number | string) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(numPrice);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'confirmed':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'shipped':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'delivered':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'cancelled':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getPaymentStatusColor = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'unpaid':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'paid':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'verified':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <>
            <Head title='Konfirmasi Pesanan' />
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/10'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <Leaf className='h-8 w-8 text-primary' />
                            <h1 className='text-2xl font-bold text-primary'>Konfirmasi Pesanan</h1>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='ghost' size='icon'>
                                <AnimatedThemeToggler />
                            </Button>
                            {auth.user ? (
                                <Link href={dashboard()} className='btn'>
                                    Dasbor
                                </Link>
                            ) : (
                                <>
                                    <Button asChild variant='outline'>
                                        <Link href={login()}>Masuk</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>Daftar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className='container mx-auto p-6'>
                    {/* Success Message */}
                    <div className='mb-8 text-center'>
                        <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-600' />
                        <h2 className='mb-2 text-3xl font-bold text-foreground'>Pesanan Berhasil Dibuat!</h2>
                        <p className='text-lg text-muted-foreground'>
                            Terima kasih atas pesanan Anda. Kami akan memproses dan menghubungi Anda segera.
                        </p>
                    </div>

                    <div className='grid gap-8 lg:grid-cols-3'>
                        {/* Order Details */}
                        <div className='space-y-6 lg:col-span-2'>
                            <Card.Card>
                                <Card.CardHeader>
                                    <div className='flex items-center justify-between'>
                                        <Card.CardTitle className='flex items-center gap-2'>
                                            <Package className='h-5 w-5' />
                                            Pesanan #{order.id}
                                        </Card.CardTitle>
                                        <div className='flex gap-2'>
                                            <span className={`rounded-md border px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                            <span
                                                className={`rounded-md border px-2 py-1 text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}
                                            >
                                                {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <Card.CardDescription className='flex items-center gap-2'>
                                        <Clock className='h-4 w-4' />
                                        Dipesan pada {formatDate(order.created_at)}
                                    </Card.CardDescription>
                                </Card.CardHeader>
                                <Card.CardContent>
                                    <div className='space-y-4'>
                                        <h4 className='font-semibold'>Item Pesanan:</h4>
                                        <div className='space-y-3'>
                                            {order.order_items?.map((item) => (
                                                <div key={item.id} className='flex items-center justify-between rounded-lg bg-muted/50 p-3'>
                                                    <div className='flex-1'>
                                                        <p className='font-medium'>{item.product_name}</p>
                                                        <p className='text-sm text-muted-foreground'>
                                                            {item.quantity} × {formatPrice(parseFloat(item.product_price))} ({item.unit_label})
                                                        </p>
                                                    </div>
                                                    <p className='font-medium'>{formatPrice(parseFloat(item.subtotal))}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator />

                                        <div className='flex justify-between text-lg font-semibold'>
                                            <span>Total</span>
                                            <span>{order.formatted_total}</span>
                                        </div>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>

                            {/* Customer Information */}
                            <Card.Card>
                                <Card.CardHeader>
                                    <Card.CardTitle>Informasi Pelanggan</Card.CardTitle>
                                </Card.CardHeader>
                                <Card.CardContent className='space-y-4'>
                                    <div className='grid gap-4 sm:grid-cols-2'>
                                        <div className='space-y-2'>
                                            <Label className='flex items-center gap-2'>
                                                <Mail className='h-4 w-4' />
                                                Email
                                            </Label>
                                            <p className='text-sm font-medium'>{order.customer_email}</p>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label className='flex items-center gap-2'>
                                                <Phone className='h-4 w-4' />
                                                Telepon
                                            </Label>
                                            <p className='text-sm font-medium'>{order.customer_phone}</p>
                                        </div>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label className='flex items-center gap-2'>
                                            <MapPin className='h-4 w-4' />
                                            Alamat Pengiriman
                                        </Label>
                                        <p className='text-sm whitespace-pre-line'>{order.shipping_address}</p>
                                    </div>
                                    {order.notes && (
                                        <div className='space-y-2'>
                                            <Label>Catatan Pesanan</Label>
                                            <p className='text-sm whitespace-pre-line text-muted-foreground'>{order.notes}</p>
                                        </div>
                                    )}
                                </Card.CardContent>
                            </Card.Card>
                        </div>

                        {/* Next Steps */}
                        <div className='lg:col-span-1'>
                            <Card.Card>
                                <Card.CardHeader>
                                    <Card.CardTitle>Apa Selanjutnya?</Card.CardTitle>
                                </Card.CardHeader>
                                <Card.CardContent className='space-y-4'>
                                    <div className='space-y-3'>
                                        <div className='flex gap-3'>
                                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                                                1
                                            </div>
                                            <div>
                                                <p className='font-medium'>Konfirmasi Pesanan</p>
                                                <p className='text-sm text-muted-foreground'>Kami akan mengirimkan email konfirmasi segera.</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs'>2</div>
                                            <div>
                                                <p className='font-medium'>Instruksi Pembayaran</p>
                                                <p className='text-sm text-muted-foreground'>
                                                    Anda akan menerima detail pembayaran via email atau telepon.
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs'>3</div>
                                            <div>
                                                <p className='font-medium'>Pemrosesan</p>
                                                <p className='text-sm text-muted-foreground'>
                                                    Kami akan menyiapkan produk pertanian Anda untuk pengiriman.
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex gap-3'>
                                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs'>4</div>
                                            <div>
                                                <p className='font-medium'>Pengiriman</p>
                                                <p className='text-sm text-muted-foreground'>Pesanan Anda akan dikirim ke alamat Anda.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className='space-y-3'>
                                        <Button asChild className='w-full'>
                                            <Link href={home()}>
                                                <Leaf className='mr-2 h-4 w-4' />
                                                Lanjut Berbelanja
                                            </Link>
                                        </Button>

                                        {auth.user && (
                                            <Button asChild variant='outline' className='w-full'>
                                                <Link href={dashboard()}>Lihat Pesanan Saya</Link>
                                            </Button>
                                        )}
                                    </div>

                                    <div className='rounded-lg bg-muted/50 p-3'>
                                        <p className='text-sm font-medium'>Butuh Bantuan?</p>
                                        <p className='text-sm text-muted-foreground'>
                                            Hubungi kami jika Anda memiliki pertanyaan tentang pesanan Anda.
                                        </p>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

// Helper component for consistent labeling
function Label({ children, className = '', ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label className={`text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
            {children}
        </label>
    );
}
