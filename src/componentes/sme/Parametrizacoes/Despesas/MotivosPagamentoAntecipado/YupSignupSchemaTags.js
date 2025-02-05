import * as yup from "yup";

export const YupSignupSchemaTags  = yup.object().shape({
    motivo: yup.string().required("Nome do motivo é obrigatório"),
});
