import * as yup from "yup";

export const YupSignupSchemaMotivosEstorno = yup.object().shape({
    motivo: yup.string().required("Nome é obrigatório"),
});