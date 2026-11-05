import * as yup from "yup";

export const YupSignupSchemaAta = yup.object().shape({
    listaParticipantes: yup.array()
        .of(yup.object().shape({
            nome: yup.string().when('professor_gremio', {
                is: (value) => Boolean(value),
                then: yup.string(),
                otherwise: yup.string().required('Nome do presente é obrigatorio'),
            }),
        })),
})
