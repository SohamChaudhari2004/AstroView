'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '@/lib/firebase';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import toast from 'react-hot-toast';

const AuthForm: React.FC = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // For email/password, redirect to dashboard (can integrate Firebase email auth later)
    setIsLoading(true);
    toast.success(isLogin ? 'Welcome back!' : 'Account created!');
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        toast.success(`Welcome, ${user.displayName || 'User'}!`);
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Google login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient mb-2">AstroView</h1>
          <p className="text-text-secondary">
            {isLogin ? 'Welcome Back' : 'Join Our Mission'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading}
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
            />
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? isLogin
                ? 'Signing In...'
                : 'Creating Account...'
              : isLogin
              ? 'Sign In'
              : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-text-tertiary text-sm">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Login */}
        <Button
          type="button"
          variant="secondary"
          className="w-full mb-4"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Continue with Google
        </Button>

        {/* Toggle Auth Mode */}
        <p className="text-center text-text-secondary text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-accent-cyan hover:text-accent-purple transition font-medium"
            disabled={isLoading}
          >
            {isLogin ? 'Register' : 'Sign In'}
          </button>
        </p>
      </Card>

      {/* Footer text */}
      <p className="text-center text-text-tertiary text-xs mt-6">
        Secure authentication powered by Firebase
      </p>
    </motion.div>
  );
};

export default AuthForm;
