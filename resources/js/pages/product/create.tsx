import ProductController from '@/actions/App/Http/Controllers/ProductController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface PreviewImage {
    file: File;
    preview: string;
}

export default function Create() {
    const [images, setImages] = useState<PreviewImage[]>([]);
    const [primaryImage, setPrimaryImage] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newImages = acceptedFiles.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setImages((prev) => [...prev, ...newImages]);

            // If this is the first image, make it primary by default
            if (images.length === 0 && newImages.length > 0) {
                setPrimaryImage(0);
            }
        },
        [images],
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
        },
    });

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (primaryImage === index) {
            setPrimaryImage(null);
        } else if (primaryImage && primaryImage > index) {
            setPrimaryImage(primaryImage - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);

        // Remove any existing image files from the FormData and add them with primary status
        formData.delete('images[]');
        formData.delete('is_primary[]');

        images.forEach((image, index) => {
            formData.append('images[]', image.file);
            formData.append('is_primary[]', (primaryImage === index).toString());
        });

        try {
            router.post(ProductController.store().url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error: any) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title='Create Product' />

            <div className='container mx-auto py-8'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>Create Product</h1>
                    <p className='text-muted-foreground'>Add a new product to your catalog</p>
                </div>

                <Card>
                    <CardContent className='pt-6'>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-6' encType='multipart/form-data'>
                            <div className='grid gap-6'>
                                {/* Rest of the form fields remain the same */}
                                <div className='grid gap-2'>
                                    <Label htmlFor='name'>Name</Label>
                                    <Input id='name' name='name' type='text' required autoFocus />
                                    <InputError message={errors.name} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='description'>Description</Label>
                                    <Textarea id='description' name='description' required />
                                    <InputError message={errors.description} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='harvest_date'>Harvest Date</Label>
                                    <Input id='harvest_date' name='harvest_date' type='date' />
                                    <InputError message={errors.harvest_date} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='expiry_date'>Expiry Date</Label>
                                    <Input id='expiry_date' name='expiry_date' type='date' />
                                    <InputError message={errors.expiry_date} />
                                </div>

                                <div className='space-y-4'>
                                    <div {...getRootProps()} className='cursor-pointer rounded-lg border-2 border-dashed p-8 text-center'>
                                        <input {...getInputProps()} />
                                        <p>Drag 'n' drop some images here, or click to select files</p>
                                        <InputError message={errors.images} />
                                    </div>

                                    {images.length > 0 && (
                                        <div className='space-y-2'>
                                            <Label>Click image to set as primary</Label>
                                            <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
                                                {images.map((image, index) => (
                                                    <div key={index} className='relative'>
                                                        <img
                                                            src={image.preview}
                                                            alt={`Preview ${index}`}
                                                            className={`h-32 w-full cursor-pointer rounded-lg object-cover ring-2 transition-all ${
                                                                primaryImage === index ? 'ring-2 ring-green-500' : ''
                                                            }`}
                                                            onClick={() => setPrimaryImage(index)}
                                                        />
                                                        <Button
                                                            type='button'
                                                            variant='destructive'
                                                            size='sm'
                                                            className='absolute top-2 right-2'
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            ×
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className='flex justify-end gap-4'>
                                    <Button type='button' variant='outline' onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type='submit' disabled={loading}>
                                        {loading ? 'Creating...' : 'Create Product'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
