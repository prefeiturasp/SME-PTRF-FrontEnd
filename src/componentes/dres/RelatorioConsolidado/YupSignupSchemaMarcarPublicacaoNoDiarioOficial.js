import * as yup from "yup";

export const YupSignupSchemaMarcarPublicacaoNoDiarioOficial = yup.object().shape({
    data_publicacao: yup.string().required("Campo data da publicação é obrigatório").nullable(),
    pagina_publicacao: yup.string().required("Campo página da publicação é obrigatório"),
});
