/* Normalização do payload antes de salvar a despesa. */
import moment from "moment";
import {ASSOCIACAO_UUID} from "../../../../../services/auth.service";
import {convertToNumber, round, trataNumericos} from "./numericos";
import {metodosAuxiliares} from "./metodosAuxiliares";

export const validaPayloadDespesas = (values, despesasTabelas=null, parametroLocation=null) => {
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

  if (values.despesas_impostos){
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

          if(parametroLocation){
            if(metodosAuxiliares.origemAnaliseLancamento(parametroLocation)){
              metodosAuxiliares.mantemConciliacaoAtualImposto(despesa_imposto);
            }
          }
      }
    });
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

