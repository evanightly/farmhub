import OrderController from '@/actions/App/Http/Controllers/OrderController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import CustomerLayout from '@/layouts/customer-layout';
import { home, login, transactions } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, CreditCard, Eye, Mail, Package, Search, Truck, XCircle } from 'lucide-react';
import React, { useState } from 'react';

interface TransactionListProps {
    orders: App.Data.OrderData[];
    searchEmail?: string;
    isAdmin?: boolean;
}

export default function TransactionList({ orders, searchEmail = '', isAdmin = false }: TransactionListProps) {
    const { auth } = usePage<SharedData>().props;
    const [email, setEmail] = useState(searchEmail);
    const [isSearching, setIsSearching] = useState(false);

    // Check if user is admin or employee
    const isAdminOrEmployee = auth.user && (auth.user.role === 'admin' || auth.user.role === 'employee');
    // Check if user is authenticated
    const isAuthenticated = !!auth.user;

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
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'unpaid':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'paid':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'verified':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className='h-3 w-3' />;
            case 'confirmed':
                return <CheckCircle className='h-3 w-3' />;
            case 'shipped':
                return <Truck className='h-3 w-3' />;
            case 'delivered':
                return <CheckCircle className='h-3 w-3' />;
            case 'cancelled':
                return <XCircle className='h-3 w-3' />;
            default:
                return <Package className='h-3 w-3' />;
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email?.trim()) return;

        setIsSearching(true);
        router.get(
            transactions(),
            { email: email?.trim() },
            {
                preserveState: true,
                onFinish: () => setIsSearching(false),
            },
        );
    };

    const renderContent = () => (
        <div className='space-y-6'>
            {/* Page Header for authenticated users */}
            {isAuthenticated && (
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-400'>
                            {isAdminOrEmployee ? 'All Transactions' : 'Your Transactions'}
                        </h1>
                        <p className='text-muted-foreground'>
                            {isAdminOrEmployee ? 'Manage and monitor all customer transactions' : 'View your order history and transaction details'}
                        </p>
                    </div>
                </div>
            )}

            {/* Search functionality for admin/employee users */}
            {isAuthenticated && isAdminOrEmployee && (
                <Card.Card variant='agricultural-glass'>
                    <Card.CardHeader>
                        <Card.CardTitle className='flex items-center gap-2'>
                            <Search className='h-5 w-5' />
                            Search Customer Orders
                        </Card.CardTitle>
                        <Card.CardDescription>Enter any email address to find order history</Card.CardDescription>
                    </Card.CardHeader>
                    <Card.CardContent>
                        <form onSubmit={handleSearch} className='flex gap-4'>
                            <div className='flex-1'>
                                <Label htmlFor='email' className='sr-only'>
                                    Email Address
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='Enter email address to search'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type='submit' disabled={isSearching || !email?.trim()} variant='agricultural'>
                                {isSearching ? 'Searching...' : 'Search Orders'}
                            </Button>
                        </form>
                    </Card.CardContent>
                </Card.Card>
            )}

            {/* Regular authenticated user info */}
            {isAuthenticated && !isAdminOrEmployee && (
                <Card.Card variant='agricultural-glass'>
                    <Card.CardHeader>
                        <Card.CardTitle className='flex items-center gap-2'>
                            <Package className='h-5 w-5' />
                            Your Order History
                        </Card.CardTitle>
                        <Card.CardDescription>All your orders are automatically displayed below</Card.CardDescription>
                    </Card.CardHeader>
                </Card.Card>
            )}

            {/* Show message for unauthenticated users */}
            {!isAuthenticated && (
                <Card.Card variant='agricultural-glass'>
                    <Card.CardContent className='py-12 text-center'>
                        <Search className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                        <h3 className='mb-2 text-lg font-medium'>Login Required</h3>
                        <p className='mb-4 text-muted-foreground'>Please log in to view your transaction history.</p>
                        <p className='mb-6 text-sm text-muted-foreground'>
                            If you have a QR code from your order, you can scan it to view specific order details.
                        </p>
                        <div className='flex justify-center gap-3'>
                            <Button asChild variant='agricultural'>
                                <Link href={login()}>Log In</Link>
                            </Button>
                            <Button asChild variant='agricultural-outline'>
                                <Link href={home()}>Continue Shopping</Link>
                            </Button>
                        </div>
                    </Card.CardContent>
                </Card.Card>
            )}

            {orders.length > 0 ? (
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-lg font-semibold'>
                            {isAdminOrEmployee ? `Orders (${orders.length} found)` : `Your Orders (${orders.length} found)`}
                        </h2>
                        {searchEmail && <p className='text-sm text-muted-foreground'>Showing orders for {searchEmail}</p>}
                    </div>

                    <div className='grid gap-4'>
                        {orders.map((order) => (
                            <Card.Card key={order.id} className='transition-shadow hover:shadow-md' variant='agricultural-glass'>
                                <Card.CardContent className='p-6'>
                                    <div className='flex items-start justify-between'>
                                        <div className='space-y-2'>
                                            <div className='flex items-center gap-3'>
                                                <h3 className='font-semibold'>Order #{order.id}</h3>
                                                <Badge variant='outline' className={getStatusColor(order.status)}>
                                                    {getStatusIcon(order.status)}
                                                    <span className='ml-1 capitalize'>{order.status}</span>
                                                </Badge>
                                                <Badge variant='outline' className={getPaymentStatusColor(order.payment_status)}>
                                                    <CreditCard className='h-3 w-3' />
                                                    <span className='ml-1 capitalize'>{order.payment_status}</span>
                                                </Badge>
                                            </div>

                                            <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                                                <div className='flex items-center gap-1'>
                                                    <Calendar className='h-4 w-4' />
                                                    {formatDate(order.created_at)}
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <Mail className='h-4 w-4' />
                                                    {order.customer_name}
                                                </div>
                                            </div>

                                            <p className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-lg font-semibold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                                {formatPrice(order.total_amount)}
                                            </p>
                                        </div>

                                        <Button asChild variant='agricultural-outline' size='sm'>
                                            <Link href={OrderController.show(order.id)}>
                                                <Eye className='mr-2 h-4 w-4' />
                                                View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>
                        ))}
                    </div>

                    <div className='text-center'>
                        <Button asChild variant='agricultural-outline'>
                            <Link href={home()}>Continue Shopping</Link>
                        </Button>
                    </div>
                </div>
            ) : isAuthenticated && searchEmail ? (
                <Card.Card variant='agricultural-glass'>
                    <Card.CardContent className='py-12 text-center'>
                        <Package className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                        <h3 className='mb-2 text-lg font-medium'>No orders found</h3>
                        <p className='mb-4 text-muted-foreground'>We could not find any orders for {searchEmail}.</p>
                        <p className='mb-6 text-sm text-muted-foreground'>Double-check your email address or try a different email.</p>
                        <Button asChild variant='agricultural'>
                            <Link href={home()}>Start Shopping</Link>
                        </Button>
                    </Card.CardContent>
                </Card.Card>
            ) : isAuthenticated && !searchEmail ? (
                <Card.Card variant='agricultural-glass'>
                    <Card.CardContent className='py-12 text-center'>
                        <Package className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                        <h3 className='mb-2 text-lg font-medium'>No orders found</h3>
                        <p className='mb-6 text-muted-foreground'>
                            {isAdminOrEmployee
                                ? 'No orders found in the system. Orders will appear here once customers start making purchases.'
                                : "You haven't placed any orders yet. Start shopping to see your order history here."}
                        </p>
                        <Button asChild variant='agricultural'>
                            <Link href={home()}>Start Shopping</Link>
                        </Button>
                    </Card.CardContent>
                </Card.Card>
            ) : !isAuthenticated ? (
                <Card.Card variant='agricultural-glass'>
                    <Card.CardContent className='py-12 text-center'>
                        <Search className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
                        <h3 className='mb-2 text-lg font-medium'>Ready to find your orders?</h3>
                        <p className='mb-6 text-muted-foreground'>Enter your email address above to search for your order history.</p>
                        <Button asChild variant='agricultural-outline'>
                            <Link href={home()}>Browse Products</Link>
                        </Button>
                    </Card.CardContent>
                </Card.Card>
            ) : null}
        </div>
    );

    // Return different layouts based on authentication status
    if (!isAuthenticated) {
        return (
            <CustomerLayout title='Transaction History' pageTitle='Transaction History' icon={Search}>
                {renderContent()}
            </CustomerLayout>
        );
    }

    return (
        <AppLayout>
            <Head title='Transactions' />
            <div className='container mx-auto space-y-8 pb-8'>{renderContent()}</div>
        </AppLayout>
    );
}
