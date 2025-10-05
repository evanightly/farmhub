import PaymentController from '@/actions/App/Http/Controllers/PaymentController';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Banknote,
    Building2,
    Check,
    CheckCircle,
    Copy,
    CreditCard,
    Hash,
    Leaf,
    Mail,
    MapPin,
    Package,
    Phone,
    QrCode,
    Shield,
    Smartphone,
    Sparkles,
    Upload,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface PaymentInstructionsProps {
    order: App.Data.OrderData & {
        payment: App.Data.PaymentData & {
            account: App.Data.AccountData;
        };
    };
    account: App.Data.AccountData;
    qrCodeDataUri: string;
}

export default function PaymentInstructions({ order, account, qrCodeDataUri }: PaymentInstructionsProps) {
    const { auth } = usePage<SharedData>().props;
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Get current date in ISO format for datetime-local input
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        proof_image: null as File | null,
        reference_number: '',
        payment_date: getCurrentDateTime(),
        notes: '',
    });

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('proof_image', file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(PaymentController.uploadProof(order.id).url, {
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
            },
        });
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
            <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 print:bg-white'>
                {/* Background decoration */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] print:hidden'></div>
                <div className='absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-[100px] print:hidden'></div>
                {/* Background decoration */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] print:hidden'></div>
                <div className='absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-[100px] print:hidden'></div>
                <header className='sticky top-0 z-50 border-b bg-white/80 shadow-sm backdrop-blur-lg dark:bg-slate-950/80 print:hidden'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <Leaf className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                                <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400'></div>
                            </div>
                            <div>
                                <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                    Payment Instructions
                                </h1>
                                <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                                    <Shield className='h-3 w-3' />
                                    Secure & Protected
                                </p>
                            </div>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='agricultural-ghost' size='icon'>
                                <AnimatedThemeToggler />
                            </Button>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className='inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-lg ring-offset-background transition-colors hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
                                >
                                    <Sparkles className='mr-2 h-4 w-4' />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Button asChild variant='agricultural-outline'>
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button asChild variant='agricultural'>
                                        <Link href={register()}>Register</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>
                {/* Print-only header */}
                {/* Print-only header */}
                <div className='hidden print:mb-6 print:block'>
                    <div className='border-b-2 border-gray-300 pb-4 text-center'>
                        <h1 className='text-2xl font-bold text-black'>Payment Instructions</h1>
                        <p className='mt-2 text-lg text-gray-700'>Order #{order.id}</p>
                        <p className='mt-1 text-sm text-gray-600'>Amount: {formatPrice(order.total_amount)}</p>
                    </div>
                </div>{' '}
                <main className='relative container mx-auto p-6 print:p-4 print:pt-0'>
                    {/* Success Message */}
                    <div className='mb-8 text-center print:mb-4'>
                        <div className='relative mb-6'>
                            <CheckCircle className='mx-auto h-20 w-20 text-emerald-600 dark:text-emerald-400 print:hidden' />
                            <div className='absolute top-0 left-1/2 h-6 w-6 -translate-x-1/2 -translate-y-2 transform animate-ping rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-60 print:hidden'></div>
                        </div>
                        <h2 className='mb-4 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-4xl font-bold text-transparent dark:from-slate-100 dark:to-slate-400 print:text-xl print:text-black'>
                            Order Created Successfully! 🎉
                        </h2>
                        <p className='mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 print:text-base print:text-gray-700'>
                            Your order has been confirmed! Please complete your payment using the secure instructions below to process your
                            agricultural products order.
                        </p>
                    </div>

                    {/* Transaction QR Code - Top Priority */}
                    <div className='mb-8'>
                        <Card.Card
                            variant='agricultural-glass'
                            className='border-2 border-emerald-200/50 dark:border-emerald-800/50 print:border print:border-gray-300 print:bg-white print:shadow-none'
                        >
                            <Card.CardHeader className='text-center'>
                                <Card.CardTitle className='flex items-center justify-center gap-2 text-xl'>
                                    <QrCode className='h-6 w-6' />
                                    Scan QR Code for Quick Access
                                </Card.CardTitle>
                                <Card.CardDescription>Keep this QR code to easily track your order</Card.CardDescription>
                            </Card.CardHeader>
                            <Card.CardContent className='space-y-4 text-center'>
                                <div className='flex justify-center'>
                                    <img
                                        src={qrCodeDataUri}
                                        alt='Transaction QR Code'
                                        className='h-32 w-32 rounded-lg border bg-white p-2 sm:h-40 sm:w-40'
                                    />
                                </div>
                                <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-3'>
                                    <p className='text-sm font-medium text-yellow-800'>⚠️ Important: Keep this QR code safe!</p>
                                    <p className='mt-1 text-xs text-yellow-700'>
                                        This QR code contains a secure access token that allows anyone to view your order details. Do not share it
                                        with unauthorized persons.
                                    </p>
                                </div>
                                <div className='text-sm text-muted-foreground'>
                                    Order Reference: <span className='font-mono font-bold'>#{order.id}</span>
                                </div>
                            </Card.CardContent>
                        </Card.Card>
                    </div>

                    {/* Main Content Grid - Payment & Upload Side by Side */}
                    <div className='grid gap-8 lg:grid-cols-2 print:mb-6 print:grid-cols-1 print:gap-4'>
                        {/* Left Column - Payment Instructions */}
                        <div className='space-y-6 print:space-y-4'>
                            <Card.Card variant='agricultural-glass' className='print:border print:border-gray-300 print:bg-white print:shadow-none'>
                                <Card.CardHeader>
                                    <Card.CardTitle className='flex items-center gap-2'>
                                        {getAccountIcon(account.account_type || 'bank_transfer')}
                                        Payment via {getAccountTypeName(account.account_type || 'bank_transfer')}
                                    </Card.CardTitle>
                                    <Card.CardDescription>Complete your payment using the details below</Card.CardDescription>
                                </Card.CardHeader>
                                <Card.CardContent className='space-y-4'>
                                    {/* Payment Amount */}
                                    <Item variant='outline'>
                                        <ItemContent>
                                            <ItemTitle className='line-clamp-1'>Amount to Pay</ItemTitle>
                                            <ItemDescription>Put this exact amount when making the transfer</ItemDescription>
                                        </ItemContent>
                                        <ItemContent className='flex-none text-center'>
                                            <ItemDescription className='text-agricultural-gradient text-2xl font-bold print:text-black'>
                                                {formatPrice(order.total_amount)}
                                            </ItemDescription>
                                        </ItemContent>
                                    </Item>

                                    {/* Account Details */}
                                    <div className='space-y-3'>
                                        <h4 className='font-semibold'>Account Details</h4>

                                        <ItemGroup className='gap-2'>
                                            <Item size='sm' variant='outline'>
                                                <ItemMedia>
                                                    <User className='size-4 text-muted-foreground' />
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle>Account Name</ItemTitle>
                                                </ItemContent>
                                                <ItemActions>
                                                    {account.account_name}
                                                    <Button
                                                        variant='agricultural-ghost'
                                                        size='icon'
                                                        onClick={() => copyToClipboard(account.account_name || '', 'account_name')}
                                                    >
                                                        {copiedField === 'account_name' ? <Check /> : <Copy />}
                                                    </Button>
                                                </ItemActions>
                                            </Item>

                                            <Item size='sm' variant='outline'>
                                                <ItemMedia>
                                                    <Hash className='size-4 text-muted-foreground' />
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle>Account Number</ItemTitle>
                                                </ItemContent>
                                                <ItemActions>
                                                    {account.account_no}
                                                    <Button
                                                        variant='agricultural-ghost'
                                                        size='icon'
                                                        onClick={() => copyToClipboard(account.account_no || '', 'account_number')}
                                                    >
                                                        {copiedField === 'account_number' ? <Check /> : <Copy />}
                                                    </Button>
                                                </ItemActions>
                                            </Item>

                                            {account.metadata &&
                                                typeof account.metadata === 'object' &&
                                                !Array.isArray(account.metadata) &&
                                                (account.metadata as any).bank_name && (
                                                    <div className='flex items-center justify-between rounded-lg border p-3'>
                                                        <div className='flex items-center gap-2'>
                                                            <Building2 className='h-4 w-4 text-muted-foreground' />
                                                            <span className='text-sm font-medium'>Bank Name</span>
                                                        </div>
                                                        <div className='flex items-center gap-2'>
                                                            <span className='font-mono text-sm'>{(account.metadata as any).bank_name}</span>
                                                            <Button
                                                                variant='agricultural-ghost'
                                                                size='sm'
                                                                onClick={() => copyToClipboard((account.metadata as any).bank_name, 'bank_name')}
                                                                className='h-8 w-8 p-0'
                                                            >
                                                                {copiedField === 'bank_name' ? (
                                                                    <Check className='h-3 w-3 text-green-600' />
                                                                ) : (
                                                                    <Copy className='h-3 w-3' />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                        </ItemGroup>
                                    </div>

                                    {/* Payment Instructions */}
                                    {account.instructions && (
                                        <div className='space-y-2'>
                                            <h4 className='font-semibold'>Payment Instructions</h4>
                                            <Item variant='outline'>
                                                <ItemContent>
                                                    <ItemDescription dangerouslySetInnerHTML={{ __html: account?.instructions ?? '' }} />
                                                </ItemContent>
                                            </Item>
                                        </div>
                                    )}

                                    {/* Important Notes */}
                                    <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-950'>
                                        <div className='flex items-start gap-2'>
                                            <AlertCircle className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
                                            <div className='space-y-1'>
                                                <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>Important Notes:</p>
                                                <ul className='space-y-1 text-xs text-yellow-700 dark:text-yellow-300'>
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

                        {/* Right Column - Payment Proof Upload (Priority) */}
                        <div className='space-y-6 print:hidden'>
                            {/* Payment Proof Upload - Priority Section */}
                            {(order.payment_status === 'unpaid' || order.payment_status === 'rejected') && (
                                <Card.Card variant='agricultural-glass' className='border-2 border-emerald-200 dark:border-emerald-800 print:hidden'>
                                    <Card.CardHeader>
                                        <Card.CardTitle className='flex items-center gap-2 text-green-800 dark:text-green-200'>
                                            <Upload className='h-5 w-5' />
                                            📸 Upload Payment Proof
                                        </Card.CardTitle>
                                        <Card.CardDescription className='text-green-700 dark:text-green-300'>
                                            <strong>Priority:</strong> After making the payment, immediately upload your transfer receipt here to
                                            speed up verification.
                                            {order.payment_status === 'rejected' && (
                                                <div className='mt-2 rounded-md bg-red-50 p-2 text-red-700'>
                                                    <strong>Note:</strong> Your previous payment was rejected. Please upload a new proof of payment.
                                                </div>
                                            )}
                                        </Card.CardDescription>
                                    </Card.CardHeader>
                                    <Card.CardContent>
                                        <form onSubmit={handleSubmit} className='space-y-4'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='proof_image' className='text-sm font-medium'>
                                                    Payment Receipt Image (Max 5MB)*
                                                </Label>
                                                <Input id='proof_image' type='file' accept='image/*' onChange={handleImageChange} required />
                                                {errors.proof_image && <p className='text-sm text-red-600'>{errors.proof_image}</p>}
                                                {previewUrl && (
                                                    <div className='mt-3'>
                                                        <img src={previewUrl} alt='Payment proof preview' className='max-h-32 rounded-lg border' />
                                                    </div>
                                                )}
                                            </div>

                                            <div className='space-y-2'>
                                                <Label htmlFor='reference_number' className='text-sm font-medium'>
                                                    Transaction Reference Number
                                                </Label>
                                                <Input
                                                    id='reference_number'
                                                    type='text'
                                                    placeholder='Enter transaction reference number'
                                                    value={data.reference_number}
                                                    onChange={(e) => setData('reference_number', e.target.value)}
                                                />
                                                {errors.reference_number && <p className='text-sm text-red-600'>{errors.reference_number}</p>}
                                            </div>

                                            <div className='space-y-2'>
                                                <Label htmlFor='payment_date' className='text-sm font-medium'>
                                                    Payment Date & Time *
                                                </Label>
                                                <Input
                                                    id='payment_date'
                                                    type='datetime-local'
                                                    value={data.payment_date}
                                                    onChange={(e) => setData('payment_date', e.target.value)}
                                                    required
                                                />
                                                {errors.payment_date && <p className='text-sm text-red-600'>{errors.payment_date}</p>}
                                            </div>

                                            <div className='space-y-2'>
                                                <Label htmlFor='notes' className='text-sm font-medium'>
                                                    Additional Notes (Optional)
                                                </Label>
                                                <textarea
                                                    id='notes'
                                                    className='min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none'
                                                    placeholder='Any additional information about your payment...'
                                                    value={data.notes}
                                                    onChange={(e) => setData('notes', e.target.value)}
                                                />
                                                {errors.notes && <p className='text-sm text-red-600'>{errors.notes}</p>}
                                            </div>

                                            <Button type='submit' disabled={processing} variant='agricultural' className='w-full'>
                                                {processing ? 'Uploading...' : '📤 Submit Payment Proof'}
                                            </Button>
                                        </form>
                                    </Card.CardContent>
                                </Card.Card>
                            )}

                            {/* Payment Rejected Status */}
                            {order.payment_status === 'rejected' && (
                                <Card.Card className='border-2 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50'>
                                    <Card.CardHeader>
                                        <Card.CardTitle className='flex items-center gap-2 text-red-800 dark:text-red-200'>
                                            <XCircle className='h-5 w-5' />
                                            Payment Rejected
                                        </Card.CardTitle>
                                    </Card.CardHeader>
                                    <Card.CardContent>
                                        <div className='space-y-3'>
                                            <div className='flex items-center justify-between'>
                                                <span className='font-medium'>Current Status:</span>
                                                <Badge variant='outline' className='border-red-200 bg-red-100 text-red-800'>
                                                    Rejected
                                                </Badge>
                                            </div>
                                            <div className='rounded-md bg-red-100 p-3 text-red-800'>
                                                <p className='text-sm font-medium'>Your payment proof was rejected.</p>
                                                <p className='mt-1 text-sm'>
                                                    Please check the payment details and upload a new proof of payment using the form above.
                                                </p>
                                            </div>
                                        </div>
                                    </Card.CardContent>
                                </Card.Card>
                            )}

                            {/* Payment Status */}
                            {order.payment_status !== 'unpaid' && order.payment_status !== 'rejected' && (
                                <Card.Card
                                    variant='agricultural-glass'
                                    className='print:border print:border-gray-300 print:bg-white print:shadow-none'
                                >
                                    <Card.CardHeader>
                                        <Card.CardTitle className='flex items-center gap-2'>
                                            <CheckCircle className='h-5 w-5' />
                                            Payment Status
                                        </Card.CardTitle>
                                    </Card.CardHeader>
                                    <Card.CardContent>
                                        <div className='flex items-center justify-between'>
                                            <span className='font-medium'>Current Status:</span>
                                            <Badge
                                                variant='outline'
                                                className={`${
                                                    order.payment_status === 'verified'
                                                        ? 'border-green-200 bg-green-100 text-green-800'
                                                        : order.payment_status === 'paid'
                                                          ? 'border-blue-200 bg-blue-100 text-blue-800'
                                                          : 'border-yellow-200 bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {order.payment_status === 'paid' && 'Awaiting Verification'}
                                                {order.payment_status === 'verified' && 'Payment Verified'}
                                            </Badge>
                                        </div>
                                        {order.payment_status === 'paid' && (
                                            <p className='mt-2 text-sm text-muted-foreground'>
                                                Your payment proof has been received and is being reviewed by our team.
                                            </p>
                                        )}
                                    </Card.CardContent>
                                </Card.Card>
                            )}
                        </div>
                    </div>

                    {/* Bottom Section - Order Summary and Customer Info */}
                    <div className='mt-8 grid gap-8 lg:grid-cols-2 print:mt-6 print:grid-cols-1 print:gap-4'>
                        {/* Order Summary */}
                        <Card.Card variant='agricultural-glass' className='print:border print:border-gray-300 print:bg-white print:shadow-none'>
                            <Card.CardHeader>
                                <Card.CardTitle className='flex items-center gap-3 text-xl'>
                                    <div className='relative'>
                                        <Package className='h-6 w-6 text-emerald-600 dark:text-emerald-400 print:text-gray-700' />
                                        <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400 print:hidden'></div>
                                    </div>
                                    <span className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400 print:bg-none print:text-black'>
                                        Order Summary
                                    </span>
                                </Card.CardTitle>
                                <Card.CardDescription>Order #{order.id}</Card.CardDescription>
                            </Card.CardHeader>
                            <Card.CardContent className='space-y-4'>
                                {/* Order Items */}
                                <div className='space-y-3'>
                                    <h4 className='font-semibold'>Items:</h4>
                                    <ItemGroup className='gap-2'>
                                        {order.order_items?.map((item) => (
                                            <Item size='sm' variant='outline'>
                                                <ItemContent>
                                                    <ItemTitle>{item.product_name}</ItemTitle>
                                                    <ItemDescription>
                                                        {item.quantity} × {formatPrice(parseFloat(item.product_price))} ({item.unit_label})
                                                    </ItemDescription>
                                                </ItemContent>
                                                <ItemActions className='font-medium'>{formatPrice(parseFloat(item.subtotal))}</ItemActions>
                                            </Item>
                                        ))}
                                    </ItemGroup>
                                </div>

                                <Separator />

                                <div className='flex items-center justify-between font-bold'>
                                    <span>Total Amount</span>
                                    <span className='text-agricultural-gradient text-lg print:text-black'>{formatPrice(order.total_amount)}</span>
                                </div>
                            </Card.CardContent>
                        </Card.Card>

                        {/* Customer Information */}
                        <Card.Card variant='agricultural-glass' className='print:border print:border-gray-300 print:bg-white print:shadow-none'>
                            <Card.CardHeader>
                                <Card.CardTitle className='flex items-center gap-3 text-xl'>
                                    <div className='relative'>
                                        <Mail className='h-6 w-6 text-blue-600 dark:text-blue-400 print:text-gray-700' />
                                        <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-blue-400 print:hidden'></div>
                                    </div>
                                    <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400 print:bg-none print:text-black'>
                                        Customer Information
                                    </span>
                                </Card.CardTitle>
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
                                    <Item size='sm' variant='outline'>
                                        <ItemContent>
                                            <ItemTitle>Notes:</ItemTitle>
                                            <ItemDescription>{order.notes} </ItemDescription>
                                        </ItemContent>
                                    </Item>
                                )}
                            </Card.CardContent>
                        </Card.Card>
                    </div>

                    {/* Action Buttons */}
                    <div className='mt-8 space-y-3 print:hidden'>
                        <div className='grid gap-3 sm:grid-cols-2'>
                            <Button asChild variant='agricultural' className='w-full'>
                                <Link href={home()}>
                                    <Sparkles className='mr-2 h-4 w-4' />
                                    Continue Shopping
                                </Link>
                            </Button>
                            <Button asChild variant='agricultural-outline' className='w-full'>
                                <Link href='#' onClick={() => window.print()}>
                                    Print Instructions
                                </Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
