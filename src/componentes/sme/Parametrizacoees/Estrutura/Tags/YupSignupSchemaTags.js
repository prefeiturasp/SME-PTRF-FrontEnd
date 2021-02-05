import * as yup from "yup";

export const YupSignupSchemaTags  = yup.object().shape({
    nome: yup.string().required("Nome é obrigatório"),
});