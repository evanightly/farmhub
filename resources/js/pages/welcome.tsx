import ProductController from '@/actions/App/Http/Controllers/ProductController';
import { Button, buttonVariants } from '@/components/ui/button';
import * as Card from '@/components/ui/card';
import * as Dialog from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios';
import { Plus, ShoppingCart } from 'lucide-react';
import React from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = React.useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const [products, setProducts] = React.useState<App.Data.ProductData[]>([]);

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // React.useEffect(() => {
    //     axios
    //         .get(ProductController.index().url)
    //         .then((response) => {
    //             setProducts(response.data.data);
    //         })
    //         .catch((error) => {
    //             console.error('Error fetching products:', error);
    //         });
    // }, []);

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
            <div className='flex min-h-screen flex-col items-center p-6 lg:justify-center lg:p-8'>
                <header className='mb-6 flex w-full max-w-[335px] gap-4 text-sm not-has-[nav]:hidden lg:max-w-4xl'>
                    <Input type='text' placeholder='Search products...' value={searchTerm} onChange={handleSearchTermChange} />
                    <nav className='flex w-full flex-1 items-center justify-end gap-4'>
                        <Button variant={'ghost'} size={'icon'}>
                            <ShoppingCart />
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
                </header>
                {products.length > 0 ? (
                    <div className='grid w-full max-w-4xl grid-cols-1 gap-6 lg:grid-cols-3'>
                        {products.map((product) => (
                            <Card.Card key={product.id} className='h-full'>
                                <Card.CardHeader>
                                    <Card.CardTitle>{product.name}</Card.CardTitle>
                                </Card.CardHeader>
                                <Card.CardContent>
                                    <ProductImage product={product} />
                                    <p className='text-sm'>{product.description}</p>
                                    {product.product_units && product.product_units.length > 0 && (
                                        <div className='mt-4 space-y-2'>
                                            {product.product_units.map((unit) => (
                                                <div key={unit.id} className='flex items-center justify-between'>
                                                    <span className='text-sm font-medium'>Type: {unit.unit_type}</span>
                                                    <span className='text-sm font-medium'>Stock: {unit.stock_quantity}</span>
                                                    <span className='text-sm font-semibold'>Price: ${unit.price_per_unit}</span>
                                                    <Button size={'icon'}>
                                                        <Plus />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card.CardContent>
                            </Card.Card>
                        ))}
                    </div>
                ) : (
                    <p className='text-center text-sm text-[#6e6e6c] dark:text-[#A3A3A1]'>No products available.</p>
                )}
                <div className='hidden h-14.5 lg:block'></div>
            </div>
        </>
    );
}

const ProductImage = ({ product }: { product: App.Data.ProductData }) => {
    if (!product.product_images || product.product_images.length === 0) {
        return (
            <div className='mb-4 flex h-32 w-full items-center justify-center rounded-md bg-[#e0e0e0] dark:bg-[#1b1b18]'>
                <span className='text-sm text-[#6e6e6c] dark:text-[#A3A3A1]'>No Image</span>
            </div>
        );
    }

    const primaryImage = product.product_images.find((img) => img.is_primary) || product.product_images[0];

    return (
        <Dialog.Dialog>
            <Dialog.DialogTrigger asChild>
                <div className='mb-4 h-32 w-full cursor-pointer overflow-hidden rounded-md'>
                    <img src={primaryImage?.url ?? ''} alt={primaryImage.alt_text || 'Product Image'} className='h-full w-full object-cover' />
                </div>
            </Dialog.DialogTrigger>
            <Dialog.DialogContent>
                <Dialog.DialogHeader>
                    <Dialog.DialogTitle>{product.name}</Dialog.DialogTitle>
                    <Dialog.DialogDescription>Galleries</Dialog.DialogDescription>
                    <Dialog.DialogContent>
                        <div className='grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3'>
                            {product.product_images?.map((img) => (
                                <div key={img.id} className='h-48 w-full overflow-hidden rounded-md'>
                                    <img src={img.url || ''} alt={img.alt_text || 'Product Image'} className='h-full w-full object-cover' />
                                </div>
                            ))}
                        </div>
                    </Dialog.DialogContent>
                </Dialog.DialogHeader>
            </Dialog.DialogContent>
        </Dialog.Dialog>
    );
};
