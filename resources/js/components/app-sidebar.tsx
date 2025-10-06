import AccountController from '@/actions/App/Http/Controllers/AccountController';
import OrderController from '@/actions/App/Http/Controllers/OrderController';
import ProductController from '@/actions/App/Http/Controllers/ProductController';
import UserController from '@/actions/App/Http/Controllers/UserController';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { orders, payments } from '@/routes/admin';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Box, CreditCard, Folder, IdCard, LayoutGrid, Package, Receipt, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'User Management',
        href: UserController.index().url,
        icon: Users,
    },
    {
        title: 'Products',
        href: ProductController.index().url,
        icon: Box,
    },
    {
        title: 'Order Management',
        href: orders(),
        icon: Package,
    },
    {
        title: 'Accounts',
        href: AccountController.index().url,
        icon: IdCard,
    },
    {
        title: 'Payment Verification',
        href: payments(),
        icon: CreditCard,
    },
    {
        title: 'Transactions',
        href: OrderController.transactions().url,
        icon: Receipt,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible='icon' variant='inset'>
            <SidebarHeader className='rounded-t-lg bg-gradient-to-b from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/50'>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size='lg' asChild className='hover:bg-emerald-100/50 dark:hover:bg-emerald-900/50'>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className='bg-gradient-to-b from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/30 dark:to-teal-950/30'>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className='rounded-b-lg border-t border-emerald-200/50 bg-gradient-to-b from-teal-50/50 to-emerald-50/50 dark:border-emerald-800/50 dark:from-teal-950/50 dark:to-emerald-950/50'>
                <NavFooter items={footerNavItems} className='mt-auto' />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
