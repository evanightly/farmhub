import ProductController from '@/actions/App/Http/Controllers/ProductController';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button, buttonVariants } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import * as Dialog from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios';
import { Leaf, Package, Plus, ShoppingCart } from 'lucide-react';
import React from 'react';

export default function Welcome() {
    const { auth, name } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [products, setProducts] = React.useState<App.Data.ProductData[]>([]);
    const [cart, setCart] = React.useState<{ [key: string]: number }>({});

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const addToCart = (unitId: string) => {
        setCart((prev) => ({
            ...prev,
            [unitId]: (prev[unitId] || 0) + 1,
        }));
    };

    const getCartCount = () => {
        return Object.values(cart).reduce((sum, count) => sum + count, 0);
    };

    React.useEffect(() => {
        axios
            .get(
                ProductController.index(
                    debouncedSearchTerm.length > 0
                        ? {
                              query: {
                                  filter: {
                                      search: debouncedSearchTerm,
                                  },
                              },
                          }
                        : {},
                ).url,
            )
            .then((response) => {
                setProducts(response.data.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, [debouncedSearchTerm]);

    return (
        <>
            <Head title='Welcome'>
                <link rel='preconnect' href='https://fonts.bunny.net' />
                <link href='https://fonts.bunny.net/css?family=instrument-sans:400,500,600' rel='stylesheet' />
            </Head>
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-accent/10'>
                <header className='sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <Leaf className='h-8 w-8 text-primary' />
                            <h1 className='text-2xl font-bold text-primary'>{name}</h1>
                        </div>
                        <div className='mx-6 flex max-w-md flex-1'>
                            <Input
                                type='text'
                                placeholder='Search fresh products...'
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                className='w-full'
                            />
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant={'ghost'} size={'icon'}>
                                <AnimatedThemeToggler />
                            </Button>
                            <Button variant={'ghost'} size={'icon'} className='relative' ripple={false}>
                                <ShoppingCart className='h-5 w-5' />
                                {getCartCount() > 0 && (
                                    <span className='absolute -top-1 -right-1 z-50 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
                                        {getCartCount()}
                                    </span>
                                )}
                            </Button>
                            {auth.user ? (
                                <Link href={dashboard()} className={buttonVariants()}>
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Button asChild variant={'outline'}>
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
                    {products.length > 0 ? (
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} onAddToCart={addToCart} cartItems={cart} />
                            ))}
                        </div>
                    ) : (
                        <div className='flex min-h-[400px] flex-col items-center justify-center text-center'>
                            <Package className='mb-4 h-16 w-16 text-muted-foreground' />
                            <h3 className='mb-2 text-lg font-semibold text-foreground'>No products found</h3>
                            <p className='max-w-md text-muted-foreground'>
                                {searchTerm
                                    ? `No products match "${searchTerm}". Try adjusting your search.`
                                    : 'No products are currently available. Check back later for fresh agricultural products.'}
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

const ProductCard = ({
    product,
    onAddToCart,
    cartItems,
}: {
    product: App.Data.ProductData;
    onAddToCart: (unitId: string) => void;
    cartItems: { [key: string]: number };
}) => {
    const primaryImage = product.product_images?.find((img) => img.is_primary) || product.product_images?.[0];
    const [selectedUnit, setSelectedUnit] = React.useState(product.product_units?.[0]?.id?.toString() || '');

    const selectedUnitData = product.product_units?.find((unit) => unit.id.toString() === selectedUnit);

    return (
        <Card.Card className='group overflow-hidden border-0 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
            <div className='relative overflow-hidden'>
                {primaryImage ? (
                    <Dialog.Dialog>
                        <Dialog.DialogTrigger asChild>
                            <div className='aspect-square w-full cursor-pointer overflow-hidden bg-gradient-to-br from-accent/20 to-primary/10'>
                                <img
                                    src={primaryImage.url || ''}
                                    alt={primaryImage.alt_text || product.name || 'Product Image'}
                                    className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                                />
                            </div>
                        </Dialog.DialogTrigger>
                        <Dialog.DialogContent className='max-w-4xl'>
                            <Dialog.DialogHeader>
                                <Dialog.DialogTitle className='flex items-center gap-2'>
                                    <Leaf className='h-5 w-5 text-primary' />
                                    {product.name}
                                </Dialog.DialogTitle>
                                <Dialog.DialogDescription>Product Gallery</Dialog.DialogDescription>
                            </Dialog.DialogHeader>
                            <div className='grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-2 lg:grid-cols-3'>
                                {product.product_images?.map((img) => (
                                    <div key={img.id} className='aspect-square w-full overflow-hidden rounded-lg'>
                                        <img src={img.url || ''} alt={img.alt_text || 'Product Image'} className='h-full w-full object-cover' />
                                    </div>
                                ))}
                            </div>
                        </Dialog.DialogContent>
                    </Dialog.Dialog>
                ) : (
                    <div className='flex aspect-square w-full items-center justify-center bg-gradient-to-br from-accent/20 to-primary/10'>
                        <div className='text-center'>
                            <Package className='mx-auto mb-2 h-12 w-12 text-muted-foreground' />
                            <span className='text-sm text-muted-foreground'>No Image</span>
                        </div>
                    </div>
                )}

                {/* Quick add button overlay */}
                <div className='absolute top-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <Button
                        size='sm'
                        className='h-8 w-8 rounded-full shadow-lg'
                        onClick={() => selectedUnitData && onAddToCart(selectedUnitData.id.toString())}
                        disabled={!selectedUnitData || (selectedUnitData.stock_quantity || 0) === 0}
                    >
                        <Plus className='h-4 w-4' />
                    </Button>
                </div>
            </div>

            <Card.CardContent className='p-4'>
                <div className='mb-3'>
                    <h3 className='mb-1 text-lg leading-tight font-semibold text-foreground'>{product.name}</h3>
                    <p className='line-clamp-2 text-sm text-muted-foreground'>{product.description}</p>
                </div>

                {product.product_units && product.product_units.length > 0 && (
                    <div className='space-y-3'>
                        {/* Unit selector */}
                        {product.product_units.length > 1 && (
                            <div className='flex flex-wrap gap-1'>
                                {product.product_units.map((unit) => (
                                    <button
                                        key={unit.id}
                                        onClick={() => setSelectedUnit(unit.id.toString())}
                                        className={`rounded-full border px-2 py-1 text-xs transition-colors ${
                                            selectedUnit === unit.id.toString()
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border bg-background text-foreground hover:bg-accent'
                                        }`}
                                    >
                                        {unit.unit_type}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Selected unit details */}
                        {selectedUnitData && (
                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-lg font-bold text-primary'>\${selectedUnitData.price_per_unit}</span>
                                    <span
                                        className={`rounded-full px-2 py-1 text-sm font-medium ${
                                            (selectedUnitData.stock_quantity || 0) > 10
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : (selectedUnitData.stock_quantity || 0) > 0
                                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                    >
                                        {(selectedUnitData.stock_quantity || 0) > 0
                                            ? `${selectedUnitData.stock_quantity || 0} in stock`
                                            : 'Out of stock'}
                                    </span>
                                </div>

                                <div className='flex items-center justify-between gap-2'>
                                    <div className='text-sm text-muted-foreground'>per {selectedUnitData.unit_type}</div>
                                    <Button
                                        size='sm'
                                        onClick={() => onAddToCart(selectedUnitData.id.toString())}
                                        disabled={(selectedUnitData.stock_quantity || 0) === 0}
                                        className='flex-shrink-0'
                                    >
                                        <Plus className='mr-1 h-4 w-4' />
                                        Add {(cartItems[selectedUnitData.id.toString()] || 0) > 0 && `(${cartItems[selectedUnitData.id.toString()]})`}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card.CardContent>
        </Card.Card>
    );
};
