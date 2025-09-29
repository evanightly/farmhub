import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { cart, checkout, dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CreditCard, Mail, MapPin, Package, Phone, ShoppingCart, User } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

export default function Checkout() {
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
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/10'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <Link href={cart()} className='flex items-center gap-2 text-primary hover:text-primary/80'>
                                <ArrowLeft className='h-5 w-5' />
                                <span className='hidden sm:inline'>Back to cart</span>
                            </Link>
                            <Separator orientation='vertical' className='h-6' />
                            <CreditCard className='h-8 w-8 text-primary' />
                            <h1 className='text-2xl font-bold text-primary'>Checkout</h1>
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant='ghost' size='icon'>
                                <AnimatedThemeToggler />
                            </Button>
                            <Button asChild variant='ghost' size='icon' className='relative' ripple={false}>
                                <Link href={cart()}>
                                    <ShoppingCart className='h-5 w-5' />
                                    {getTotalItems() > 0 && (
                                        <span className='absolute -top-1 -right-1 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                                            {getTotalItems() > 99 ? '99+' : getTotalItems()}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                            {auth.user ? (
                                <Link href={dashboard()} className='btn'>
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Button asChild variant='outline'>
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register()}>Register</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main className='container mx-auto p-6'>
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
