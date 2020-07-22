/* eslint eqeqeq: 0 */
/* eslint-disable */
import * as yup from "yup";
import moment from "moment";
import {ASSOCIACAO_UUID} from "../services/auth.service";
import {getPeriodoFechado} from "../services/Associacao.service";

export const checkDuplicateInObject = (propertyName, inputArray) => {

  var seenDuplicate = false,
      testObject = {};

  inputArray.map((item) => {
    var itemPropertyName = item[propertyName];
    if (itemPropertyName in testObject) {
      testObject[itemPropertyName].duplicate = true;
      item.duplicate = true;
      seenDuplicate = true;
    } else {
      testObject[itemPropertyName] = item;
      delete item.duplicate;
    }
  });
  return seenDuplicate;
};

export const YupSignupSchemaAlterarSenha = yup.object().shape({
  senha_atual: yup.string().required("Campo senha atual é obrigatório"),
  senha: yup.string().required("Campo nova senha é obrigatório"),
  confirmacao_senha: yup.string().required("Campo confirmação da nova senha é obrigatório")
  .oneOf([yup.ref('senha'), null], 'As senhas precisam ser iguais'),
});

export const YupSignupSchemaAlterarEmail = yup.object().shape({
  email: yup.string().required("Campo email é obrigatório"),
  confirmacao_email: yup.string().required("Campo confirmação do email é obrigatório")
  .oneOf([yup.ref('email'), null], 'Os emails precisam ser iguais'),
});

export const YupSignupSchemaRedefinirSenha = yup.object().shape({
  senha: yup.string().required("Campo nova senha é obrigatório"),
  confirmacao_senha: yup.string().required("Campo confirmação da nova senha é obrigatório")
  .oneOf([yup.ref('senha'), null], 'As Senhas precisam ser iguais'),
});

export const YupSignupSchemaRecuperarSenha = yup.object().shape({
  usuario: yup.string().required("Campo usuário é obrigatório"),
});

export const YupSignupSchemaLogin = yup.object().shape({
  login: yup.string().required("Campo código RF é obrigatório"),
  senha: yup.string().required("Campo código Senha é obrigatório"),
});

export const YupSignupSchemaMembros = yup.object().shape({
  representacao: yup.string().required("Representação é obrigatório"),

  codigo_identificacao: yup.string()
    .test('test-name', 'É obrigatório e não pode ultrapassar 10 caracteres',
        function (value) {
          const { representacao } = this.parent;
          if(representacao === "SERVIDOR" || representacao === "ESTUDANTE"){
            return !(!value || value.trim() === "" || value.length > 10);
          }else {
            return true
          }
      }),

  nome: yup.string()
  .test('test-name', 'É obrigatório e não pode ultrapassar 160 caracteres',
      function (value) {
        const { representacao } = this.parent;
        if(representacao === "PAI_RESPONSAVEL"){
          return !(!value || value.trim() === "" || value.length > 160);
        }else {
          return true
        }
      }),

  cargo_educacao: yup.string()
  .test('test-name', 'É obrigatório e não pode ultrapassar 45 caracteres',
      function (value) {
        const { representacao } = this.parent;
        if(representacao === "SERVIDOR"){
            return !(!value || value.trim() === "" || value.length > 45);
        }else {
          return true
        }
      }),
});

export const YupSignupSchemaCadastroDespesa = yup.object().shape({
  cpf_cnpj_fornecedor: yup.string().required("Campo CNPJ ou CPF é obrigatório")
  .test('test-name', 'Digite um CPF ou um CNPJ válido',
      function (value) {
        if(value !== undefined){
          return valida_cpf_cnpj(value)
        }else {
          return true
        }
      }),
  nome_fornecedor: yup.string().nullable(),
  tipo_documento:yup.string().nullable(),
  numero_documento:yup.string().nullable(),
  data_documento: yup.string().nullable(),
  tipo_transacao: yup.string().nullable(),
  data_transacao: yup.string().nullable(),
  documento_transacao: yup.string().nullable(),
  valor_total: yup.string().nullable(),
  valor_recursos_proprios: yup.string().nullable(),
  valor_total_dos_rateios:yup.string().nullable(),
  valor_recusos_acoes:yup.string().nullable(),
});

export const periodoFechado = async (data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral) =>{
  data = moment(data, "YYYY-MM-DD").format("YYYY-MM-DD");
  try {
    let periodo_fechado = await getPeriodoFechado(data);

    if (!periodo_fechado.aceita_alteracoes){
      setReadOnlyBtnAcao(true);
      setShowPeriodoFechado(true);
      setReadOnlyCampos(true);
    }else {
      setReadOnlyBtnAcao(false);
      setShowPeriodoFechado(false);
      setReadOnlyCampos(false);
    }
  }
  catch (e) {
    setReadOnlyBtnAcao(true);
    setShowPeriodoFechado(true);
    setReadOnlyCampos(true);
    onShowErroGeral();
    console.log("Erro ao buscar perído ", e)
  }
}

export const validaPayloadDespesas = (values, despesasTabelas=null) => {

  if (despesasTabelas){
    let exibe_documento_transacao =  despesasTabelas.tipos_transacao.find(element => element.id === Number(values.tipo_transacao))
    if(!values.tipo_transacao || !exibe_documento_transacao.tem_documento){
      values.documento_transacao ="";
    }
  }

  // Quando é Alteração
  if (typeof values.associacao === "object"){
    values.associacao = localStorage.getItem(ASSOCIACAO_UUID)
  }

  if (typeof values.tipo_documento === "object" && values.tipo_documento !== null){
    values.tipo_documento = values.tipo_documento.id
  }else {
    if (values.tipo_documento !== "" && values.tipo_documento !== "0" && values.tipo_documento !== 0 && values.tipo_documento !== null) {
      values.tipo_documento = convertToNumber(values.tipo_documento);
    } else {
      values.tipo_documento = null
    }
  }

  if (typeof values.tipo_transacao === "object" && values.tipo_transacao !== null){
    values.tipo_transacao = values.tipo_transacao.id
  }else {
    if (values.tipo_transacao !== "" && values.tipo_transacao !== "0" && values.tipo_transacao !== 0 && values.tipo_transacao !== null) {
      values.tipo_transacao = convertToNumber(values.tipo_transacao);
    } else {
      values.tipo_transacao = null
    }
  }

  values.valor_total = trataNumericos(values.valor_total);
  values.valor_recursos_proprios = trataNumericos(values.valor_recursos_proprios);
  values.valor_recusos_acoes = round((values.valor_recusos_acoes), 2)

  if (values.data_documento !== "" && values.data_documento !== null){
    values.data_documento = moment(values.data_documento).format("YYYY-MM-DD");
  }else {
    values.data_documento = null
  }

  if (values.data_transacao !== "" && values.data_transacao !== null){
    values.data_transacao = moment(values.data_transacao).format("YYYY-MM-DD");
  }else {
    values.data_transacao = null
  }

  values.rateios.map((rateio) => {

    if (typeof rateio.especificacao_material_servico === "object" && rateio.especificacao_material_servico !== null){
      rateio.especificacao_material_servico = rateio.especificacao_material_servico.id
    }else {
      rateio.especificacao_material_servico = convertToNumber(rateio.especificacao_material_servico)
    }

    if (typeof rateio.conta_associacao === "object" && rateio.conta_associacao !== null){
      rateio.conta_associacao = rateio.conta_associacao.uuid
    }else {
      if (rateio.conta_associacao === "0" || rateio.conta_associacao === "" || rateio.conta_associacao === 0){
        rateio.conta_associacao = null
      }
    }

    if (typeof rateio.acao_associacao === "object" && rateio.acao_associacao !== null){
      rateio.acao_associacao = rateio.acao_associacao.uuid
    }else {
      if (rateio.acao_associacao === "0" || rateio.acao_associacao === "" || rateio.acao_associacao === 0) {
        rateio.acao_associacao = null
      }
    }

    if (rateio.tipo_custeio !== null ){

      if (typeof rateio.tipo_custeio === "object" && rateio.tipo_custeio !== null){
        rateio.tipo_custeio = rateio.tipo_custeio.id
      }else {

        if (rateio.tipo_custeio === "0" || rateio.tipo_custeio === 0 || rateio.tipo_custeio === ""){
          rateio.tipo_custeio = null
        }else {
          rateio.tipo_custeio = convertToNumber(rateio.tipo_custeio)
        }
      }
    }

    rateio.quantidade_itens_capital = convertToNumber(rateio.quantidade_itens_capital)
    rateio.valor_item_capital = trataNumericos(rateio.valor_item_capital)
    rateio.valor_rateio = round(trataNumericos(rateio.valor_rateio),2)

    if (rateio.aplicacao_recurso === "0" || rateio.aplicacao_recurso === "" || rateio.aplicacao_recurso === 0){
      rateio.aplicacao_recurso = null
    }

    if (rateio.especificacao_material_servico === "0" || rateio.especificacao_material_servico === 0 || rateio.especificacao_material_servico === ""){
      rateio.especificacao_material_servico = null
    }

    if (rateio.aplicacao_recurso === "CAPITAL"){
      rateio.valor_rateio = round(rateio.quantidade_itens_capital * rateio.valor_item_capital, 2)
    }

  })

  return values
}

export const exibeValorFormatadoPT_BR = (valor)  => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export const exibeDataPT_BR = (data) => {
  if (data === 'None'){
    data = moment(new Date(), "YYYY-MM-DD").format("DD/MM/YYYY");
  }else {
    data =  moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY");
  }
  return data
}

export const exibeDateTimePT_BR = (data) => {
  if (data === 'None'){
    data = moment(new Date(), "YYYY-MM-DD").format("DD/MM/YYYY [às] HH:mm:ss");
  }else {
    data =  moment(new Date(data), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY [às] HH:mm:ss");
  }
  return data
}

export const exibeDateTimePT_BR_Ata = (data) => {
  if (data === 'None'){
    data = moment(new Date(), "YYYY-MM-DD").format("DD/MM/YYYY [às] HH:mm");
  }else {
    data =  moment(new Date(data), "YYYY-MM-DD").format("DD/MM/YYYY [às] HH:mm");
  }
  return data
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
export const calculaValorRecursoAcoes = (values) => {

  //console.log("Calcula Valor ", values)

  let valor_totalTratado = trataNumericos(values.valor_total)
  let valor_recursos_propriosTratado = trataNumericos(values.valor_recursos_proprios)
  let valor_total = round(valor_totalTratado - valor_recursos_propriosTratado, 2);
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

export const processoIncorporacaoMask = (value) => {
  // 0000.0000/0000000-0
  let processo = value.replace(/[^\d]+/g, "");

  let mask = [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]

  return mask
}

function valida_cpf_cnpj ( valor ) {

  // Remove caracteres inválidos do valor
  if (valor){
    valor = valor.replace(/[^0-9]/g, '');
  }

  if (
      !valor ||
      (valor.length < 11 && valor.length > 14) ||
      valor === "00000000000" ||
      valor === "00000000000000" ||
      valor === "11111111111" ||
      valor === "11111111111111" ||
      valor === "22222222222" ||
      valor === "22222222222222" ||
      valor === "33333333333" ||
      valor === "33333333333333" ||
      valor === "44444444444" ||
      valor === "44444444444444" ||
      valor === "55555555555" ||
      valor === "55555555555555" ||
      valor === "66666666666" ||
      valor === "66666666666666" ||
      valor === "77777777777" ||
      valor === "77777777777777" ||
      valor === "88888888888" ||
      valor === "88888888888888" ||
      valor === "99999999999" ||
      valor === "99999999999999"
  ){
    return false
  }


  // Verifica se é CPF ou CNPJ
  let valida = verifica_cpf_cnpj( valor );

  // Garante que o valor é uma string
  valor = valor.toString();



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

export const getTextoStatusPeriodo = (statusId) => {
  if (statusId === 'EM_ANDAMENTO') {
    status = 'O período está em andamento, os dados apresentados estão em atualização sendo cadastrados.'
  } else if (statusId === 'PENDENTE') {
    status = 'O período está pendente'
  } else if (statusId === 'CONCILIADO') {
    status = 'O período foi conferido pela Associação'
  } else if (statusId === 'APROVADO') {
    status =
        'O período está fechado e foi aprovado pela Diretoria Regional de Educação'
  } else if (statusId === 'REJEITADO') {
    status =
        'O período está fechado e foi rejeitado pela Diretoria Regional de Educação'
  } else {
    status = 'O período está com status indefinido'
  }
  return status
}

export const getCorStatusPeriodo = (statusId) => {
  let cor = ''
  if (statusId === 'EM_ANDAMENTO') {
    cor = 'cinza'
  } else if (statusId === 'PENDENTE') {
    cor = 'vermelho'
  } else if (statusId === 'CONCILIADO') {
    cor = 'amarelo'
  } else if (statusId === 'APROVADO') {
    cor = 'verde'
  } else if (statusId === 'REJEITADO') {
    cor = 'vermelho'
  } else {
    cor = 'vermelho'
  }
  return cor
}