import React from "react";

export const TextoDinamicoSuperior = ({dadosAta, retornaDadosAtaFormatado, prestacaoDeContasDetalhe}) => {
    let primeiro_paragrafo = `ATA DA REUNIÃO ${retornaDadosAtaFormatado("tipo_reuniao")} DA Associação ${dadosAta.associacao.nome ? dadosAta.associacao.nome : "___"} DO(A) Unidade Educacional ${dadosAta.associacao.unidade.nome ? dadosAta.associacao.unidade.nome : "___"}`.toUpperCase();
    const textoAlertaPrevia = 'Atenção! Essa é apenas uma prévia da ata. As informações aqui exibidas podem mudar até a conclusão da prestação de contas. A ata final só poderá ser criada após a conclusão do período.'

    let textoPauta = ''
    let textoObjeto = ''
    if (dadosAta.tipo_ata === 'RETIFICACAO') {
        textoPauta = ` Retificação da Prestação de Contas do PTRF e suas ações agregadas, 
        do período de ${retornaDadosAtaFormatado("periodo.data_inicio_realizacao_despesas")} a 
        ${retornaDadosAtaFormatado("periodo.data_fim_realizacao_despesas")}, 
        referente ao ${retornaDadosAtaFormatado("periodo.referencia")}.`

        textoObjeto = 'as alterações realizadas, conforme solicitado pela DRE, resultando nos dados consolidados'
    } else {
        textoPauta = ` Apresentação ao Conselho Fiscal da prestação de contas da verba do PTRF e suas ações agregadas, 
        do período de ${retornaDadosAtaFormatado("periodo.data_inicio_realizacao_despesas")} a 
        ${retornaDadosAtaFormatado("periodo.data_fim_realizacao_despesas")}, 
        referente ao ${retornaDadosAtaFormatado("periodo.referencia")}.`

        textoObjeto = 'os documentos fiscais referentes às despesas realizadas no período para análise dos presentes'
    }
    return(
        <>
            {/*Para as atas de apresentação (Não retificação)*/}
            {/*Se não tem Prestação de Conta trata-se de uma prévia e exibe o texto de alerta*/}
            {dadosAta && dadosAta.tipo_ata !== 'RETIFICACAO' && !dadosAta.prestacao_conta &&
            <p>
                <strong>{textoAlertaPrevia}</strong>
            </p>
            }

            {/*Para as atas de retificação*/}
            {/*Se o status da PC é DEVOLVIDA trata-se de uma prévia e exibe texto de alerta*/}
            {dadosAta && dadosAta.tipo_ata === 'RETIFICACAO' && prestacaoDeContasDetalhe && prestacaoDeContasDetalhe.status && prestacaoDeContasDetalhe.status === 'DEVOLVIDA' &&
            <p>
                <strong>{textoAlertaPrevia}</strong>
            </p>
            }

            <p>
                {primeiro_paragrafo}
            </p>
            <p>
                {retornaDadosAtaFormatado("data_reuniao")},
                no(a) {dadosAta.local_reuniao ? dadosAta.local_reuniao : "___"}, {dadosAta.associacao.unidade.tipo_unidade ? dadosAta.associacao.unidade.tipo_unidade : "___"} {dadosAta.associacao.unidade.nome ? dadosAta.associacao.unidade.nome : "___"},
                com início às {dadosAta.hora_reuniao}, reuniram-se os membros
                da {dadosAta.associacao.nome ? dadosAta.associacao.nome : "___"} para tratar da seguinte pauta:
                {textoPauta} Aberta a reunião
                em {retornaDadosAtaFormatado("convocacao")}, pelo(a)
                Senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"}, {dadosAta.cargo_presidente_reuniao ? dadosAta.cargo_presidente_reuniao : "___"} e
                verificada a existência de número legal de membros presentes, o(a)
                senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"} apresentou {textoObjeto}, conforme segue:
            </p>
        </>
    )
}