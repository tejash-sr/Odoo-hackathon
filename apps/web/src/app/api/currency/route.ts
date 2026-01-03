import { NextRequest, NextResponse } from 'next/server';

// Using ExchangeRate-API (free tier: 1500 requests/month)
// Alternative: frankfurter.app (completely free, no API key needed)
const EXCHANGE_API_URL = 'https://api.frankfurter.app';

interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Popular currencies for travelers
const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY',
  'HKD', 'SGD', 'THB', 'INR', 'MXN', 'BRL', 'KRW', 'NZD',
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get('from') || 'USD';
  const to = searchParams.get('to');
  const amount = parseFloat(searchParams.get('amount') || '1');

  try {
    // Get latest rates
    const url = to
      ? `${EXCHANGE_API_URL}/latest?from=${from}&to=${to}`
      : `${EXCHANGE_API_URL}/latest?from=${from}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch exchange rates' },
        { status: response.status }
      );
    }

    const data: ExchangeRates = await response.json();

    // Calculate converted amounts
    const conversions: Record<string, { rate: number; amount: number }> = {};
    
    Object.entries(data.rates).forEach(([currency, rate]) => {
      conversions[currency] = {
        rate,
        amount: Math.round(amount * rate * 100) / 100,
      };
    });

    // Get popular currencies subset
    const popularConversions: Record<string, { rate: number; amount: number }> = {};
    POPULAR_CURRENCIES.forEach(currency => {
      if (conversions[currency]) {
        popularConversions[currency] = conversions[currency];
      }
    });

    return NextResponse.json({
      base: data.base,
      date: data.date,
      amount,
      rates: to ? conversions : popularConversions,
      allRates: conversions,
    });
  } catch (error) {
    console.error('Currency API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    );
  }
}

// Historical rates endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from = 'USD', to = 'EUR', startDate, endDate } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const url = `${EXCHANGE_API_URL}/${startDate}..${endDate}?from=${from}&to=${to}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch historical rates' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Format for charting
    const history = Object.entries(data.rates).map(([date, rates]: [string, any]) => ({
      date,
      rate: rates[to],
    }));

    return NextResponse.json({
      from: data.base,
      to,
      startDate: data.start_date,
      endDate: data.end_date,
      history,
    });
  } catch (error) {
    console.error('Currency history API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch historical rates' },
      { status: 500 }
    );
  }
}
