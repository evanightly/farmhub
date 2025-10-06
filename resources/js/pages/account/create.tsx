import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload } from 'lucide-react';
import React, { ChangeEvent } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        account_name: '',
        owner_name: '',
        account_no: '',
        account_type: 'bank_transfer',
        account_logo: null as File | null,
        instructions: '',
        is_active: true,
        metadata: {},
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('account_logo', file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(AccountController.store().url, {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title='Create Account' />

            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Button variant='outline' size='sm' asChild>
                        <Link href={AccountController.index().url}>
                            <ArrowLeft className='h-4 w-4' />
                            Kembali ke Akun
                        </Link>
                    </Button>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Buat Akun</h1>
                        <p className='text-muted-foreground'>Tambahkan akun pembayaran baru ke sistem Anda</p>
                    </div>
                </div>

                <Card className='max-w-2xl'>
                    <CardHeader>
                        <CardTitle>Informasi Akun</CardTitle>
                        <CardDescription>Masukkan detail untuk akun pembayaran baru</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='account_name'>Nama Akun *</Label>
                                    <Input
                                        id='account_name'
                                        value={data.account_name}
                                        onChange={(e) => setData('account_name', e.target.value)}
                                        placeholder='mis., BCA Tabungan'
                                        required
                                    />
                                    {errors.account_name && <p className='text-sm text-destructive'>{errors.account_name}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='owner_name'>Nama Pemilik *</Label>
                                    <Input
                                        id='owner_name'
                                        value={data.owner_name}
                                        onChange={(e) => setData('owner_name', e.target.value)}
                                        placeholder='mis., John Doe'
                                        required
                                    />
                                    {errors.owner_name && <p className='text-sm text-destructive'>{errors.owner_name}</p>}
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-4'>
                                <div className='space-y-2'>
                                    <Label htmlFor='account_no'>Nomor Rekening *</Label>
                                    <Input
                                        id='account_no'
                                        value={data.account_no}
                                        onChange={(e) => setData('account_no', e.target.value)}
                                        placeholder='mis., 1234567890'
                                        required
                                    />
                                    {errors.account_no && <p className='text-sm text-destructive'>{errors.account_no}</p>}
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='account_type'>Account Type *</Label>
                                    <Select value={data.account_type} onValueChange={(value) => setData('account_type', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
                                            <SelectItem value='e_wallet'>E-Wallet</SelectItem>
                                            <SelectItem value='cash'>Cash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.account_type && <p className='text-sm text-destructive'>{errors.account_type}</p>}
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='account_logo'>Account Logo</Label>
                                <div className='flex items-center gap-4'>
                                    <Input id='account_logo' type='file' accept='image/*' onChange={handleFileChange} className='flex-1' />
                                    <Button type='button' variant='outline' size='sm'>
                                        <Upload className='mr-2 h-4 w-4' />
                                        Upload
                                    </Button>
                                </div>
                                <p className='text-sm text-muted-foreground'>Supported formats: JPG, PNG, SVG. Max size: 2MB</p>
                                {errors.account_logo && <p className='text-sm text-destructive'>{errors.account_logo}</p>}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='instructions'>Payment Instructions</Label>
                                <Textarea
                                    id='instructions'
                                    value={data.instructions}
                                    onChange={(e) => setData('instructions', e.target.value)}
                                    placeholder='Enter specific instructions for this payment method...'
                                    rows={4}
                                />
                                {errors.instructions && <p className='text-sm text-destructive'>{errors.instructions}</p>}
                            </div>

                            <div className='flex items-center space-x-2'>
                                <Switch
                                    id='is_active'
                                    checked={data.is_active}
                                    onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                                />
                                <Label htmlFor='is_active'>Active</Label>
                                <p className='text-sm text-muted-foreground'>When active, this account will be available for payments</p>
                            </div>

                            <div className='flex justify-end gap-4'>
                                <Button type='button' variant='outline' asChild>
                                    <Link href={AccountController.index().url}>Cancel</Link>
                                </Button>
                                <Button type='submit' disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Account'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
