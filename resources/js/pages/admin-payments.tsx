import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import * as Dialog from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { CheckCircle, CreditCard, FileImage, XCircle } from 'lucide-react';
import { useState } from 'react';

interface AdminPaymentsProps {
    payments: {
        data: App.Data.PaymentData[];
        links: any[];
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            per_page: number;
            to: number;
            total: number;
        };
    };
}

export default function AdminPayments({ payments }: AdminPaymentsProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedPayment, setSelectedPayment] = useState<App.Data.PaymentData | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        action: '' as 'approve' | 'reject' | '',
        admin_notes: '',
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleVerifyPayment = (payment: App.Data.PaymentData, action: 'approve' | 'reject') => {
        setSelectedPayment(payment);
        setData('action', action);
        setDialogOpen(true);
    };

    const submitVerification = () => {
        if (!selectedPayment) return;

        post(`/admin/payments/${selectedPayment.id}/verify`, {
            onSuccess: () => {
                setDialogOpen(false);
                setSelectedPayment(null);
                reset();
            },
        });
    };

    const columns = [
        {
            id: 'order_id',
            header: 'Order ID',
            accessorKey: 'order_id',
            cell: ({ row }: any) => <span className='font-medium'>#{row.original.order_id}</span>,
        },
        {
            id: 'customer',
            header: 'Customer',
            cell: ({ row }: any) => (
                <div>
                    <p className='font-medium'>{row.original.order?.customer_name}</p>
                    <p className='text-sm text-muted-foreground'>{row.original.order?.customer_email}</p>
                </div>
            ),
        },
        {
            id: 'amount',
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ row }: any) => <span className='font-medium'>{formatPrice(row.original.amount)}</span>,
        },
        {
            id: 'payment_method',
            header: 'Method',
            accessorKey: 'payment_method',
            cell: ({ row }: any) => (
                <Badge variant='outline'>
                    <CreditCard className='mr-1 h-3 w-3' />
                    {row.original.payment_method?.replace('_', ' ')}
                </Badge>
            ),
        },
        {
            id: 'payment_date',
            header: 'Payment Date',
            accessorKey: 'payment_date',
            cell: ({ row }: any) => <span className='text-sm'>{formatDate(row.original.payment_date)}</span>,
        },
        {
            id: 'reference_number',
            header: 'Reference',
            accessorKey: 'reference_number',
            cell: ({ row }: any) => <span className='font-mono text-sm'>{row.original.reference_number || '-'}</span>,
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className='flex gap-2'>
                    {row.original.proof_image_path && (
                        <Dialog.Dialog>
                            <Dialog.DialogTrigger asChild>
                                <Button size='sm' variant='outline'>
                                    <FileImage className='h-4 w-4' />
                                </Button>
                            </Dialog.DialogTrigger>
                            <Dialog.DialogContent className='max-w-3xl'>
                                <Dialog.DialogHeader>
                                    <Dialog.DialogTitle>Payment Proof</Dialog.DialogTitle>
                                    <Dialog.DialogDescription>
                                        Order #{row.original.order_id} - {row.original.order?.customer_name}
                                    </Dialog.DialogDescription>
                                </Dialog.DialogHeader>
                                <div className='space-y-4'>
                                    <img
                                        src={`/storage/${row.original.proof_image_path}`}
                                        alt='Payment proof'
                                        className='max-h-96 w-full rounded-lg border object-contain'
                                    />
                                    {row.original.notes && (
                                        <div className='rounded-lg bg-muted p-3'>
                                            <p className='text-sm font-medium'>Customer Notes:</p>
                                            <p className='text-sm text-muted-foreground'>{row.original.notes}</p>
                                        </div>
                                    )}
                                    <div className='flex justify-end gap-2'>
                                        <Button variant='outline' onClick={() => handleVerifyPayment(row.original, 'reject')}>
                                            <XCircle className='mr-2 h-4 w-4' />
                                            Reject
                                        </Button>
                                        <Button onClick={() => handleVerifyPayment(row.original, 'approve')}>
                                            <CheckCircle className='mr-2 h-4 w-4' />
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.DialogContent>
                        </Dialog.Dialog>
                    )}
                    <Button size='sm' variant='outline' onClick={() => handleVerifyPayment(row.original, 'approve')}>
                        <CheckCircle className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='outline' onClick={() => handleVerifyPayment(row.original, 'reject')}>
                        <XCircle className='h-4 w-4' />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <DataTable
                title='Payment Verification'
                description='Review and verify customer payment proofs'
                data={payments.data}
                columns={columns}
                pagination={payments.meta as any}
                filters={{}}
                searchPlaceholder='Search payments by order ID, customer name, or reference...'
                emptyMessage='No pending payments'
                emptyDescription='Payment proofs requiring verification will appear here.'
                routeFunction={() => ({ url: '/admin/payments', method: 'GET' })}
                resetRoute='/admin/payments'
            />

            {/* Verification Dialog */}
            <Dialog.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.DialogContent>
                    <Dialog.DialogHeader>
                        <Dialog.DialogTitle>{data.action === 'approve' ? 'Approve Payment' : 'Reject Payment'}</Dialog.DialogTitle>
                        <Dialog.DialogDescription>
                            Order #{selectedPayment?.order_id} - {formatPrice(selectedPayment?.amount || 0)}
                        </Dialog.DialogDescription>
                    </Dialog.DialogHeader>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='admin_notes'>{data.action === 'approve' ? 'Approval Notes (Optional)' : 'Rejection Reason'}</Label>
                            <Textarea
                                id='admin_notes'
                                value={data.admin_notes}
                                onChange={(e) => setData('admin_notes', e.target.value)}
                                placeholder={
                                    data.action === 'approve'
                                        ? 'Add any notes about this approval...'
                                        : 'Explain why this payment is being rejected...'
                                }
                                rows={3}
                                required={data.action === 'reject'}
                            />
                        </div>
                        <div className='flex justify-end gap-2'>
                            <Button variant='outline' onClick={() => setDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={submitVerification}
                                disabled={processing}
                                variant={data.action === 'approve' ? 'default' : 'destructive'}
                            >
                                {processing ? 'Processing...' : data.action === 'approve' ? 'Approve Payment' : 'Reject Payment'}
                            </Button>
                        </div>
                    </div>
                </Dialog.DialogContent>
            </Dialog.Dialog>
        </AdminLayout>
    );
}
