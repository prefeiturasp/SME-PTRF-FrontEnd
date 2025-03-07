import * as yup from "yup";

export const YupSignupSchemaPeriodos = (deveValidarPeriodoAnterior) =>
    yup.object().shape({
      referencia: yup.string().required("Referência é obrigatória"),
  
      periodo_anterior: deveValidarPeriodoAnterior
        ? yup.string().required("Período anterior é obrigatório")
        : yup.string().nullable(),
  
      data_inicio_realizacao_despesas: yup
        .string()
        .required("Data de início de realização de despesas é obrigatória")
        .nullable(),
  
      data_fim_prestacao_contas: yup.date().nullable().when(
        "data_inicio_prestacao_contas",
        (data_inicio_prestacao_contas, schema) =>
          data_inicio_prestacao_contas
            ? schema.min(
                data_inicio_prestacao_contas,
                "A data de fim de prestação de contas não pode ser anterior à data de início"
              )
            : schema
      ),
    });
  