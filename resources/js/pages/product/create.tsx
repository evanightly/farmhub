import ProductController from '@/actions/App/Http/Controllers/ProductController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Create() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);

        try {
            router.post(ProductController.store().url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onSuccess: () => {
                    // Redirect to products index on success
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } catch (error: any) {
            console.log(error);
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
                                {/* Basic Product Information */}
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
