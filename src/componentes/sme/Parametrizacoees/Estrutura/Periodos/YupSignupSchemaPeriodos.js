import * as yup from "yup";

export const YupSignupSchemaPeriodos = yup.object().shape({
    referencia: yup.string().required("Referência é obrigatório"),
    data_inicio_realizacao_despesas: yup.string().required("Data de início de realização de despesas é obrigatório"),
    data_fim_realizacao_despesas: yup.string().required("Data de fim de realização de despesas é obrigatório"),
});