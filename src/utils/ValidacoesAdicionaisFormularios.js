/* eslint eqeqeq: 0 */
/* eslint-disable */
import * as yup from "yup";
import moment from "moment";

export const YupSignupSchemaLogin = yup.object().shape({
    login: yup.string().required("Campo código RF é obrigatório"),
    senha: yup.string().typeError('Campo Senha precisa ser numérico').required("Campo código Senhya é obrigatório"),
});

export const YupSignupSchemaCadastroDespesa = yup.object().shape({

    cpf_cnpj_fornecedor: yup.string()
    .test('test-name', 'Digite um CPF ou um CNPJ válido',
        function (value) {
            return valida_cpf_cnpj(value)
        }),
    nome_fornecedor: yup.string(),
    tipo_documento:yup.string(),
    numero_documento:yup.string(),
    data_documento: yup.string(),
    tipo_transacao: yup.string(),
    data_transacao: yup.string(),
    valor_total: yup.string(),
    valor_recursos_proprios: yup.string(),
    valorRecursoAcoes:yup.string(),
});

export const payloadFormDespesaContext = (data)=>{

    let arrayRetorno =[]

    data.map(item => {
        if (item.valor_item_capital !== "" && item.quantidade_itens_capital !== ""){
            item.valor_item_capital = trataNumericos(item.valor_item_capital);
            item.quantidade_itens_capital = trataNumericos(item.quantidade_itens_capital);
            item.valor_rateio = round((item.valor_item_capital * item.quantidade_itens_capital), 2);
        }else{
            item.valor_item_capital = 0;
            item.quantidade_itens_capital = 0;
            item.valor_rateio = trataNumericos(item.valor_rateio)
        }

        item.tipo_custeio = convertToNumber(item.tipo_custeio)

        if (item.tipo_aplicacao_recurso === 1){
            item.aplicacao_recurso = "CUSTEIO"
        }else {
            item.aplicacao_recurso = "CAPITAL"
        }

        item.especificacao_material_servico = convertToNumber(item.especificacao_material_servico)

        arrayRetorno.push(item)
    })

    return arrayRetorno;
}

export const payloadFormDespesaPrincipal = (data, tipo_aplicacao_recurso, idAssociacao, verboHttp)=>{



    data.associacao = idAssociacao;

    if (data.tipo_documento.id){
        data.tipo_documento = convertToNumber(data.tipo_documento.id)
    }else{
        data.tipo_documento = convertToNumber(data.tipo_documento)
    }

    if(data.tipo_transacao.id){
        data.tipo_transacao = convertToNumber(data.tipo_transacao.id)
    }else{
        data.tipo_transacao = convertToNumber(data.tipo_transacao)
    }

    data.valor_total = trataNumericos(data.valor_total);
    data.valor_recursos_proprios = trataNumericos(data.valor_recursos_proprios);
    data.valorRecursoAcoes = round((data.valor_total - data.valor_recursos_proprios), 2);

    if (data.data_documento){
        //data.data_documento = trataData(data.data_documento)
        //data.data_documento =  moment(data.data_documento, "YYYY-MM-DD").add(1, 'days');
        data.data_documento =  moment(data.data_documento).format("YYYY-MM-DD");
    }else {
        data.data_documento = "";
    }

    if (data.data_transacao){
        data.data_transacao = trataData(data.data_transacao)
        //data.data_transacao =  moment(data.data_transacao, "YYYY-MM-DD").add(1, 'days');
        data.data_transacao =  moment(data.data_transacao).format("YYYY-MM-DD");
    }else {
        data.data_transacao = "";
    }

    data.rateios.map((rateio) =>{
        rateio.associacao = idAssociacao;

        if(verboHttp==="POST"){
            rateio.especificacao_material_servico = convertToNumber(rateio.especificacao_material_servico);
        }else if(verboHttp==="PUT"){
            rateio.conta_associacao = rateio.conta_associacao.uuid;
            rateio.acao_associacao = rateio.acao_associacao.uuid;
            rateio.tipo_custeio = rateio.tipo_custeio.id;
            rateio.especificacao_material_servico = convertToNumber(rateio.especificacao_material_servico.id);
        }
    })

    if (tipo_aplicacao_recurso === "CUSTEIO"){

        data.rateios.map((rateio) =>{
            rateio.valor_item_capital = 0;
            rateio.quantidade_itens_capital = 0;

            rateio.aplicacao_recurso = tipo_aplicacao_recurso
            rateio.valor_rateio = trataNumericos(rateio.valor_rateio)
        })
    }


    if (tipo_aplicacao_recurso === "CAPITAL"){
        data.rateios.map((rateio) =>{

            rateio.aplicacao_recurso = tipo_aplicacao_recurso

            if (rateio.valor_item_capital !== "" && rateio.quantidade_itens_capital !== ""){
                rateio.valor_item_capital = trataNumericos(rateio.valor_item_capital);
                rateio.quantidade_itens_capital = trataNumericos(rateio.quantidade_itens_capital);
                rateio.valor_rateio = round((rateio.valor_item_capital * rateio.quantidade_itens_capital), 2);
            }else{
                rateio.valor_item_capital = 0;
                rateio.quantidade_itens_capital = 0;
                rateio.valor_rateio = trataNumericos(rateio.valor_rateio)
            }
        })
    }

    return data;
}

export const trataData = (data) => {
    return moment(data, "YYYY-MM-DD").add(1, 'days');
}

export const convertToNumber = (string)=>{
    return Number(string)
}

export const round = (num, places) => {
    return +(parseFloat(num).toFixed(places));
}

export const trataNumericos = (valor) =>{

    if (typeof (valor) === "string"){
        return Number(valor.replace(/\./gi,'').replace(/R/gi,'').replace(/,/gi,'.').replace(/\$/, ""));

    }else {

        return valor
    }
}

export const calculaValorRateio = (valor1, valor2) => {

    let valor1Tratado = trataNumericos(valor1)
    let valor2Tratado = trataNumericos(valor2)

    let valor_total = valor1Tratado * valor2Tratado;

    return valor_total;
}
export const calculaValorRecursoAcoes = (props) => {

    let valor_totalTratado = trataNumericos(props.values.valor_total)
    let valor_recursos_propriosTratado = trataNumericos(props.values.valor_recursos_proprios)
    let valor_total = valor_totalTratado - valor_recursos_propriosTratado;
    return valor_total;
}

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
