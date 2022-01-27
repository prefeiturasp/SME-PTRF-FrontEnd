import React from "react";

export const TextoDinamicoSuperior = ({dadosAta, retornaDadosAtaFormatado}) => {
    
    return(
        <>
            <p className="titulo-texto-dinamico-superior mb-2">ATA DE PARECER TÉCNICO CONCLUSIVO {retornaDadosAtaFormatado("numero_ata")}</p>
            <p className="texto-dinamico-superior">
                {retornaDadosAtaFormatado("data_reuniao")}, às {retornaDadosAtaFormatado("hora_reuniao")}, reuniu-se a Comissão de Prestação de Contas do PTRF da Diretoria Regional de Educação {retornaDadosAtaFormatado("nome_dre")},
                instituída pela Portaria DRE-{retornaDadosAtaFormatado("nome_dre")} nº {retornaDadosAtaFormatado("numero_portaria")} de {retornaDadosAtaFormatado("data_portaria")}, para análise das prestações de contas dos recursos transferidos pelo
                Programa de Transferência de Recursos Financeiros - PTRF, período de {retornaDadosAtaFormatado("periodo.data_inicio_realizacao_despesas")} a {retornaDadosAtaFormatado("periodo.data_fim_realizacao_despesas")},
                conforme inciso III e IV do art. 34 da Portaria SME nº 6.634/2021 e deliberou:
            </p>
        </>
    )
}