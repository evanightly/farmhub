import ProductImageController from '@/actions/App/Http/Controllers/ProductImageController';
import ProductUnitController from '@/actions/App/Http/Controllers/ProductUnitController';
import { Button, buttonVariants } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Combobox } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
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
import { toast } from 'sonner';

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
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
    const [unitTypes, setUnitTypes] = useState(['Kilogram (kg)', 'Karung', 'Ton', 'Pieces', 'Ikat', 'Gram (g)', 'Pack', 'Box']);
    const [imageFormKey, setImageFormKey] = useState(0); // For resetting file input

    // PHP upload limits (in bytes) - using common default values
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB default
    const MAX_TOTAL_SIZE = 8 * 1024 * 1024; // 8MB total

    const validateFileSize = (files: File[]) => {
        const errors: string[] = [];
        const totalSize = files.reduce((sum, file) => sum + file.size, 0);

        // Check individual file sizes
        files.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                errors.push(
                    `Berkas "${file.name}" terlalu besar. Ukuran maksimum yang diizinkan adalah ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB.`,
                );
            }
        });

        // Check total size
        if (totalSize > MAX_TOTAL_SIZE) {
            errors.push(
                `Total ukuran berkas terlalu besar. Ukuran total maksimum yang diizinkan adalah ${(MAX_TOTAL_SIZE / 1024 / 1024).toFixed(1)}MB.`,
            );
        }

        return errors;
    };
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

    const imageForm = useForm({
        images: [] as File[],
        alt_texts: [] as string[],
        is_primary: false,
        product_id: item.id,
    });

    const handleUnitOrder = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = productUnits.findIndex((unit) => unit.id === active.id);
        const newIndex = productUnits.findIndex((unit) => unit.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedUnits = [...productUnits];
            const [movedUnit] = reorderedUnits.splice(oldIndex, 1);
            reorderedUnits.splice(newIndex, 0, movedUnit);

            setProductUnits(reorderedUnits);

            // Update sort_order for affected units
            try {
                const updatePromises = reorderedUnits.map((unit, index) =>
                    axios.put(ProductUnitController.update({ product_unit: unit.id }).url, {
                        ...unit,
                        sort_order: index + 1,
                    }),
                );
                await Promise.all(updatePromises);
            } catch (error: any) {
                console.error('Error updating unit order:', error);
                toast.error('Gagal menyimpan urutan unit.');
                // Revert the change on error
                setProductUnits(productUnits);
            }
        }
    };

    const handleImageOrder = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = productImages.findIndex((image) => image.id === active.id);
        const newIndex = productImages.findIndex((image) => image.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
            const reorderedImages = [...productImages];
            const [movedImage] = reorderedImages.splice(oldIndex, 1);
            reorderedImages.splice(newIndex, 0, movedImage);

            setProductImages(reorderedImages);

            // Update sort_order and is_primary for affected images
            try {
                const updatePromises = reorderedImages.map((image, index) =>
                    axios.put(ProductImageController.update(image.id).url, {
                        ...image,
                        sort_order: index + 1,
                        is_primary: index === 0, // Set first image as primary
                    }),
                );
                await Promise.all(updatePromises);
            } catch (error: any) {
                console.error('Error updating image order:', error);
                toast.error('Gagal menyimpan urutan gambar.');
                // Revert the change on error
                setProductImages(productImages);
            }
        }
    };

    const resetImageForm = () => {
        imageForm.reset();
        imageForm.setData('images', []);
        imageForm.setData('alt_texts', []);
        imageForm.setData('is_primary', false);
        setImageFormKey((prev) => prev + 1);
    };

    const handleCloseImageDialog = () => {
        resetImageForm();
        setIsAddImageOpen(false);
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

    const handleDeleteUnit = async (unitId: number) => {
        try {
            await axios.delete(ProductUnitController.destroy({ product_unit: unitId }).url);
            setProductUnits(productUnits.filter((unit) => unit.id !== unitId));
            toast.success('Unit berhasil dihapus!');
        } catch (error: any) {
            console.error('Error deleting unit:', error);
            toast.error('Gagal menghapus unit.');
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        try {
            await axios.delete(ProductImageController.destroy({ product_image: imageId }).url);
            setProductImages(productImages.filter((image) => image.id !== imageId));
            toast.success('Gambar berhasil dihapus!');
        } catch (error: any) {
            console.error('Error deleting image:', error);
            toast.error('Gagal menghapus gambar.');
        }
    };

    const handleAddImage = async () => {
        const files = imageForm.data.images;
        if (files.length === 0) {
            toast.error('Silakan pilih setidaknya satu gambar.');
            return;
        }

        const validationErrors = validateFileSize(files);
        if (validationErrors.length > 0) {
            validationErrors.forEach((error) => toast.error(error));
            return;
        }

        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
                formData.append(`alt_texts[${index}]`, imageForm.data.alt_texts[index] || '');
            });
            formData.append('is_primary', imageForm.data.is_primary ? '1' : '0');
            formData.append('product_id', item.id.toString());

            const response = await axios.post(ProductImageController.store().url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json', // Ensure JSON response
                },
            });

            // Handle the response - the Laravel controller returns the newly created images
            if (response.status === 200 || response.status === 201) {
                const newImages = Array.isArray(response.data) ? response.data : [response.data];
                // console.log('New images received:', newImages); // Debug log

                // If setting as primary, reorder images to put new primary images first
                if (imageForm.data.is_primary && newImages.length > 0) {
                    // Update existing images to not be primary and add new images at the beginning
                    setProductImages((prev) => [...newImages, ...prev.map((img) => ({ ...img, is_primary: false }))]);
                } else {
                    // Add new images to the end, maintaining existing primary status
                    setProductImages((prev) => [...prev, ...newImages]);
                }

                // Reset form and close dialog
                resetImageForm();
                setIsAddImageOpen(false);

                toast.success(`${newImages.length} gambar berhasil ditambahkan!`);
            }
        } catch (error: any) {
            // console.error('Error adding images:', error);

            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors)
                    .flat()
                    .forEach((errorMsg: any) => {
                        toast.error(errorMsg);
                    });
            } else {
                toast.error(error.response?.data?.message || 'Gagal menambahkan gambar.');
            }
        }
    };

    const handleAddUnit = async () => {
        try {
            const response = await axios.post(ProductUnitController.store().url, unitForm.data);
            console.log(response);

            if (response.status === 200) {
                setProductUnits([...productUnits, response.data]);
                unitForm.reset();
                setIsAddUnitOpen(false);
                toast.success('Unit berhasil ditambahkan!');
            }
        } catch (error: any) {
            console.error('Error adding unit:', error);
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors)
                    .flat()
                    .forEach((errorMsg: any) => {
                        toast.error(errorMsg);
                    });
            } else {
                toast.error(error.response?.data?.message || 'Gagal menambahkan unit.');
            }
        }
    };

    const handleUpdateUnit = async () => {
        if (!editingUnit) return;

        try {
            const response = await axios.put(ProductUnitController.update({ product_unit: editingUnit.id }).url, editUnitForm.data);
            if (response.status === 200) {
                setProductUnits(productUnits.map((unit) => (unit.id === editingUnit.id ? response.data : unit)));
                editUnitForm.reset();
                setIsEditUnitOpen(false);
                setEditingUnit(null);
                toast.success('Unit berhasil diperbarui!');
            }
        } catch (error: any) {
            console.error('Error updating unit:', error);
            if (error.response?.data?.errors) {
                Object.values(error.response.data.errors)
                    .flat()
                    .forEach((errorMsg: any) => {
                        toast.error(errorMsg);
                    });
            } else {
                toast.error(error.response?.data?.message || 'Gagal memperbarui unit.');
            }
        }
    };

    const handleUpdateImageAltText = async () => {
        if (editingImageIndex === null || !productImages[editingImageIndex]) return;

        const image = productImages[editingImageIndex];

        try {
            await axios.put(ProductImageController.update(image.id).url, {
                alt_text: image.alt_text || '',
            });
            toast.success('Teks alt gambar berhasil diperbarui!');
            setEditingImageIndex(null);
        } catch (error: any) {
            console.error('Error updating image:', error);
            toast.error(error.response?.data?.message || 'Gagal memperbarui teks alt gambar.');
        }
    };

    return (
        <AppLayout>
            <Head title={`Product: ${item.name}`} />

            <div className='container mx-auto py-8'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>{item.name}</h1>
                    <p className='mt-2 text-muted-foreground'>{item.description}</p>
                </div>

                <main className='flex flex-1 flex-col gap-8 space-y-8 lg:flex-row'>
                    {/* Product Images Section */}
                    <Card.Card variant='agricultural-glass' className='flex-1'>
                        <Card.CardHeader>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <Card.CardTitle>Gambar Produk</Card.CardTitle>
                                    <Card.CardDescription>
                                        Seret untuk mengubah urutan gambar. Gambar pertama akan menjadi gambar utama.
                                    </Card.CardDescription>
                                </div>
                                <Dialog open={isAddImageOpen} onOpenChange={(open) => (open ? setIsAddImageOpen(true) : handleCloseImageDialog())}>
                                    <DialogTrigger asChild>
                                        <Button variant='agricultural'>Tambah Gambar</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Gambar Baru</DialogTitle>
                                            <DialogDescription>Unggah satu atau lebih gambar untuk produk ini.</DialogDescription>
                                        </DialogHeader>
                                        <form
                                            onSubmit={(e: React.FormEvent) => {
                                                e.preventDefault();
                                                handleAddImage();
                                            }}
                                        >
                                            <div className='grid gap-4 py-4'>
                                                <div className='grid gap-2'>
                                                    <Label htmlFor='images'>Gambar (Beberapa berkas diizinkan)</Label>
                                                    <Input
                                                        key={imageFormKey}
                                                        id='images'
                                                        type='file'
                                                        accept='image/*'
                                                        multiple
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files || []);
                                                            imageForm.setData('images', files);
                                                            // Initialize alt_texts array with empty strings
                                                            imageForm.setData('alt_texts', new Array(files.length).fill(''));
                                                        }}
                                                    />
                                                    <p className='text-xs text-muted-foreground'>
                                                        Maksimum {(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB per berkas,{' '}
                                                        {(MAX_TOTAL_SIZE / 1024 / 1024).toFixed(1)}MB total
                                                    </p>
                                                </div>

                                                {/* Alt text inputs for each selected image with preview */}
                                                {imageForm.data.images.map((file, index) => (
                                                    <div key={`${file.name}-${index}`} className='grid gap-2 rounded-lg border p-4'>
                                                        <div className='flex items-start gap-4'>
                                                            {/* Image Preview */}
                                                            <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border bg-muted'>
                                                                <img
                                                                    src={URL.createObjectURL(file)}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className='h-full w-full object-cover'
                                                                />
                                                            </div>
                                                            {/* Alt text input */}
                                                            <div className='flex-1 space-y-2'>
                                                                <Label
                                                                    className='line-clamp-2 text-sm font-medium break-all'
                                                                    htmlFor={`alt_text_${index}`}
                                                                >
                                                                    Teks alternatif untuk "{file.name}"
                                                                </Label>
                                                                <Input
                                                                    id={`alt_text_${index}`}
                                                                    placeholder='Deskripsikan gambar ini untuk aksesibilitas'
                                                                    value={imageForm.data.alt_texts[index] || ''}
                                                                    onChange={(e) => {
                                                                        const newAltTexts = [...imageForm.data.alt_texts];
                                                                        newAltTexts[index] = e.target.value;
                                                                        imageForm.setData('alt_texts', newAltTexts);
                                                                    }}
                                                                />
                                                                <p className='text-xs text-muted-foreground'>
                                                                    Ukuran: {(file.size / 1024 / 1024).toFixed(2)}MB
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className='flex items-center gap-2'>
                                                    <Switch
                                                        id='is_primary'
                                                        checked={imageForm.data.is_primary}
                                                        onCheckedChange={(checked) => imageForm.setData('is_primary', checked)}
                                                    />
                                                    <Label htmlFor='is_primary'>Jadikan gambar pertama sebagai utama</Label>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type='submit' variant='agricultural'>
                                                    Unggah Gambar
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card.CardHeader>
                        <Card.CardContent>
                            <Sortable.Root
                                value={productImages}
                                onValueChange={setProductImages}
                                onMove={handleImageOrder}
                                orientation='mixed'
                                getItemValue={(item) => item.id}
                            >
                                <Sortable.Content className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                    {productImages.map((image) => (
                                        <Sortable.Item key={image.id} value={image.id} className='group relative'>
                                            <div className='relative h-52 w-full overflow-hidden rounded-lg border bg-muted'>
                                                <img src={image.url} alt={image.alt_text} className='h-full w-full object-cover' />

                                                {/* Drag Handle */}
                                                <Sortable.ItemHandle
                                                    className={buttonVariants({
                                                        size: 'icon',
                                                        className:
                                                            'absolute top-2 left-2 flex cursor-grab bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/70 active:cursor-grabbing',
                                                    })}
                                                >
                                                    <GripVertical />
                                                </Sortable.ItemHandle>

                                                {/* Action Buttons */}
                                                <div className='absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                                                    <Button
                                                        ripple={false}
                                                        variant='secondary'
                                                        size='icon'
                                                        onClick={() => setEditingImageIndex(productImages.indexOf(image))}
                                                    >
                                                        <Edit className='h-3 w-3' />
                                                    </Button>
                                                    <Button
                                                        ripple={false}
                                                        variant='destructive'
                                                        size='icon'
                                                        onClick={() => handleDeleteImage(image.id)}
                                                    >
                                                        <XIcon className='h-3 w-3' />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Sortable.Item>
                                    ))}
                                </Sortable.Content>
                            </Sortable.Root>
                        </Card.CardContent>
                    </Card.Card>

                    {/* Product Units Section */}
                    <Card.Card variant='agricultural-glass' className='flex-1'>
                        <Card.CardHeader className='flex flex-row items-center justify-between'>
                            <div>
                                <Card.CardTitle>Unit Produk</Card.CardTitle>
                                <Card.CardDescription>Kelola dan atur unit produk</Card.CardDescription>
                            </div>
                            <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
                                <DialogTrigger asChild>
                                    <Button variant='agricultural'>Tambah Unit</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Tambah Unit Baru</DialogTitle>
                                        <DialogDescription>Buat unit baru untuk produk ini. Unit akan ditambahkan ke daftar.</DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={(e: React.FormEvent) => {
                                            e.preventDefault();
                                            handleAddUnit();
                                        }}
                                    >
                                        <div className='grid gap-4 py-4'>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='unit_type'>Jenis Unit</Label>
                                                <Combobox
                                                    value={unitForm.data.unit_type}
                                                    onValueChange={(value: string) => unitForm.setData('unit_type', value)}
                                                    options={unitTypes}
                                                    placeholder='Cari jenis unit...'
                                                    allowCustom={true}
                                                    onCreateNew={(newType: string) => {
                                                        setUnitTypes((prev) => [...prev, newType]);
                                                        unitForm.setData('unit_type', newType);
                                                    }}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='unit_label'>Label Unit</Label>
                                                <Input
                                                    id='unit_label'
                                                    value={unitForm.data.unit_label}
                                                    onChange={(e) => unitForm.setData('unit_label', e.target.value)}
                                                    placeholder='contoh: Karung (25kg)'
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='price_per_unit'>Harga per Unit</Label>
                                                <Input
                                                    id='price_per_unit'
                                                    type='number'
                                                    value={unitForm.data.price_per_unit}
                                                    onChange={(e) => unitForm.setData('price_per_unit', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='stock_quantity'>Jumlah Stok</Label>
                                                <Input
                                                    id='stock_quantity'
                                                    type='number'
                                                    value={unitForm.data.stock_quantity}
                                                    onChange={(e) => unitForm.setData('stock_quantity', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='notes'>Catatan</Label>
                                                <Textarea
                                                    id='notes'
                                                    value={unitForm.data.notes || ''}
                                                    onChange={(e) => unitForm.setData('notes', e.target.value)}
                                                    placeholder='Catatan khusus tentang unit ini'
                                                />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Switch
                                                    id='is_active'
                                                    checked={unitForm.data.is_active}
                                                    onCheckedChange={(checked) => unitForm.setData('is_active', checked)}
                                                />
                                                <Label htmlFor='is_active'>Aktif</Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type='submit' variant='agricultural'>
                                                Tambah Unit
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>

                            {/* Edit Unit Dialog */}
                            <Dialog open={isEditUnitOpen} onOpenChange={setIsEditUnitOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Unit</DialogTitle>
                                        <DialogDescription>Perbarui detail unit ini.</DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={(e: React.FormEvent) => {
                                            e.preventDefault();
                                            handleUpdateUnit();
                                        }}
                                    >
                                        <div className='grid gap-4 py-4'>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_unit_type'>Jenis Unit</Label>
                                                <Combobox
                                                    value={editUnitForm.data.unit_type}
                                                    onValueChange={(value: string) => editUnitForm.setData('unit_type', value)}
                                                    options={unitTypes}
                                                    placeholder='Cari jenis unit...'
                                                    allowCustom={true}
                                                    onCreateNew={(newType: string) => {
                                                        setUnitTypes((prev) => [...prev, newType]);
                                                        editUnitForm.setData('unit_type', newType);
                                                    }}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_unit_label'>Label Unit</Label>
                                                <Input
                                                    id='edit_unit_label'
                                                    value={editUnitForm.data.unit_label}
                                                    onChange={(e) => editUnitForm.setData('unit_label', e.target.value)}
                                                    placeholder='contoh: Karung (25kg)'
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_price_per_unit'>Harga per Unit</Label>
                                                <Input
                                                    id='edit_price_per_unit'
                                                    type='number'
                                                    value={editUnitForm.data.price_per_unit}
                                                    onChange={(e) => editUnitForm.setData('price_per_unit', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_stock_quantity'>Jumlah Stok</Label>
                                                <Input
                                                    id='edit_stock_quantity'
                                                    type='number'
                                                    value={editUnitForm.data.stock_quantity}
                                                    onChange={(e) => editUnitForm.setData('stock_quantity', Number(e.target.value))}
                                                />
                                            </div>
                                            <div className='grid gap-2'>
                                                <Label htmlFor='edit_notes'>Catatan</Label>
                                                <Textarea
                                                    id='edit_notes'
                                                    value={editUnitForm.data.notes || ''}
                                                    onChange={(e) => editUnitForm.setData('notes', e.target.value)}
                                                    placeholder='Catatan khusus tentang unit ini'
                                                />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Switch
                                                    id='edit_is_active'
                                                    checked={editUnitForm.data.is_active}
                                                    onCheckedChange={(checked) => editUnitForm.setData('is_active', checked)}
                                                />
                                                <Label htmlFor='edit_is_active'>Aktif</Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type='button'
                                                variant='agricultural-outline'
                                                onClick={() => {
                                                    setIsEditUnitOpen(false);
                                                    setEditingUnit(null);
                                                    editUnitForm.reset();
                                                }}
                                            >
                                                Batal
                                            </Button>
                                            <Button type='submit' variant='agricultural'>
                                                Perbarui Unit
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </Card.CardHeader>
                        <Card.CardContent>
                            <Sortable.Root
                                value={productUnits}
                                onValueChange={setProductUnits}
                                onMove={handleUnitOrder}
                                getItemValue={(item) => item.id}
                            >
                                <Sortable.Content className='space-y-2'>
                                    {productUnits.map((unit) => (
                                        <Sortable.Item key={unit.id} value={unit.id} className='relative'>
                                            <Item variant='muted' className='group transition-all hover:shadow-md'>
                                                <ItemMedia className='!self-center'>
                                                    <Sortable.ItemHandle className='flex cursor-grab items-center justify-center rounded opacity-40 transition-opacity hover:bg-muted hover:opacity-100 active:cursor-grabbing'>
                                                        <GripVertical className='size-4' />
                                                    </Sortable.ItemHandle>
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemTitle className='flex items-center gap-2'>
                                                        {unit.unit_label} ({unit.unit_type})
                                                        {!unit.is_active && (
                                                            <span className='rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary-foreground'>
                                                                Tidak Aktif
                                                            </span>
                                                        )}
                                                    </ItemTitle>
                                                    <ItemDescription className='flex gap-4'>
                                                        <span className='flex items-center gap-1.5'>
                                                            <span className='text-xs font-medium text-muted-foreground uppercase'>Stok</span>
                                                            <span className='text-sm font-medium'>{unit.stock_quantity}</span>
                                                        </span>
                                                        <span className='flex items-center gap-1.5'>
                                                            <span className='text-xs font-medium text-muted-foreground uppercase'>Harga</span>
                                                            <span className='text-sm font-medium'>{unit.formatted_price_per_unit}</span>
                                                        </span>
                                                    </ItemDescription>

                                                    {unit.notes && <ItemDescription className='mt-2'>{unit.notes}</ItemDescription>}
                                                </ItemContent>
                                                <ItemActions>
                                                    <Button variant='secondary' size='sm' onClick={() => handleEditUnit(unit)}>
                                                        <Edit />
                                                    </Button>
                                                    <Button variant='destructive' size='sm' onClick={() => handleDeleteUnit(unit.id)}>
                                                        <Trash2 />
                                                    </Button>
                                                </ItemActions>
                                            </Item>
                                        </Sortable.Item>
                                    ))}
                                </Sortable.Content>
                            </Sortable.Root>
                        </Card.CardContent>
                    </Card.Card>
                </main>
            </div>

            {/* Edit Image Dialog */}
            <Dialog open={editingImageIndex !== null} onOpenChange={(open) => !open && setEditingImageIndex(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Teks Alt Gambar</DialogTitle>
                        <DialogDescription>Perbarui deskripsi aksesibilitas untuk gambar ini.</DialogDescription>
                    </DialogHeader>
                    {editingImageIndex !== null && productImages[editingImageIndex] && (
                        <form
                            onSubmit={(e: React.FormEvent) => {
                                e.preventDefault();
                                handleUpdateImageAltText();
                            }}
                        >
                            <div className='grid gap-4 py-4'>
                                <div className='flex items-start gap-4'>
                                    <div className='relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-muted'>
                                        <img
                                            src={productImages[editingImageIndex].url}
                                            alt={productImages[editingImageIndex].alt_text || 'Product image'}
                                            className='h-full w-full object-cover'
                                        />
                                    </div>
                                    <div className='flex-1 space-y-2'>
                                        <Label htmlFor='edit_alt_text'>Teks Alt</Label>
                                        <Textarea
                                            id='edit_alt_text'
                                            placeholder='Deskripsikan gambar ini untuk aksesibilitas'
                                            value={productImages[editingImageIndex].alt_text || ''}
                                            onChange={(e) => {
                                                setProductImages((prev) =>
                                                    prev.map((img, idx) => (idx === editingImageIndex ? { ...img, alt_text: e.target.value } : img)),
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type='button' variant='outline' onClick={() => setEditingImageIndex(null)}>
                                    Batal
                                </Button>
                                <Button type='submit' variant='agricultural'>
                                    Perbarui Teks Alternatif
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
