import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import * as Dialog from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import CustomerLayout from '@/layouts/customer-layout';
import { home, transactions } from '@/routes';
import { uploadProofQr } from '@/routes/payment';
import { Link, useForm } from '@inertiajs/react';
import {
    Banknote,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    CreditCard,
    FileImage,
    Mail,
    MapPin,
    Package,
    Phone,
    Smartphone,
    Truck,
    Upload,
    User,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

interface OrderDetailsProps {
    order: App.Data.OrderData;
    isQrAccess?: boolean;
    accessToken?: string;
    canUploadPayment?: boolean;
}

export default function OrderDetails({ order, isQrAccess = false, accessToken, canUploadPayment = false }: OrderDetailsProps) {
    const [showUploadForm, setShowUploadForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        proof_image: null as File | null,
        reference_number: '',
        payment_date: new Date().toISOString().split('T')[0], // Default to today
        notes: '',
        token: accessToken || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(uploadProofQr(order.id).url, {
            onSuccess: () => {
                reset();
                setShowUploadForm(false);
            },
        });
    };
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

    const getPaymentIcon = (paymentMethod: string) => {
        switch (paymentMethod) {
            case 'credit_card':
                return <CreditCard className='h-4 w-4' />;
            case 'bank_transfer':
                return <Building2 className='h-4 w-4' />;
            case 'cash':
                return <Banknote className='h-4 w-4' />;
            case 'digital_wallet':
                return <Smartphone className='h-4 w-4' />;
            default:
                return <CreditCard className='h-4 w-4' />;
        }
    };

    return (
        <CustomerLayout
            title={`Order #${order.id}`}
            pageTitle={`Order #${order.id}`}
            icon={Package}
            backLink={isQrAccess ? undefined : transactions().url}
            backLabel={isQrAccess ? undefined : 'Back to transactions'}
        >
            <div className='grid gap-8 lg:grid-cols-3'>
                <div className='space-y-6 lg:col-span-2'>
                    <Card.Card>
                        <Card.CardHeader>
                            <div className='flex items-center justify-between'>
                                <Card.CardTitle className='flex items-center gap-2'>
                                    <Package className='h-5 w-5' />
                                    Order Status
                                </Card.CardTitle>
                                <div className='flex gap-2'>
                                    <Badge variant='outline' className={getStatusColor(order.status)}>
                                        {getStatusIcon(order.status)}
                                        <span className='ml-1 capitalize'>{order.status}</span>
                                    </Badge>
                                    <Badge variant='outline' className={getPaymentStatusColor(order.payment_status)}>
                                        <CreditCard className='h-3 w-3' />
                                        <span className='ml-1 capitalize'>{order.payment_status}</span>
                                    </Badge>
                                </div>
                            </div>
                            <Card.CardDescription className='flex items-center gap-2'>
                                <Calendar className='h-4 w-4' />
                                Placed on {formatDate(order.created_at)}
                            </Card.CardDescription>
                            {isQrAccess && (
                                <div className='mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3'>
                                    <p className='text-sm font-medium text-blue-900'>📱 QR Code Access</p>
                                    <p className='mt-1 text-sm text-blue-700'>
                                        You're viewing this order through a QR code.
                                        {canUploadPayment && ' You can upload payment proof below.'}
                                    </p>
                                </div>
                            )}
                        </Card.CardHeader>
                    </Card.Card>

                    <Card.Card variant='agricultural-glass'>
                        <Card.CardHeader>
                            <Card.CardTitle>Order Items</Card.CardTitle>
                        </Card.CardHeader>
                        <Card.CardContent>
                            <div className='space-y-4'>
                                {order.order_items?.map((item) => (
                                    <div key={item.id} className='flex items-center justify-between rounded-lg bg-muted/50 p-4'>
                                        <div className='flex-1'>
                                            <h4 className='font-medium'>{item.product_name}</h4>
                                            <p className='text-sm text-muted-foreground'>
                                                {item.quantity} × {formatPrice(parseFloat(item.product_price))} per {item.unit_label}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-medium'>{formatPrice(parseFloat(item.subtotal))}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className='my-4' />

                            <div className='flex items-center justify-between text-lg font-bold'>
                                <span>Total Amount</span>
                                <span className='text-primary'>{formatPrice(order.total_amount)}</span>
                            </div>
                        </Card.CardContent>
                    </Card.Card>

                    {order.payment && (
                        <Card.Card variant='agricultural-glass'>
                            <Card.CardHeader>
                                <Card.CardTitle className='flex items-center gap-2'>
                                    <CreditCard className='h-5 w-5' />
                                    Payment Information
                                </Card.CardTitle>
                            </Card.CardHeader>
                            <Card.CardContent className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm text-muted-foreground'>Payment Method</span>
                                    <div className='flex items-center gap-2'>
                                        {getPaymentIcon(order.payment.payment_method || '')}
                                        <span className='capitalize'>{order.payment.payment_method?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-sm text-muted-foreground'>Amount</span>
                                    <span className='font-medium'>{formatPrice(order.payment.amount || 0)}</span>
                                </div>
                                {order.payment.payment_date && (
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-muted-foreground'>Payment Date</span>
                                        <span>{formatDate(order.payment.payment_date)}</span>
                                    </div>
                                )}
                                {order.payment.verified_at && (
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-muted-foreground'>Verified Date</span>
                                        <span>{formatDate(order.payment.verified_at)}</span>
                                    </div>
                                )}
                                {order.payment.reference_number && (
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-muted-foreground'>Reference Number</span>
                                        <span className='font-mono text-sm'>{order.payment.reference_number}</span>
                                    </div>
                                )}
                                {order.payment.proof_image_path && (
                                    <div className='space-y-2'>
                                        <span className='text-sm text-muted-foreground'>Payment Proof</span>
                                        <Dialog.Dialog>
                                            <Dialog.DialogTrigger asChild>
                                                <Button variant='outline' size='sm' className='w-full'>
                                                    <FileImage className='mr-2 h-4 w-4' />
                                                    View Payment Proof
                                                </Button>
                                            </Dialog.DialogTrigger>
                                            <Dialog.DialogContent className='max-w-2xl'>
                                                <Dialog.DialogHeader>
                                                    <Dialog.DialogTitle>Payment Proof</Dialog.DialogTitle>
                                                    <Dialog.DialogDescription>Order #{order.id} - Payment Receipt</Dialog.DialogDescription>
                                                </Dialog.DialogHeader>
                                                <div className='space-y-4'>
                                                    <img
                                                        src={`/storage/${order.payment.proof_image_path}`}
                                                        alt='Payment proof'
                                                        className='max-h-96 w-full rounded-lg border object-contain'
                                                    />
                                                    {order.payment.notes && (
                                                        <div className='rounded-lg bg-muted p-3'>
                                                            <p className='text-sm font-medium'>Notes:</p>
                                                            <p className='text-sm'>{order.payment.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </Dialog.DialogContent>
                                        </Dialog.Dialog>
                                    </div>
                                )}
                            </Card.CardContent>
                        </Card.Card>
                    )}

                    {/* Payment Upload Form for QR Access */}
                    {canUploadPayment && (
                        <Card.Card variant='agricultural-glass'>
                            <Card.CardHeader>
                                <Card.CardTitle className='flex items-center gap-2'>
                                    <Upload className='h-5 w-5' />
                                    Upload Payment Proof
                                </Card.CardTitle>
                                <Card.CardDescription>
                                    {order.payment_status === 'rejected'
                                        ? 'Your previous payment was rejected. Please upload a new payment proof.'
                                        : 'Upload your payment proof to complete this order.'}
                                </Card.CardDescription>
                            </Card.CardHeader>
                            <Card.CardContent>
                                {!showUploadForm ? (
                                    <Button onClick={() => setShowUploadForm(true)} variant='agricultural' className='w-full'>
                                        <Upload className='mr-2 h-4 w-4' />
                                        Upload Payment Proof
                                    </Button>
                                ) : (
                                    <form onSubmit={handleSubmit} className='space-y-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='proof_image'>Payment Proof Image *</Label>
                                            <Input
                                                id='proof_image'
                                                type='file'
                                                accept='image/*'
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setData('proof_image', file);
                                                    }
                                                }}
                                                required
                                            />
                                            {errors.proof_image && <p className='text-sm text-red-600'>{errors.proof_image}</p>}
                                            <p className='text-sm text-muted-foreground'>Upload an image of your payment receipt (max 5MB)</p>
                                        </div>

                                        <div className='space-y-2'>
                                            <Label htmlFor='payment_date'>Payment Date *</Label>
                                            <Input
                                                id='payment_date'
                                                type='date'
                                                value={data.payment_date}
                                                onChange={(e) => setData('payment_date', e.target.value)}
                                                required
                                            />
                                            {errors.payment_date && <p className='text-sm text-red-600'>{errors.payment_date}</p>}
                                        </div>

                                        <div className='space-y-2'>
                                            <Label htmlFor='reference_number'>Reference Number (Optional)</Label>
                                            <Input
                                                id='reference_number'
                                                type='text'
                                                placeholder='e.g., TXN123456789'
                                                value={data.reference_number}
                                                onChange={(e) => setData('reference_number', e.target.value)}
                                            />
                                            {errors.reference_number && <p className='text-sm text-red-600'>{errors.reference_number}</p>}
                                        </div>

                                        <div className='space-y-2'>
                                            <Label htmlFor='notes'>Additional Notes (Optional)</Label>
                                            <Textarea
                                                id='notes'
                                                placeholder='Any additional information about your payment...'
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                rows={3}
                                            />
                                            {errors.notes && <p className='text-sm text-red-600'>{errors.notes}</p>}
                                        </div>

                                        <div className='flex gap-2'>
                                            <Button type='submit' disabled={processing} variant='agricultural' className='flex-1'>
                                                {processing ? 'Uploading...' : 'Upload Payment Proof'}
                                            </Button>
                                            <Button
                                                type='button'
                                                variant='agricultural-outline'
                                                onClick={() => {
                                                    setShowUploadForm(false);
                                                    reset();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </Card.CardContent>
                        </Card.Card>
                    )}
                </div>

                <div className='space-y-6'>
                    <Card.Card variant='agricultural-glass'>
                        <Card.CardHeader>
                            <Card.CardTitle className='flex items-center gap-2'>
                                <User className='h-5 w-5' />
                                Customer Information
                            </Card.CardTitle>
                        </Card.CardHeader>
                        <Card.CardContent className='space-y-4'>
                            <div>
                                <h4 className='font-medium'>{order.customer_name}</h4>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Mail className='h-4 w-4 text-muted-foreground' />
                                <span className='text-sm'>{order.customer_email}</span>
                            </div>
                            {order.customer_phone && (
                                <div className='flex items-center gap-2'>
                                    <Phone className='h-4 w-4 text-muted-foreground' />
                                    <span className='text-sm'>{order.customer_phone}</span>
                                </div>
                            )}
                        </Card.CardContent>
                    </Card.Card>

                    <Card.Card variant='agricultural-glass'>
                        <Card.CardHeader>
                            <Card.CardTitle className='flex items-center gap-2'>
                                <MapPin className='h-5 w-5' />
                                Shipping Address
                            </Card.CardTitle>
                        </Card.CardHeader>
                        <Card.CardContent>
                            <p className='text-sm'>{order.shipping_address}</p>
                        </Card.CardContent>
                    </Card.Card>

                    {order.notes && (
                        <Card.Card variant='agricultural-glass'>
                            <Card.CardHeader>
                                <Card.CardTitle>Order Notes</Card.CardTitle>
                            </Card.CardHeader>
                            <Card.CardContent>
                                <p className='text-sm'>{order.notes}</p>
                            </Card.CardContent>
                        </Card.Card>
                    )}

                    <div className='space-y-3'>
                        <Button asChild variant='agricultural' className='w-full'>
                            <Link href={home()}>Continue Shopping</Link>
                        </Button>
                        {!isQrAccess && (
                            <Button asChild variant='agricultural-outline' className='w-full'>
                                <Link href={transactions()}>Back to Transactions</Link>
                            </Button>
                        )}
                        {isQrAccess && (
                            <div className='rounded-lg bg-muted p-3'>
                                <p className='mb-2 text-sm font-medium'>📱 Bookmark this page</p>
                                <p className='text-sm text-muted-foreground'>
                                    Save this page to check your order status anytime. Your payment will be verified by our admin within 1-2 business
                                    days.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
