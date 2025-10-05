import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { cart, checkout, dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, CreditCard, Heart, Leaf, Minus, Package, Plus, ShoppingCart, Sparkles, Star, Trash2 } from 'lucide-react';

export default function Cart() {
    const { auth } = usePage<SharedData>().props;
    const { items, updateQuantity, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(price);
    };

    const handleQuantityChange = (unitId: string, newQuantity: string) => {
        const quantity = parseInt(newQuantity) || 0;
        updateQuantity(unitId, quantity);
    };

    return (
        <>
            <Head title='Shopping Cart' />
            <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
                {/* Background decoration */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>
                <div className='absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-[100px]'></div>

                <header className='sticky top-0 z-50 border-b bg-white/80 shadow-sm backdrop-blur-lg dark:bg-slate-950/80'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <Link
                                href={home()}
                                className='flex items-center gap-2 text-emerald-600 transition-colors duration-300 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
                            >
                                <ArrowLeft className='h-5 w-5' />
                                <span className='hidden font-medium sm:inline'>Back to catalog</span>
                            </Link>
                            <Separator orientation='vertical' className='h-6' />
                            <div className='relative'>
                                <Leaf className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                                <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400'></div>
                            </div>
                            <div>
                                <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                    Shopping Cart
                                </h1>
                                <p className='text-xs text-muted-foreground'>Premium Agricultural Products</p>
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

                <main className='relative container mx-auto p-6'>
                    {items.length > 0 ? (
                        <div className='grid gap-8 lg:grid-cols-3'>
                            {/* Cart Items */}
                            <div className='lg:col-span-2'>
                                <div className='mb-8 flex items-center justify-between'>
                                    <div>
                                        <h2 className='bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold text-transparent dark:from-slate-100 dark:to-slate-400'>
                                            Your Cart
                                        </h2>
                                        <p className='mt-1 text-slate-600 dark:text-slate-400'>{getTotalItems()} premium items ready for checkout</p>
                                    </div>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={clearCart}
                                        className='border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300'
                                    >
                                        <Trash2 className='mr-2 h-4 w-4' />
                                        Clear cart
                                    </Button>
                                </div>

                                <div className='space-y-6'>
                                    {items.map((item) => (
                                        <Card.Card key={item.unitId} variant='agricultural-glass' className='group overflow-hidden'>
                                            <Card.CardContent className='p-6'>
                                                <div className='flex gap-6'>
                                                    {/* Product Image */}
                                                    <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 shadow-lg dark:from-emerald-950 dark:to-teal-950'>
                                                        {item.productImage ? (
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-110'
                                                            />
                                                        ) : (
                                                            <div className='flex h-full w-full items-center justify-center'>
                                                                <Package className='h-8 w-8 text-slate-400 dark:text-slate-600' />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className='flex-1'>
                                                        <div className='flex items-start justify-between'>
                                                            <div className='space-y-2'>
                                                                <h3 className='text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400'>
                                                                    {item.productName}
                                                                </h3>
                                                                <Badge className='border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'>
                                                                    <Star className='mr-1 h-3 w-3' />
                                                                    {item.unitLabel}
                                                                </Badge>
                                                                <p className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                                                    {formatPrice(item.pricePerUnit)}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                variant='ghost'
                                                                size='icon'
                                                                onClick={() => removeFromCart(item.unitId)}
                                                                className='h-10 w-10 text-slate-400 transition-colors duration-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400'
                                                            >
                                                                <Trash2 className='h-5 w-5' />
                                                            </Button>
                                                        </div>

                                                        <div className='mt-6 flex items-center justify-between'>
                                                            {/* Quantity Controls */}
                                                            <div className='flex items-center gap-3'>
                                                                <Button
                                                                    variant='outline'
                                                                    size='icon'
                                                                    className='h-10 w-10 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950'
                                                                    onClick={() => updateQuantity(item.unitId, item.quantity - 1)}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus className='h-4 w-4' />
                                                                </Button>
                                                                <Input
                                                                    type='number'
                                                                    min='1'
                                                                    max={item.stockQuantity}
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleQuantityChange(item.unitId, e.target.value)}
                                                                    className='h-10 w-20 border-emerald-200 text-center font-semibold focus:border-emerald-500 dark:border-emerald-800 dark:focus:border-emerald-400'
                                                                />
                                                                <Button
                                                                    variant='outline'
                                                                    size='icon'
                                                                    className='h-10 w-10 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950'
                                                                    onClick={() => updateQuantity(item.unitId, item.quantity + 1)}
                                                                    disabled={item.quantity >= item.stockQuantity}
                                                                >
                                                                    <Plus className='h-4 w-4' />
                                                                </Button>
                                                            </div>

                                                            {/* Subtotal */}
                                                            <div className='space-y-1 text-right'>
                                                                <p className='text-sm text-slate-500 dark:text-slate-400'>Subtotal</p>
                                                                <p className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                                                    {formatPrice(item.pricePerUnit * item.quantity)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Stock Warning */}
                                                        {item.quantity >= item.stockQuantity && (
                                                            <div className='mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950'>
                                                                <p className='text-sm font-medium text-yellow-700 dark:text-yellow-300'>
                                                                    ⚠️ Maximum stock reached ({item.stockQuantity} available)
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card.CardContent>
                                        </Card.Card>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className='lg:col-span-1'>
                                <Card.Card variant='agricultural-glass' className='sticky top-24'>
                                    <Card.CardHeader className='pb-4'>
                                        <Card.CardTitle className='flex items-center gap-3 text-2xl'>
                                            <div className='relative'>
                                                <CreditCard className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                                                <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400'></div>
                                            </div>
                                            <span className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                                Order Summary
                                            </span>
                                        </Card.CardTitle>
                                    </Card.CardHeader>
                                    <Card.CardContent className='space-y-6'>
                                        <div className='space-y-4'>
                                            <div className='flex items-center justify-between rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950'>
                                                <span className='font-medium text-emerald-700 dark:text-emerald-300'>Items ({getTotalItems()})</span>
                                                <span className='font-bold text-emerald-800 dark:text-emerald-200'>
                                                    {formatPrice(getTotalPrice())}
                                                </span>
                                            </div>
                                            <div className='flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-950'>
                                                <span className='font-medium text-blue-700 dark:text-blue-300'>Shipping</span>
                                                <span className='font-medium text-blue-600 dark:text-blue-400'>Calculated at checkout</span>
                                            </div>
                                        </div>
                                        <Separator className='h-px bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800' />
                                        <div className='flex items-center justify-between rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 dark:border-emerald-800 dark:from-emerald-950 dark:to-teal-950'>
                                            <span className='text-xl font-bold text-slate-900 dark:text-slate-100'>Total</span>
                                            <span className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                                {formatPrice(getTotalPrice())}
                                            </span>
                                        </div>
                                    </Card.CardContent>
                                    <Card.CardFooter className='flex flex-col gap-4 pt-6'>
                                        <Button
                                            asChild
                                            className='h-12 w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl'
                                            size='lg'
                                        >
                                            <Link href={checkout()}>
                                                <CheckCircle className='mr-2 h-5 w-5' />
                                                Proceed to Checkout
                                            </Link>
                                        </Button>
                                        <Button
                                            variant='outline'
                                            className='h-12 w-full border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950'
                                            asChild
                                        >
                                            <Link href={home()}>
                                                <Sparkles className='mr-2 h-4 w-4' />
                                                Continue Shopping
                                            </Link>
                                        </Button>
                                    </Card.CardFooter>
                                </Card.Card>
                            </div>
                        </div>
                    ) : (
                        /* Empty Cart */
                        <div className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
                            <div className='relative mb-8'>
                                <ShoppingCart className='h-24 w-24 text-slate-400 dark:text-slate-600' />
                                <div className='absolute -top-2 -right-2 h-8 w-8 animate-ping rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-60'></div>
                            </div>
                            <h2 className='mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100'>Your cart is empty</h2>
                            <p className='mb-8 max-w-md leading-relaxed text-slate-600 dark:text-slate-400'>
                                Looks like you haven't added any premium agricultural products to your cart yet. Start exploring our fresh collection!
                            </p>
                            <Button
                                asChild
                                size='lg'
                                className='bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl'
                            >
                                <Link href={home()}>
                                    <Leaf className='mr-2 h-5 w-5' />
                                    Discover Fresh Products
                                </Link>
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
