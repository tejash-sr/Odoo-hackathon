import { Router, type Router as ExpressRouter, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { validateExpense, validatePagination } from '../middleware/validators.js';
import { AppError } from '../middleware/errorHandler.js';

const router: ExpressRouter = Router();

// In-memory expense store
const expenses = new Map<string, {
  id: string;
  tripId: string;
  userId: string;
  title: string;
  amount: number;
  currency: string;
  category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'other';
  date: string;
  paidBy: string;
  splitBetween: Array<{
    userId: string;
    amount: number;
    paid: boolean;
  }>;
  receipt?: string;
  notes?: string;
  createdAt: string;
}>();

// Get expenses for a trip
router.get('/trip/:tripId', authenticate, validatePagination, (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { tripId } = req.params;
    const { category, page = 1, limit = 20 } = req.query;

    let tripExpenses = Array.from(expenses.values())
      .filter(e => e.tripId === tripId);

    // Filter by category
    if (category && typeof category === 'string') {
      tripExpenses = tripExpenses.filter(e => e.category === category);
    }

    // Sort by date descending
    tripExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate totals
    const totals = tripExpenses.reduce((acc, expense) => {
      acc.total += expense.amount;
      acc.byCategory[expense.category] = (acc.byCategory[expense.category] || 0) + expense.amount;
      return acc;
    }, { total: 0, byCategory: {} as Record<string, number> });

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginated = tripExpenses.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        expenses: paginated,
        totals,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: tripExpenses.length,
        totalPages: Math.ceil(tripExpenses.length / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single expense
router.get('/:id', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const expense = expenses.get(id);

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
});

// Create expense
router.post('/', authenticate, validateExpense, (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400, errors.array());
    }

    const userId = req.user!.id;
    const { tripId, title, amount, currency, category, date, paidBy, splitBetween, receipt, notes } = req.body;

    const expense = {
      id: uuidv4(),
      tripId,
      userId,
      title,
      amount,
      currency: currency || 'USD',
      category,
      date,
      paidBy: paidBy || userId,
      splitBetween: splitBetween || [],
      receipt,
      notes,
      createdAt: new Date().toISOString(),
    };

    expenses.set(expense.id, expense);

    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
});

// Update expense
router.put('/:id', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const expense = expenses.get(id);
    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    // Check ownership
    if (expense.userId !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'amount', 'currency', 'category', 'date', 'paidBy', 'splitBetween', 'receipt', 'notes'];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        (expense as any)[key] = updates[key];
      }
    });

    expenses.set(id, expense);

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
});

// Delete expense
router.delete('/:id', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const expense = expenses.get(id);

    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    if (expense.userId !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    expenses.delete(id);

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get expense summary for trip
router.get('/trip/:tripId/summary', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { tripId } = req.params;

    const tripExpenses = Array.from(expenses.values())
      .filter(e => e.tripId === tripId);

    const summary = {
      totalExpenses: tripExpenses.length,
      totalAmount: tripExpenses.reduce((sum, e) => sum + e.amount, 0),
      byCategory: {} as Record<string, { count: number; amount: number }>,
      byPayer: {} as Record<string, { count: number; amount: number }>,
      dailyAverage: 0,
    };

    tripExpenses.forEach(expense => {
      // By category
      if (!summary.byCategory[expense.category]) {
        summary.byCategory[expense.category] = { count: 0, amount: 0 };
      }
      summary.byCategory[expense.category].count++;
      summary.byCategory[expense.category].amount += expense.amount;

      // By payer
      if (!summary.byPayer[expense.paidBy]) {
        summary.byPayer[expense.paidBy] = { count: 0, amount: 0 };
      }
      summary.byPayer[expense.paidBy].count++;
      summary.byPayer[expense.paidBy].amount += expense.amount;
    });

    // Calculate daily average
    if (tripExpenses.length > 0) {
      const dates = new Set(tripExpenses.map(e => e.date.split('T')[0]));
      summary.dailyAverage = summary.totalAmount / dates.size;
    }

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
});

// Calculate split settlements
router.get('/trip/:tripId/settlements', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { tripId } = req.params;

    const tripExpenses = Array.from(expenses.values())
      .filter(e => e.tripId === tripId);

    // Calculate who paid what and who owes what
    const balances: Record<string, number> = {};

    tripExpenses.forEach(expense => {
      // Add amount to payer's balance
      balances[expense.paidBy] = (balances[expense.paidBy] || 0) + expense.amount;

      // Subtract split amounts from each person's balance
      expense.splitBetween.forEach(split => {
        balances[split.userId] = (balances[split.userId] || 0) - split.amount;
      });
    });

    // Calculate settlements needed
    const settlements: Array<{ from: string; to: string; amount: number }> = [];
    const debtors = Object.entries(balances).filter(([_, amount]) => amount < 0);
    const creditors = Object.entries(balances).filter(([_, amount]) => amount > 0);

    debtors.forEach(([debtorId, debt]) => {
      let remaining = Math.abs(debt);
      creditors.forEach(([creditorId, credit]) => {
        if (remaining > 0 && credit > 0) {
          const amount = Math.min(remaining, credit);
          if (amount > 0) {
            settlements.push({
              from: debtorId,
              to: creditorId,
              amount: Math.round(amount * 100) / 100,
            });
            remaining -= amount;
          }
        }
      });
    });

    res.json({
      success: true,
      data: {
        balances,
        settlements,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
