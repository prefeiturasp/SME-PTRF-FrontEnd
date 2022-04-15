/* eslint eqeqeq: 0 */
/* eslint-disable */
import * as yup from "yup";
import moment from "moment";
import {ASSOCIACAO_UUID} from "../services/auth.service";
import {getPeriodoFechado} from "../services/escolas/Associacao.service";

export const checkDuplicateInObject = (propertyName, inputArray) => {

  var seenDuplicate = false,
      testObject = {};

  inputArray.map((item) => {
    let itemPropertyName = item[propertyName];
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

export const YupSignupSchemaAssociacoes  = yup.object().shape({
  nome: yup.string().required("Nome é obrigatório"),
  codigo_eol_unidade: yup.string().required("Código EOL da unidade é obrigatório"),
  status_regularidade: yup.string().required("Status de regularidade é obrigatório"),
  cnpj: yup.string()
  .test('test-name', 'Digite um CNPJ Válido',
      function (value) {
        if (value){
          return valida_cnpj(value)
        }else {
          return true
        }
      }),
});

export const YupSignupSchemaDreDadosDiretoria = yup.object().shape({
  dre_cnpj: yup.string()
  .test('test-name', 'Digite um CNPJ Válido',
      function (value) {
        if (value){
          return valida_cnpj(value)
        }
        else{
          // O campo CNPJ não é mais obrigatório
          return true;
        }
      }),
});

export const YupSignupSchemaDadosDaAssociacao = yup.object().shape({
  email: yup.string().email("Digite um email válido").nullable(),
});

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
  login: yup.string().required("Campo Usuário é obrigatório"),
  senha: yup.string().required("Campo Senha é obrigatório"),
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

export const YupSignupSchemaCadastroDespesaSaida = yup.object().shape({

  nome_fornecedor: yup.string().required("Nome Fornecedor é obrigatório")
  .test('test-nome-fornecedor', 'Digite um nome de fornecedor válido',
      function (value) {
        if (value !== undefined || value !== '') {
          return true
        } else {
          return false
        }
      }),

  tipo_documento:yup.string().required("Tipo de documento é obrigatório")
  .test('test-tipo-documento', 'Selecione um tipo de documento válido',
      function (value) {
        if (value !== undefined || value !== '') {
          return true
        } else {
          return false
        }
      }),


  data_documento: yup.string().required("Data do documento é obrigatório.").nullable(),
  tipo_transacao: yup.string().required("Tipo da transação é obrigatório.").nullable(),

  data_transacao: yup.string().required("Data do pagamento é obrigatório.").nullable(),
  documento_transacao: yup.string().nullable(),

  valor_total: yup.string().required("Valor do crédito é obrigatório.")
    .test('test-valor', 'Valor deve ser maior que zero.',
      function (value) {
          return !(trataNumericos(value) <= 0);
      })
    .test('test-string', 'Valor do crédito é obrigatório.',
      function (value) {
          return !(typeof(value) == undefined)
      }),

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

export const periodoFechadoImposto = async (despesas_impostos, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral) =>{  
  for(let despesa_imposto = 0; despesa_imposto <= despesas_impostos.length-1; despesa_imposto++){
    if(despesas_impostos[despesa_imposto].data_transacao){
      let data = moment(despesas_impostos[despesa_imposto].data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");

      try{
        let periodo_fechado = await getPeriodoFechado(data);
        if (!periodo_fechado.aceita_alteracoes){
          setReadOnlyBtnAcao(true);
          setShowPeriodoFechadoImposto(true);
          setReadOnlyCamposImposto(prevState => ({...prevState, [despesa_imposto]: true}));
          setDisableBtnAdicionarImposto(true);
        }
        else{
          setReadOnlyBtnAcao(false);
          setShowPeriodoFechadoImposto(false);
          setReadOnlyCamposImposto(prevState => ({...prevState, [despesa_imposto]: false}));
          setDisableBtnAdicionarImposto(false);
        }
      }
      catch (e){
        setReadOnlyBtnAcao(true);
        setShowPeriodoFechadoImposto(true);
        setReadOnlyCamposImposto(prevState => ({...prevState, [despesa_imposto]: true}));
        setDisableBtnAdicionarImposto(true);
        onShowErroGeral();
        console.log("Erro ao buscar perído ", e)
      }
    }
  }
}

export const validaPayloadDespesas = (values, despesasTabelas=null) => {

  let exibe_documento_transacao
  if (despesasTabelas){
    if (typeof values.tipo_transacao === 'object' && values.tipo_transacao !== null){
      exibe_documento_transacao = despesasTabelas.tipos_transacao.find(element => element.id === Number(values.tipo_transacao.id))
    }else {
      exibe_documento_transacao =  despesasTabelas.tipos_transacao.find(element => element.id === Number(values.tipo_transacao))
    }
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
  values.valor_total = round(trataNumericos(values.valor_total),2);
  values.valor_original = trataNumericos(values.valor_original);

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

  // validacoes da despesa imposto
  values.despesas_impostos.map((despesa_imposto) => {
    if(despesa_imposto.data_transacao !== "" && despesa_imposto.data_transacao !== null){
      despesa_imposto.data_transacao = moment(despesa_imposto.data_transacao).format("YYYY-MM-DD");
    }
    else{
      despesa_imposto.data_transacao = null;
    }

    if(despesa_imposto.rateios.length >= 0){
        despesa_imposto.rateios.map((rateio) => {
            // o valor total e original da despesa imposto, devem ser o mesmo que o dos rateios
            despesa_imposto.valor_total = trataNumericos(rateio.valor_rateio);
            despesa_imposto.valor_original = trataNumericos(rateio.valor_original);

            rateio.quantidade_itens_capital = convertToNumber(rateio.quantidade_itens_capital);
            rateio.valor_item_capital = trataNumericos(rateio.valor_item_capital);
            rateio.valor_rateio = round(trataNumericos(rateio.valor_rateio), 2);
            rateio.valor_original = round(trataNumericos(rateio.valor_original), 2);
        });
    }
  });

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

    if (typeof rateio.tag === "object" && rateio.tag !== null){
      rateio.tag = rateio.tag.uuid
    }else {
      if ( rateio.tag === "" || rateio.escolha_tags === 'nao' ) {
        rateio.tag = null
      }
    }

    rateio.quantidade_itens_capital = convertToNumber(rateio.quantidade_itens_capital)
    rateio.valor_item_capital = trataNumericos(rateio.valor_item_capital)
    rateio.valor_rateio = round(trataNumericos(rateio.valor_rateio),2)
    rateio.valor_original = round(trataNumericos(rateio.valor_original),2)

    if (rateio.aplicacao_recurso === "0" || rateio.aplicacao_recurso === "" || rateio.aplicacao_recurso === 0){
      rateio.aplicacao_recurso = null
    }

    if (rateio.especificacao_material_servico === "0" || rateio.especificacao_material_servico === 0 || rateio.especificacao_material_servico === ""){
      rateio.especificacao_material_servico = null
    }

    if (rateio.aplicacao_recurso === "CAPITAL"){
      //rateio.valor_rateio = round(rateio.quantidade_itens_capital * rateio.valor_item_capital, 2)
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
    data = moment(new Date(data), "YYYY-MM-DD").format("DD/MM/YYYY [às] HH:mm:ss");
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
};
export const calculaValorRecursoAcoes = (values) => {
  let valor_totalTratado = trataNumericos(values.valor_total);
  let valor_recursos_propriosTratado = trataNumericos(values.valor_recursos_proprios);
  return round(valor_totalTratado - valor_recursos_propriosTratado, 2);
};

export const calculaValorOriginal = (values) => {
  let valor_total_ratado = trataNumericos(values.valor_original);
  let valor_recursos_proprios_tratado = trataNumericos(values.valor_recursos_proprios);
  let valor_total = round(valor_total_ratado - valor_recursos_proprios_tratado, 2);
  return valor_total;
};

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

export function valida_cpf_cnpj_permitindo_cnpj_zerado ( valor ) {

  // Remove caracteres inválidos do valor
  if (valor){
    valor = valor.replace(/[^0-9]/g, '');
  }

  if (
      !valor ||
      (valor.length < 11 && valor.length > 14) ||
      valor === "00000000000" ||
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

export function valida_cpf_cnpj ( valor ) {

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
    status = 'O período foi conferido e fechado pela Associação de Pais e Mestres'
  } else if (statusId === 'APROVADO') {
    status = 'O período está fechado e foi aprovado pela Diretoria Regional de Educação'
  } else if (statusId === 'REJEITADO') {
    status =
        'O período está fechado e foi rejeitado pela Diretoria Regional de Educação'
  } else {
    status = 'O período está com status indefinido'
  }
  return status
};

export const getCorStatusPeriodo = (statusId) => {
  let cor = ''
  if (statusId === 'EM_ANDAMENTO' || (statusId && statusId.prestacao_contas_status && statusId.prestacao_contas_status.texto_status === "Período em andamento. ")) {
    cor = 'amarelo'
  } else if (statusId === 'PENDENTE') {
    cor = 'vermelho'
  } else if (statusId === 'CONCILIADO') {
    cor = 'azul'
  } else if (statusId === 'APROVADO') {
    cor = 'verde'
  } else if (statusId === 'REJEITADO') {
    cor = 'vermelho'
  } else {
    cor = 'vermelho'
  }
  return cor
};


export const slugify = (string) =>{
  return string
  .toString()
  .trim()
  .toLowerCase()
  .replace(/[àÀáÁâÂãäÄÅåª]+/g, 'a')       // Special Characters #1
  .replace(/[èÈéÉêÊëË]+/g, 'e')       	// Special Characters #2
  .replace(/[ìÌíÍîÎïÏ]+/g, 'i')       	// Special Characters #3
  .replace(/[òÒóÓôÔõÕöÖº]+/g, 'o')       	// Special Characters #4
  .replace(/[ùÙúÚûÛüÜ]+/g, 'u')       	// Special Characters #5
  .replace(/[ýÝÿŸ]+/g, 'y')       		// Special Characters #6
  .replace(/[ñÑ]+/g, 'n')       			// Special Characters #7
  .replace(/[çÇ]+/g, 'c')       			// Special Characters #8
  .replace(/[ß]+/g, 'ss')       			// Special Characters #9
  .replace(/[Ææ]+/g, 'ae')       			// Special Characters #10
  .replace(/[Øøœ]+/g, 'oe')       		// Special Characters #11
  .replace(/[%]+/g, 'pct')       			// Special Characters #12
  .replace(/\s+/g, '-')           		// Replace spaces with -
  .replace(/[^\w\-]+/g, '')       		// Remove all non-word chars
  .replace(/\-\-+/g, '-')         		// Replace multiple - with single -
  .replace(/^-+/, '')             		// Trim - from start of text
  .replace(/-+$/, '');            		// Trim - from end of text
};

export const gerarUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16)
  });
};

export const comparaObjetos = (objetoA, objetoB) =>{

  //Busca as chaves do objetoA e objetoB
  //utilizando o "let" o escopo da variável é limitado para o bloco.
  //Object.keys retornará um array com todas as chaves do objeto.
  let aChaves = Object.keys(objetoA),
      bChaves = Object.keys(objetoB);

  //Compara os tamanhos, se forem diferentes retorna falso pois
  //o numero de propriedades é diferente, logo os objetos são diferentes
  if (aChaves.length !== bChaves.length) {
    return false;
  }

  //Verifico se existe algum elemento com valor diferente nos objetos.
  //o array.some executa uma função(passada por parâmetro) para cada valor
  //do array. Essa função deve executar um teste, se para algum dos valores
  //o teste é verdadeiro, a execução é interrompida e true é retornado.
  //Do contrário, se o teste nunca for verdadeiro ele retornará false
  //após executar o teste para todos valores do array.
  //Estou basicamente verficando se existe diferença entre dois valores do objeto.

  let saoDiferentes = aChaves.some((chave) => {
    return objetoA[chave] !== objetoB[chave];
  });

  //como saoDiferentes contém true caso os objetos sejam diferentes eu
  //simplesmente nego esse valor para retornar que os objetos são iguais (ou não).
  return !saoDiferentes;
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

export const apenasNumero = (valor) => {
	const re = /^[0-9\b]+$/;
	
	if (valor === '' || re.test(valor)) {
		return true;
		
	}
	return false;
}
