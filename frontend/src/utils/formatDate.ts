/**
 * Utilidades para formateo de fechas
 */

export function formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

export const formatDateShort = (d = new Date()) => {
  const opts: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  };
  return d.toLocaleDateString('en-US', opts);
};
