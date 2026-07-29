/* Schemas Yup do cadastro de despesa (pipeline). */
import * as yup from "yup";
import {trataNumericos} from "./numericos";
import {valida_cpf_cnpj} from "./cpfCnpj";

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

