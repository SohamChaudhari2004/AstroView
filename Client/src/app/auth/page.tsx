import React from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import AuthForm from '@/features/auth/AuthForm';

export default function AuthPage() {
  return (
    <AuthLayout>
      <AuthForm />
    </AuthLayout>
  );
}
