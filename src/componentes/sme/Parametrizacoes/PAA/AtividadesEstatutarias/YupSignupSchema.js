import * as yup from "yup";

export const YupSignupSchema = () =>
    yup.object().shape({
      nome: yup
        .string()
        .transform(value => (typeof value === "string" ? value.trim() : value))
        .required("Nome da atividade estatutária é obrigatório"),
      tipo: yup
        .string()
        .required("Tipo da atividade estatutária é obrigatório"),
      status: yup
        .string()
        .required("Status da atividade estatutária é obrigatório"),
      mes: yup
        .string()
        .required("Mês da atividade estatutária é obrigatório"),
    });
  