import * as yup from "yup";

export const YupSignupSchema = () =>
    yup.object().shape({
      nome: yup
        .string()
        .required("Nome do Recurso é obrigatório"),
    });
  