import * as yup from "yup";

export const YupSchemaDetalheTipoCredito  = yup.object().shape({
    nome: yup.string().required("Detalhe é obrigatório."),
    tipo_receita: yup.string().required("Tipo de crédito é obrigatório"),
    recurso_uuid: yup.string().required("Recurso é obrigatório"),
});