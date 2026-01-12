import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Expense } from '@globetrotter/types';

export interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  selectedCategory: string | null;
  dateRange: { start: Date | null; end: Date | null };
  
  // Computed values
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  
  // Actions
  setExpenses: (expenses: Expense[]) => void;
  fetchExpenses: (tripId: string) => Promise<void>;
  addExpense: (tripId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (expenseId: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  
  // Filter actions
  setSelectedCategory: (category: string | null) => void;
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  clearFilters: () => void;
  
  // Split expense actions
  settleExpense: (expenseId: string, userId: string) => Promise<void>;
  calculateSplit: (expense: Expense) => Record<string, number>;
}

export const useExpenseStore = create<ExpenseState>()(
  devtools(
    (set, get) => ({
      expenses: [],
      isLoading: false,
      error: null,
      selectedCategory: null,
      dateRange: { start: null, end: null },
      totalExpenses: 0,
      expensesByCategory: {},

      setExpenses: (expenses) => {
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount.amount, 0);
        const expensesByCategory = expenses.reduce((acc, e) => {
          acc[e.category] = (acc[e.category] || 0) + e.amount.amount;
          return acc;
        }, {} as Record<string, number>);
        set({ expenses, totalExpenses, expensesByCategory });
      },

      fetchExpenses: async (tripId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/trips/${tripId}/expenses`);
          if (!response.ok) throw new Error('Failed to fetch expenses');
          const expenses = await response.json();
          get().setExpenses(expenses);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch expenses',
            isLoading: false 
          });
        }
      },

      addExpense: async (tripId, expenseData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/trips/${tripId}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expenseData),
          });
          if (!response.ok) throw new Error('Failed to add expense');
          const expense = await response.json();
          const { expenses } = get();
          get().setExpenses([...expenses, expense]);
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add expense',
            isLoading: false 
          });
        }
      },

      updateExpense: async (expenseId, data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/expenses/${expenseId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error('Failed to update expense');
          const updatedExpense = await response.json();
          const { expenses } = get();
          get().setExpenses(expenses.map((e) => e.id === expenseId ? updatedExpense : e));
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update expense',
            isLoading: false 
          });
        }
      },

      deleteExpense: async (expenseId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/expenses/${expenseId}`, { method: 'DELETE' });
          if (!response.ok) throw new Error('Failed to delete expense');
          const { expenses } = get();
          get().setExpenses(expenses.filter((e) => e.id !== expenseId));
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete expense',
            isLoading: false 
          });
        }
      },

      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setDateRange: (range) => set({ dateRange: range }),
      clearFilters: () => set({ selectedCategory: null, dateRange: { start: null, end: null } }),

      settleExpense: async (expenseId, userId) => {
        // Mark expense as settled for user
        await get().updateExpense(expenseId, { 
          settlements: { [userId]: true } 
        } as any);
      },

      calculateSplit: (expense) => {
        // Calculate splits based on ExpenseSplit array
        const splitAmounts: Record<string, number> = {};
        
        if (expense.splitWith && expense.splitWith.length > 0) {
          expense.splitWith.forEach((split) => {
            splitAmounts[split.userId] = split.amount.amount;
          });
        }

        return splitAmounts;
      },
    }),
    { name: 'expense-store' }
  )
);
