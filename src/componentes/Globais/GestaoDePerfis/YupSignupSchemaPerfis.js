import * as yup from "yup";
import {valida_cpf_cnpj} from "../../../utils/ValidacoesAdicionaisFormularios";

export const YupSignupSchemaPerfis = yup.object().shape({
    cargo_educacao: yup.string()
        .test('test-name', 'É obrigatório e não pode ultrapassar 45 caracteres',
            function (value) {
                const { representacao } = this.parent;
                if(representacao === "SERVIDOR"){
                    return !(!value || value.trim() === "" || value.length > 45);
                }else {
                    return true
                }
            }),

    e_servidor: yup.string().required("Tipo de usuário é obrigatório"),

    // username: yup.string().required("ID do usuário é obrigatório")
    //     .test('test-name', 'Digite um CPF válido',
    //         function (value) {
    //             const { e_servidor } = this.parent;
    //             if (e_servidor === 'False'){
    //                 if(value !== undefined){
    //                     return valida_cpf_cnpj(value)
    //                 }else {
    //                     return true
    //                 }
    //             }else {
    //                 return true
    //             }
    //         }),
    name: yup.string().required("Nome de usuário é obrigatório"),
    groups: yup.string().required("Grupo de acesso é obrigatório"),
});