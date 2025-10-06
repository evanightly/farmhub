import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { Leaf, LoaderCircle, Shield, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950 dark:via-teal-950 dark:to-green-950'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0 overflow-hidden'>
                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className='absolute h-2 w-2 rounded-full bg-emerald-400/20'
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            scale: 0,
                        }}
                        animate={{
                            y: [null, Math.random() * -20 - 10 + '%'],
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Gradient Orbs */}
                <motion.div
                    className='absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blur-3xl'
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
                <motion.div
                    className='absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-teal-400/20 to-green-400/20 blur-3xl'
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />

                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]' />
            </div>

            <Head title='Log in' />

            {/* Theme Toggle Button */}
            <motion.div
                className='absolute top-6 right-6 z-20'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <AnimatedThemeToggler />
            </motion.div>

            <div className='relative z-10 flex min-h-screen'>
                {/* Left Side - Branding */}
                <div className='hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:px-8 xl:px-16'>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='w-full max-w-lg'
                    >
                        <div className='mb-8 flex items-center space-x-3'>
                            <motion.div
                                className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <Leaf className='h-6 w-6 text-white' />
                            </motion.div>
                            <h1 className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-3xl font-bold text-transparent'>
                                FarmHub
                            </h1>
                        </div>

                        <motion.h2
                            className='mb-6 text-4xl leading-tight font-bold text-gray-900 xl:text-5xl dark:text-white'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Welcome back to your
                            <span className='block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                                Agricultural Hub
                            </span>
                        </motion.h2>

                        <motion.p
                            className='mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-300'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            Access your personalized dashboard, manage your orders, and explore the finest agricultural products from trusted farmers.
                        </motion.p>

                        <motion.div
                            className='space-y-4'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            {[
                                { icon: Users, text: 'Connect with trusted farmers' },
                                { icon: Shield, text: 'Secure and reliable platform' },
                                { icon: Sparkles, text: 'Premium quality products' },
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className='flex items-center space-x-3 text-gray-600 dark:text-gray-300'
                                    whileHover={{ x: 5 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                >
                                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30'>
                                        <feature.icon className='h-4 w-4 text-emerald-600 dark:text-emerald-400' />
                                    </div>
                                    <span>{feature.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Side - Login Form */}
                <div className='flex flex-1 flex-col justify-center'>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='mx-auto w-full max-w-md'
                    >
                        <Card className='border-0 bg-white/70 shadow-2xl backdrop-blur-xl dark:bg-gray-900/70'>
                            <CardHeader className='pb-8 text-center'>
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                                    <CardTitle className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent'>
                                        Welcome Back
                                    </CardTitle>
                                </motion.div>
                                <CardDescription className='mt-2 text-base text-gray-600 dark:text-gray-300'>
                                    Sign in to access your account
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                {status && (
                                    <motion.div
                                        className='mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20'
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className='text-center text-sm font-medium text-green-800 dark:text-green-200'>{status}</p>
                                    </motion.div>
                                )}

                                <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className='space-y-6'>
                                    {({ processing, errors }) => (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                className='space-y-2'
                                            >
                                                <Label htmlFor='email' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                    Email address
                                                </Label>
                                                <Input
                                                    id='email'
                                                    type='email'
                                                    name='email'
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete='email'
                                                    placeholder='email@example.com'
                                                    className='h-12 border-gray-200 bg-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-emerald-400'
                                                />
                                                <InputError message={errors.email} />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                                className='space-y-2'
                                            >
                                                <div className='flex items-center justify-between'>
                                                    <Label htmlFor='password' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                        Password
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className='text-sm text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300'
                                                            tabIndex={5}
                                                        >
                                                            Forgot password?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <Input
                                                    id='password'
                                                    type='password'
                                                    name='password'
                                                    required
                                                    tabIndex={2}
                                                    autoComplete='current-password'
                                                    placeholder='Enter your password'
                                                    className='h-12 border-gray-200 bg-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-emerald-400'
                                                />
                                                <InputError message={errors.password} />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.5 }}
                                                className='flex items-center space-x-3'
                                            >
                                                <Checkbox
                                                    id='remember'
                                                    name='remember'
                                                    tabIndex={3}
                                                    className='border-gray-300 data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 dark:border-gray-600'
                                                />
                                                <Label htmlFor='remember' className='text-sm text-gray-600 dark:text-gray-300'>
                                                    Remember me for 30 days
                                                </Label>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.6 }}
                                            >
                                                <Button
                                                    type='submit'
                                                    className='h-12 w-full transform bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl'
                                                    tabIndex={4}
                                                    disabled={processing}
                                                    data-test='login-button'
                                                >
                                                    {processing ? (
                                                        <div className='flex items-center space-x-2'>
                                                            <LoaderCircle className='h-4 w-4 animate-spin' />
                                                            <span>Signing in...</span>
                                                        </div>
                                                    ) : (
                                                        'Sign In'
                                                    )}
                                                </Button>
                                            </motion.div>

                                            <motion.div
                                                className='pt-4 text-center'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5, delay: 0.7 }}
                                            >
                                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                    Don't have an account?{' '}
                                                    <TextLink
                                                        href={register()}
                                                        tabIndex={6}
                                                        className='font-medium text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300'
                                                    >
                                                        Create account
                                                    </TextLink>
                                                </p>
                                            </motion.div>
                                        </>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
