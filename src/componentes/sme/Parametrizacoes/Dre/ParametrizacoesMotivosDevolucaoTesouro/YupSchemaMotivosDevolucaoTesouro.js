import * as yup from "yup";

export const YupSchemaMotivosDevolucaoTesouro  = yup.object().shape({
    nome: yup.string().required("Motivo é obrigatório."),
});