import ProductController from '@/actions/App/Http/Controllers/ProductController';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { PaginationMeta } from '@/components/ui/data-table-types';
import * as DropdownMenu from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
type Product = App.Data.ProductData;

interface Props {
    items: PaginationMeta & { data: Product[] };
    filters: { search?: string };
}

export default function Index({ items, filters }: Props) {
    const handleDelete = (id?: number) => {
        if (!id) return;
        if (!confirm('Are you sure you want to delete this item?')) return;
        router.delete(ProductController.destroy(id).url);
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

                const href = ProductController.show(item.id).url;
                return (
                    <Link href={href} className='flex items-center gap-2 font-medium hover:underline'>
                        {name}
                    </Link>
                );
            },
            enableFiltering: true,
            filter: {
                type: 'text',
                placeholder: 'Filter by item name...',
            },
        },
        {
            id: 'formatted_created_at',
            header: 'Created At',
            accessorKey: 'formatted_created_at',
            enableSorting: true,
            cell: ({ row, getValue }) => {
                const item = row.original;
                const formattedCreatedAt = getValue() as string;

                if (!item.id) return formattedCreatedAt;

                return <span>{formattedCreatedAt}</span>;
            },
        },
        {
            id: 'image_count',
            header: 'Images',
            accessorKey: 'image_count',
            enableSorting: true,
            cell: ({ row, getValue }) => {
                const item = row.original;
                const imageCount = getValue() as number;

                if (!item.id) return imageCount;

                return <span>{imageCount}</span>;
            },
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
                            <Button variant='ghost' className='h-8 w-8 p-0'>
                                <span className='sr-only'>Open menu</span>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenu.DropdownMenuTrigger>
                        <DropdownMenu.DropdownMenuContent align='end'>
                            <DropdownMenu.DropdownMenuItem asChild>
                                <Link href={ProductController.edit(item.id).url} className='flex w-full'>
                                    <Edit className='mr-2 h-4 w-4' />
                                    Edit
                                </Link>
                            </DropdownMenu.DropdownMenuItem>
                            <DropdownMenu.DropdownMenuItem onClick={() => handleDelete(item.id as number)} className='text-destructive'>
                                <Trash className='mr-2 h-4 w-4' />
                                Delete
                            </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                    </DropdownMenu.DropdownMenu>
                );
            },
        },
    ] as (ColumnDef<Product> & {
        enableFiltering?: boolean;
        filter?: any;
        filterOnly?: boolean;
        header?: string;
    })[];

    return (
        <AppLayout>
            <Head title='Products' />

            {/* Page Header */}
            <div className='container mx-auto py-8'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Products</h1>
                        <p className='text-muted-foreground'>Manage your products</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button asChild>
                            <Link href={ProductController.create().url}>Create Item</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <DataTable
                title='Products'
                data={items.data}
                columns={columns}
                pagination={items}
                searchPlaceholder='Search products...'
                enableSearch={true}
                enableColumnFilters={true}
                enableMultiSort={true}
                routeFunction={ProductController.index}
                resetRoute={ProductController.index().url}
                emptyMessage='No products found'
                emptyDescription={
                    filters.search
                        ? 'No products match your search criteria. Try adjusting your filters.'
                        : 'Get started by creating your first product.'
                }
            />
        </AppLayout>
    );
}
