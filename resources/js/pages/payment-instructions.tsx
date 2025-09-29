import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, Banknote, Building2, CheckCircle, Copy, CreditCard, Leaf, Mail, MapPin, Package, Phone, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface PaymentInstructionsProps {
    order: App.Data.OrderData & {
        payment: App.Data.PaymentData & {
            account: App.Data.AccountData;
        };
    };
    account: App.Data.AccountData;
}

export default function PaymentInstructions({ order, account }: PaymentInstructionsProps) {
    const { auth } = usePage<SharedData>().props;
    const [copiedField, setCopiedField] = useState<string | null>(null);

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

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getAccountIcon = (type: string) => {
        switch (type) {
            case 'bank_transfer':
                return <Building2 className='h-5 w-5' />;
            case 'e_wallet':
                return <Smartphone className='h-5 w-5' />;
            case 'cash':
                return <Banknote className='h-5 w-5' />;
            default:
                return <CreditCard className='h-5 w-5' />;
        }
    };

    const getAccountTypeName = (type: string) => {
        switch (type) {
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'e_wallet':
                return 'E-Wallet';
            case 'cash':
                return 'Cash Payment';
            default:
                return 'Payment';
        }
    };

    return (
        <>
            <Head title='Payment Instructions' />
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/10 print:bg-white'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm print:hidden'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <Leaf className='h-8 w-8 text-primary' />
                            <h1 className='text-2xl font-bold text-primary'>Payment Instructions</h1>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='ghost' size='icon'>
                                <AnimatedThemeToggler />
                            </Button>
                            {auth.user ? (
                                <Link href={dashboard()} className='btn'>
                                    Dashboard
                                </Link>
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

                {/* Print-only header */}
                <div className='hidden print:mb-6 print:block'>
                    <div className='border-b pb-4 text-center'>
                        <h1 className='text-2xl font-bold text-black'>Payment Instructions</h1>
                        <p className='text-gray-600'>Order #{order.id}</p>
                    </div>
                </div>

                <main className='container mx-auto p-6 print:p-4 print:pt-0'>
                    {/* Success Message */}
                    <div className='mb-8 text-center print:mb-4'>
                        <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-600 print:hidden' />
                        <h2 className='mb-2 text-3xl font-bold text-foreground print:text-xl print:text-black'>Order Created Successfully!</h2>
                        <p className='text-lg text-muted-foreground print:text-base print:text-gray-700'>
                            Please complete your payment using the instructions below.
                        </p>
                    </div>

                    <div className='grid gap-8 lg:grid-cols-2 print:grid-cols-1 print:gap-4'>
                        {/* Payment Instructions */}
                        <div className='print-avoid-break space-y-6'>
                            <Card.Card className='border-primary/20 print:border-gray-300'>
                                <Card.CardHeader>
                                    <Card.CardTitle className='flex items-center gap-2'>
                                        {getAccountIcon(account.account_type || 'bank_transfer')}
                                        Payment via {getAccountTypeName(account.account_type || 'bank_transfer')}
                                    </Card.CardTitle>
                                    <Card.CardDescription>Complete your payment using the details below</Card.CardDescription>
                                </Card.CardHeader>
                                <Card.CardContent className='space-y-4'>
                                    {/* Payment Amount */}
                                    <div className='rounded-lg bg-primary/5 p-4'>
                                        <div className='flex items-center justify-between'>
                                            <span className='text-sm font-medium text-muted-foreground'>Amount to Pay</span>
                                            <span className='text-2xl font-bold text-primary'>{formatPrice(order.total_amount)}</span>
                                        </div>
                                    </div>

                                    {/* Account Details */}
                                    <div className='space-y-3'>
                                        <h4 className='font-semibold'>Account Details</h4>

                                        <div className='space-y-2'>
                                            <div className='flex items-center justify-between rounded-lg border p-3'>
                                                <div>
                                                    <p className='text-sm text-muted-foreground'>Account Name</p>
                                                    <p className='font-medium'>{account.account_name}</p>
                                                </div>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    className='print:hidden'
                                                    onClick={() => copyToClipboard(account.account_name || '', 'name')}
                                                >
                                                    {copiedField === 'name' ? (
                                                        <CheckCircle className='h-4 w-4 text-green-600' />
                                                    ) : (
                                                        <Copy className='h-4 w-4' />
                                                    )}
                                                </Button>
                                            </div>

                                            <div className='flex items-center justify-between rounded-lg border p-3'>
                                                <div>
                                                    <p className='text-sm text-muted-foreground'>Account Number</p>
                                                    <p className='font-mono font-medium'>{account.account_no}</p>
                                                </div>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                    className='print:hidden'
                                                    onClick={() => copyToClipboard(account.account_no || '', 'number')}
                                                >
                                                    {copiedField === 'number' ? (
                                                        <CheckCircle className='h-4 w-4 text-green-600' />
                                                    ) : (
                                                        <Copy className='h-4 w-4' />
                                                    )}
                                                </Button>
                                            </div>

                                            {account.metadata &&
                                                typeof account.metadata === 'object' &&
                                                !Array.isArray(account.metadata) &&
                                                (account.metadata as any).bank_name && (
                                                    <div className='flex items-center justify-between rounded-lg border p-3'>
                                                        <div>
                                                            <p className='text-sm text-muted-foreground'>Bank Name</p>
                                                            <p className='font-medium'>{(account.metadata as any).bank_name}</p>
                                                        </div>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            className='print:hidden'
                                                            onClick={() => copyToClipboard((account.metadata as any)?.bank_name || '', 'bank')}
                                                        >
                                                            {copiedField === 'bank' ? (
                                                                <CheckCircle className='h-4 w-4 text-green-600' />
                                                            ) : (
                                                                <Copy className='h-4 w-4' />
                                                            )}
                                                        </Button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>

                                    {/* Payment Instructions */}
                                    {account.instructions && (
                                        <div className='space-y-2'>
                                            <h4 className='font-semibold'>Payment Instructions</h4>
                                            <div className='rounded-lg bg-muted/50 p-3'>
                                                <div
                                                    className='prose prose-sm dark:prose-invert max-w-none'
                                                    dangerouslySetInnerHTML={{ __html: account.instructions }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Important Notes */}
                                    <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950'>
                                        <div className='flex items-start gap-2'>
                                            <AlertCircle className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
                                            <div className='space-y-1'>
                                                <p className='font-medium text-yellow-800 dark:text-yellow-200'>Important Notes:</p>
                                                <ul className='space-y-1 text-sm text-yellow-700 dark:text-yellow-300'>
                                                    <li>• Transfer the exact amount as shown above</li>
                                                    <li>• Keep your payment receipt for verification</li>
                                                    <li>• Contact us if you have any payment issues</li>
                                                    <li>• Your order will be processed after payment verification</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>
                        </div>

                        {/* Order Summary */}
                        <div className='space-y-6'>
                            <Card.Card>
                                <Card.CardHeader>
                                    <Card.CardTitle className='flex items-center gap-2'>
                                        <Package className='h-5 w-5' />
                                        Order Summary
                                    </Card.CardTitle>
                                    <Card.CardDescription>Order #{order.id}</Card.CardDescription>
                                </Card.CardHeader>
                                <Card.CardContent className='space-y-4'>
                                    {/* Order Items */}
                                    <div className='space-y-3'>
                                        <h4 className='font-semibold'>Items:</h4>
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

                                    <div className='flex items-center justify-between font-bold'>
                                        <span>Total Amount</span>
                                        <span className='text-lg text-primary'>{formatPrice(order.total_amount)}</span>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>

                            {/* Customer Information */}
                            <Card.Card>
                                <Card.CardHeader>
                                    <Card.CardTitle>Customer Information</Card.CardTitle>
                                </Card.CardHeader>
                                <Card.CardContent className='space-y-3'>
                                    <div className='flex items-center gap-2'>
                                        <Mail className='h-4 w-4 text-muted-foreground' />
                                        <span className='text-sm'>{order.customer_email}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Phone className='h-4 w-4 text-muted-foreground' />
                                        <span className='text-sm'>{order.customer_phone}</span>
                                    </div>
                                    <div className='flex items-start gap-2'>
                                        <MapPin className='mt-0.5 h-4 w-4 text-muted-foreground' />
                                        <span className='text-sm'>{order.shipping_address}</span>
                                    </div>
                                    {order.notes && (
                                        <div className='rounded-lg bg-muted/50 p-3'>
                                            <p className='text-sm text-muted-foreground'>Notes:</p>
                                            <p className='text-sm'>{order.notes}</p>
                                        </div>
                                    )}
                                </Card.CardContent>
                            </Card.Card>

                            {/* Action Buttons */}
                            <div className='space-y-3 print:hidden'>
                                <Button asChild className='w-full'>
                                    <Link href={home()}>Continue Shopping</Link>
                                </Button>
                                <Button asChild variant='outline' className='w-full'>
                                    <Link href='#' onClick={() => window.print()}>
                                        Print Instructions
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
