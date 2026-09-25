import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../lib/auth';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { DEFAULT_PROPERTY_IMAGE } from '../lib/property-images';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Enter phone or email'),
  password: z.string().min(1, 'Password required'),
});

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  website: z.string().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

export function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const signupForm = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onLogin = async (data: LoginForm) => {
    await login(data.identifier, data.password);
    navigate(from);
  };

  const onSignup = async (data: SignupForm) => {
    await signup({ ...data, role: 'buyer' });
    navigate('/signup/onboarding');
  };

  return (
    <>
      <Helmet><title>Sign In — Updesh Residency</title></Helmet>
      <div className="min-h-[80vh] flex flex-col md:flex-row md:items-center md:justify-center">
        <div className="md:hidden relative h-48 overflow-hidden">
          <img src={DEFAULT_PROPERTY_IMAGE} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-xl font-medium">Updesh Residency</h1>
            <p className="text-sm opacity-90">Delhi NCR&apos;s Exclusive Property Circle</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 hidden md:block">
            <h1 className="text-2xl font-medium text-primary">Updesh Residency</h1>
            <p className="text-sm text-onSurface-variant mt-1">Delhi NCR&apos;s Exclusive Property Circle</p>
          </div>

          <div className="bg-white border border-outline rounded-md p-6">
            <div className="flex border-b border-outline mb-6">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 ${tab === 'login' ? 'border-onSurface text-onSurface' : 'border-transparent text-onSurface-variant'}`}
              >
                LOGIN
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 pb-3 text-sm font-medium border-b-2 ${tab === 'signup' ? 'border-onSurface text-onSurface' : 'border-transparent text-onSurface-variant'}`}
              >
                SIGN UP
              </button>
            </div>

            {tab === 'login' ? (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <h2 className="font-medium mb-1">Welcome back</h2>
                  <p className="text-sm text-onSurface-variant mb-4">Enter your credentials to access your account.</p>
                </div>
                <Input
                  label="Phone Number or Email"
                  placeholder="e.g. +91 98765 43210"
                  {...loginForm.register('identifier')}
                  error={loginForm.formState.errors.identifier?.message}
                />
                <Input
                  label="Password"
                  type="password"
                  {...loginForm.register('password')}
                  error={loginForm.formState.errors.password?.message}
                />
                <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                  Sign In →
                </Button>
              </form>
            ) : (
              <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                <input type="text" {...signupForm.register('website')} className="hidden" tabIndex={-1} autoComplete="off" />
                <Input label="Full Name" {...signupForm.register('name')} error={signupForm.formState.errors.name?.message} />
                <Input label="Email" type="email" {...signupForm.register('email')} error={signupForm.formState.errors.email?.message} />
                <Input label="Phone" {...signupForm.register('phone')} error={signupForm.formState.errors.phone?.message} />
                <Input label="Password" type="password" {...signupForm.register('password')} error={signupForm.formState.errors.password?.message} />
                <Button type="submit" className="w-full" disabled={signupForm.formState.isSubmitting}>
                  Create Account →
                </Button>
              </form>
            )}
          </div>

          <p className="text-center text-sm text-onSurface-variant mt-6">
            <Link to="/contact" className="underline hover:text-primary">Need assistance? Contact Support</Link>
          </p>
        </div>
        </div>
      </div>
    </>
  );
}
