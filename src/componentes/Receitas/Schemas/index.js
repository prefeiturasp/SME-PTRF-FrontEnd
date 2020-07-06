import * as yup from 'yup'
import { trataNumericos } from "../../../utils/ValidacoesAdicionaisFormularios";


export const ReceitaSchema = yup.object().shape({
    tipo_receita: yup.string().required("Tipo de crédito é obrigatório."),
    categoria_receita: yup.string().required("Classificação do crédito é obrigatório."),
    acao_associacao: yup.string().required("Ação é obrigatório."),
    conta_associacao: yup.string().required("Tipo de conta é obrigatório."),
    data: yup.string().required("Data do crédito é obrigatório.").nullable(),
    valor: yup.string().required("Valor do crédito é obrigatório.")
        .test('test-valor', 'Valor deve ser maior que zero.',
        function (value) {
            return !(trataNumericos(value) <= 0);
        }).test('test-string', 'Valor do crédito é obrigatório.',
        function (value) {
            return !(typeof(value) == undefined)
        }),
});