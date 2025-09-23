export const formatDateShort = (d = new Date()) => {
  const opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  return d.toLocaleDateString('en-US', opts);
};
