import * as yup from "yup";

export const YupSchemaTipoConta  = yup.object().shape({
    nome: yup.string().required("Nome é obrigatório"),
});