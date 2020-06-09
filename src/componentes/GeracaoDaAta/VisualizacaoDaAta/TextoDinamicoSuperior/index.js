import React from "react";

export const TextoDinamicoSuperior = ({dadosAta, retornaDadosAtaFormatado}) => {
    console.log("TextoDinamicoSuperior ", dadosAta)
    return(
        <>
            <p>
                ATA DA REUNIÃO {retornaDadosAtaFormatado("tipo_reuniao")} DA Associação {dadosAta.associacao.nome ? dadosAta.associacao.nome : "___"} DO(A) Unidade Educacional {dadosAta.associacao.unidade.nome ? dadosAta.associacao.unidade.nome : "___"}
            </p>

            <p>
                Aos {retornaDadosAtaFormatado("data_reuniao")}, reuniram-se os membros da Asociação “[associacao.nome]” do(a) Unidade Educacional “[associacao.unidade.nome] no(a) [local_reuniao] , para tratar da seguinte pauta: Apresentação ao Conselho Fiscal da prestação de contas da verba do PTRF
                e suas ações agregadas, do período de [periodo.data_inicio_realizacao_despesas] [periodo.data_fim_realizacao_despesas] 20/02/2019  até  20/05/2020], referente ao [periodo.referencia] 1°] repasse de 2019. Aberta a reunião em [convocacao+tabela=1ª convocação] , ___ convocação pelo(a) Senhor(a) [presidente_reuniao] , [cargo_presidente_reuniao] e verificada a existência de número legal de membros presentes, o(a) senhor(a) [presidente_reuniao] apresentou os documentos fiscais referentes às despesas realizadas no período para análise dos presentes, conforme segue:
            </p>
        </>
    )
}