import React from "react";

export const TextoDinamicoSuperior = ({dadosAta, retornaDadosAtaFormatado}) => {
    //console.log("TextoDinamicoSuperior ", dadosAta)
    return(
        <>
            <p>
                ATA DA REUNIÃO {retornaDadosAtaFormatado("tipo_reuniao")} DA Associação {dadosAta.associacao.nome ? dadosAta.associacao.nome : "___"} DO(A) Unidade Educacional {dadosAta.associacao.unidade.nome ? dadosAta.associacao.unidade.nome : "___"}
            </p>
            <p>
                Aos {retornaDadosAtaFormatado("data_reuniao")}, reuniram-se os membros da Asociação {dadosAta.associacao.nome ? dadosAta.associacao.nome : "___"} do(a) Unidade Educacional {dadosAta.associacao.unidade.nome ? dadosAta.associacao.unidade.nome : "___"} no(a) {dadosAta.local_reuniao ? dadosAta.local_reuniao : "___"} , para tratar da seguinte pauta: Apresentação ao Conselho Fiscal da prestação de contas da verba do PTRF
                e suas ações agregadas, do período de {retornaDadosAtaFormatado("periodo.data_inicio_realizacao_despesas")} até {retornaDadosAtaFormatado("periodo.data_fim_realizacao_despesas")}, referente ao {retornaDadosAtaFormatado("periodo.referencia")}. Aberta a reunião em {retornaDadosAtaFormatado("convocacao")}, convocação pelo(a) Senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"}, {dadosAta.cargo_presidente_reuniao ? dadosAta.cargo_presidente_reuniao : "___"} e verificada a existência de número legal de membros presentes, o(a) senhor(a) {dadosAta.presidente_reuniao ? dadosAta.presidente_reuniao : "___"} apresentou os documentos fiscais referentes às despesas realizadas no período para análise dos presentes, conforme segue:
            </p>
        </>
    )
}