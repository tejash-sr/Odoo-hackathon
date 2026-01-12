import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
        primary:
          'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
        secondary:
          'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        success:
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning:
          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        error:
          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        info:
          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        outline:
          'border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300',
        // Travel-specific badges
        flight: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        hotel: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
        activity: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        transport: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant,
      size,
      dot,
      icon,
      removable,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-1.5 w-1.5 rounded-full',
              variant === 'success' && 'bg-emerald-500',
              variant === 'warning' && 'bg-amber-500',
              variant === 'error' && 'bg-red-500',
              variant === 'info' && 'bg-blue-500',
              (!variant || variant === 'default') && 'bg-sky-500',
              variant === 'secondary' && 'bg-slate-500'
            )}
          />
        )}
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {removable && (
          <button
            type="button"
            className="ml-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

// Status Badge Component
export interface StatusBadgeProps {
  status: 'planning' | 'booked' | 'in-progress' | 'completed' | 'cancelled';
  size?: 'sm' | 'default' | 'lg';
}

const statusConfig = {
  planning: { label: 'Planning', variant: 'info' as const },
  booked: { label: 'Booked', variant: 'success' as const },
  'in-progress': { label: 'In Progress', variant: 'warning' as const },
  completed: { label: 'Completed', variant: 'secondary' as const },
  cancelled: { label: 'Cancelled', variant: 'error' as const },
};

const StatusBadge = ({ status, size = 'default' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size} dot>
      {config.label}
    </Badge>
  );
};

export { Badge, StatusBadge, badgeVariants };
