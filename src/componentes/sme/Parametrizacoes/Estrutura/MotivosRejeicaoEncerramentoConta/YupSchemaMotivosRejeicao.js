import * as yup from "yup";

export const YupSchemaMotivosRejeicao  = yup.object().shape({
    nome: yup.string().required("Motivo é obrigatório."),
});