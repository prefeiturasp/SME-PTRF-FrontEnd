/* Validação CPF/CNPJ do cadastro de despesa (pipeline). */

const PESOS_DV_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const CNPJ_ZERADO = "00000000000000";
const removeMascaraCnpj = (valor) => {
  return valor.replace(/[.\-/]/g, "").toUpperCase();
};

const charValueCnpj = (caractere) => {
  return caractere.toUpperCase().charCodeAt(0) - 48;
};

const calculaDvCnpj = (base12) => {
  let somatorioDv1 = 0;
  let somatorioDv2 = 0;

  for (let i = 0; i < 12; i++) {
    const valorCaractere = charValueCnpj(base12[i]);
    somatorioDv1 += valorCaractere * PESOS_DV_CNPJ[i + 1];
    somatorioDv2 += valorCaractere * PESOS_DV_CNPJ[i];
  }

  const dv1 = somatorioDv1 % 11 < 2 ? 0 : 11 - (somatorioDv1 % 11);
  somatorioDv2 += dv1 * PESOS_DV_CNPJ[12];
  const dv2 = somatorioDv2 % 11 < 2 ? 0 : 11 - (somatorioDv2 % 11);

  return `${dv1}${dv2}`;
};

const limpaCpf = (valor) => {
  return valor ? valor.replace(/[^0-9]/g, '') : '';
};

const limpaCpfCnpj = (valor) => {
  return valor ? valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : '';
};

const possuiSequenciaInvalida = (valor, permitirCnpjZerado = false) => {
  const sequenciasInvalidas = [
    "00000000000",
    "11111111111",
    "11111111111111",
    "22222222222",
    "22222222222222",
    "33333333333",
    "33333333333333",
    "44444444444",
    "44444444444444",
    "55555555555",
    "55555555555555",
    "66666666666",
    "66666666666666",
    "77777777777",
    "77777777777777",
    "88888888888",
    "88888888888888",
    "99999999999",
    "99999999999999",
  ];

  if (!permitirCnpjZerado) {
    sequenciasInvalidas.push("00000000000000");
  }

  return sequenciasInvalidas.includes(valor);
};

function verifica_cpf_cnpj(valor) {
  const valorCpf = limpaCpf(valor);
  const valorCpfCnpj = limpaCpfCnpj(valor);

  if (valorCpf.length === 11 && /^\d+$/.test(valorCpf)) {
    return 'CPF';
  }

  if (valorCpfCnpj.length === 14) {
    return 'CNPJ';
  }

  return false;
}

export function valida_cpf_cnpj_permitindo_cnpj_zerado(valor) {
  const tipoDocumento = verifica_cpf_cnpj(valor);

  if (!tipoDocumento) {
    return false;
  }

  if (tipoDocumento === 'CPF') {
    const cpf = limpaCpf(valor);
    if (possuiSequenciaInvalida(cpf, true)) {
      return false;
    }
    return valida_cpf(cpf);
  }

  const cnpj = limpaCpfCnpj(valor);
  if (cnpj === CNPJ_ZERADO) {
    return true;
  }
  if (possuiSequenciaInvalida(cnpj, true)) {
    return false;
  }
  return valida_cnpj(cnpj);
}

export function valida_cpf_cnpj(valor) {
  const tipoDocumento = verifica_cpf_cnpj(valor);

  if (!tipoDocumento) {
    return false;
  }

  if (tipoDocumento === 'CPF') {
    const cpf = limpaCpf(valor);
    if (possuiSequenciaInvalida(cpf)) {
      return false;
    }
    return valida_cpf(cpf);
  }

  const cnpj = limpaCpfCnpj(valor);
  if (possuiSequenciaInvalida(cnpj)) {
    return false;
  }
  return valida_cnpj(cnpj);
}

function calc_digitos_posicoes( digitos, posicoes = 10, soma_digitos = 0 ) {

  digitos = digitos.toString();

  for ( let i = 0; i < digitos.length; i++  ) {
    soma_digitos = soma_digitos + ( digitos[i] * posicoes );
    posicoes--;
    if ( posicoes < 2 ) {
      posicoes = 9;
    }
  }

  soma_digitos = soma_digitos % 11;

  if ( soma_digitos < 2 ) {
    soma_digitos = 0;
  } else {
    soma_digitos = 11 - soma_digitos;
  }

  let cpf = digitos + soma_digitos;

  return cpf;

} // calc_digitos_posicoes

function valida_cpf( valor ) {

  valor = valor.toString();

  valor = valor.replace(/[^0-9]/g, '');

  let digitos = valor.substr(0, 9);

  let novo_cpf = calc_digitos_posicoes( digitos );

  novo_cpf = calc_digitos_posicoes( novo_cpf, 11 );

  if ( novo_cpf === valor ) {
    return true;
  } else {
    return false;
  }

} // valida_cpf

export function valida_cnpj(valor) {
  if (!valor) {
    return false;
  }

  const cnpj = removeMascaraCnpj(valor.toString());

  if (cnpj === CNPJ_ZERADO) {
    return false;
  }

  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj)) {
    return false;
  }

  return cnpj.slice(-2) === calculaDvCnpj(cnpj.slice(0, 12));
}

export const valida_cpf_exportado = ( valor ) => {

  valor = valor.toString();

  valor = valor.replace(/[^0-9]/g, '');

  let digitos = valor.substr(0, 9);

  let novo_cpf = calc_digitos_posicoes( digitos );

  novo_cpf = calc_digitos_posicoes( novo_cpf, 11 );

  if ( novo_cpf === valor ) {
    return true;
  } else {
    return false;
  }

} // valida_cpf

