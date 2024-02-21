import * as yup from "yup";

export const YupSignupSchemaAta = yup.object().shape({
    listaPresentesPadrao: yup.array()
        .of(yup.object().shape({
            nome: yup.string().required('Nome do presente é obrigatorio'),
        })),
})
