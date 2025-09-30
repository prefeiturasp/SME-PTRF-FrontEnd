import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import '../../../componentes/Globais/LegendaInformaçãoAssociacao/legendaInformacoesAssociacao.scss';

function useTagInformacaoAssociacaoEncerradaTemplate(){
    function retornaTagInformacaoAssociacaoEncerradaTemplate (rowData) {
        // Essa validação dos campos é necessária pois o hook é usado para associação e unidade
        // E dependendo de quem está invocando o hook, o nome do campo pode ser diferente
        
        let associacao_encerrada = false;
        let data_de_encerramento = null;
        let tooltip_data_encerramento = null;
        let associacao_uuid = rowData && rowData.associacao_uuid ? rowData.associacao_uuid : rowData.uuid;

        if (rowData && rowData.data_de_encerramento_associacao) {
            data_de_encerramento = rowData.data_de_encerramento_associacao;
            tooltip_data_encerramento = rowData.tooltip_associacao_encerrada;
            associacao_encerrada = true;
        }

        else if (rowData && rowData.associacao && rowData.associacao.data_de_encerramento) {
            data_de_encerramento = rowData.associacao.data_de_encerramento;
            tooltip_data_encerramento = rowData.associacao.tooltip_data_encerramento;
            associacao_encerrada = true;
        }

        else if (rowData && rowData.associacao && rowData.associacao.encerrada === true) {
            associacao_encerrada = true;
        }

        if (!associacao_encerrada) {
            return null;
        }

        return (
            <>
                <div data-tooltip-content={tooltip_data_encerramento} data-html={true} className="tag-informacoes-associacao-encerrada fundo-cor-cinza-neutral-03 texto-cor-branco" key={associacao_uuid}>
                    <span>Associação encerrada</span>
                </div>
                <ReactTooltip/>
            </>
        )
    }

    return retornaTagInformacaoAssociacaoEncerradaTemplate
}

export default useTagInformacaoAssociacaoEncerradaTemplate