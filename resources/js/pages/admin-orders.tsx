import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import * as Dialog from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { CheckCircle, Clock, CreditCard, Eye, FileImage, Package, Truck, XCircle } from 'lucide-react';

interface AdminOrdersProps {
    orders: {
        data: App.Data.OrderData[];
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
    filters: {
        filter?: {
            search?: string;
            status?: string;
            payment_status?: string;
            date_from?: string;
            date_to?: string;
        };
        sort?: string;
        page?: number;
        per_page?: number;
    };
}

export default function AdminOrders({ orders, filters }: AdminOrdersProps) {
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
            month: 'short',
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

    const handleStatusUpdate = (orderId: number, newStatus: string) => {
        router.patch(
            `/admin/orders/${orderId}/status`,
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
            },
        );
    };

    const columns = [
        {
            id: 'id',
            header: 'Order ID',
            accessorKey: 'id',
            cell: ({ row }: any) => <span className='font-medium'>#{row.original.id}</span>,
        },
        {
            id: 'customer',
            header: 'Customer',
            accessorKey: 'customer_name',
            cell: ({ row }: any) => (
                <div>
                    <p className='font-medium'>{row.original.customer_name}</p>
                    <p className='text-sm text-muted-foreground'>{row.original.customer_email}</p>
                </div>
            ),
        },
        {
            id: 'total_amount',
            header: 'Total',
            accessorKey: 'total_amount',
            cell: ({ row }: any) => <span className='font-medium'>{formatPrice(row.original.total_amount)}</span>,
        },
        {
            id: 'status',
            header: 'Status',
            accessorKey: 'status',
            cell: ({ row }: any) => (
                <Select value={row.original.status} onValueChange={(value) => handleStatusUpdate(row.original.id, value)}>
                    <SelectTrigger className='w-32'>
                        <div className='flex items-center gap-2'>
                            {getStatusIcon(row.original.status)}
                            <SelectValue />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='pending'>Pending</SelectItem>
                        <SelectItem value='confirmed'>Confirmed</SelectItem>
                        <SelectItem value='shipped'>Shipped</SelectItem>
                        <SelectItem value='delivered'>Delivered</SelectItem>
                        <SelectItem value='cancelled'>Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            ),
            filterMeta: {
                type: 'select',
                valueMapKey: 'status',
                valueMap: {
                    pending: 'Pending',
                    confirmed: 'Confirmed',
                    shipped: 'Shipped',
                    delivered: 'Delivered',
                    cancelled: 'Cancelled',
                },
            },
        },
        {
            id: 'payment_status',
            header: 'Payment',
            accessorKey: 'payment_status',
            cell: ({ row }: any) => (
                <Badge variant='outline' className={`${getPaymentStatusColor(row.original.payment_status)}`}>
                    <CreditCard className='mr-1 h-3 w-3' />
                    <span className='capitalize'>{row.original.payment_status}</span>
                </Badge>
            ),
            filterMeta: {
                type: 'select',
                valueMapKey: 'payment_status',
                valueMap: {
                    unpaid: 'Unpaid',
                    paid: 'Paid',
                    verified: 'Verified',
                },
            },
        },
        {
            id: 'payment_proof',
            header: 'Proof',
            cell: ({ row }: any) => (
                <div className='flex items-center gap-1'>
                    {row.original.payment?.proof_image_path ? (
                        <Dialog.Dialog>
                            <Dialog.DialogTrigger asChild>
                                <Button size='sm' variant='outline'>
                                    <FileImage className='h-3 w-3' />
                                </Button>
                            </Dialog.DialogTrigger>
                            <Dialog.DialogContent className='max-w-2xl'>
                                <Dialog.DialogHeader>
                                    <Dialog.DialogTitle>Payment Proof - Order #{row.original.id}</Dialog.DialogTitle>
                                    <Dialog.DialogDescription>Customer: {row.original.customer_name}</Dialog.DialogDescription>
                                </Dialog.DialogHeader>
                                <div className='space-y-4'>
                                    <img
                                        src={`/storage/${row.original.payment.proof_image_path}`}
                                        alt='Payment proof'
                                        className='max-h-96 w-full rounded-lg border object-contain'
                                    />
                                    {row.original.payment.reference_number && (
                                        <div className='rounded-lg bg-muted p-3'>
                                            <p className='text-sm font-medium'>Reference Number:</p>
                                            <p className='font-mono text-sm'>{row.original.payment.reference_number}</p>
                                        </div>
                                    )}
                                    {row.original.payment.notes && (
                                        <div className='rounded-lg bg-muted p-3'>
                                            <p className='text-sm font-medium'>Customer Notes:</p>
                                            <p className='text-sm'>{row.original.payment.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </Dialog.DialogContent>
                        </Dialog.Dialog>
                    ) : (
                        <span className='text-sm text-muted-foreground'>-</span>
                    )}
                </div>
            ),
        },
        {
            id: 'created_at',
            header: 'Date',
            accessorKey: 'created_at',
            cell: ({ row }: any) => <span className='text-sm'>{formatDate(row.original.created_at)}</span>,
            filterMeta: {
                type: 'dateRange',
                startKey: 'date_from',
                endKey: 'date_to',
            },
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: any) => (
                <div className='flex gap-2'>
                    <Button asChild size='sm' variant='outline'>
                        <Link href={`/orders/${row.original.id}`}>
                            <Eye className='h-4 w-4' />
                        </Link>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <DataTable
                title='Order Management'
                description='Manage customer orders and update order statuses'
                data={orders.data}
                columns={columns}
                pagination={orders.meta as any}
                filters={filters.filter || {}}
                searchPlaceholder='Search orders by ID, customer name, or email...'
                emptyMessage='No orders found'
                emptyDescription='Orders will appear here once customers start placing them.'
                routeFunction={() => ({ url: '/admin/orders', method: 'GET' })}
                resetRoute='/admin/orders'
            />
        </AdminLayout>
    );
}
