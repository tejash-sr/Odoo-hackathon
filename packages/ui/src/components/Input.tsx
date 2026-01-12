import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const inputVariants = cva(
  'flex w-full rounded-lg border bg-white px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:placeholder:text-slate-500',
  {
    variants: {
      variant: {
        default:
          'border-slate-200 focus-visible:border-sky-500 focus-visible:ring-sky-500/20 dark:border-slate-700',
        error:
          'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
        success:
          'border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20',
      },
      inputSize: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-11 px-4',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant,
      inputSize,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      leftAddon,
      rightAddon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const hasError = !!error;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="flex h-11 items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
              {leftAddon}
            </div>
          )}
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({
                variant: hasError ? 'error' : variant,
                inputSize,
              }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              leftAddon && 'rounded-l-none',
              rightAddon && 'rounded-r-none',
              className
            )}
            ref={ref}
            id={inputId}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute right-3 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
          {rightAddon && (
            <div className="flex h-11 items-center rounded-r-lg border border-l-0 border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
              {rightAddon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              'mt-1.5 text-xs',
              error ? 'text-red-500' : 'text-slate-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };
