/* Helpers numéricos do cadastro de despesa (pipeline). */

export const convertToNumber = (string) => Number(string);

export const round = (num, places) => +(parseFloat(num).toFixed(places));

export const trataNumericos = (valor) => {
  if (typeof valor === "string") {
    const isNegative = valor.startsWith("-");
    const cleaned = valor.replace(/[^\d,]/g, "");
    const converted = cleaned.replace(/,/g, ".");
    const numberValue = Number(converted);
    return isNegative ? -numberValue : numberValue;
  }
  return valor;
};

export const calculaValorRateio = (valor1, valor2) => {
  return trataNumericos(valor1) * trataNumericos(valor2);
};

export const calculaValorRecursoAcoes = (values) => {
  return round(
    trataNumericos(values.valor_total) - trataNumericos(values.valor_recursos_proprios),
    2
  );
};

export const calculaValorOriginal = (values) => {
  return round(
    trataNumericos(values.valor_original) - trataNumericos(values.valor_recursos_proprios),
    2
  );
};

export const apenasNumero = (valor) => {
  const re = /^[0-9\b]+$/;
  return valor === "" || re.test(valor);
};
