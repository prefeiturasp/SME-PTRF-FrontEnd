export function validarDAC11A(ccmComDV) {
  const digits = ccmComDV.replace(/\D/g, "");

  if (digits.length !== 12) return false;

  const base = digits.slice(0, -1);
  const dvInformado = parseInt(digits.slice(-1), 10);

  let peso = 2;
  let soma = 0;

  for (let i = 0; i < base.length; i++) {
    soma += parseInt(base[i], 10) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }

  const resto = soma % 11;
  const dvCalculado = resto === 0 || resto === 1 ? 0 : 11 - resto;

  return dvCalculado === dvInformado;
}
