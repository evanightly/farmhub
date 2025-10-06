import UserController from '@/actions/App/Http/Controllers/UserController';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PaginationMeta } from '@/components/ui/data-table-types';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    items: PaginationMeta & { data: User[] };
    filters: { search?: string };
}

export default function Index({ items, filters }: Props) {
    const handleDelete = (id?: number) => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this user?')) return;
        router.delete(UserController.destroy(id).url);
    };

    const columns = [
        {
            id: 'name',
            header: 'Name',
            accessorKey: 'name',
            enableSorting: true,
            cell: ({ row, getValue }) => {
                const item = row.original;
                const name = getValue() as string;

                if (!item.id) return name;

                return (
                    <Link href={UserController.edit(item.id).url} className='font-medium hover:underline'>
                        {name}
                    </Link>
                );
            },
            enableFiltering: true,
            filter: {
                type: 'text',
                placeholder: 'Filter by name...',
            },
        },
        {
            id: 'email',
            header: 'Email',
            accessorKey: 'email',
            enableSorting: true,
            enableFiltering: true,
            filter: {
                type: 'text',
                placeholder: 'Filter by email...',
            },
        },
        {
            id: 'role',
            header: 'Role',
            accessorKey: 'role',
            enableSorting: true,
            cell: ({ getValue }) => {
                const role = getValue() as string;
                return <span className='capitalize'>{role}</span>;
            },
            enableFiltering: true,
            filter: {
                type: 'select',
                options: [
                    { label: 'Admin', value: 'admin' },
                    { label: 'Employee', value: 'employee' },
                    { label: 'Customer', value: 'customer' },
                ],
                placeholder: 'Filter by role...',
            },
        },
        {
            id: 'created_at',
            header: 'Created At',
            accessorKey: 'created_at',
            enableSorting: true,
            cell: ({ getValue }) => format(new Date(getValue() as string), 'MMM d, yyyy'),
        },
        {
            id: 'actions',
            enableSorting: false,
            cell: ({ row }) => {
                const item = row.original;

                if (!item.id) return null;

                return (
                    <DropdownMenu.DropdownMenu>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <Button variant='agricultural-ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenu.DropdownMenuTrigger>
                        <DropdownMenu.DropdownMenuContent align='end'>
                            <DropdownMenu.DropdownMenuItem asChild>
                                <Link href={UserController.edit(item.id).url} className='flex w-full'>
                                    <Edit className='mr-2 h-4 w-4' />
                                    Edit
                                </Link>
                            </DropdownMenu.DropdownMenuItem>
                            <DropdownMenu.DropdownMenuItem onClick={() => handleDelete(item.id)} className='text-destructive'>
                                <Trash className='mr-2 h-4 w-4' />
                                Delete
                            </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                    </DropdownMenu.DropdownMenu>
                );
            },
        },
    ] as (ColumnDef<User> & {
        enableFiltering?: boolean;
        filter?: any;
        filterOnly?: boolean;
        header?: string;
    })[];

    return (
        <AppLayout>
            <Head title='Users' />

            {/* Page Header */}
            <div className='container mx-auto py-8'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-400'>
                            Users
                        </h1>
                        <p className='text-muted-foreground'>Manage system users</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button asChild variant='agricultural'>
                            <Link href={UserController.create().url}>Create User</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <DataTable
                title='Users'
                data={items.data}
                columns={columns}
                pagination={items}
                searchPlaceholder='Search users...'
                enableSearch={true}
                enableColumnFilters={true}
                enableMultiSort={true}
                routeFunction={UserController.index}
                resetRoute={UserController.index().url}
                emptyMessage='No users found'
                emptyDescription={
                    filters.search ? 'No users match your search criteria. Try adjusting your filters.' : 'Get started by creating your first user.'
                }
            />
        </AppLayout>
    );
}
