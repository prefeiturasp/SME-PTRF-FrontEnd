export const formatMoneyBRL = (value) => {
  return value
    ? Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : null;
};
