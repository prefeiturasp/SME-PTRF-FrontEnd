export const formatMoneyByCentsBRL = (value) => {
  if (value === null || value === undefined || isNaN(value) || value === "")
    return null;

  return (value / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatMoneyBRL = (value) => {
  if (value === null || value === undefined || isNaN(value) || value === "")
    return null;

  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseMoneyBRL = (value) => {
  if (!value || /[a-zA-Z]/.test(value)) return null;
  const numericValue = value.replace(/\D/g, "");
  return parseInt(numericValue, 10);
};

export const parseMoneyCentsBRL = (value) => {
  if (!value) return null;

  const clean = value.replace(/[^\d]/g, "");

  const float = parseFloat(clean) / 100;

  return isNaN(float) ? null : float;
};
