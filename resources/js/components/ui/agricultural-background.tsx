import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

interface AgriculturalBackgroundProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'subtle' | 'payment';
    showOrbs?: boolean;
}

export function AgriculturalBackground({ 
    className, 
    variant = 'default', 
    showOrbs = true,
    children,
    ...props 
}: AgriculturalBackgroundProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'subtle':
                return 'bg-gradient-to-br from-slate-50/50 via-emerald-50/30 to-teal-50/50 dark:from-slate-950/50 dark:via-emerald-950/30 dark:to-teal-950/50';
            case 'payment':
                return 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950';
            default:
                return 'bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 dark:from-slate-950 dark:via-emerald-950 dark:to-teal-950';
        }
    };

    const getOrbStyles = () => {
        switch (variant) {
            case 'subtle':
                return 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10';
            case 'payment':
                return 'bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20';
            default:
                return 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20';
        }
    };

    return (
        <div 
            className={cn(
                'relative min-h-screen overflow-hidden',
                getVariantStyles(),
                className
            )}
            {...props}
        >
            {/* Grid Pattern */}
            <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] print:hidden'></div>
            
            {/* Floating Gradient Orbs */}
            {showOrbs && (
                <>
                    <div className={cn(
                        'absolute top-0 right-0 left-0 -z-10 m-auto h-[310px] w-[310px] rounded-full blur-[100px] print:hidden',
                        getOrbStyles()
                    )}></div>
                    {variant !== 'subtle' && (
                        <div className={cn(
                            'absolute bottom-0 left-1/4 -z-10 h-[200px] w-[200px] rounded-full blur-[80px] print:hidden',
                            variant === 'payment' 
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 opacity-15'
                                : 'bg-gradient-to-r from-teal-500/15 to-emerald-500/15'
                        )}></div>
                    )}
                </>
            )}
            
            {children}
        </div>
    );
}