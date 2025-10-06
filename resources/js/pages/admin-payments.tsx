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
            header: 'ID Pesanan',
            accessorKey: 'order_id',
            cell: ({ row }: any) => <span className='font-medium'>#{row.original.order_id}</span>,
        },
        {
            id: 'customer',
            header: 'Pelanggan',
            cell: ({ row }: any) => (
                <div>
                    <p className='font-medium'>{row.original.order?.customer_name}</p>
                    <p className='text-sm text-muted-foreground'>{row.original.order?.customer_email}</p>
                </div>
            ),
        },
        {
            id: 'amount',
            header: 'Jumlah',
            accessorKey: 'amount',
            cell: ({ row }: any) => <span className='font-medium'>{formatPrice(row.original.amount)}</span>,
        },
        {
            id: 'payment_method',
            header: 'Metode',
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
            header: 'Tanggal Pembayaran',
            accessorKey: 'payment_date',
            cell: ({ row }: any) => <span className='text-sm'>{formatDate(row.original.payment_date)}</span>,
        },
        {
            id: 'reference_number',
            header: 'Referensi',
            accessorKey: 'reference_number',
            cell: ({ row }: any) => <span className='font-mono text-sm'>{row.original.reference_number || '-'}</span>,
        },
        {
            id: 'actions',
            header: 'Aksi',
            cell: ({ row }: any) => (
                <div className='flex gap-2'>
                    {row.original.proof_image_path && (
                        <Dialog.Dialog>
                            <Dialog.DialogTrigger asChild>
                                <Button size='sm' variant='agricultural-ghost'>
                                    <FileImage className='h-4 w-4' />
                                </Button>
                            </Dialog.DialogTrigger>
                            <Dialog.DialogContent className='max-w-3xl'>
                                <Dialog.DialogHeader>
                                    <Dialog.DialogTitle>Bukti Pembayaran</Dialog.DialogTitle>
                                    <Dialog.DialogDescription>
                                        Pesanan #{row.original.order_id} - {row.original.order?.customer_name}
                                    </Dialog.DialogDescription>
                                </Dialog.DialogHeader>
                                <div className='space-y-4'>
                                    <img
                                        src={`/storage/${row.original.proof_image_path}`}
                                        alt='Bukti pembayaran'
                                        className='max-h-96 w-full rounded-lg border object-contain'
                                    />
                                    {row.original.notes && (
                                        <div className='rounded-lg bg-muted p-3'>
                                            <p className='text-sm font-medium'>Catatan Pelanggan:</p>
                                            <p className='text-sm text-muted-foreground'>{row.original.notes}</p>
                                        </div>
                                    )}
                                    <div className='flex justify-end gap-2'>
                                        <Button variant='agricultural-outline' onClick={() => handleVerifyPayment(row.original, 'reject')}>
                                            <XCircle className='mr-2 h-4 w-4' />
                                            Tolak
                                        </Button>
                                        <Button variant='agricultural' onClick={() => handleVerifyPayment(row.original, 'approve')}>
                                            <CheckCircle className='mr-2 h-4 w-4' />
                                            Setujui
                                        </Button>
                                    </div>
                                </div>
                            </Dialog.DialogContent>
                        </Dialog.Dialog>
                    )}
                    <Button size='sm' variant='agricultural-outline' onClick={() => handleVerifyPayment(row.original, 'approve')}>
                        <CheckCircle className='h-4 w-4' />
                    </Button>
                    <Button size='sm' variant='agricultural-ghost' onClick={() => handleVerifyPayment(row.original, 'reject')}>
                        <XCircle className='h-4 w-4' />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className='container mx-auto py-8'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-400'>
                            Verifikasi Pembayaran
                        </h1>
                        <p className='text-muted-foreground'>Tinjau dan verifikasi bukti pembayaran pelanggan</p>
                    </div>
                </div>
            </div>

            <DataTable
                title='Pembayaran'
                data={payments.data}
                columns={columns}
                pagination={payments.meta as any}
                filters={{}}
                searchPlaceholder='Cari pembayaran berdasarkan ID pesanan, nama pelanggan, atau referensi...'
                emptyMessage='Tidak ada pembayaran menunggu'
                emptyDescription='Bukti pembayaran yang memerlukan verifikasi akan muncul di sini.'
                routeFunction={() => ({ url: '/admin/payments', method: 'GET' })}
                resetRoute='/admin/payments'
            />

            {/* Verification Dialog */}
            <Dialog.Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.DialogContent>
                    <Dialog.DialogHeader>
                        <Dialog.DialogTitle>{data.action === 'approve' ? 'Setujui Pembayaran' : 'Tolak Pembayaran'}</Dialog.DialogTitle>
                        <Dialog.DialogDescription>
                            Pesanan #{selectedPayment?.order_id} - {formatPrice(selectedPayment?.amount || 0)}
                        </Dialog.DialogDescription>
                    </Dialog.DialogHeader>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Label htmlFor='admin_notes'>{data.action === 'approve' ? 'Catatan Persetujuan (Opsional)' : 'Alasan Penolakan'}</Label>
                            <Textarea
                                id='admin_notes'
                                value={data.admin_notes}
                                onChange={(e) => setData('admin_notes', e.target.value)}
                                placeholder={
                                    data.action === 'approve'
                                        ? 'Tambahkan catatan tentang persetujuan ini...'
                                        : 'Jelaskan mengapa pembayaran ini ditolak...'
                                }
                                rows={3}
                                required={data.action === 'reject'}
                            />
                        </div>
                        <div className='flex justify-end gap-2'>
                            <Button variant='outline' onClick={() => setDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={submitVerification}
                                disabled={processing}
                                variant={data.action === 'approve' ? 'default' : 'destructive'}
                            >
                                {processing ? 'Memproses...' : data.action === 'approve' ? 'Setujui Pembayaran' : 'Tolak Pembayaran'}
                            </Button>
                        </div>
                    </div>
                </Dialog.DialogContent>
            </Dialog.Dialog>
        </AdminLayout>
    );
}
