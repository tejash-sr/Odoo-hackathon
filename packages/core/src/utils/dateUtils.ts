import {
  format,
  formatDistance,
  formatRelative,
  isToday,
  isTomorrow,
  isYesterday,
  addDays,
  subDays,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  startOfDay,
  endOfDay,
  parseISO,
  isValid,
} from 'date-fns';

/**
 * Format a date to a readable string
 */
export function formatDate(
  date: Date | string,
  formatString: string = 'MMM d, yyyy'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, formatString);
}

/**
 * Format time from date
 */
export function formatTime(date: Date | string, is24Hour: boolean = false): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid time';
  return format(dateObj, is24Hour ? 'HH:mm' : 'h:mm a');
}

/**
 * Format date and time together
 */
export function formatDateTime(date: Date | string, is24Hour: boolean = false): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, is24Hour ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy h:mm a');
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Get smart date string (Today, Tomorrow, Yesterday, or date)
 */
export function getSmartDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isYesterday(dateObj)) return 'Yesterday';
  
  return formatRelative(dateObj, new Date());
}

/**
 * Calculate trip duration in days
 */
export function getTripDuration(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate) + 1;
}

/**
 * Get countdown to trip start
 */
export function getTripCountdown(startDate: Date): string {
  const now = new Date();
  const days = differenceInDays(startDate, now);
  
  if (days < 0) return 'Trip started';
  if (days === 0) return 'Trip starts today!';
  if (days === 1) return 'Trip starts tomorrow!';
  if (days < 7) return `${days} days to go`;
  if (days < 30) return `${Math.floor(days / 7)} weeks to go`;
  return `${Math.floor(days / 30)} months to go`;
}

/**
 * Generate date range array
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = startOfDay(startDate);
  const end = startOfDay(endDate);
  
  while (currentDate <= end) {
    dates.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
}

/**
 * Format duration in hours and minutes
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

/**
 * Parse duration string to minutes
 */
export function parseDuration(duration: string): number {
  const hourMatch = duration.match(/(\d+)\s*h/);
  const minMatch = duration.match(/(\d+)\s*min/);
  
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minMatch ? parseInt(minMatch[1], 10) : 0;
  
  return hours * 60 + minutes;
}

/**
 * Check if date is within trip dates
 */
export function isWithinTrip(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startOfDay(startDate) && date <= endOfDay(endDate);
}

/**
 * Get day of trip
 */
export function getDayOfTrip(date: Date, startDate: Date): number {
  return differenceInDays(date, startOfDay(startDate)) + 1;
}
