import * as yup from "yup";

export const YupSchemaAcertosDocumentos = yup.object().shape({
    nome: yup.string().required("Nome é obrigatório."),
    categoria: yup.string().required("Categoria é obrigatório."),
    tipos_documento_prestacao: yup.array().min(1, "Pelo menos um documento é obrigatório."),
    ativo: yup.boolean(),
    pode_alterar_saldo_conciliacao: yup.boolean(),
});
