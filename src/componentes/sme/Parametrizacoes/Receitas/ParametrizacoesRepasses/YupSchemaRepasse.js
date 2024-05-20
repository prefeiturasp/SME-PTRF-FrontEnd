import * as yup from "yup";

export const YupSchemaRepasse  = yup.object().shape({
    associacao: yup.string().required("Unidade é obrigatório."),
    conta_associacao: yup.string().required("Conta é obrigatório."),
    acao_associacao: yup.string().required("Ação é obrigatório."),
    periodo: yup.string().required("Período é obrigatório."),
});