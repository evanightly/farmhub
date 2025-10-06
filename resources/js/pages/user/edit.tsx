import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Form, Head } from '@inertiajs/react';

interface Props {
    item: App.Data.UserData;
}

export default function Edit({ item }: Props) {
    // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setErrors({});

    //     const formData = new FormData(e.currentTarget);

    //     // Only include password fields if they are not empty
    //     if (!formData.get('password')) {
    //         formData.delete('password');
    //         formData.delete('password_confirmation');
    //     }

    //     try {
    //         router.put(UserController.update(item.id).url, formData);
    //     } catch (error: any) {
    //         console.error(error);
    //         if (error.response?.data?.errors) {
    //             setErrors(error.response.data.errors);
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <AppLayout>
            <Head title='Edit Pengguna' />

            <div className='container mx-auto py-8'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold tracking-tight'>Edit Pengguna</h1>
                    <p className='text-muted-foreground'>Perbarui detail pengguna</p>
                </div>

                <Card>
                    <CardContent className='pt-6'>
                        <Form {...UserController.update.form(item.id)} className='flex flex-col gap-6'>
                            {({ processing, errors }) => (
                                <div className='grid gap-6'>
                                    <div className='grid gap-2'>
                                        <Label htmlFor='name'>Nama</Label>
                                        <Input id='name' name='name' type='text' defaultValue={item.name} required autoFocus />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className='grid gap-2'>
                                        <Label htmlFor='email'>Email</Label>
                                        <Input id='email' name='email' type='email' defaultValue={item.email} required />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className='grid gap-2'>
                                        <Label htmlFor='role'>Peran</Label>
                                        <Select name='role' defaultValue={item.role} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Pilih peran' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='admin'>Admin</SelectItem>
                                                <SelectItem value='employee'>Karyawan</SelectItem>
                                                <SelectItem value='customer'>Pelanggan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.role} />
                                    </div>

                                    <div className='grid gap-2'>
                                        <Label htmlFor='password'>
                                            Kata Sandi <span className='text-sm text-muted-foreground'>(opsional)</span>
                                        </Label>
                                        <Input id='password' name='password' type='password' autoComplete='new-password' />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className='grid gap-2'>
                                        <Label htmlFor='password_confirmation'>
                                            Konfirmasi Kata Sandi <span className='text-sm text-muted-foreground'>(opsional)</span>
                                        </Label>
                                        <Input id='password_confirmation' name='password_confirmation' type='password' autoComplete='new-password' />
                                        <InputError message={errors.password_confirmation} />
                                    </div>

                                    <div className='flex justify-end gap-4'>
                                        <Button type='button' variant='outline' onClick={() => window.history.back()}>
                                            Batal
                                        </Button>
                                        <Button type='submit' disabled={processing}>
                                            {processing ? 'Memperbarui...' : 'Perbarui Pengguna'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
