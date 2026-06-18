import * as yup from "yup";

export const YupSchemaComissoes  = yup.object().shape({
    nome: yup.string().required("Nome da comissão é obrigatório."),
    recursos: yup.array().min(1, "Selecione pelo menos um recurso").required("Recurso é obrigatório"),
    responsavel_analise_pc: yup.boolean().notRequired(),
});