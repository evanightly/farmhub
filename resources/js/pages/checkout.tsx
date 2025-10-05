import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { cart, checkout, dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    CreditCard,
    Heart,
    Mail,
    MapPin,
    Package,
    Phone,
    Shield,
    ShoppingCart,
    Smartphone,
    Sparkles,
    User,
    Wallet,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface CheckoutProps {
    accounts: App.Data.AccountData[];
}

export default function Checkout({ accounts }: CheckoutProps) {
    const { auth } = usePage<SharedData>().props;
    const { items, getTotalItems, getTotalPrice, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Form state
    const [formData, setFormData] = React.useState({
        customer_name: auth.user?.name || '',
        customer_email: auth.user?.email || '',
        customer_phone: '',
        shipping_address: '',
        notes: '',
        selected_account_id: '',
    });

    const [errors, setErrors] = React.useState<Record<string, string>>({});

    // Redirect to cart if no items
    React.useEffect(() => {
        if (items.length === 0) {
            router.visit(cart());
        }
    }, [items]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleAccountSelection = (accountId: string) => {
        setFormData((prev) => ({
            ...prev,
            selected_account_id: accountId,
        }));

        // Clear error when account is selected
        if (errors.selected_account_id) {
            setErrors((prev) => ({
                ...prev,
                selected_account_id: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.customer_name.trim()) {
            newErrors.customer_name = 'Name is required';
        }

        if (!formData.customer_email.trim()) {
            newErrors.customer_email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customer_email)) {
            newErrors.customer_email = 'Please enter a valid email address';
        }

        if (!formData.customer_phone.trim()) {
            newErrors.customer_phone = 'Phone number is required';
        }

        if (!formData.shipping_address.trim()) {
            newErrors.shipping_address = 'Shipping address is required';
        }

        if (!formData.selected_account_id) {
            newErrors.selected_account_id = 'Please select a payment method';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order data
            const orderData = {
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                customer_phone: formData.customer_phone,
                shipping_address: formData.shipping_address,
                notes: formData.notes,
                total_amount: getTotalPrice(),
                selected_account_id: formData.selected_account_id,
                order_items: items.map((item) => ({
                    product_id: item.productId,
                    product_unit_id: parseInt(item.unitId),
                    product_name: item.productName,
                    unit_label: item.unitLabel,
                    product_price: item.pricePerUnit,
                    quantity: item.quantity,
                    subtotal: item.pricePerUnit * item.quantity,
                })),
            };

            // Submit order
            router.post(checkout(), orderData, {
                onSuccess: () => {
                    clearCart();
                    toast.success('Order placed successfully!');
                },
                onError: (errors) => {
                    console.error('Order submission error:', errors);
                    toast.error('Failed to place order. Please try again.');
                    setErrors(errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            });
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('An unexpected error occurred. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <>
            <Head title='Checkout' />
            <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
                {/* Background decoration */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>
                <div className='absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-[100px]'></div>

                <header className='sticky top-0 z-50 border-b bg-white/80 shadow-sm backdrop-blur-lg dark:bg-slate-950/80'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <Link
                                href={cart()}
                                className='flex items-center gap-2 text-emerald-600 transition-colors duration-300 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                            >
                                <ArrowLeft className='h-5 w-5' />
                                <span className='hidden font-medium sm:inline'>Back to cart</span>
                            </Link>
                            <Separator orientation='vertical' className='h-6' />
                            <div className='relative'>
                                <CreditCard className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                                <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400'></div>
                            </div>
                            <div>
                                <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                    Secure Checkout
                                </h1>
                                <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                                    <Shield className='h-3 w-3' />
                                    Protected & Encrypted
                                </p>
                            </div>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='ghost' size='icon' className='hover:bg-emerald-50 dark:hover:bg-emerald-950'>
                                <AnimatedThemeToggler />
                            </Button>
                            <Button
                                asChild
                                variant='ghost'
                                size='icon'
                                className='relative hover:bg-emerald-50 dark:hover:bg-emerald-950'
                                ripple={false}
                            >
                                <Link href={cart()}>
                                    <ShoppingCart className='h-5 w-5' />
                                    {getTotalItems() > 0 && (
                                        <span className='absolute -top-1 -right-1 z-50 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-semibold text-white shadow-lg'>
                                            {getTotalItems() > 99 ? '99+' : getTotalItems()}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className='inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-medium text-white shadow-lg ring-offset-background transition-colors hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
                                >
                                    <Sparkles className='mr-2 h-4 w-4' />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant='outline'
                                        className='border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950'
                                    >
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl'
                                    >
                                        <Link href={register()}>
                                            <Heart className='mr-2 h-4 w-4' />
                                            Join Us
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className='relative container mx-auto p-4'>
                    <form onSubmit={handleSubmit}>
                        <div className='grid gap-8 lg:grid-cols-3'>
                            {/* Customer Information */}
                            <div className='space-y-6 lg:col-span-2'>
                                <Card.Card>
                                    <Card.CardHeader>
                                        <Card.CardTitle className='flex items-center gap-2'>
                                            <User className='h-5 w-5' />
                                            Customer Information
                                        </Card.CardTitle>
                                        <Card.CardDescription>
                                            Please provide your contact information for order processing and delivery.
                                        </Card.CardDescription>
                                    </Card.CardHeader>
                                    <Card.CardContent className='space-y-4'>
                                        <div className='grid gap-4 sm:grid-cols-2'>
                                            <div className='space-y-2'>
                                                <Label htmlFor='customer_name' className='flex items-center gap-2'>
                                                    <User className='h-4 w-4' />
                                                    Full Name *
                                                </Label>
                                                <Input
                                                    id='customer_name'
                                                    name='customer_name'
                                                    value={formData.customer_name}
                                                    onChange={handleInputChange}
                                                    placeholder='Enter your full name'
                                                    className={errors.customer_name ? 'border-destructive' : ''}
                                                />
                                                {errors.customer_name && <p className='text-sm text-destructive'>{errors.customer_name}</p>}
                                            </div>
                                            <div className='space-y-2'>
                                                <Label htmlFor='customer_email' className='flex items-center gap-2'>
                                                    <Mail className='h-4 w-4' />
                                                    Email Address *
                                                </Label>
                                                <Input
                                                    id='customer_email'
                                                    name='customer_email'
                                                    type='email'
                                                    value={formData.customer_email}
                                                    onChange={handleInputChange}
                                                    placeholder='Enter your email address'
                                                    className={errors.customer_email ? 'border-destructive' : ''}
                                                />
                                                {errors.customer_email && <p className='text-sm text-destructive'>{errors.customer_email}</p>}
                                            </div>
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='customer_phone' className='flex items-center gap-2'>
                                                <Phone className='h-4 w-4' />
                                                Phone Number *
                                            </Label>
                                            <Input
                                                id='customer_phone'
                                                name='customer_phone'
                                                type='tel'
                                                value={formData.customer_phone}
                                                onChange={handleInputChange}
                                                placeholder='Enter your phone number'
                                                className={errors.customer_phone ? 'border-destructive' : ''}
                                            />
                                            {errors.customer_phone && <p className='text-sm text-destructive'>{errors.customer_phone}</p>}
                                        </div>
                                    </Card.CardContent>
                                </Card.Card>

                                <Card.Card>
                                    <Card.CardHeader>
                                        <Card.CardTitle className='flex items-center gap-2'>
                                            <MapPin className='h-5 w-5' />
                                            Shipping Information
                                        </Card.CardTitle>
                                        <Card.CardDescription>Where should we deliver your agricultural products?</Card.CardDescription>
                                    </Card.CardHeader>
                                    <Card.CardContent className='space-y-4'>
                                        <div className='space-y-2'>
                                            <Label htmlFor='shipping_address'>Shipping Address *</Label>
                                            <Textarea
                                                id='shipping_address'
                                                name='shipping_address'
                                                value={formData.shipping_address}
                                                onChange={handleInputChange}
                                                placeholder='Enter your complete shipping address...'
                                                rows={3}
                                                className={errors.shipping_address ? 'border-destructive' : ''}
                                            />
                                            {errors.shipping_address && <p className='text-sm text-destructive'>{errors.shipping_address}</p>}
                                        </div>
                                        <div className='space-y-2'>
                                            <Label htmlFor='notes'>Order Notes (Optional)</Label>
                                            <Textarea
                                                id='notes'
                                                name='notes'
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                placeholder='Any special instructions or notes for your order...'
                                                rows={2}
                                            />
                                        </div>
                                    </Card.CardContent>
                                </Card.Card>

                                <Card.Card>
                                    <Card.CardHeader>
                                        <Card.CardTitle className='flex items-center gap-2'>
                                            <CreditCard className='h-5 w-5' />
                                            Payment Method
                                        </Card.CardTitle>
                                        <Card.CardDescription>Choose your preferred payment method for this order.</Card.CardDescription>
                                    </Card.CardHeader>
                                    <Card.CardContent className='space-y-4'>
                                        <RadioGroup value={formData.selected_account_id} onValueChange={handleAccountSelection}>
                                            <div className='space-y-3'>
                                                {accounts.map((account) => {
                                                    const Icon =
                                                        account.account_type === 'bank_transfer'
                                                            ? Banknote
                                                            : account.account_type === 'e_wallet'
                                                              ? Smartphone
                                                              : Wallet;
                                                    const isSelected = formData.selected_account_id === account.id.toString();
                                                    return (
                                                        <div key={account.id} className='relative'>
                                                            <RadioGroupItem
                                                                value={account.id.toString()}
                                                                id={`account-${account.id}`}
                                                                className='sr-only'
                                                            />
                                                            <Label
                                                                htmlFor={`account-${account.id}`}
                                                                className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-muted/50 ${
                                                                    isSelected
                                                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                                                                        : 'border-border'
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                                                                    }`}
                                                                >
                                                                    {isSelected && <div className='h-2 w-2 rounded-full bg-primary-foreground' />}
                                                                </div>
                                                                <div className='flex flex-1 items-center space-x-3'>
                                                                    <Icon className='h-5 w-5 text-muted-foreground' />
                                                                    <div className='flex-1'>
                                                                        <div className='font-medium'>{account.account_name}</div>
                                                                        <p className='text-sm text-muted-foreground'>
                                                                            {account.owner_name} - {account.account_no}
                                                                        </p>
                                                                        {account.instructions && (
                                                                            <p className='mt-1 text-xs text-muted-foreground'>
                                                                                {account.instructions}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Label>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </RadioGroup>
                                        {errors.selected_account_id && <p className='text-sm text-destructive'>{errors.selected_account_id}</p>}
                                    </Card.CardContent>
                                </Card.Card>
                            </div>

                            {/* Order Summary */}
                            <div className='lg:col-span-1'>
                                <Card.Card className='sticky top-24'>
                                    <Card.CardHeader>
                                        <Card.CardTitle className='flex items-center gap-2'>
                                            <Package className='h-5 w-5' />
                                            Order Summary
                                        </Card.CardTitle>
                                    </Card.CardHeader>
                                    <Card.CardContent className='space-y-4'>
                                        <div className='space-y-3'>
                                            {items.map((item) => (
                                                <div key={item.unitId} className='flex justify-between text-sm'>
                                                    <div className='flex-1'>
                                                        <p className='font-medium'>{item.productName}</p>
                                                        <p className='text-muted-foreground'>
                                                            {item.quantity} × {formatPrice(item.pricePerUnit)} ({item.unitLabel})
                                                        </p>
                                                    </div>
                                                    <p className='font-medium'>{formatPrice(item.pricePerUnit * item.quantity)}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator />

                                        <div className='space-y-2'>
                                            <div className='flex justify-between text-sm'>
                                                <span>Subtotal ({getTotalItems()} items)</span>
                                                <span>{formatPrice(getTotalPrice())}</span>
                                            </div>
                                            <div className='flex justify-between text-sm'>
                                                <span>Shipping</span>
                                                <span className='text-muted-foreground'>Calculated after order</span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className='flex justify-between font-semibold'>
                                            <span>Total</span>
                                            <span className='text-lg'>{formatPrice(getTotalPrice())}</span>
                                        </div>

                                        <Button type='submit' className='w-full' size='lg' disabled={isSubmitting || items.length === 0}>
                                            {isSubmitting ? (
                                                <>
                                                    <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent' />
                                                    Processing Order...
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard className='mr-2 h-4 w-4' />
                                                    Place Order
                                                </>
                                            )}
                                        </Button>

                                        <p className='text-center text-xs text-muted-foreground'>
                                            By placing this order, you agree to our terms and conditions.
                                        </p>
                                    </Card.CardContent>
                                </Card.Card>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
