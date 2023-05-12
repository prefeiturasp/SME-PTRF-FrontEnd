import React from "react";
import ReactTooltip from "react-tooltip";
import '../../../componentes/Globais/LegendaInformaçãoAssociacao/legendaInformacoesAssociacao.scss';

function useTagInformacaoAssociacaoEncerradaTemplate(){
    function retornaTagInformacaoAssociacaoEncerradaTemplate (rowData) {
        return (
            rowData.data_de_encerramento_associacao !== null &&
                <>
                    <div data-tip={rowData.tooltip_associacao_encerrada} data-html={true} className="tag-informacoes-associacao-encerrada fundo-cor-cinza-neutral-03 texto-cor-branco" key={rowData.associacao_uuid}>
                        <span>Associação encerrada</span>
                    </div>
                    <ReactTooltip/>
                </>
        )
    }

    return retornaTagInformacaoAssociacaoEncerradaTemplate
}

export default useTagInformacaoAssociacaoEncerradaTemplate