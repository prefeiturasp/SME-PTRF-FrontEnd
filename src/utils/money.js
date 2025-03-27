export const formatMoneyBRL = (value) => {
  if (value === null || value === undefined || isNaN(value)) return null;
  return (value / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseMoneyBRL = (value) => {
  if (!value || /[a-zA-Z]/.test(value)) return null;
  const numericValue = value.replace(/\D/g, "");
  return numericValue ? parseInt(numericValue, 10) : null;
};
