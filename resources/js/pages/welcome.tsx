import ProductController from '@/actions/App/Http/Controllers/ProductController';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import * as Dialog from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { cart, dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios';
import { Calendar, Clock, Eye, Heart, Leaf, Package, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import React from 'react';

export default function Welcome() {
    const { auth, name } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [products, setProducts] = React.useState<App.Data.ProductData[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { getTotalItems } = useCart();

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    React.useEffect(() => {
        setIsLoading(true);
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
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [debouncedSearchTerm]);

    return (
        <>
            <Head title='Welcome'>
                <link rel='preconnect' href='https://fonts.bunny.net' />
                <link href='https://fonts.bunny.net/css?family=instrument-sans:400,500,600' rel='stylesheet' />
            </Head>
            <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950'>
                {/* Background decoration */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]'></div>
                <div className='absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-[100px]'></div>

                <header className='sticky top-0 z-50 border-b bg-white/80 shadow-sm backdrop-blur-lg dark:bg-slate-950/80'>
                    <div className='container mx-auto flex items-center justify-between p-4'>
                        <div className='flex items-center gap-3'>
                            <div className='relative'>
                                <Leaf className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
                                <div className='absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-emerald-400'></div>
                            </div>
                            <div>
                                <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                    {name}
                                </h1>
                                <p className='text-xs text-muted-foreground'>Fresh & Premium Agricultural Products</p>
                            </div>
                        </div>
                        <div className='relative mx-6 flex max-w-md flex-1'>
                            <Input
                                type='text'
                                placeholder='🔍 Discover fresh products...'
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                className='w-full border-slate-200 bg-white/60 backdrop-blur-sm transition-all duration-300 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800/60 dark:focus:border-emerald-400'
                            />
                        </div>
                        <nav className='flex items-center gap-3'>
                            <Button asChild variant={'ghost'} size={'icon'} className='hover:bg-emerald-50 dark:hover:bg-emerald-950'>
                                <AnimatedThemeToggler />
                            </Button>
                            <Button
                                asChild
                                variant={'ghost'}
                                size={'icon'}
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
                                    className={buttonVariants({
                                        className:
                                            'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl',
                                    })}
                                >
                                    <Sparkles className='mr-2 h-4 w-4' />
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Button
                                        asChild
                                        variant={'outline'}
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
                    {isLoading ? (
                        <div className='flex min-h-[500px] flex-col items-center justify-center text-center'>
                            <div className='relative mb-6'>
                                <div className='h-20 w-20 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600 dark:border-emerald-800 dark:border-t-emerald-400'></div>
                            </div>
                            <h3 className='mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100'>Loading products...</h3>
                            <p className='max-w-md leading-relaxed text-slate-600 dark:text-slate-400'>
                                Please wait while we fetch the freshest agricultural products for you.
                            </p>
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className='mb-8 text-center'>
                                <h2 className='mb-2 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-3xl font-bold text-transparent dark:from-slate-100 dark:to-slate-400'>
                                    Fresh From Farm to Table
                                </h2>
                                <p className='mx-auto max-w-2xl text-slate-600 dark:text-slate-400'>
                                    Discover premium agricultural products handpicked for quality and freshness. Supporting local farmers and
                                    sustainable farming practices.
                                </p>
                            </div>
                            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className='flex min-h-[500px] flex-col items-center justify-center text-center'>
                            <div className='relative mb-6'>
                                <Package className='h-20 w-20 text-slate-400 dark:text-slate-600' />
                                <div className='absolute -top-2 -right-2 h-6 w-6 animate-ping rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-60'></div>
                            </div>
                            <h3 className='mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100'>No products found</h3>
                            <p className='max-w-md leading-relaxed text-slate-600 dark:text-slate-400'>
                                {searchTerm
                                    ? `No products match "${searchTerm}". Try adjusting your search to discover amazing agricultural products.`
                                    : 'No products are currently available. Check back later for fresh agricultural products from our trusted farmers.'}
                            </p>
                            {!searchTerm && (
                                <Button
                                    className='mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:from-emerald-600 hover:to-teal-600'
                                    onClick={() => router.reload()}
                                >
                                    <Sparkles className='mr-2 h-4 w-4' />
                                    Refresh Products
                                </Button>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

const ProductCard = ({ product }: { product: App.Data.ProductData }) => {
    const primaryImage = product.product_images?.find((img) => img.is_primary) || product.product_images?.[0];
    const [selectedUnit, setSelectedUnit] = React.useState(product.product_units?.[0]?.id?.toString() || '');
    const [isHovered, setIsHovered] = React.useState(false);
    const [dialogCurrentImageIndex, setDialogCurrentImageIndex] = React.useState(0);
    const { addToCart, getItemQuantity } = useCart();

    const selectedUnitData = product.product_units?.find((unit) => unit.id.toString() === selectedUnit);
    const hasMultipleImages = (product.product_images?.length || 0) > 1;

    // Calculate freshness status
    const getFreshnessStatus = () => {
        if (!product.harvest_date || !product.expiry_date) return null;

        const harvestDate = new Date(product.harvest_date);
        const expiryDate = new Date(product.expiry_date);
        const today = new Date();
        const daysFromHarvest = (today.getTime() - harvestDate.getTime()) / (1000 * 3600 * 24);
        const daysToExpiry = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

        if (daysToExpiry < 0) return { status: 'expired', color: 'red', text: 'Expired' };
        if (daysToExpiry <= 3) return { status: 'urgent', color: 'orange', text: `${Math.ceil(daysToExpiry)} days left` };
        if (daysFromHarvest <= 2) return { status: 'fresh', color: 'green', text: 'Just harvested!' };
        if (daysToExpiry <= 7) return { status: 'good', color: 'yellow', text: `${Math.ceil(daysToExpiry)} days left` };
        return { status: 'excellent', color: 'emerald', text: 'Fresh' };
    };

    const freshnessStatus = getFreshnessStatus();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleAddToCart = () => {
        if (!selectedUnitData) return;

        addToCart({
            unitId: selectedUnitData.id.toString(),
            productId: product.id,
            productName: product.name || '',
            unitType: selectedUnitData.unit_type || '',
            unitLabel: selectedUnitData.unit_label || selectedUnitData.unit_type || '',
            pricePerUnit: selectedUnitData.price_per_unit || 0,
            stockQuantity: selectedUnitData.stock_quantity || 0,
            productImage: primaryImage?.url || undefined,
        });
    };

    return (
        <Card.Card
            className='group relative overflow-hidden border-0 bg-white/60 p-0 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 dark:bg-slate-900/60 dark:hover:shadow-emerald-400/20'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Magic card spotlight effect */}
            <div
                className='absolute inset-0 -skew-x-12 transform bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:translate-x-full group-hover:opacity-100'
                style={{
                    background: `linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent)`,
                    transform: isHovered ? 'translateX(100%) skewX(-12deg)' : 'translateX(-100%) skewX(-12deg)',
                    transition: 'transform 1000ms ease-in-out',
                }}
            />

            {/* Status badges */}
            <div className='absolute top-3 left-3 z-20 flex flex-col gap-2'>
                {freshnessStatus && (
                    <Badge
                        className={`text-xs font-semibold shadow-lg backdrop-blur-sm ${
                            freshnessStatus.color === 'green'
                                ? 'border-emerald-400 bg-emerald-500/90 text-white'
                                : freshnessStatus.color === 'emerald'
                                  ? 'border-emerald-400 bg-emerald-500/90 text-white'
                                  : freshnessStatus.color === 'yellow'
                                    ? 'border-yellow-400 bg-yellow-500/90 text-white'
                                    : freshnessStatus.color === 'orange'
                                      ? 'border-orange-400 bg-orange-500/90 text-white'
                                      : 'border-red-400 bg-red-500/90 text-white'
                        }`}
                    >
                        {freshnessStatus.text}
                    </Badge>
                )}
                {(selectedUnitData?.stock_quantity || 0) <= 5 && (selectedUnitData?.stock_quantity || 0) > 0 && (
                    <Badge className='border-orange-400 bg-orange-500/90 text-xs text-white shadow-lg backdrop-blur-sm'>
                        <Clock className='mr-1 h-3 w-3' />
                        Low Stock
                    </Badge>
                )}
            </div>

            {/* Product Image */}
            <div className='relative overflow-hidden'>
                {product.product_images && product.product_images.length > 0 ? (
                    <Dialog.Dialog>
                        <Dialog.DialogTrigger asChild>
                            <div className='group/image relative aspect-square w-full cursor-pointer overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950 dark:to-teal-950'>
                                <img
                                    src={primaryImage?.url || ''}
                                    alt={primaryImage?.alt_text || product.name || 'Product Image'}
                                    className='h-full w-full object-cover transition-all duration-700 group-hover/image:scale-110 group-hover/image:rotate-1'
                                />

                                {/* Image overlay on hover */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/image:opacity-100' />
                                <div className='absolute right-3 bottom-3 left-3 translate-y-2 transform opacity-0 transition-all duration-300 group-hover/image:translate-y-0 group-hover/image:opacity-100'>
                                    <div className='flex items-center gap-2 text-sm font-medium text-white'>
                                        <Eye className='h-4 w-4' />
                                        <span>{hasMultipleImages ? `View Gallery (${product.product_images.length})` : 'View Image'}</span>
                                    </div>
                                </div>
                            </div>
                        </Dialog.DialogTrigger>
                        <Dialog.DialogContent className='max-h-[85dvh] border-emerald-200 bg-white/95 backdrop-blur-lg dark:border-emerald-800 dark:bg-slate-900/95'>
                            <Dialog.DialogHeader>
                                <Dialog.DialogTitle className='flex items-center gap-3 text-2xl'>
                                    <Leaf className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                                    <span className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                        {product.name}
                                    </span>
                                </Dialog.DialogTitle>
                                <Dialog.DialogDescription className='text-slate-600 dark:text-slate-400'>
                                    {hasMultipleImages ? `Image gallery with ${product.product_images.length} photos` : 'Product image'}
                                </Dialog.DialogDescription>
                            </Dialog.DialogHeader>

                            <div>
                                {hasMultipleImages ? (
                                    <div className='flex flex-col gap-4'>
                                        {/* Main carousel */}
                                        <div className='relative'>
                                            <Carousel
                                                className='w-full'
                                                opts={{
                                                    startIndex: dialogCurrentImageIndex,
                                                    loop: true,
                                                }}
                                                setApi={(api) => {
                                                    if (api) {
                                                        api.on('select', () => {
                                                            setDialogCurrentImageIndex(api.selectedScrollSnap());
                                                        });
                                                    }
                                                }}
                                            >
                                                <CarouselContent>
                                                    {product.product_images.map((img, index) => (
                                                        <CarouselItem key={img.id}>
                                                            <div className='flex flex-col items-center space-y-4'>
                                                                <div className='aspect-square w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg'>
                                                                    <img
                                                                        src={img.url || ''}
                                                                        alt={img.alt_text || `${product.name} - Image ${index + 1}`}
                                                                        className='h-full w-full object-cover'
                                                                    />
                                                                </div>
                                                                {/* Alt text display */}
                                                                {img.alt_text && (
                                                                    <div className='rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-800'>
                                                                        <p className='text-sm text-slate-600 italic dark:text-slate-400'>
                                                                            {img.alt_text}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className={buttonVariants()} />
                                                <CarouselNext className={buttonVariants()} />
                                            </Carousel>
                                        </div>

                                        {/* Thumbnail carousel */}
                                        <div className='flex justify-center'>
                                            <div className='flex flex-wrap gap-2 rounded-lg bg-slate-100 p-2 dark:bg-slate-800'>
                                                {product.product_images.map((img, index) => (
                                                    <button
                                                        key={img.id}
                                                        onClick={() => setDialogCurrentImageIndex(index)}
                                                        className={`size-16 rounded-lg border-2 transition-all duration-200 ${
                                                            index === dialogCurrentImageIndex
                                                                ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800'
                                                                : 'border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500'
                                                        }`}
                                                    >
                                                        <img
                                                            src={img.url || ''}
                                                            alt={img.alt_text || `Thumbnail ${index + 1}`}
                                                            className='h-full w-full rounded-md object-cover'
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center space-y-4'>
                                        <div className='aspect-square w-full max-w-2xl overflow-hidden rounded-2xl shadow-lg'>
                                            <img
                                                src={primaryImage?.url || ''}
                                                alt={primaryImage?.alt_text || product.name || 'Product Image'}
                                                className='h-full w-full object-cover'
                                            />
                                        </div>
                                        {/* Alt text display for single image */}
                                        {primaryImage?.alt_text && (
                                            <div className='rounded-lg bg-slate-100 px-4 py-2 dark:bg-slate-800'>
                                                <p className='text-sm text-slate-600 italic dark:text-slate-400'>{primaryImage.alt_text}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Dialog.DialogContent>
                    </Dialog.Dialog>
                ) : (
                    <div className='flex aspect-square w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900'>
                        <div className='text-center'>
                            <Package className='mx-auto mb-3 h-16 w-16 text-slate-400 dark:text-slate-600' />
                            <span className='text-sm font-medium text-slate-500 dark:text-slate-400'>No Image Available</span>
                        </div>
                    </div>
                )}

                {/* Quick add button overlay */}
                <div className={`absolute top-3 right-3 transition-all duration-300 ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                    <Button
                        size='sm'
                        className='h-10 w-10 rounded-full border-2 border-white/50 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl backdrop-blur-sm hover:from-emerald-600 hover:to-teal-600'
                        onClick={handleAddToCart}
                        disabled={!selectedUnitData || (selectedUnitData.stock_quantity || 0) === 0}
                    >
                        <Plus className='h-5 w-5' />
                    </Button>
                </div>
            </div>

            <Card.CardContent className='space-y-4 p-6'>
                {/* Product Info */}
                <div className='space-y-2'>
                    <h3 className='line-clamp-1 text-xl leading-tight font-bold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400'>
                        {product.name}
                    </h3>
                    <p className='line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400'>{product.description}</p>
                </div>

                {/* Date Information */}
                <div className='grid grid-cols-2 gap-3'>
                    {product.harvest_date && (
                        <div className='flex items-center gap-2 rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950'>
                            <Calendar className='h-4 w-4 flex-shrink-0 text-emerald-600 dark:text-emerald-400' />
                            <div className='min-w-0'>
                                <p className='text-xs font-medium text-emerald-700 dark:text-emerald-300'>Harvested</p>
                                <p className='truncate text-xs text-emerald-600 dark:text-emerald-400'>{formatDate(product.harvest_date)}</p>
                            </div>
                        </div>
                    )}
                    {product.expiry_date && (
                        <div className='flex items-center gap-2 rounded-lg bg-orange-50 p-2 dark:bg-orange-950'>
                            <Clock className='h-4 w-4 flex-shrink-0 text-orange-600 dark:text-orange-400' />
                            <div className='min-w-0'>
                                <p className='text-xs font-medium text-orange-700 dark:text-orange-300'>Best Before</p>
                                <p className='truncate text-xs text-orange-600 dark:text-orange-400'>{formatDate(product.expiry_date)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Units and Pricing */}
                {product.product_units && product.product_units.length > 0 && (
                    <div className='space-y-4'>
                        {/* Unit selector */}
                        {product.product_units.length > 1 && (
                            <div className='flex flex-wrap gap-2'>
                                {product.product_units.map((unit) => (
                                    <button
                                        key={unit.id}
                                        onClick={() => setSelectedUnit(unit.id.toString())}
                                        className={`rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                            selectedUnit === unit.id.toString()
                                                ? 'scale-105 border-emerald-500 bg-emerald-500 text-white shadow-lg'
                                                : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-emerald-950'
                                        }`}
                                    >
                                        {unit.unit_type}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Selected unit details */}
                        {selectedUnitData && (
                            <div className='space-y-3'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <span className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-400'>
                                            ${selectedUnitData.price_per_unit}
                                        </span>
                                        <span className='ml-1 text-sm text-slate-500 dark:text-slate-400'>/ {selectedUnitData.unit_type}</span>
                                    </div>
                                    <Badge
                                        className={`font-semibold shadow-sm ${
                                            (selectedUnitData.stock_quantity || 0) > 10
                                                ? 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                                : (selectedUnitData.stock_quantity || 0) > 0
                                                  ? 'border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                  : 'border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}
                                    >
                                        {(selectedUnitData.stock_quantity || 0) > 0 ? `${selectedUnitData.stock_quantity} in stock` : 'Out of stock'}
                                    </Badge>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    disabled={(selectedUnitData.stock_quantity || 0) === 0}
                                    className='w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transition-all duration-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl disabled:from-slate-300 disabled:to-slate-400 disabled:text-slate-500'
                                >
                                    <Plus className='mr-2 h-4 w-4' />
                                    Add to Cart
                                    {getItemQuantity(selectedUnitData.id.toString()) > 0 && (
                                        <span className='ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold'>
                                            {getItemQuantity(selectedUnitData.id.toString())}
                                        </span>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card.CardContent>
        </Card.Card>
    );
};
