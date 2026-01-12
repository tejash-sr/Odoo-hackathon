import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const cardVariants = cva(
  'rounded-xl border bg-white transition-all duration-200 dark:bg-slate-900',
  {
    variants: {
      variant: {
        default: 'border-slate-200 dark:border-slate-800',
        elevated: 'border-transparent shadow-lg hover:shadow-xl',
        outline: 'border-slate-200 dark:border-slate-700',
        ghost: 'border-transparent',
        interactive:
          'border-slate-200 cursor-pointer hover:border-sky-300 hover:shadow-md dark:border-slate-700 dark:hover:border-sky-700',
        gradient:
          'border-transparent bg-gradient-to-br from-sky-50 to-violet-50 dark:from-sky-900/20 dark:to-violet-900/20',
      },
      padding: {
        none: '',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-slate-900 dark:text-slate-100',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-slate-500 dark:text-slate-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

const CardImage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    src: string;
    alt?: string;
    aspectRatio?: 'video' | 'square' | 'wide';
    overlay?: boolean;
  }
>(
  (
    {
      className,
      src,
      alt = '',
      aspectRatio = 'video',
      overlay = false,
      children,
      ...props
    },
    ref
  ) => {
    const aspectClasses = {
      video: 'aspect-video',
      square: 'aspect-square',
      wide: 'aspect-[21/9]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative -m-6 mb-4 overflow-hidden rounded-t-xl',
          aspectClasses[aspectRatio],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        )}
        {children && (
          <div className="absolute inset-0 flex items-end p-4">
            {children}
          </div>
        )}
      </div>
    );
  }
);
CardImage.displayName = 'CardImage';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
};
