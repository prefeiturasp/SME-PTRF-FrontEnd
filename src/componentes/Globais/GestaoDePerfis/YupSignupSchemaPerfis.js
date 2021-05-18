import * as yup from "yup";

export const YupSignupSchemaPerfis = yup.object().shape({
    e_servidor: yup.string().required("Tipo de usuário é obrigatório"),
    name: yup.string().required("Nome de usuário é obrigatório"),
    email: yup.string().email("Digite um email válido").nullable(),
    groups: yup.string().required("Grupo de acesso é obrigatório"),
    //visoes: yup.string().required("Visões é obrigatório"),
});