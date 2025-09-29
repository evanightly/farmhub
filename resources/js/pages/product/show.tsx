import ProductImageController from '@/actions/App/Http/Controllers/ProductImageController';
import ProductUnitController from '@/actions/App/Http/Controllers/ProductUnitController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as Sortable from '@/components/ui/sortable';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { DragEndEvent } from '@dnd-kit/core';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Edit, GripVertical, Trash2, X as XIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    item: App.Data.Product.Show.ProductData;
}

export default function Show({ item }: Props) {
    const [productUnits, setProductUnits] = useState(item.product_units ?? []);
    const [productImages, setProductImages] = useState(item.product_images ?? []);
    const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
    const [isEditUnitOpen, setIsEditUnitOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<(typeof productUnits)[0] | null>(null);
    const [isAddImageOpen, setIsAddImageOpen] = useState(false);

    const unitForm = useForm({
        unit_type: '',
        unit_label: '',
        price_per_unit: 0,
        stock_quantity: 0,
        is_active: true,
        sort_order: productUnits.length + 1,
        notes: '',
        product_id: item.id,
    });

    const editUnitForm = useForm({
        unit_type: '',
        unit_label: '',
        price_per_unit: 0,
        stock_quantity: 0,
        is_active: true,
        sort_order: 0,
        notes: '',
        product_id: item.id,
    });

    const handleUnitOrder = async (event: DragEndEvent & { activeIndex: number; overIndex: number }) => {
        const oldIndex = event.activeIndex;
        const newIndex = event.overIndex;

        const updatedUnits = [...productUnits];
        const [movedUnit] = updatedUnits.splice(oldIndex, 1);
        updatedUnits.splice(newIndex, 0, movedUnit);
        // Update sort_order based on new array positions
        const updatedWithOrder = updatedUnits.map((unit, index) => ({
            ...unit,
            sort_order: index + 1,
        }));

        try {
            if (!item.id) return;

            await axios.post(ProductUnitController.reorder(item.id).url, {
                units: updatedWithOrder.map(({ id, sort_order }) => ({ id, sort_order })),
            });
            // Only update state after successful API call
            setProductUnits(updatedWithOrder);
        } catch (error) {
            console.error('Failed to update unit order:', error);
            // Keep original order on error
            setProductUnits(productUnits);
        }
    };

    const handleImageOrder = async (event: DragEndEvent & { activeIndex: number; overIndex: number }) => {
        const oldIndex = event.activeIndex;
        const newIndex = event.overIndex;

        const updatedImages = [...productImages];
        const [movedImage] = updatedImages.splice(oldIndex, 1);
        updatedImages.splice(newIndex, 0, movedImage);

        // Update sort_order based on new array positions
        const updatedWithOrder = updatedImages.map((image, index) => ({
            ...image,
            sort_order: index + 1,
        }));

        try {
            if (!item.id) return;
            await axios.post(ProductImageController.reorder(item.id).url, {
                images: updatedWithOrder.map(({ id, sort_order }) => ({ id, sort_order })),
            });
            // Only update state after successful API call
            setProductImages(updatedWithOrder);
        } catch (error) {
            console.error('Failed to update image order:', error);
            // Keep original order on error
            setProductImages(productImages);
        }
    };

    const imageForm = useForm({
        images: [] as File[],
        is_primary: false,
        product_id: item.id,
    });

    const handleAddUnit = async () => {
        try {
            const response = await axios.post(ProductUnitController.store().url, {
                ...unitForm.data,
                product_id: item.id,
            });

            setProductUnits((prev) => [...prev, response.data].sort((a, b) => a.sort_order - b.sort_order));
            setIsAddUnitOpen(false);
            unitForm.reset();
        } catch (error) {
            console.error('Failed to add unit:', error);
        }
    };

    const handleDeleteUnit = async (id: number) => {
        if (!confirm('Are you sure you want to delete this unit?')) {
            return;
        }

        try {
            await axios.delete(ProductUnitController.destroy(id).url);
            setProductUnits((prev) => prev.filter((unit) => unit.id !== id));
        } catch (error) {
            console.error('Failed to delete unit:', error);
        }
    };

    const handleEditUnit = (unit: (typeof productUnits)[0]) => {
        setEditingUnit(unit);
        editUnitForm.setData({
            unit_type: unit.unit_type || '',
            unit_label: unit.unit_label || '',
            price_per_unit: unit.price_per_unit || 0,
            stock_quantity: unit.stock_quantity || 0,
            is_active: unit.is_active ?? true,
            sort_order: unit.sort_order || 0,
            notes: unit.notes || '',
            product_id: item.id,
        });
        setIsEditUnitOpen(true);
    };

    const handleUpdateUnit = async () => {
        if (!editingUnit) return;

        try {
            const response = await axios.put(ProductUnitController.update(editingUnit.id).url, editUnitForm.data);

            setProductUnits((prev) =>
                prev.map((unit) => (unit.id === editingUnit.id ? response.data : unit)).sort((a, b) => a.sort_order - b.sort_order),
            );
            setIsEditUnitOpen(false);
            setEditingUnit(null);
            editUnitForm.reset();
        } catch (error) {
            console.error('Failed to update unit:', error);
        }
    };

    const handleDeleteImage = async (id: number) => {
        try {
            await axios.delete(ProductImageController.destroy(id).url);
            setProductImages((prev) => prev.filter((image) => image.id !== id));
        } catch (error) {
            console.error('Failed to delete image:', error);
        }
    };

    const handleAddImage = async () => {
        try {
            const formData = new FormData();
            imageForm.data.images.forEach((file) => {
                formData.append('images[]', file);
            });
            formData.append('is_primary', imageForm.data.is_primary ? '1' : '0');
            formData.append('product_id', String(item.id));

            const response = await axios.post(ProductImageController.store().url, formData);

            // Update state with new images
            setProductImages((prev) => [...prev, ...response.data].sort((a, b) => a.sort_order - b.sort_order));
            setIsAddImageOpen(false);
            imageForm.reset();
        } catch (error) {
            console.error('Failed to add images:', error);
        }
    };

    return (
        <AppLayout>
            <Head title={`Product: ${item.name}`} />

            <div className='container mx-auto py-8'>
                {/* Header Section */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>{item.name}</h1>
                    <p className='text-muted-foreground'>{item.description}</p>
                </div>

                <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                    {/* Product Images Section */}
                    <Card>
                        <CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <CardTitle>Product Images</CardTitle>
                                    <CardDescription>Drag to reorder images. The first image will be the primary one.</CardDescription>
                                </div>
                                <Dialog open={isAddImageOpen} onOpenChange={setIsAddImageOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add Images</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Images</DialogTitle>
                                            <DialogDescription>Upload one or more images for this product.</DialogDescription>
                                        </DialogHeader>
                                        <form
                                            onSubmit={(e: React.FormEvent) => {
                                                e.preventDefault();
                                                handleAddImage();
                                            }}
                                        >
                                            <div className='grid gap-4 py-4'>
                                                <div className='grid gap-2'>
                                                    <Label htmlFor='images'>Images</Label>
                                                    <Input
                                                        id='images'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            imageForm.setData('images', files);
                                                        }}
                                                    />
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    <Switch
                                                        id='is_primary'
                                                        checked={imageForm.data.is_primary}
                                                        onCheckedChange={(checked) => imageForm.setData('is_primary', checked)}
                                                    />
                                                    <Label htmlFor='is_primary'>Set as primary image</Label>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type='submit'>Upload Images</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Sortable.Root
                                value={productImages}
                                onValueChange={setProductImages}
                                onMove={handleImageOrder}
                                orientation='mixed'
                                getItemValue={(item) => item.id}
                            >
                                <Sortable.Content className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                                    {productImages.map((image) => (
                                        <Sortable.Item key={image.id} value={image.id} className='group relative'>
                                            <div className='relative aspect-square overflow-hidden rounded-lg border bg-muted'>
                                                <img src={image.url} alt={image.alt_text} className='h-full w-full object-cover' />

                                                {/* Drag Handle */}
                                                <Sortable.ItemHandle className='absolute top-2 left-2 flex h-6 w-6 cursor-grab items-center justify-center rounded bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/70 active:cursor-grabbing'>
                                                    <GripVertical className='h-3 w-3 text-white' />
                                                </Sortable.ItemHandle>

                                                {/* Delete Button */}
                                                <Button
                                                    ripple={false}
                                                    variant='destructive'
                                                    size='icon'
                                                    className='absolute top-2 right-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'
                                                    onClick={() => handleDeleteImage(image.id)}
                                                >
                                                    <XIcon className='h-3 w-3' />
                                                </Button>
                                            </div>
                                        </Sortable.Item>
                                    ))}
                                </Sortable.Content>
                            </Sortable.Root>
                        </CardContent>
                    </Card>

                    {/* Product Units Section */}
                    <Card>
                        <CardHeader className='flex flex-row items-center justify-between'>
                            <div>
                                <CardTitle>Product Units</CardTitle>
                                <CardDescription>Manage and organize product units</CardDescription>
                            </div>
                            <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
                                <DialogTrigger asChild>
                                    <Button>Add Unit</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Unit</DialogTitle>
                                        <DialogDescription>Create a new unit for this product. The unit will be added to the list.</DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={(e: React.FormEvent) => {
                                            e.preventDefault();
                                            handleAddUnit();
                                        }}
                                    >
                                        <div className='grid gap-4 py-4'>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='unit_type'>Unit Type</Label>
                                                <Command className='rounded-lg border shadow-md'>
                                                    <CommandInput
                                                        placeholder='Search unit type...'
                                                        value={unitForm.data.unit_type}
                                                        onValueChange={(value) => unitForm.setData('unit_type', value)}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>Press enter to add "{unitForm.data.unit_type}" as a new unit</CommandEmpty>
                                                        <CommandGroup heading='Common Units'>
                                                            {[
                                                                { value: 'kg', label: 'Kilogram (kg)' },
                                                                { value: 'karung', label: 'Karung' },
                                                                { value: 'ton', label: 'Ton' },
                                                                { value: 'pieces', label: 'Pieces' },
                                                                { value: 'ikat', label: 'Ikat' },
                                                                { value: 'gram', label: 'Gram (g)' },
                                                                { value: 'pack', label: 'Pack' },
                                                                { value: 'box', label: 'Box' },
                                                            ].map((unit) => (
                                                                <CommandItem
                                                                    key={unit.value}
                                                                    value={unit.value}
                                                                    onSelect={(value) => unitForm.setData('unit_type', value)}
                                                                >
                                                                    {unit.label}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='unit_label'>Unit Label</Label>
                                                <Input
                                                    id='unit_label'
                                                    value={unitForm.data.unit_label}
                                                    onChange={(e) => unitForm.setData('unit_label', e.target.value)}
                                                    placeholder='e.g., Karung (25kg)'
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='price_per_unit'>Price per Unit</Label>
                                                <Input
                                                    id='price_per_unit'
                                                    type='number'
                                                    value={unitForm.data.price_per_unit}
                                                    onChange={(e) => unitForm.setData('price_per_unit', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='stock_quantity'>Stock Quantity</Label>
                                                <Input
                                                    id='stock_quantity'
                                                    type='number'
                                                    value={unitForm.data.stock_quantity}
                                                    onChange={(e) => unitForm.setData('stock_quantity', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='notes'>Notes</Label>
                                                <Textarea
                                                    id='notes'
                                                    value={unitForm.data.notes || ''}
                                                    onChange={(e) => unitForm.setData('notes', e.target.value)}
                                                    placeholder='Any special notes about this unit'
                                                />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Switch
                                                    id='is_active'
                                                    checked={unitForm.data.is_active}
                                                    onCheckedChange={(checked) => unitForm.setData('is_active', checked)}
                                                />
                                                <Label htmlFor='is_active'>Active</Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type='submit'>Add Unit</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {/* Edit Unit Dialog */}
                            <Dialog open={isEditUnitOpen} onOpenChange={setIsEditUnitOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Unit</DialogTitle>
                                        <DialogDescription>Update the details for this product unit.</DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={(e: React.FormEvent) => {
                                            e.preventDefault();
                                            handleUpdateUnit();
                                        }}
                                    >
                                        <div className='grid gap-4 py-4'>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_unit_type'>Unit Type</Label>
                                                <Command className='border'>
                                                    <CommandInput placeholder='Search unit type...' />
                                                    <CommandList>
                                                        <CommandEmpty>No unit type found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {['kg', 'karung', 'ton', 'pieces', 'ikat'].map((type) => (
                                                                <CommandItem
                                                                    key={type}
                                                                    value={type}
                                                                    onSelect={() => editUnitForm.setData('unit_type', type)}
                                                                >
                                                                    {type}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_unit_label'>Unit Label</Label>
                                                <Input
                                                    id='edit_unit_label'
                                                    value={editUnitForm.data.unit_label}
                                                    onChange={(e) => editUnitForm.setData('unit_label', e.target.value)}
                                                    placeholder='e.g., Karung (25kg)'
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_price_per_unit'>Price per Unit</Label>
                                                <Input
                                                    id='edit_price_per_unit'
                                                    type='number'
                                                    value={editUnitForm.data.price_per_unit}
                                                    onChange={(e) => editUnitForm.setData('price_per_unit', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_stock_quantity'>Stock Quantity</Label>
                                                <Input
                                                    id='edit_stock_quantity'
                                                    type='number'
                                                    value={editUnitForm.data.stock_quantity}
                                                    onChange={(e) => editUnitForm.setData('stock_quantity', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_notes'>Notes</Label>
                                                <Textarea
                                                    id='edit_notes'
                                                    value={editUnitForm.data.notes || ''}
                                                    onChange={(e) => editUnitForm.setData('notes', e.target.value)}
                                                    placeholder='Any special notes about this unit'
                                                />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Switch
                                                    id='edit_is_active'
                                                    checked={editUnitForm.data.is_active}
                                                    onCheckedChange={(checked) => editUnitForm.setData('is_active', checked)}
                                                />
                                                <Label htmlFor='edit_is_active'>Active</Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type='button'
                                                variant='outline'
                                                onClick={() => {
                                                    setIsEditUnitOpen(false);
                                                    setEditingUnit(null);
                                                    editUnitForm.reset();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type='submit'>Update Unit</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Sortable.Root
                                value={productUnits}
                                onValueChange={setProductUnits}
                                onMove={handleUnitOrder}
                                getItemValue={(item) => item.id}
                            >
                                <Sortable.Content className='space-y-2'>
                                    {productUnits.map((unit) => (
                                        <Sortable.Item key={unit.id} value={unit.id} className='relative'>
                                            <div className='group flex items-center gap-3 rounded-lg border border-border/50 bg-gradient-to-br from-card to-card/95 p-6 shadow-sm transition-all hover:border-border hover:shadow-md'>
                                                {/* Drag Handle */}
                                                <Sortable.ItemHandle className='flex h-6 w-6 cursor-grab items-center justify-center rounded opacity-40 transition-opacity hover:bg-muted hover:opacity-100 active:cursor-grabbing'>
                                                    <GripVertical className='h-4 w-4 text-muted-foreground' />
                                                </Sortable.ItemHandle>

                                                {/* Unit Content */}
                                                <div className='flex-1 space-y-2'>
                                                    <div className='flex items-center gap-2'>
                                                        <h4 className='font-medium tracking-tight'>{unit.unit_label}</h4>
                                                        {!unit.is_active && (
                                                            <span className='rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary-foreground'>
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className='flex gap-4'>
                                                        <div className='flex items-center gap-1.5'>
                                                            <span className='text-xs font-medium text-muted-foreground uppercase'>Stock</span>
                                                            <span className='text-sm font-medium'>{unit.stock_quantity}</span>
                                                        </div>
                                                        <div className='flex items-center gap-1.5'>
                                                            <span className='text-xs font-medium text-muted-foreground uppercase'>Price</span>
                                                            <span className='text-sm font-medium'>{unit.formatted_price_per_unit}</span>
                                                        </div>
                                                    </div>
                                                    {unit.notes && <p className='mt-1 text-sm text-muted-foreground'>{unit.notes}</p>}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className='flex items-center gap-2'>
                                                    <Button variant='secondary' size='sm' onClick={() => handleEditUnit(unit)}>
                                                        <Edit />
                                                    </Button>
                                                    <Button variant='destructive' size='sm' onClick={() => handleDeleteUnit(unit.id)}>
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Sortable.Item>
                                    ))}
                                </Sortable.Content>
                            </Sortable.Root>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
