import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
            router.post(UserController.store().url, formData);
        } catch (error: any) {
            console.error(error);
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title='Create User' />

            <div className='container mx-auto py-8'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>Create User</h1>
                    <p className='text-muted-foreground'>Add a new user to the system</p>
                </div>

                <Card>
                    <CardContent className='pt-6'>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                            <div className='grid gap-6'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='name'>Name</Label>
                                    <Input id='name' name='name' type='text' required autoFocus />
                                    <InputError message={errors.name} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='email'>Email</Label>
                                    <Input id='email' name='email' type='email' required />
                                    <InputError message={errors.email} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='role'>Role</Label>
                                    <Select name='role' required>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select a role' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='admin'>Admin</SelectItem>
                                            <SelectItem value='employee'>Employee</SelectItem>
                                            <SelectItem value='customer'>Customer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.role} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='password'>Password</Label>
                                    <Input id='password' name='password' type='password' required />
                                    <InputError message={errors.password} />
                                </div>

                                <div className='grid gap-2'>
                                    <Label htmlFor='password_confirmation'>Confirm Password</Label>
                                    <Input id='password_confirmation' name='password_confirmation' type='password' required />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className='flex justify-end gap-4'>
                                    <Button type='button' variant='outline' onClick={() => window.history.back()}>
                                        Cancel
                                    </Button>
                                    <Button type='submit' disabled={loading}>
                                        {loading ? 'Creating...' : 'Create User'}
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
