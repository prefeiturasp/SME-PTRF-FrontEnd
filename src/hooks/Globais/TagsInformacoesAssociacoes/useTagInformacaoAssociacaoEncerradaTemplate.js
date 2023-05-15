import React from "react";
import ReactTooltip from "react-tooltip";
import '../../../componentes/Globais/LegendaInformaçãoAssociacao/legendaInformacoesAssociacao.scss';

function useTagInformacaoAssociacaoEncerradaTemplate(){
    function retornaTagInformacaoAssociacaoEncerradaTemplate (rowData) {
        // Essa validação dos campos é necessária pois o hook é usado para associação e unidade
        // E dependendo de quem está invocando o hook, o nome do campo pode ser diferente

        let data_de_encerramento = rowData && rowData.data_de_encerramento_associacao ? rowData.data_de_encerramento_associacao : rowData.data_de_encerramento;
        let tooltip_data_encerramento = rowData && rowData.tooltip_associacao_encerrada ? rowData.tooltip_associacao_encerrada : rowData.tooltip_data_encerramento;
        let associacao_uuid = rowData && rowData.associacao_uuid ? rowData.associacao_uuid : rowData.uuid;

        return (
            data_de_encerramento !== undefined && data_de_encerramento !== null &&
                <>
                    <div data-tip={tooltip_data_encerramento} data-html={true} className="tag-informacoes-associacao-encerrada fundo-cor-cinza-neutral-03 texto-cor-branco" key={associacao_uuid}>
                        <span>Associação encerrada</span>
                    </div>
                    <ReactTooltip/>
                </>
        )
    }

    return retornaTagInformacaoAssociacaoEncerradaTemplate
}

export default useTagInformacaoAssociacaoEncerradaTemplate