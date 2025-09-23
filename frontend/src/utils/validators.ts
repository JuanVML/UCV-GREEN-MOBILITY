export const isEduEmail = (email: string) => {
  if (!email) return false;
  return email.toLowerCase().endsWith('.edu.pe');
};
