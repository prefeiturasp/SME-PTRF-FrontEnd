import * as yup from "yup";
import {valida_cpf_cnpj_permitindo_cnpj_zerado} from "../../../../../utils/ValidacoesAdicionaisFormularios";

export const YupSignupSchemaFornecedores  = yup.object().shape({
    nome: yup.string().required("Nome é obrigatório"),
    cpf_cnpj: yup.string()
        .required("CPF / CNPJ é obrigatório")
        .test('test-name', 'Digite um CPF / CNPJ válido',
            function (value) {
                if (value){
                    return valida_cpf_cnpj_permitindo_cnpj_zerado(value)
                }else {
                    return true
                }
            }),
});