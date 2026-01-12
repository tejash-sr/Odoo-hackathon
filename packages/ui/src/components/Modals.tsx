import * as React from 'react';
import { cn } from '../lib/utils';
import { Button } from './Button';
import {
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
} from 'lucide-react';

// Modal Component
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  showClose?: boolean;
  className?: string;
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  showClose = true,
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900',
          modalSizes[size],
          'animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        {showClose && (
          <button
            className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

// Bottom Sheet Component
export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
  className?: string;
}

const sheetHeights = {
  auto: 'max-h-[90vh]',
  half: 'h-[50vh]',
  full: 'h-[90vh]',
};

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
  className,
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          'relative w-full rounded-t-3xl bg-white dark:bg-slate-900',
          sheetHeights[height],
          'animate-in slide-in-from-bottom duration-300',
          className
        )}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4">
          <div className="h-1 w-12 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {title && (
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
          </div>
        )}

        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// Alert Dialog
export interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: 'info' | 'warning' | 'danger' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  className?: string;
}

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  success: CheckCircle,
};

const alertColors = {
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
  warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30',
  danger: 'bg-red-100 text-red-600 dark:bg-red-900/30',
  success: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30',
};

const alertButtonColors = {
  info: 'primary',
  warning: 'primary',
  danger: 'destructive',
  success: 'primary',
} as const;

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'info',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  className,
}: AlertDialogProps) {
  const Icon = alertIcons[variant];

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showClose={false}
      className={className}
    >
      <div className="text-center">
        <div
          className={cn(
            'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
            alertColors[variant]
          )}
        >
          <Icon className="h-8 w-8" />
        </div>

        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mb-6 text-sm text-slate-500">{description}</p>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={alertButtonColors[variant]}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Toast Notification
export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const toastStyles = {
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800',
  success: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800',
  error: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800',
};

const toastIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

const toastIconColors = {
  info: 'text-blue-600',
  success: 'text-emerald-600',
  warning: 'text-amber-600',
  error: 'text-red-600',
};

export function Toast({
  title,
  message,
  variant = 'info',
  onClose,
  className,
}: ToastProps) {
  const Icon = toastIcons[variant];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 shadow-lg',
        toastStyles[variant],
        'animate-in slide-in-from-right duration-300',
        className
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', toastIconColors[variant])} />
      <div className="flex-1">
        {title && (
          <h4 className="font-medium text-slate-900 dark:text-slate-100">
            {title}
          </h4>
        )}
        <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
      </div>
      {onClose && (
        <button
          className="text-slate-400 hover:text-slate-600"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// Toast Container
export interface ToastContainerProps {
  toasts: ToastProps[];
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

const toastPositions = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};

export function ToastContainer({
  toasts,
  position = 'top-right',
  className,
}: ToastContainerProps) {
  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col gap-2',
        toastPositions[position],
        className
      )}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

// Stepper Component
export interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div
      className={cn(
        orientation === 'horizontal'
          ? 'flex items-center'
          : 'flex flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || isCurrent);

        return (
          <React.Fragment key={step.id}>
            <div
              className={cn(
                'flex items-center gap-3',
                orientation === 'vertical' && 'mb-4',
                isClickable && 'cursor-pointer'
              )}
              onClick={() => isClickable && onStepClick(index)}
            >
              <div
                className={cn(
                  'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  isCompleted &&
                    'border-primary-500 bg-primary-500 text-white',
                  isCurrent &&
                    'border-primary-500 bg-primary-50 text-primary-600 dark:bg-primary-900/30',
                  !isCompleted &&
                    !isCurrent &&
                    'border-slate-200 text-slate-400 dark:border-slate-700'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div>
                <h4
                  className={cn(
                    'text-sm font-medium',
                    (isCompleted || isCurrent)
                      ? 'text-slate-900 dark:text-slate-100'
                      : 'text-slate-400'
                  )}
                >
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-xs text-slate-500">{step.description}</p>
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1',
                  orientation === 'horizontal'
                    ? 'mx-4 h-0.5'
                    : 'ml-5 h-8 w-0.5',
                  index < currentStep
                    ? 'bg-primary-500'
                    : 'bg-slate-200 dark:bg-slate-700'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Tabs Component
export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  fullWidth = false,
  className,
}: TabsProps) {
  return (
    <div
      className={cn(
        'flex',
        variant === 'default' && 'border-b border-slate-200 dark:border-slate-700',
        variant === 'pills' && 'gap-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors',
              fullWidth && 'flex-1 justify-center',
              variant === 'default' && [
                'border-b-2 -mb-px',
                isActive
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700',
              ],
              variant === 'pills' && [
                'rounded-lg',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-700',
              ],
              variant === 'underline' && [
                'relative',
                isActive
                  ? 'text-primary-600'
                  : 'text-slate-500 hover:text-slate-700',
              ],
              tab.disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => !tab.disabled && onTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'ml-1.5 rounded-full px-2 py-0.5 text-xs',
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                )}
              >
                {tab.badge}
              </span>
            )}
            {variant === 'underline' && isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Pagination Component
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          First
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, i) =>
        typeof page === 'number' ? (
          <Button
            key={i}
            variant={page === currentPage ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ) : (
          <span
            key={i}
            className="px-2 text-slate-400"
          >
            {page}
          </span>
        )
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {showFirstLast && (
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          Last
        </Button>
      )}
    </div>
  );
}
