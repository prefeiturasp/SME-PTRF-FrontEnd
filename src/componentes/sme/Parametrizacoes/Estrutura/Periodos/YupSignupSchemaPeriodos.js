import * as yup from "yup";

export const YupSignupSchemaPeriodos  = yup.object().shape({
    referencia: yup.string().required("Referência é obrigatório"),
    data_inicio_realizacao_despesas: yup.string().required("Data de início de realização de despesas é obrigatório").nullable(),

    data_fim_prestacao_contas: yup.date().nullable()
    .when("data_inicio_prestacao_contas", (data_inicio_prestacao_contas, YupSignupSchemaPeriodos) => data_inicio_prestacao_contas ? YupSignupSchemaPeriodos.min(data_inicio_prestacao_contas, "A data de fim de prestação de contas não pode ser anterior a data de início de prestação de contas") : YupSignupSchemaPeriodos)
});