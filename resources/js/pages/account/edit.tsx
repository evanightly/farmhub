import AccountController from '@/actions/App/Http/Controllers/AccountController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Eye, Upload } from 'lucide-react';
import React, { useState } from 'react';

type Account = App.Data.AccountData;

interface Props {
    account: Account;
}

export default function Edit({ account }: Props) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setLoading(true);

            const formData = new FormData(e.currentTarget);

            // Add the _method field for Laravel to recognize this as a PUT request
            formData.append('_method', 'PUT');

            router.post(AccountController.update(account.id!).url, formData, {
                onSuccess: () => {
                    setErrors({});
                },
                onError: (errors) => {
                    setErrors(errors);
                },
                onFinish: () => {
                    setLoading(false);
                },
            });
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit Account: ${account.account_name}`} />

            <div className='space-y-6'>
                <div className='flex items-center gap-4'>
                    <Button variant='outline' size='sm' asChild>
                        <Link href={AccountController.show(account.id!).url}>
                            <ArrowLeft className='h-4 w-4' />
                            Back to Account
                        </Link>
                    </Button>
                    <div>
                        <h1 className='text-3xl font-bold tracking-tight'>Edit Account</h1>
                        <p className='text-muted-foreground'>Update the account information</p>
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                    <div className='lg:col-span-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Update the details for this payment account</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className='space-y-6' encType='multipart/form-data'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='account_name'>Account Name *</Label>
                                            <Input
                                                id='account_name'
                                                name='account_name'
                                                defaultValue={account.account_name || ''}
                                                placeholder='e.g., BCA Savings'
                                                required
                                            />
                                            <InputError message={errors.account_name} />
                                        </div>

                                        <div className='space-y-2'>
                                            <Label htmlFor='owner_name'>Owner Name *</Label>
                                            <Input
                                                id='owner_name'
                                                name='owner_name'
                                                defaultValue={account.owner_name || ''}
                                                placeholder='e.g., John Doe'
                                                required
                                            />
                                            <InputError message={errors.owner_name} />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='account_no'>Account Number *</Label>
                                            <Input
                                                id='account_no'
                                                name='account_no'
                                                defaultValue={account.account_no || ''}
                                                placeholder='e.g., 1234567890'
                                                required
                                            />
                                            <InputError message={errors.account_no} />
                                        </div>

                                        <div className='space-y-2'>
                                            <Label htmlFor='account_type'>Account Type *</Label>
                                            <Select name='account_type' defaultValue={account.account_type || 'bank_transfer'}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
                                                    <SelectItem value='e_wallet'>E-Wallet</SelectItem>
                                                    <SelectItem value='cash'>Cash</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.account_type} />
                                        </div>
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='account_logo'>Account Logo</Label>
                                        <div className='flex items-center gap-4'>
                                            <Input id='account_logo' name='account_logo' type='file' accept='image/*' className='flex-1' />
                                            <Button type='button' variant='outline' size='sm'>
                                                <Upload className='mr-2 h-4 w-4' />
                                                Upload
                                            </Button>
                                        </div>
                                        <p className='text-sm text-muted-foreground'>
                                            Supported formats: JPG, PNG, SVG. Max size: 2MB. Leave empty to keep current logo.
                                        </p>
                                        <InputError message={errors.account_logo} />
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='instructions'>Payment Instructions</Label>
                                        <Textarea
                                            id='instructions'
                                            name='instructions'
                                            defaultValue={account.instructions || ''}
                                            placeholder='Enter specific instructions for this payment method...'
                                            rows={4}
                                        />
                                        <InputError message={errors.instructions} />
                                    </div>

                                    <div className='flex items-center space-x-2'>
                                        <input
                                            type='checkbox'
                                            id='is_active_checkbox'
                                            name='is_active'
                                            value='1'
                                            defaultChecked={account.is_active ?? true}
                                            className='sr-only'
                                        />
                                        <Switch
                                            id='is_active'
                                            defaultChecked={account.is_active ?? true}
                                            onCheckedChange={(checked) => {
                                                const checkbox = document.getElementById('is_active_checkbox') as HTMLInputElement;
                                                if (checkbox) {
                                                    checkbox.checked = checked;
                                                }
                                            }}
                                        />
                                        <Label htmlFor='is_active'>Active</Label>
                                        <p className='text-sm text-muted-foreground'>When active, this account will be available for payments</p>
                                    </div>

                                    <div className='flex justify-end gap-4'>
                                        <Button type='button' variant='outline' asChild>
                                            <Link href={AccountController.show(account.id!).url}>Cancel</Link>
                                        </Button>
                                        <Button type='submit' disabled={loading}>
                                            {loading ? 'Updating...' : 'Update Account'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className='space-y-6'>
                        {account.account_logo && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current Logo</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={`/storage/${account.account_logo}`}
                                        alt={account.account_name || 'Account logo'}
                                        className='h-auto w-full rounded-lg border'
                                    />
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-2'>
                                <Button variant='outline' size='sm' className='w-full' asChild>
                                    <Link href={AccountController.show(account.id!).url}>
                                        <Eye className='mr-2 h-4 w-4' />
                                        View Account
                                    </Link>
                                </Button>
                                <Button variant='outline' size='sm' className='w-full' asChild>
                                    <Link href={AccountController.index().url}>Back to All Accounts</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
