import * as yup from "yup";
import {valida_cpf_cnpj} from "../../../utils/ValidacoesAdicionaisFormularios";

export const YupSignupSchemaHistoricoDeMembros = yup.object().shape({
    nome: yup.string().required("Nome Completo é obrigatório").nullable(),
    cargo_associacao: yup.string().required("Cargo na Associação é obrigatório"),
    representacao: yup.string().required("Representação é obrigatório"),
    email: yup.string().email("Digite um email válido").nullable(),

    codigo_identificacao: yup.string().nullable()
        .test('test-name', 'É obrigatório e não pode ultrapassar 10 caracteres',
            function (value) {
                const { representacao } = this.parent;
                if(representacao === "SERVIDOR" || representacao === "ESTUDANTE"){
                    if (!value){
                        return false
                    }else {
                        return !(!value || value.trim() === "" || value.length > 10);
                    }

                }else {
                    return true
                }
            }),

    cpf_responsavel: yup.string().nullable()
        .test('test-name', 'Digite um CPF válido',
            function (value) {
                const { representacao } = this.parent;
                if(representacao === "PAI_RESPONSAVEL" || representacao === "ESTUDANTE"){
                    return valida_cpf_cnpj(value)
                }else {
                    return true
                }
            }),

    data_inicio_no_cargo: yup.string().required(" Período inicial de ocupação é obrigatório").nullable(),

    responsavel_pelas_atribuicoes: yup.string().nullable()
        .test('test-name', 'Responsável pelas atribuições é obrigatório',
            function (value) {
                const { cargo_associacao } = this.parent;
                const { switch_status_presidente } = this.parent;
                return !(cargo_associacao === "PRESIDENTE_DIRETORIA_EXECUTIVA" && !switch_status_presidente && !value);
            }),
});