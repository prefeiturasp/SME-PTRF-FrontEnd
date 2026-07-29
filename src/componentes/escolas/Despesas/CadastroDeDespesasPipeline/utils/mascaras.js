/* Máscaras de input do cadastro de despesa (pipeline). */

const CNPJ_MASK = [
  /[A-Za-z0-9]/, /[A-Za-z0-9]/, ".",
  /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, ".",
  /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, "/",
  /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, /[A-Za-z0-9]/, "-",
  /\d/, /\d/
];

export const cpfMaskContitional = (value) => {
  const cpfCnpj = value.replace(/[^A-Za-z0-9]+/g, "").toUpperCase();

  if (cpfCnpj.length > 11 || /[A-Za-z]/.test(cpfCnpj)) {
    return CNPJ_MASK;
  }

  return [/\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/, /\d/];
};

export const processoIncorporacaoMask = (value) => {
  // 0000.0000/0000000-0
  value.replace(/[^\d]+/g, "");
  return [/\d/, /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/];
};
