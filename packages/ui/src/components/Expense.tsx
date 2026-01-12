import * as React from 'react';
import { cn, formatCurrency, formatDate, formatTime } from '../lib/utils';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { Avatar, AvatarGroup } from './Avatar';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Receipt,
  CreditCard,
  Plus,
  Filter,
  Download,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  ChevronRight,
  Utensils,
  Car,
  Hotel,
  Ticket,
  ShoppingBag,
  Coffee,
  Plane,
} from 'lucide-react';

// Expense Item
export interface ExpenseItemProps {
  id: string;
  title: string;
  category: string;
  amount: number;
  currency?: string;
  date: Date;
  paidBy?: { name: string; avatar?: string };
  splitWith?: Array<{ name: string; avatar?: string }>;
  receipt?: string;
  notes?: string;
  onClick?: () => void;
  className?: string;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  food: Utensils,
  transport: Car,
  accommodation: Hotel,
  activities: Ticket,
  shopping: ShoppingBag,
  drinks: Coffee,
  flights: Plane,
  other: Receipt,
};

const categoryColors: Record<string, string> = {
  food: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30',
  transport: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30',
  accommodation: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30',
  activities: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30',
  shopping: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30',
  drinks: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30',
  flights: 'bg-sky-100 text-sky-600 dark:bg-sky-900/30',
  other: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30',
};

export function ExpenseItem({
  title,
  category,
  amount,
  currency = 'USD',
  date,
  paidBy,
  splitWith = [],
  receipt,
  notes,
  onClick,
  className,
}: ExpenseItemProps) {
  const Icon = categoryIcons[category.toLowerCase()] || Receipt;

  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
          categoryColors[category.toLowerCase()] || categoryColors.other
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">
          {title}
        </h4>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="capitalize">{category}</span>
          <span>•</span>
          <span>{formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {paidBy && splitWith.length > 0 && (
        <div className="hidden sm:block">
          <AvatarGroup max={3}>
            <Avatar src={paidBy.avatar} name={paidBy.name} size="sm" />
            {splitWith.map((person, i) => (
              <Avatar key={i} src={person.avatar} name={person.name} size="sm" />
            ))}
          </AvatarGroup>
        </div>
      )}

      <div className="text-right">
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {formatCurrency(amount, currency)}
        </div>
        {splitWith.length > 0 && (
          <div className="text-xs text-slate-500">
            Split {splitWith.length + 1} ways
          </div>
        )}
      </div>

      {onClick && (
        <ChevronRight className="h-5 w-5 text-slate-400" />
      )}
    </div>
  );
}

// Budget Overview Card
export interface BudgetOverviewProps {
  totalBudget: number;
  totalSpent: number;
  currency?: string;
  categories: Array<{
    name: string;
    spent: number;
    budget: number;
    color: string;
  }>;
  className?: string;
}

export function BudgetOverview({
  totalBudget,
  totalSpent,
  currency = 'USD',
  categories,
  className,
}: BudgetOverviewProps) {
  const remaining = totalBudget - totalSpent;
  const percentUsed = (totalSpent / totalBudget) * 100;
  const isOverBudget = totalSpent > totalBudget;

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-slate-500">Trip Budget</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalSpent, currency)}
            </span>
            <span className="text-slate-500">
              of {formatCurrency(totalBudget, currency)}
            </span>
          </div>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            isOverBudget
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-emerald-100 dark:bg-emerald-900/30'
          )}
        >
          <PieChart
            className={cn(
              'h-6 w-6',
              isOverBudget ? 'text-red-600' : 'text-emerald-600'
            )}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-slate-500">
            {percentUsed.toFixed(0)}% used
          </span>
          <span
            className={cn(
              'font-medium',
              isOverBudget ? 'text-red-600' : 'text-emerald-600'
            )}
          >
            {isOverBudget ? 'Over by ' : ''}
            {formatCurrency(Math.abs(remaining), currency)}{' '}
            {isOverBudget ? '' : 'remaining'}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isOverBudget ? 'bg-red-500' : 'bg-emerald-500'
            )}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          />
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          By Category
        </h4>
        {categories.map((cat, i) => {
          const catPercent = (cat.spent / cat.budget) * 100;
          const isOver = cat.spent > cat.budget;

          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1 text-sm">
                <span className="text-slate-600 dark:text-slate-400 capitalize">
                  {cat.name}
                </span>
                <span className="text-slate-900 dark:text-slate-100">
                  {formatCurrency(cat.spent, currency)} /{' '}
                  {formatCurrency(cat.budget, currency)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isOver ? 'bg-red-500' : ''
                  )}
                  style={{
                    width: `${Math.min(catPercent, 100)}%`,
                    backgroundColor: isOver ? undefined : cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Expense Summary Stats
export interface ExpenseStatsProps {
  dailyAverage: number;
  highestDay: { date: Date; amount: number };
  lowestDay: { date: Date; amount: number };
  mostSpentCategory: { name: string; amount: number };
  currency?: string;
  className?: string;
}

export function ExpenseStats({
  dailyAverage,
  highestDay,
  lowestDay,
  mostSpentCategory,
  currency = 'USD',
  className,
}: ExpenseStatsProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-4', className)}>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Daily Average</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(dailyAverage, currency)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
            <TrendingUp className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Highest Day</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(highestDay.amount, currency)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
            <TrendingDown className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Lowest Day</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {formatCurrency(lowestDay.amount, currency)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
            <Tag className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Top Category</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 capitalize">
              {mostSpentCategory.name}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Split Expense Card
export interface SplitExpenseProps {
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    paid: number;
    owes: number;
  }>;
  currency?: string;
  onSettle?: (participantId: string) => void;
  className?: string;
}

export function SplitExpense({
  participants,
  currency = 'USD',
  onSettle,
  className,
}: SplitExpenseProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Split Summary
        </h3>
        <Badge variant="secondary">{participants.length} people</Badge>
      </div>

      <div className="space-y-3">
        {participants.map((person) => {
          const balance = person.paid - person.owes;
          const isPositive = balance > 0;
          const isSettled = balance === 0;

          return (
            <div
              key={person.id}
              className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800"
            >
              <Avatar src={person.avatar} name={person.name} size="md" />

              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                  {person.name}
                </h4>
                <div className="text-sm text-slate-500">
                  Paid: {formatCurrency(person.paid, currency)}
                </div>
              </div>

              <div className="text-right">
                {isSettled ? (
                  <div className="flex items-center text-emerald-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    <span className="font-medium">Settled</span>
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                        'font-semibold',
                        isPositive ? 'text-emerald-600' : 'text-red-600'
                      )}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(balance, currency)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {isPositive ? 'Gets back' : 'Owes'}
                    </div>
                  </>
                )}
              </div>

              {!isSettled && onSettle && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSettle(person.id)}
                >
                  Settle
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Add Expense Button
export interface AddExpenseButtonProps {
  onClick?: () => void;
  className?: string;
}

export function AddExpenseButton({ onClick, className }: AddExpenseButtonProps) {
  return (
    <button
      className={cn(
        'fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-transform hover:scale-105 hover:bg-primary-600 active:scale-95',
        className
      )}
      onClick={onClick}
    >
      <Plus className="h-6 w-6" />
    </button>
  );
}

// Expense Filter Tabs
export interface ExpenseFiltersProps {
  categories: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string | undefined) => void;
  dateRange?: { start: Date; end: Date };
  onDateRangeChange?: (range: { start: Date; end: Date } | undefined) => void;
  className?: string;
}

export function ExpenseFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  className,
}: ExpenseFiltersProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex flex-1 gap-2 overflow-x-auto pb-2">
        <button
          className={cn(
            'flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            !selectedCategory
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
          )}
          onClick={() => onCategoryChange?.(undefined)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={cn(
              'flex-shrink-0 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors',
              selectedCategory === cat
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
            )}
            onClick={() => onCategoryChange?.(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <Button variant="secondary" size="sm">
        <Calendar className="mr-2 h-4 w-4" />
        Date
      </Button>

      <Button variant="secondary" size="sm">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
