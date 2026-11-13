import * as yup from "yup";

export const FormProgramaPDDEValidacao = yup.object().shape({
    nome: yup.string().trim().required("Nome é obrigatório"),
});
