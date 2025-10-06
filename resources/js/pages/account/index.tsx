import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { FilterType, PaginationMeta } from '@/components/ui/data-table-types';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';

type Account = App.Data.AccountData;

interface Props {
    items: PaginationMeta & { data: Account[] };
    filters: { search?: string; account_type?: string; is_active?: boolean };
}

export default function Index({ items, filters }: Props) {
    const handleDelete = (id?: number) => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this account?')) return;
        router.delete(AccountController.destroy(id));
    };

    const handleReorder = (accounts: Account[]) => {
        const reorderedAccounts = accounts.map((account, index) => ({
            id: account.id,
            sort_order: index + 1,
        }));

        router.post(AccountController.reorder(), {
            accounts: reorderedAccounts,
        });
    };

    const getAccountTypeColor = (type: string) => {
        switch (type) {
            case 'bank_transfer':
                return 'bg-blue-100 text-blue-800';
            case 'e_wallet':
                return 'bg-green-100 text-green-800';
            case 'cash':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatAccountType = (type: string) => {
        switch (type) {
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'e_wallet':
                return 'E-Wallet';
            case 'cash':
                return 'Cash';
            default:
                return type;
        }
    };

    const columns = [
        {
            id: 'account_logo',
            header: 'Logo',
            cell: ({ row }) => {
                const account = row.original;
                return account.account_logo ? (
                    <img
                        src={`/storage/${account.account_logo}`}
                        alt={account.account_name || 'Account logo'}
                        className='h-8 w-8 rounded object-cover'
                    />
                ) : (
                    <div className='flex h-8 w-8 items-center justify-center rounded bg-gray-100'>
                        <span className='text-xs text-gray-500'>N/A</span>
                    </div>
                );
            },
        },
        {
            id: 'account_name',
            header: 'Account Name',
            accessorKey: 'account_name',
            enableSorting: true,
            cell: ({ row, getValue }) => {
                const account = row.original;
                const name = getValue() as string;

                if (!account.id) return name;

                return (
                    <div className='space-y-1'>
                        <Link href={AccountController.show(account.id).url} className='font-medium text-primary hover:underline'>
                            {name}
                        </Link>
                        <div className='text-sm text-muted-foreground'>{account.owner_name}</div>
                    </div>
                );
            },
            enableFiltering: true,
            filter: {
                type: 'text' as FilterType,
                placeholder: 'Filter by account name...',
            },
        },
        {
            id: 'account_no',
            header: 'Account Number',
            accessorKey: 'account_no',
            enableSorting: true,
            enableFiltering: true,
            filter: {
                type: 'text' as FilterType,
                placeholder: 'Filter by account number...',
            },
        },
        {
            id: 'account_type',
            header: 'Type',
            accessorKey: 'account_type',
            enableSorting: true,
            cell: ({ getValue }) => {
                const type = getValue() as string;
                return <Badge className={getAccountTypeColor(type)}>{formatAccountType(type)}</Badge>;
            },
            enableFiltering: true,
            filter: {
                type: 'select' as FilterType,
                placeholder: 'Filter by type...',
                options: [
                    { label: 'Bank Transfer', value: 'bank_transfer' },
                    { label: 'E-Wallet', value: 'e_wallet' },
                    { label: 'Cash', value: 'cash' },
                ],
            },
        },
        {
            id: 'is_active',
            header: 'Status',
            accessorKey: 'is_active',
            enableSorting: true,
            cell: ({ getValue }) => {
                const isActive = getValue() as boolean;
                return <Badge variant={isActive ? 'default' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
            },
            enableFiltering: true,
            filter: {
                type: 'select' as FilterType,
                placeholder: 'Filter by status...',
                options: [
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' },
                ],
            },
        },
        {
            id: 'sort_order',
            header: 'Order',
            accessorKey: 'sort_order',
            enableSorting: true,
        },
        {
            id: 'actions',
            header: 'Actions',
            enableSorting: false,
            cell: ({ row }) => {
                const account = row.original;
                return (
                    <DropdownMenu.DropdownMenu>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <Button variant='agricultural-ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenu.DropdownMenuTrigger>
                        <DropdownMenu.DropdownMenuContent align='end'>
                            <DropdownMenu.DropdownMenuLabel>Actions</DropdownMenu.DropdownMenuLabel>
                            <DropdownMenu.DropdownMenuItem asChild>
                                <Link href={AccountController.show(account.id!).url}>View Account</Link>
                            </DropdownMenu.DropdownMenuItem>
                            <DropdownMenu.DropdownMenuItem asChild>
                                <Link href={AccountController.edit(account.id!).url}>
                                    <Edit className='mr-2 h-4 w-4' />
                                    Edit
                                </Link>
                            </DropdownMenu.DropdownMenuItem>
                            <DropdownMenu.DropdownMenuSeparator />
                            <DropdownMenu.DropdownMenuItem onClick={() => handleDelete(account.id)} className='text-destructive'>
                                <Trash className='mr-2 h-4 w-4' />
                                Delete
                            </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                    </DropdownMenu.DropdownMenu>
                );
            },
        },
    ] as (ColumnDef<Account> & {
        enableFiltering?: boolean;
        filter?: any;
        filterOnly?: boolean;
        header?: string;
    })[];

    return (
        <AppLayout>
            <Head title='Account Management' />

            {/* Page Header */}
            <div className='container mx-auto py-8'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-400'>
                            Account Management
                        </h1>
                        <p className='text-muted-foreground'>Manage payment accounts for your e-catalog</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button asChild variant='agricultural'>
                            <Link href={AccountController.create().url}>
                                <Plus className='mr-2 h-4 w-4' />
                                Add Account
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            <DataTable
                title='Accounts'
                data={items.data}
                columns={columns}
                pagination={items}
                searchPlaceholder='Search accounts...'
                enableSearch={true}
                enableColumnFilters={true}
                enableMultiSort={true}
                routeFunction={AccountController.index}
                resetRoute={AccountController.index().url}
                emptyMessage='No accounts found'
                emptyDescription={
                    filters.search
                        ? 'No accounts match your search criteria. Try adjusting your filters.'
                        : 'Get started by creating your first account.'
                }
            />
        </AppLayout>
    );
}
