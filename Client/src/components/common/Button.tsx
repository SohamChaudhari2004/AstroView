'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center px-4 py-2 rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-accent-cyan to-accent-purple hover:shadow-glow-cyan text-background',
        secondary:
          'glass hover:bg-card-hover border-white/20 hover:border-accent-cyan/50 text-text-primary',
        danger:
          'bg-accent-danger/20 hover:bg-accent-danger/30 border border-accent-danger text-accent-danger',
        outline: 'border border-accent-cyan text-accent-cyan hover:shadow-glow-cyan',
        ghost: 'text-text-secondary hover:text-accent-cyan',
      },
      size: {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={`${buttonVariants({ variant, size })} ${className}`}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export default Button;
