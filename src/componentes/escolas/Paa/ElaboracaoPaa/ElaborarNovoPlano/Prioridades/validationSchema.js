import * as Yup from "yup";

export const createValidationSchema = (selectedRecurso, selectedTipoAplicacao) => {
  let schema = Yup.object().shape({
    prioridade: Yup.string().required('Prioridade é obrigatório'),
    recurso: Yup.string().required('Recurso é obrigatório'),
    tipo_aplicacao: Yup.string().required('Tipo de aplicação é obrigatório'),
    especificacao_material: Yup.string().required('Especificação de material é obrigatório'),
    valor_total: Yup.number()
                    .required('Valor total é obrigatório!')
                    .typeError('Valor total é obrigatório!')
                    .moreThan(0, 'Valor total é obrigatório!')
  });

  // Adicionar validação para campos específicos do PTRF
  if (selectedRecurso === 'PTRF') {
    schema = schema.shape({
      ...schema.fields,
      acao_associacao: Yup.string().required('Ação é obrigatório')
    });
  }

  // Adicionar validação para campos específicos do PDDE
  if (selectedRecurso === 'PDDE') {
    schema = schema.shape({
      ...schema.fields,
      programa_pdde: Yup.string().required('Programa é obrigatório'),
      acao_pdde: Yup.string().required('Ação é obrigatório')
    });
  }

  // Adicionar validação para tipo de despesa quando tipo_aplicacao = CUSTEIO
  if (selectedTipoAplicacao === 'CUSTEIO') {
    schema = schema.shape({
      ...schema.fields,
      tipo_despesa_custeio: Yup.string().required('Tipo de despesa é obrigatório')
    });
  }

  return schema;
}; 