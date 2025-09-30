import AccountController from '@/actions/App/Http/Controllers/AccountController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Edit, FileText, Hash, Trash } from 'lucide-react';

type Account = App.Data.AccountData;

interface Props {
    account: Account;
    payments_count?: number;
}

export default function Show({ account, payments_count = 0 }: Props) {
    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this account?')) return;
        router.delete(AccountController.destroy(account.id!).url);
    };

    const getAccountTypeColor = (type: string) => {
        switch (type) {
            case 'bank_transfer':
                return 'bg-blue-100 text-blue-800';
            case 'e_wallet':
                return 'bg-green-100 text-green-800';
            case 'cash':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatAccountType = (type: string) => {
        switch (type) {
            case 'bank_transfer':
                return 'Bank Transfer';
            case 'e_wallet':
                return 'E-Wallet';
            case 'cash':
                return 'Cash';
            default:
                return type;
        }
    };

    return (
        <AppLayout>
            <Head title={`Account: ${account.account_name}`} />

            <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <Button variant='outline' size='sm' asChild>
                            <Link href={AccountController.index().url}>
                                <ArrowLeft className='h-4 w-4' />
                                Back to Accounts
                            </Link>
                        </Button>
                        <div>
                            <h1 className='text-3xl font-bold tracking-tight'>{account.account_name}</h1>
                            <p className='text-muted-foreground'>Account details and payment information</p>
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Button variant='outline' asChild>
                            <Link href={AccountController.edit(account.id!).url}>
                                <Edit className='mr-2 h-4 w-4' />
                                Edit
                            </Link>
                        </Button>
                        <Button variant='destructive' onClick={handleDelete} disabled={payments_count > 0}>
                            <Trash className='mr-2 h-4 w-4' />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
                    <div className='space-y-6 lg:col-span-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle className='flex items-center gap-2'>
                                    <CreditCard className='h-5 w-5' />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <Label>Account Name</Label>
                                        <p className='font-medium'>{account.account_name}</p>
                                    </div>
                                    <div>
                                        <Label>Owner Name</Label>
                                        <p className='font-medium'>{account.owner_name}</p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <Label>Account Number</Label>
                                        <p className='font-mono font-medium'>{account.account_no}</p>
                                    </div>
                                    <div>
                                        <Label>Account Type</Label>
                                        <Badge className={getAccountTypeColor(account.account_type!)}>
                                            {formatAccountType(account.account_type!)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <Label>Status</Label>
                                        <Badge variant={account.is_active ? 'default' : 'secondary'}>
                                            {account.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div>
                                        <Label>Sort Order</Label>
                                        <p className='font-medium'>{account.sort_order}</p>
                                    </div>
                                </div>

                                {account.instructions && (
                                    <div>
                                        <Label>Payment Instructions</Label>
                                        <div className='mt-2 rounded-lg bg-muted p-3'>
                                            <p className='text-sm whitespace-pre-wrap'>{account.instructions}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {account.metadata && Object.keys(account.metadata).length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='flex items-center gap-2'>
                                        <FileText className='h-5 w-5' />
                                        Additional Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className='overflow-auto rounded-lg bg-muted p-3 text-sm'>{JSON.stringify(account.metadata, null, 2)}</pre>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className='space-y-6'>
                        {account.account_logo && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Logo</CardTitle>
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
                                <CardTitle className='flex items-center gap-2'>
                                    <Hash className='h-5 w-5' />
                                    Usage Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div>
                                    <Label>Total Payments</Label>
                                    <p className='text-2xl font-bold'>{payments_count}</p>
                                </div>

                                <Separator />

                                <div>
                                    <Label>Created</Label>
                                    <p className='text-sm text-muted-foreground'>{new Date(account.created_at!).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <Label>Last Updated</Label>
                                    <p className='text-sm text-muted-foreground'>{new Date(account.updated_at!).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {payments_count > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-amber-600'>⚠️ Deletion Warning</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-sm text-muted-foreground'>
                                        This account cannot be deleted because it has {payments_count} associated payment
                                        {payments_count !== 1 ? 's' : ''}.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Helper component for labels
function Label({ children }: { children: React.ReactNode }) {
    return <span className='text-sm font-medium text-muted-foreground'>{children}</span>;
}
