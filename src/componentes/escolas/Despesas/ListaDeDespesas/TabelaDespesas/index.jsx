import React from "react";
import { TableTags } from "../../../../Globais/TableTags";
import { coresTagsDespesas } from "../../../../../utils/CoresTags";
import TheadDespesas from "./TheadDespesas";

const TabelaDespesas = ({ despesas, onClickDespesa, tipoLancamentoTemplate, especificacaoDataTemplate, valorTotalTemplate }) => {
    return (
        <table data-qa="table-lista-despesas" id="tabela-lista-despesas" className="table table-bordered">
            <TheadDespesas />

            {despesas.map((despesa, index) =>
                <tbody data-qa={`tbody-despesa-${index}`} key={`tbody-despesa-${index}`} onClick={() => onClickDespesa(despesa)}>
                    <tr key={`tr-despesa-${index}`} data-qa={`tr-despesa-${index}`}>
                        <td key={`td-despesa-numero_documento-${index}`} data-qa={`td-despesa-numero-documento-e-status-${index}`}
                            rowSpan={despesa.rateios.length > 0 ? despesa.rateios.length + 1 : 2}>
                            {tipoLancamentoTemplate(despesa, index)}
                        </td>
                    
                        <td data-qa={`td-despesa-informacoes-${index}`} rowSpan={despesa.rateios.length > 0 ? despesa.rateios.length + 1 : 2}>
                            {<TableTags data={despesa} coresTags={coresTagsDespesas} showPeriodoConciliacao={true} />} 
                        </td>
                    </tr>


                    {despesa.rateios.length > 0 ?
                        despesa.rateios.map((rateio, index) =>
                            <tr key={`tr-rateio-${index}`} data-qa={`tr-rateio-${index}`}>

                                <td data-qa={`td-rateio-especificacao-e-data-documento-${index}`} key={`td-rateio-especificacao-${index}`}>{especificacaoDataTemplate(despesa, rateio, index)}</td>
                                <td data-qa={`td-rateio-aplicacao-recurso-${index}`} className="centraliza-conteudo-tabela text-center">{rateio.aplicacao_recurso}</td>
                                
                                {rateio.acao_associacao ?
                                    <td data-qa={`td-rateio-acao-${index}`} className="centraliza-conteudo-tabela text-center"
                                        key={`td-rateio-acao-${index}`}>{rateio.acao_associacao.acao.nome}</td>
                                    :
                                    <td data-qa={`td-rateio-acao-${index}`} className="centraliza-conteudo-tabela text-center">-</td>
                                }

                                <td data-qa={`td-rateio-valor-${index}`} className="centraliza-conteudo-tabela text-center"
                                    key={`td-rateio-valor-${index}`}>{valorTotalTemplate(rateio, index)}
                                </td>

                            </tr>
                        )
                        :
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    }
                </tbody>
            )}
        </table>
    )
}

export default TabelaDespesas;