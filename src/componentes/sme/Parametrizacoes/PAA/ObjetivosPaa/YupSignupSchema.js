import * as yup from "yup";

export const YupSignupSchema = () =>
    yup.object().shape({
      nome: yup
        .string()
        .transform(value => (typeof value === "string" ? value.trim() : value))
        .required("Nome do objetivo é obrigatório"),
    });
  