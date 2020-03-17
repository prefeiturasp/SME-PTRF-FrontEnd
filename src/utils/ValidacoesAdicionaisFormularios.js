import * as yup from "yup";

export const YupSignupSchemaLogin = yup.object().shape({
    loginRf: yup.number().typeError('Campo RF precisa ser numérico').required("Campo código RF é obrigatório"),
    loginSenha: yup.number().typeError('Campo Senha precisa ser numérico').required("Campo código Senhya é obrigatório"),
});