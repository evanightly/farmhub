import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { Award, Globe, Leaf, LoaderCircle, ShieldCheck, TrendingUp, Users2 } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'motion/react';

export default function Register() {
    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 dark:from-emerald-950 dark:via-teal-950 dark:to-green-950'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0 overflow-hidden'>
                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className='absolute h-3 w-3 rounded-full bg-emerald-400/20'
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            scale: 0,
                        }}
                        animate={{
                            y: [null, Math.random() * -30 - 10 + '%'],
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                        }}
                    />
                ))}

                {/* Animated Gradient Orbs */}
                <motion.div
                    className='absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blur-3xl'
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 270, 360],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
                <motion.div
                    className='absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-gradient-to-tr from-teal-400/20 to-green-400/20 blur-3xl'
                    animate={{
                        scale: [1.3, 1, 1.3],
                        rotate: [360, 90, 0],
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />

                {/* Grid Pattern */}
                <div className='absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px]' />
            </div>

            <Head title='Register' />

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
                {/* Left Side - Registration Form */}
                <div className='flex flex-1 flex-col justify-center'>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='mx-auto w-full max-w-md'
                    >
                        <Card className='border-0 bg-white/70 shadow-2xl backdrop-blur-xl dark:bg-gray-900/70'>
                            <CardHeader className='pb-8 text-center'>
                                <motion.div
                                    className='mb-4 flex items-center justify-center'
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                >
                                    <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'>
                                        <Leaf className='h-8 w-8 text-white' />
                                    </div>
                                </motion.div>
                                <CardTitle className='bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent'>
                                    Join FarmHub
                                </CardTitle>
                                <CardDescription className='mt-2 text-base text-gray-600 dark:text-gray-300'>
                                    Create your account and start your agricultural journey
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Form
                                    {...RegisteredUserController.store.form()}
                                    resetOnSuccess={['password', 'password_confirmation']}
                                    disableWhileProcessing
                                    className='space-y-5'
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                className='space-y-2'
                                            >
                                                <Label htmlFor='name' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                    Full Name
                                                </Label>
                                                <Input
                                                    id='name'
                                                    type='text'
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete='name'
                                                    name='name'
                                                    placeholder='Enter your full name'
                                                    className='h-12 border-gray-200 bg-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-emerald-400'
                                                />
                                                <InputError message={errors.name} />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                                className='space-y-2'
                                            >
                                                <Label htmlFor='email' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                    Email Address
                                                </Label>
                                                <Input
                                                    id='email'
                                                    type='email'
                                                    required
                                                    tabIndex={2}
                                                    autoComplete='email'
                                                    name='email'
                                                    placeholder='email@example.com'
                                                    className='h-12 border-gray-200 bg-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-emerald-400'
                                                />
                                                <InputError message={errors.email} />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.5 }}
                                                className='space-y-2'
                                            >
                                                <Label htmlFor='password' className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                    Password
                                                </Label>
                                                <Input
                                                    id='password'
                                                    type='password'
                                                    required
                                                    tabIndex={3}
                                                    autoComplete='new-password'
                                                    name='password'
                                                    placeholder='Create a strong password'
                                                    className='h-12 border-gray-200 bg-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-emerald-400'
                                                />
                                                <InputError message={errors.password} />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.6 }}
                                                className='space-y-2'
                                            >
                                                <Label
                                                    htmlFor='password_confirmation'
                                                    className='text-sm font-medium text-gray-700 dark:text-gray-300'
                                                >
                                                    Confirm Password
                                                </Label>
                                                <Input
                                                    id='password_confirmation'
                                                    type='password'
                                                    required
                                                    tabIndex={4}
                                                    autoComplete='new-password'
                                                    name='password_confirmation'
                                                    placeholder='Confirm your password'
                                                    className='h-12 border-gray-200 bg-white/50 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-gray-700 dark:bg-gray-800/50 dark:focus:border-emerald-400'
                                                />
                                                <InputError message={errors.password_confirmation} />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.7 }}
                                                className='pt-2'
                                            >
                                                <Button
                                                    type='submit'
                                                    className='h-12 w-full transform bg-gradient-to-r from-emerald-600 to-teal-600 font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl'
                                                    tabIndex={5}
                                                    data-test='register-user-button'
                                                >
                                                    {processing ? (
                                                        <div className='flex items-center space-x-2'>
                                                            <LoaderCircle className='h-4 w-4 animate-spin' />
                                                            <span>Creating account...</span>
                                                        </div>
                                                    ) : (
                                                        'Create Account'
                                                    )}
                                                </Button>
                                            </motion.div>

                                            <motion.div
                                                className='pt-4 text-center'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5, delay: 0.8 }}
                                            >
                                                <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                    Already have an account?{' '}
                                                    <TextLink
                                                        href={login()}
                                                        tabIndex={6}
                                                        className='font-medium text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300'
                                                    >
                                                        Sign in
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

                {/* Right Side - Benefits */}
                <div className='hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:px-8 xl:px-16'>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='w-full max-w-lg'
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className='mb-8'
                        >
                            <h2 className='mb-6 text-4xl leading-tight font-bold text-gray-900 xl:text-5xl dark:text-white'>
                                Start Your
                                <span className='block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                                    Agricultural Journey
                                </span>
                            </h2>
                            <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
                                Join thousands of farmers, buyers, and agricultural enthusiasts on our platform. Get access to premium products,
                                trusted connections, and expert insights.
                            </p>
                        </motion.div>

                        <motion.div
                            className='space-y-6'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: 'Verified Quality',
                                    description: 'All products are quality-checked and verified by our expert team',
                                },
                                {
                                    icon: Users2,
                                    title: 'Trusted Network',
                                    description: 'Connect with verified farmers and trusted agricultural suppliers',
                                },
                                {
                                    icon: TrendingUp,
                                    title: 'Market Insights',
                                    description: 'Get real-time market prices and agricultural trend analysis',
                                },
                                {
                                    icon: Award,
                                    title: 'Premium Experience',
                                    description: 'Enjoy priority support and exclusive access to premium features',
                                },
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    className='flex items-start space-x-4 rounded-xl border border-white/20 bg-white/30 p-4 backdrop-blur-sm dark:border-gray-700/30 dark:bg-gray-800/30'
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                >
                                    <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'>
                                        <benefit.icon className='h-6 w-6 text-white' />
                                    </div>
                                    <div>
                                        <h3 className='mb-1 font-semibold text-gray-900 dark:text-white'>{benefit.title}</h3>
                                        <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>{benefit.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className='mt-8 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20'
                        >
                            <div className='mb-3 flex items-center space-x-3'>
                                <Globe className='h-6 w-6 text-emerald-600 dark:text-emerald-400' />
                                <h4 className='font-semibold text-emerald-800 dark:text-emerald-200'>Join Our Growing Community</h4>
                            </div>
                            <p className='text-sm text-emerald-700 dark:text-emerald-300'>
                                Over <span className='font-bold'>10,000+</span> farmers and buyers are already part of our platform, creating a
                                thriving agricultural ecosystem.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
