import ProductController from '@/actions/App/Http/Controllers/ProductController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Form, Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    item: App.Data.ProductData;
}

export default function Edit({ item }: Props) {
    console.log(item);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize images from existing product images
    // useEffect(() => {
    //     const existingImages = item.product_images.map((img) => ({
    //         id: img.id,
    //         preview: `/storage/${img.image_path}`,
    //         is_primary: img.is_primary,
    //     }));
    //     setImages(existingImages);

    //     // Set primary image index
    //     const primaryIndex = existingImages.findIndex((img) => img.is_primary);
    //     if (primaryIndex !== -1) {
    //         setPrimaryImage(primaryIndex);
    //     }
    // }, [item]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            e.preventDefault();
            setLoading(true);

            const formData = new FormData(e.currentTarget);
            router.put(ProductController.update(item.id).url, formData);
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title='Edit Product' />

            <div className='container mx-auto py-8'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>Edit Product</h1>
                    <p className='text-muted-foreground'>Update your product details</p>
                </div>

                <Card>
                    <CardContent className='pt-6'>
                        <Form {...ProductController.update.form(item.id)} className='flex flex-col gap-6' encType='multipart/form-data'>
                            <div className='grid gap-6'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='name'>Name</Label>
                                    <Input id='name' name='name' type='text' defaultValue={item?.name ?? ''} required />
                                    <InputError message={errors.name} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='description'>Description</Label>
                                    <Textarea id='description' name='description' defaultValue={item?.description ?? ''} required />
                                    <InputError message={errors.description} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='harvest_date'>Harvest Date</Label>
                                    <Input id='harvest_date' name='harvest_date' type='date' defaultValue={item.harvest_date ?? ''} />
                                    <InputError message={errors.harvest_date} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='expiry_date'>Expiry Date</Label>
                                    <Input id='expiry_date' name='expiry_date' type='date' defaultValue={item.expiry_date ?? ''} />
                                    <InputError message={errors.expiry_date} />
                                </div>

                                <div className='flex justify-end gap-4'>
                                    <Button type='button' variant='outline' onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type='submit' disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Product'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
