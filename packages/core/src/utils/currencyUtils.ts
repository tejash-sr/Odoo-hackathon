// Currency conversion rates (in real app, these would come from an API)
const BASE_CURRENCY = 'USD';

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83.12,
  MXN: 17.15,
  BRL: 4.97,
  KRW: 1328.50,
  SGD: 1.34,
  HKD: 7.82,
  THB: 35.50,
  PHP: 55.90,
  IDR: 15650,
  MYR: 4.72,
  VND: 24350,
  AED: 3.67,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  MXN: 'MX$',
  BRL: 'R$',
  KRW: '₩',
  SGD: 'S$',
  HKD: 'HK$',
  THB: '฿',
  PHP: '₱',
  IDR: 'Rp',
  MYR: 'RM',
  VND: '₫',
  AED: 'د.إ',
};

/**
 * Format currency with proper symbol and decimal places
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  options: {
    showSymbol?: boolean;
    showCode?: boolean;
    decimals?: number;
    locale?: string;
  } = {}
): string {
  const {
    showSymbol = true,
    showCode = false,
    decimals,
    locale = 'en-US',
  } = options;

  // Currencies that typically don't use decimal places
  const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR'];
  const decimalPlaces = decimals ?? (noDecimalCurrencies.includes(currency) ? 0 : 2);

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: showCode ? 'currency' : 'decimal',
      currency: currency,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    if (showCode) {
      return formatter.format(amount);
    }

    const formatted = formatter.format(amount);
    return showSymbol ? `${CURRENCY_SYMBOLS[currency] || currency}${formatted}` : formatted;
  } catch {
    return `${currency} ${amount.toFixed(decimalPlaces)}`;
  }
}

/**
 * Convert amount between currencies
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) return amount;
  
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate;
  return usdAmount * toRate;
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string): number {
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = EXCHANGE_RATES[toCurrency] || 1;
  return toRate / fromRate;
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Calculate budget breakdown
 */
export interface BudgetBreakdown {
  accommodation: number;
  transportation: number;
  food: number;
  activities: number;
  shopping: number;
  miscellaneous: number;
}

export function calculateBudgetBreakdown(
  totalBudget: number,
  style: 'budget' | 'mid-range' | 'luxury' = 'mid-range'
): BudgetBreakdown {
  const breakdowns = {
    budget: {
      accommodation: 0.25,
      transportation: 0.20,
      food: 0.25,
      activities: 0.15,
      shopping: 0.05,
      miscellaneous: 0.10,
    },
    'mid-range': {
      accommodation: 0.30,
      transportation: 0.20,
      food: 0.20,
      activities: 0.15,
      shopping: 0.07,
      miscellaneous: 0.08,
    },
    luxury: {
      accommodation: 0.35,
      transportation: 0.15,
      food: 0.20,
      activities: 0.15,
      shopping: 0.08,
      miscellaneous: 0.07,
    },
  };

  const percentages = breakdowns[style];

  return {
    accommodation: totalBudget * percentages.accommodation,
    transportation: totalBudget * percentages.transportation,
    food: totalBudget * percentages.food,
    activities: totalBudget * percentages.activities,
    shopping: totalBudget * percentages.shopping,
    miscellaneous: totalBudget * percentages.miscellaneous,
  };
}

/**
 * Calculate daily budget
 */
export function calculateDailyBudget(
  totalBudget: number,
  days: number,
  reservedAmount: number = 0
): number {
  const availableBudget = totalBudget - reservedAmount;
  return availableBudget / days;
}

/**
 * Get budget status
 */
export function getBudgetStatus(
  spent: number,
  budget: number
): 'under' | 'near' | 'over' {
  const percentage = (spent / budget) * 100;
  if (percentage > 100) return 'over';
  if (percentage > 80) return 'near';
  return 'under';
}

/**
 * Get supported currencies
 */
export function getSupportedCurrencies(): Array<{ code: string; symbol: string }> {
  return Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => ({
    code,
    symbol,
  }));
}

/**
 * Format compact currency (e.g., $1.2K, $3.5M)
 */
export function formatCompactCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(1)}K`;
  }
  return `${symbol}${amount.toFixed(0)}`;
}
