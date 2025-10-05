import { usePage } from '@inertiajs/react';
import { Leaf } from 'lucide-react';

export default function AppLogo() {
    const page = usePage();

    return (
        <>
            <div className='flex aspect-square size-8 items-center justify-center rounded-md'>
                <Leaf className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
            </div>
            <div className='ml-1 grid flex-1 text-left text-sm'>
                <span className='mb-0.5 truncate leading-tight font-semibold'>{page.props.name as unknown as string}</span>
            </div>
        </>
    );
}
