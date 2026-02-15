'use client';

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{icon}</div>}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 pl-${icon ? '10' : '4'} rounded-xl
            bg-card-bg border border-white/10 text-text-primary
            placeholder-text-tertiary
            focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan
            transition-all duration-300
            ${error ? 'border-accent-danger' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-accent-danger text-sm mt-1">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';

export default Input;
