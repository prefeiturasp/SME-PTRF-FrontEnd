import * as yup from 'yup'
import { trataNumericos } from "../../../utils/ValidacoesAdicionaisFormularios";


export const ReceitaSchema = yup.object().shape({
    tipo_receita: yup.string().required("Tipo de receita é obrigatório."),
    acao_associacao: yup.string().required("Ação é obrigatório."),
    conta_associacao: yup.string().required("Tipo de conta é obrigatório."),
    data: yup.string().required("Data da receita é obrigatório."),
    valor: yup.string().required("Valor da receita é obrigatório.")
        .test('test-valor', 'Valor deve ser maior que zero.',
        function (value) {
            return !(trataNumericos(value) <= 0);
        }).test('test-string', 'Valor da receita é obrigatório.',
        function (value) {
            return !(typeof(value) == undefined)
        }),
    descricao: yup.string().required("Descrição é obrigatório."),
});