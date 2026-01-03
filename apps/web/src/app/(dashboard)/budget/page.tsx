'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Calendar,
  DollarSign,
  Plane,
  Hotel,
  Utensils,
  Car,
  Ticket,
  ShoppingBag,
  MoreHorizontal,
  ChevronDown,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  Camera,
} from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  merchant?: string;
  receiptUrl?: string;
  notes?: string;
  status: 'verified' | 'pending' | 'flagged';
}

interface BudgetCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  budgeted: number;
  spent: number;
}

const categories: BudgetCategory[] = [
  { id: 'flights', name: 'Flights', icon: Plane, color: 'blue', budgeted: 1500, spent: 1245 },
  { id: 'hotels', name: 'Hotels', icon: Hotel, color: 'violet', budgeted: 2000, spent: 1680 },
  { id: 'food', name: 'Food & Dining', icon: Utensils, color: 'orange', budgeted: 800, spent: 420 },
  { id: 'transport', name: 'Transport', icon: Car, color: 'emerald', budgeted: 400, spent: 185 },
  { id: 'activities', name: 'Activities', icon: Ticket, color: 'pink', budgeted: 600, spent: 340 },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'amber', budgeted: 500, spent: 125 },
];

const recentExpenses: Expense[] = [
  { id: '1', title: 'Shinkansen Tokyo to Kyoto', amount: 145, category: 'transport', date: '2024-03-15', merchant: 'JR Rail', status: 'verified' },
  { id: '2', title: 'Sushi Dinner at Tsukiji', amount: 85, category: 'food', date: '2024-03-15', merchant: 'Sushi Zanmai', status: 'verified' },
  { id: '3', title: 'Tokyo Tower Entry', amount: 25, category: 'activities', date: '2024-03-14', merchant: 'Tokyo Tower', status: 'pending' },
  { id: '4', title: 'Hotel Night - Shinjuku', amount: 180, category: 'hotels', date: '2024-03-14', merchant: 'Keio Plaza', status: 'verified' },
  { id: '5', title: 'Souvenir Shop', amount: 45, category: 'shopping', date: '2024-03-14', merchant: 'Don Quijote', status: 'pending' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BudgetPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState('This Trip');
  const [showAddExpense, setShowAddExpense] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'list' | 'chart'>('list');

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = Math.round((totalSpent / totalBudget) * 100);

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || Receipt;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || 'slate';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-violet-600 to-purple-600 px-4 pb-24 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Budget Tracker</h1>
              <p className="mt-1 text-primary-100">Japan Adventure • March 2024</p>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-lg transition-transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Total Budget Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            <div className="col-span-2 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-primary-100">Total Budget</p>
                  <p className="mt-1 text-4xl font-bold text-white">
                    ${totalBudget.toLocaleString()}
                  </p>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                  <Wallet className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-100">
                    ${totalSpent.toLocaleString()} spent
                  </span>
                  <span className="text-white font-medium">{spentPercentage}%</span>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${spentPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      spentPercentage > 90
                        ? 'bg-red-400'
                        : spentPercentage > 75
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20">
                    <ArrowDownRight className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-100">Remaining</p>
                    <p className="text-xl font-bold text-white">
                      ${remaining.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20">
                    <Target className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-100">Daily Average</p>
                    <p className="text-xl font-bold text-white">$142</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto -mt-16 max-w-6xl px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 lg:grid-cols-3"
        >
          {/* Category Breakdown */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Budget Categories
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`rounded-lg p-2 transition-colors ${
                    viewMode === 'chart'
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <PieChart className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {categories.map((category) => {
                const percentage = Math.round((category.spent / category.budgeted) * 100);
                const isOverBudget = percentage > 100;
                const Icon = category.icon;

                return (
                  <motion.div
                    key={category.id}
                    whileHover={{ scale: 1.01 }}
                    className="group cursor-pointer rounded-xl border border-slate-100 p-4 transition-all hover:shadow-md dark:border-slate-800"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${category.color}-100 text-${category.color}-600 dark:bg-${category.color}-900/30 dark:text-${category.color}-400`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900 dark:text-white">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              ${category.spent}
                            </span>
                            <span className="text-sm text-slate-400">
                              / ${category.budgeted}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(percentage, 100)}%` }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                              className={`h-full rounded-full ${
                                isOverBudget
                                  ? 'bg-red-500'
                                  : percentage > 80
                                  ? 'bg-amber-500'
                                  : `bg-${category.color}-500`
                              }`}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              isOverBudget
                                ? 'text-red-500'
                                : percentage > 80
                                ? 'text-amber-500'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Daily Spending Trend */}
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Spending Trend
              </h3>
              <div className="mt-4 flex items-end justify-between gap-1">
                {[45, 78, 52, 90, 68, 85, 42].map((value, i) => (
                  <div key={i} className="flex-1">
                    <div
                      className={`rounded-t-sm ${
                        i === 6 ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`}
                      style={{ height: `${value}px` }}
                    />
                    <p className="mt-1 text-center text-[10px] text-slate-400">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">This week</span>
                <span className="flex items-center gap-1 text-emerald-600">
                  <TrendingDown className="h-4 w-4" />
                  12% less
                </span>
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-900/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    Budget Alert
                  </p>
                  <p className="mt-1 text-sm text-amber-600 dark:text-amber-300">
                    Hotels category is at 84% - consider adjusting for remaining nights.
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Receipt Scanner */}
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-700">
              <Camera className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="mt-2 font-medium text-slate-600 dark:text-slate-400">
                Scan Receipt
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                AI-powered expense extraction
              </p>
              <button className="mt-4 rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                Open Scanner
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mt-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Expenses
            </h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                <Filter className="h-4 w-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800">
                <Calendar className="h-4 w-4" />
                This Week
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Expense
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Status
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentExpenses.map((expense) => {
                  const Icon = getCategoryIcon(expense.category);
                  const color = getCategoryColor(expense.category);

                  return (
                    <tr
                      key={expense.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-100 text-${color}-600 dark:bg-${color}-900/30 dark:text-${color}-400`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {expense.title}
                            </p>
                            {expense.merchant && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {expense.merchant}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full bg-${color}-100 px-2 py-1 text-xs font-medium text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400`}
                        >
                          {categories.find((c) => c.id === expense.category)?.name}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(expense.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          ${expense.amount}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {expense.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Verified
                          </span>
                        ) : expense.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                            <Clock className="h-4 w-4" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle className="h-4 w-4" />
                            Flagged
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-center">
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View All Expenses →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddExpense && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowAddExpense(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Add Expense
              </h3>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="What did you spend on?"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Amount
                    </label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 pl-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Category
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          className={`flex flex-col items-center gap-1 rounded-xl border-2 border-slate-200 p-3 transition-all hover:border-primary-500 hover:bg-primary-50 dark:border-slate-700 dark:hover:border-primary-500 dark:hover:bg-primary-900/20`}
                        >
                          <Icon className="h-5 w-5 text-slate-500" />
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Notes (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Add any notes..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.02]">
                  Save Expense
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
