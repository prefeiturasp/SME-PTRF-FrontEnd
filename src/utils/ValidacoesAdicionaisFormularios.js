/* eslint eqeqeq: 0 */
/* eslint-disable */
import * as yup from "yup";

export const YupSignupSchemaLogin = yup.object().shape({
    loginRf: yup.number().typeError('Campo RF precisa ser numérico').required("Campo código RF é obrigatório"),
    loginSenha: yup.number().typeError('Campo Senha precisa ser numérico').required("Campo código Senhya é obrigatório"),
});

export const YupSignupSchemaCadastroDespesa = yup.object().shape({

    cnpCpf: yup.string()
    .test('test-name', 'Digite um CPF ou um CNPJ válido',
        function (value) {
            return valida_cpf_cnpj(value)
        }),
    razaoSocial: yup.string(),
    tipoDocumento:yup.string(),
    numreroDocumento:yup.string(),
    dataDocumento: yup.string(),
    tipoTransacao: yup.string(),
    dataTransacao: yup.string(),
    valorTotal: yup.string(),
    valorRecursoProprio: yup.string(),
    valorRecursoAcoes:yup.string(),
});

export const cpfMaskContitional = (value) => {
    let cpfCnpj = value.replace(/[^\d]+/g, "");
    let mask = [];
    if (cpfCnpj.length <= 11 ) {
        mask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    }else if (cpfCnpj.length > 11){
        mask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/,/\d/]
    }
    return mask
}

function valida_cpf_cnpj ( valor ) {

    if ( !valor || (valor.length < 11 && valor.length > 14) || valor === "00000000000" || valor === "11111111111" || valor === "22222222222" || valor === "33333333333" || valor === "44444444444" || valor === "55555555555" || valor === "66666666666" || valor === "77777777777" || valor === "88888888888"
        || valor === "99999999999" )
        return false

    // Verifica se é CPF ou CNPJ
    let valida = verifica_cpf_cnpj( valor );

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    // Valida CPF
    if ( valida === 'CPF' ) {
        // Retorna true para cpf válido
        return valida_cpf( valor );
    }

    // Valida CNPJ
    else if ( valida === 'CNPJ' ) {
        // Retorna true para CNPJ válido
        return valida_cnpj( valor );
    }

    // Não retorna nada
    else {
        return false;
    }

} // valida_cpf_cnpj

function verifica_cpf_cnpj ( valor ) {

    // Garante que o valor é uma string
    valor = valor.toString();

    // Remove caracteres inválidos do valor
    valor = valor.replace(/[^0-9]/g, '');

    // Verifica CPF
    if ( valor.length === 11 ) {
        return 'CPF';
    }

    // Verifica CNPJ
    else if ( valor.length === 14 ) {
        return 'CNPJ';
    }

    // Não retorna nada
    else {
        return false;
    }

} // verifica_cpf_cnpj

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

function valida_cnpj ( valor ) {
    valor = valor.toString();

    valor = valor.replace(/[^0-9]/g, '');

    let cnpj_original = valor;

    let primeiros_numeros_cnpj = valor.substr( 0, 12 );

    let primeiro_calculo = calc_digitos_posicoes( primeiros_numeros_cnpj, 5 );

    let segundo_calculo = calc_digitos_posicoes( primeiro_calculo, 6 );

    let cnpj = segundo_calculo;

    if ( cnpj === cnpj_original ) {
        return true;
    }

    return false;

} // valida_cnpj




