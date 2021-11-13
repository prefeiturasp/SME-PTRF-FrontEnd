import * as yup from "yup";

export const YupSignupSchemaListaPresentes = yup.object().shape({
    listaPresentesPadrao: yup.array()
        .of(yup.object().shape({
            nome: yup.string().required('Nome do presente é obrigatorio'),
        }))
})
