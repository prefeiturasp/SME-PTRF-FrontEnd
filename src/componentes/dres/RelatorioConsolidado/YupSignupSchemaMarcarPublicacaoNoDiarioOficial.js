import * as yup from "yup";

export const YupSignupSchemaMarcarPublicacaoNoDiarioOficial = yup.object().shape({
    data_publicacao: yup.string().required("Campo data é obrigatório").nullable(),
    pagina_publicacao: yup.string().when('habilita_exibicao_de_lauda', {
        is: (value) => Boolean(value),
        then: yup.string().required("Campo página da publicação é obrigatório"),
        otherwise: yup.string(),
    }),
});