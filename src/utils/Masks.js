export const formatProcessoIncorporacao = (value) => {
  const digits = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 16);

  let result = "";

  if (digits.length > 0) result += digits.slice(0, 4);
  if (digits.length >= 5) result += "." + digits.slice(4, 8);
  if (digits.length >= 9) result += "/" + digits.slice(8, 15);
  if (digits.length === 16) result += "-" + digits.slice(15, 16);

  return result;
};

export const parsetFormattedProcessoIncorporacao = (value) => {
  return value.replace(/\D/g, "").slice(0, 16);
};
