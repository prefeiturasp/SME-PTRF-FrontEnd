import React from "react";
import ReactTooltip from "react-tooltip";
import '../../../componentes/Globais/LegendaInformaçãoAssociacao/legendaInformacoesAssociacao.scss';

function useTagInformacaoAssociacaoEncerradaTemplate(){
    function retornaTagInformacaoAssociacaoEncerradaTemplate (rowData) {
        let dataTip = ""

        if(rowData.data_de_encerramento_associacao !== null && rowData.data_de_encerramento_associacao !== undefined) {
            dataTip = rowData.tooltip_associacao_encerrada
        }

        if(rowData.data_de_encerramento !== null && rowData.data_de_encerramento !== undefined) {
            dataTip = rowData.tooltip_data_encerramento
        }

        return (
            ((rowData.data_de_encerramento_associacao !== null && 
                rowData.data_de_encerramento_associacao !== undefined) || 
                (rowData.data_de_encerramento !== null &&
                rowData.data_de_encerramento !== undefined)) &&
                <>
                    <div data-tip={dataTip} data-html={true} className="tag-informacoes-associacao-encerrada fundo-cor-cinza-neutral-03 texto-cor-branco" key={rowData.associacao_uuid}>
                        <span>Associação encerrada</span>
                    </div>
                    <ReactTooltip/>
                </>
        )
    }

    return retornaTagInformacaoAssociacaoEncerradaTemplate
}

export default useTagInformacaoAssociacaoEncerradaTemplate