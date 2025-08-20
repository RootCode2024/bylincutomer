/**
 * Utility functions for date and time formatting
 */

/**
 * Format a date string or Date object
 * @param {string|Date} date - The date to format
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @param {Object} [options] - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'fr-FR', options = {}) {
  if (!date) return 'N/A';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
}

/**
 * Format a date with time
 * @param {string|Date} date - The date to format
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(date, locale = 'en-US') {
  return formatDate(date, locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Format a time duration (e.g., "2 hours 30 minutes")
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} Formatted duration string
 */
export function formatDuration(milliseconds) {
  if (isNaN(milliseconds)) return 'N/A';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;
  
  const parts = [];
  
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (remainingHours > 0) parts.push(`${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`);
  if (remainingMinutes > 0) parts.push(`${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`);
  if (remainingSeconds > 0 && parts.length === 0) {
    parts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
  }
  
  return parts.join(' ') || '0 seconds';
}

/**
 * Get relative time string (e.g., "2 days ago")
 * @param {string|Date} date - The date to compare
 * @param {string} [locale='en-US'] - The locale to use for formatting
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date, locale = 'en-US') {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    // Create a relative time formatter
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return rtf.format(-diffInMinutes, 'minute');
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return rtf.format(-diffInHours, 'hour');
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return rtf.format(-diffInDays, 'day');
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return rtf.format(-diffInMonths, 'month');
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, 'year');
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'N/A';
  }
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if dates are the same day
 */
export function isSameDay(date1, date2) {
  if (!date1 || !date2) return false;
  
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get the start of the day for a given date
 * @param {Date} date - The date
 * @returns {Date} Date set to start of day (00:00:00)
 */
export function startOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get the end of the day for a given date
 * @param {Date} date - The date
 * @returns {Date} Date set to end of day (23:59:59.999)
 */
export function endOfDay(date) {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}