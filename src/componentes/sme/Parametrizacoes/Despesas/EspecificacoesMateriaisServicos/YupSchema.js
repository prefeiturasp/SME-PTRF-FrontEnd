import * as yup from "yup";

export const YupSchema  = yup.object().shape({
    descricao: yup.string().required("Descrição é obrigatório."),
    aplicacao_recurso: yup.string().required("Aplicação de recurso é obrigatório."),
    tipo_custeio: yup.string().when('aplicacao_recurso', {
        is: 'CAPITAL',
        then: yup.string().nullable(),
        otherwise: yup.string().required("Tipo de custeio é obrigatório."),
    })
});
