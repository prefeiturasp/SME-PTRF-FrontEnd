import * as yup from "yup";

export const YupSignupSchemaDetalharAcertos = (idDevolucaoTesouro) => yup.object().shape({
    solicitacoes_acerto: yup.array()
        .of(yup.object().shape({
            tipo_acerto: yup.string().required('Tipo de acerto é obrigatório'),
            detalhamento: yup.string().notRequired().when('tipo_acerto', {
                is: idDevolucaoTesouro,
                then: yup.string().required('Motivo é obrigatório')
            }),
            devolucao_tesouro: yup.object({}).notRequired().when('tipo_acerto', {
                is: idDevolucaoTesouro,
                then: yup.object().shape({
                    tipo: yup.string().required('Tipo de devolução é obrigatório'),
                    devolucao_total: yup.string().required('Valor total ou parcial é obrigatório'),
                    valor: yup.string().required('Valor é obrigatório')
                })
            })
        }))
})

// export const YupSignupSchemaDetalharAcertos = yup.object().shape({
//     solicitacoes_acerto: yup.array()
//         .of(yup.object().shape({
//                 tipo_acerto: yup.string().required('Tipo de acerto é obrigatorio')
//             }).test('test-name', 'É obrigatório e não pode ultrapassar 160 caracteres',
//                 function (value) {
//                     debugger
//                     const devolucao_tesouro  = value && value.devolucao_tesouro && value.devolucao_tesouro.tipo ? value.devolucao_tesouro : {};
//
//                     if (Object.entries(devolucao_tesouro) > 0){
//                         let cont = devolucao_tesouro
//                     }
//
//                     if(!devolucao_tesouro){
//                         return true;
//                     }else {
//                         return false
//                     }
//                 }),
//         )
// })