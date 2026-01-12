import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, getInitials } from '../lib/utils';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        default: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
        '3xl': 'h-24 w-24 text-3xl',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  name?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, src, alt, name, status, ...props }, ref) => {
  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  };

  return (
    <div className="relative inline-flex">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        <AvatarPrimitive.Image
          src={src}
          alt={alt || name}
          className="aspect-square h-full w-full object-cover"
        />
        <AvatarPrimitive.Fallback
          className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-400 to-violet-500 font-medium text-white"
          delayMs={600}
        >
          {name ? getInitials(name) : '?'}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-900',
            statusColors[status],
            size === 'xs' && 'h-1.5 w-1.5',
            size === 'sm' && 'h-2 w-2',
            (!size || size === 'default') && 'h-2.5 w-2.5',
            size === 'lg' && 'h-3 w-3',
            size === 'xl' && 'h-3.5 w-3.5',
            size === '2xl' && 'h-4 w-4',
            size === '3xl' && 'h-5 w-5'
          )}
        />
      )}
    </div>
  );
});
Avatar.displayName = 'Avatar';

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
}

const AvatarGroup = ({
  children,
  max = 4,
  size = 'default',
}: AvatarGroupProps) => {
  const childArray = React.Children.toArray(children);
  const visibleAvatars = childArray.slice(0, max);
  const remainingCount = childArray.length - max;

  const overlapClasses = {
    xs: '-ml-1.5',
    sm: '-ml-2',
    default: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5',
  };

  return (
    <div className="flex items-center">
      {visibleAvatars.map((child, index) => (
        <div
          key={index}
          className={cn('relative', index > 0 && overlapClasses[size])}
          style={{ zIndex: visibleAvatars.length - index }}
        >
          {React.cloneElement(child as React.ReactElement, { size })}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative flex items-center justify-center rounded-full bg-slate-200 font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300',
            overlapClasses[size],
            avatarVariants({ size })
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export { Avatar, AvatarGroup };
