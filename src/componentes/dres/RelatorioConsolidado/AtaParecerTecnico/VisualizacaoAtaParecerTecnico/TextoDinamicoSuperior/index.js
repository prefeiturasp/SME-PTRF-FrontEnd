import React from "react";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { TextoDocumentoConsolidadoPC } from "../../../../../../utils/TextoDocumentoConsolidadoPC";

export const TextoDinamicoSuperior = ({retornaDadosAtaFormatado, retornaTituloCorpoAta, ehPrevia, ehRetificacao, motivoRetificacao}) => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();

    const texto_documento_consolidado_pc = new TextoDocumentoConsolidadoPC(recursoSelecionado?.habilita_exibicao_de_lauda);
    const texto_publicacao = texto_documento_consolidado_pc.texto_artigo_a();
    const texto_emissao = texto_documento_consolidado_pc.texto_emissao();

    const getTexto = (ehRetificacao) => {
        const baseLegal = "conforme incisos III e IV do art. 34 da Portaria SME nº 6.634/2021"

        const textoBase = `${retornaDadosAtaFormatado("data_reuniao")}, às ${retornaDadosAtaFormatado("hora_reuniao")},
         reuniu-se a Comissão de Prestação de Contas do PTRF da Diretoria Regional de Educação 
         ${retornaDadosAtaFormatado("nome_dre")}, instituída pela Portaria DRE-${retornaDadosAtaFormatado("nome_dre")} 
         nº ${retornaDadosAtaFormatado("numero_portaria")} de ${retornaDadosAtaFormatado("data_portaria")},`

        const textoObjetivo = `para análise das prestações de contas ${ehRetificacao ? "RETIFICADAS" : ""} 
        dos recursos transferidos pelo ${recursoSelecionado?.nome}, 
        período de ${retornaDadosAtaFormatado("periodo.data_inicio_realizacao_despesas")} a 
        ${retornaDadosAtaFormatado("periodo.data_fim_realizacao_despesas")}, 
        ${ehRetificacao ? "em virtude dos seguintes motivos:" : `${baseLegal} e deliberou:`}`

        const motivosRetificacao = ehRetificacao ? motivoRetificacao : ""

        const deliberacaoRetificacao = ehRetificacao ? `Após análise, ${baseLegal}, a Comissão deliberou:` : ""

        return <>
            <p className="texto-dinamico-superior">{textoBase} {textoObjetivo}</p>
            <p className="texto-dinamico-superior">{motivosRetificacao}</p>
            <p className="texto-dinamico-superior">{deliberacaoRetificacao}</p>
        </>
    }
    return (
        <>
            <p className="titulo-texto-dinamico-superior mb-2">{retornaTituloCorpoAta()} {retornaDadosAtaFormatado("numero_ata")}</p>
            {ehPrevia() &&
                <p className="texto-atencao">
                    {`Atenção! Essa é uma versão prévia da ata. As informações aqui exibidas podem ser alteradas até ${texto_publicacao}
                    do Consolidado das PCs. A ata final só poderá ser ${texto_emissao} do
                    Consolidado das PCs.`}
                </p>
            }

            {getTexto(ehRetificacao)}

        </>
    )
}