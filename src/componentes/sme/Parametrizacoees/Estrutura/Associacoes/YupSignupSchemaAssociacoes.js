import * as yup from "yup";

export const YupSignupSchemaAssociacoes  = yup.object().shape({
    nome: yup.string().required("Nome é obrigatório"),
    codigo_eol_unidade: yup.string().required("Código EOL da unidade é obrigatório"),
});