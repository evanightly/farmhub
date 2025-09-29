import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { cart, checkout, dashboard, home, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Leaf, Minus, Package, Plus, ShoppingCart, Trash2 } from 'lucide-react';

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
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/10'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <Link href={home()} className='flex items-center gap-2 text-primary hover:text-primary/80'>
                                <ArrowLeft className='h-5 w-5' />
                                <span className='hidden sm:inline'>Back to catalog</span>
                            </Link>
                            <Separator orientation='vertical' className='h-6' />
                            <Leaf className='h-8 w-8 text-primary' />
                            <h1 className='text-2xl font-bold text-primary'>Cart</h1>
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
                    {items.length > 0 ? (
                        <div className='grid gap-8 lg:grid-cols-3'>
                            {/* Cart Items */}
                            <div className='lg:col-span-2'>
                                <div className='mb-6 flex items-center justify-between'>
                                    <h2 className='text-2xl font-semibold'>Your Cart ({getTotalItems()} items)</h2>
                                    <Button variant='outline' size='sm' onClick={clearCart} className='text-destructive hover:text-destructive'>
                                        <Trash2 className='mr-2 h-4 w-4' />
                                        Clear cart
                                    </Button>
                                </div>

                                <div className='space-y-4'>
                                    {items.map((item) => (
                                        <Card.Card key={item.unitId} className='overflow-hidden'>
                                            <Card.CardContent className='p-4'>
                                                <div className='flex gap-4'>
                                                    {/* Product Image */}
                                                    <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-accent/20 to-primary/10'>
                                                        {item.productImage ? (
                                                            <img
                                                                src={item.productImage}
                                                                alt={item.productName}
                                                                className='h-full w-full object-cover'
                                                            />
                                                        ) : (
                                                            <div className='flex h-full w-full items-center justify-center'>
                                                                <Package className='h-8 w-8 text-muted-foreground' />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className='flex-1'>
                                                        <div className='flex items-start justify-between'>
                                                            <div>
                                                                <h3 className='text-lg font-semibold'>{item.productName}</h3>
                                                                <p className='text-sm text-muted-foreground'>{item.unitLabel}</p>
                                                                <p className='text-lg font-bold text-primary'>{formatPrice(item.pricePerUnit)}</p>
                                                            </div>
                                                            <Button
                                                                variant='ghost'
                                                                size='icon'
                                                                onClick={() => removeFromCart(item.unitId)}
                                                                className='h-8 w-8 text-muted-foreground hover:text-destructive'
                                                            >
                                                                <Trash2 className='h-4 w-4' />
                                                            </Button>
                                                        </div>

                                                        <div className='mt-4 flex items-center justify-between'>
                                                            {/* Quantity Controls */}
                                                            <div className='flex items-center gap-2'>
                                                                <Button
                                                                    variant='outline'
                                                                    size='icon'
                                                                    className='h-8 w-8'
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
                                                                    className='h-8 w-16 text-center'
                                                                />
                                                                <Button
                                                                    variant='outline'
                                                                    size='icon'
                                                                    className='h-8 w-8'
                                                                    onClick={() => updateQuantity(item.unitId, item.quantity + 1)}
                                                                    disabled={item.quantity >= item.stockQuantity}
                                                                >
                                                                    <Plus className='h-4 w-4' />
                                                                </Button>
                                                            </div>

                                                            {/* Subtotal */}
                                                            <div className='text-right'>
                                                                <p className='text-sm text-muted-foreground'>Subtotal</p>
                                                                <p className='text-lg font-bold'>{formatPrice(item.pricePerUnit * item.quantity)}</p>
                                                            </div>
                                                        </div>

                                                        {/* Stock Warning */}
                                                        {item.quantity >= item.stockQuantity && (
                                                            <p className='mt-2 text-sm text-yellow-600 dark:text-yellow-400'>
                                                                Maximum stock reached ({item.stockQuantity} available)
                                                            </p>
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
                                <Card.Card className='sticky top-24'>
                                    <Card.CardHeader>
                                        <Card.CardTitle>Order Summary</Card.CardTitle>
                                    </Card.CardHeader>
                                    <Card.CardContent className='space-y-4'>
                                        <div className='flex justify-between'>
                                            <span>Items ({getTotalItems()})</span>
                                            <span>{formatPrice(getTotalPrice())}</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span>Shipping</span>
                                            <span className='text-muted-foreground'>Calculated at checkout</span>
                                        </div>
                                        <Separator />
                                        <div className='flex justify-between text-lg font-bold'>
                                            <span>Total</span>
                                            <span>{formatPrice(getTotalPrice())}</span>
                                        </div>
                                    </Card.CardContent>
                                    <Card.CardFooter className='flex flex-col gap-2'>
                                        <Button asChild className='w-full' size='lg'>
                                            <Link href={checkout()}>Proceed to Checkout</Link>
                                        </Button>
                                        <Button variant='outline' className='w-full' asChild>
                                            <Link href={home()}>Continue Shopping</Link>
                                        </Button>
                                    </Card.CardFooter>
                                </Card.Card>
                            </div>
                        </div>
                    ) : (
                        /* Empty Cart */
                        <div className='flex min-h-[60vh] flex-col items-center justify-center text-center'>
                            <ShoppingCart className='mb-4 h-24 w-24 text-muted-foreground' />
                            <h2 className='mb-2 text-2xl font-semibold'>Your cart is empty</h2>
                            <p className='mb-6 max-w-md text-muted-foreground'>
                                Looks like you haven't added any agricultural products to your cart yet. Start shopping to fill it up!
                            </p>
                            <Button asChild size='lg'>
                                <Link href={home()}>
                                    <Leaf className='mr-2 h-5 w-5' />
                                    Browse Products
                                </Link>
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
