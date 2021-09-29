import * as yup from "yup";

export const YupSignupSchemaDetalharAcertosDocumentos = yup.object().shape({
    solicitacoes_acerto: yup.array()
        .of(yup.object().shape({
            tipo_acerto: yup.string().required('Tipo de acerto é obrigatorio')
        }))
})
