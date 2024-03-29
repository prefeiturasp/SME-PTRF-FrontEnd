import React from "react";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";

export const TopoSelectPeriodoBotaoConcluir = ({
                                                   periodoPrestacaoDeConta,
                                                   handleChangePeriodoPrestacaoDeConta,
                                                   periodosAssociacao,
                                                   retornaObjetoPeriodoPrestacaoDeConta,
                                                   statusPrestacaoDeConta,
                                                   checkCondicaoExibicao,
                                                   podeConcluir,
                                                   concluirPeriodo,
                                                   textoBotaoConcluir,
                                                   contasAssociacao
                                               }) => {
    return (
        <>
            <form id="periodo_conta">
                <div className="row pt-4">
                    <div className="col-md-12 col-lg-7 col-xl-5 mb-md-2">
                        <div className="row">
                            <div className="col-12 col-sm-4 col-md-3 mt-2 pr-0 mr-xl-n3 mr-lg-n2">
                                <label htmlFor="periodo" className="">Período:</label>
                            </div>
                            <div className="col-12 col-sm-5 col-md-9 pl-0">
                                <select
                                    value={
                                        retornaObjetoPeriodoPrestacaoDeConta(
                                            periodoPrestacaoDeConta.periodo_uuid,
                                            periodoPrestacaoDeConta.data_inicial,
                                            periodoPrestacaoDeConta.data_final
                                        )
                                    }
                                    onChange={(e) => handleChangePeriodoPrestacaoDeConta(e.target.name, e.target.value)}
                                    name="periodoPrestacaoDeConta"
                                    id="periodoPrestacaoDeConta"
                                    data-qa="select-periodo-pc"
                                    className="form-control"
                                >
                                    <option value="" data-qa={`opt-0-select-periodo-pc`}>Escolha um período</option>
                                    {periodosAssociacao && periodosAssociacao.map((periodo, index) =>
                                        <option
                                            key={periodo.uuid}
                                            data-qa={`opt-${index+1}-select-periodo-pc`}
                                            value={
                                                retornaObjetoPeriodoPrestacaoDeConta(
                                                    periodo.uuid,
                                                    periodo.data_inicio_realizacao_despesas,
                                                    periodo.data_fim_realizacao_despesas
                                                )}
                                        >
                                            {`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}
                                        </option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div
                        className="col-md-12 col-lg-5 col-xl-7 mb-md-2 text-right"
                        style={
                            {visibility: podeConcluir ? "visible" : "hidden"}
                        }
                    >
                        {checkCondicaoExibicao(periodoPrestacaoDeConta) && 
                            statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && 
                            statusPrestacaoDeConta.prestacao_contas_status.pc_requer_conclusao &&
                            contasAssociacao && contasAssociacao.length > 0 &&
                            <button
                                onClick={concluirPeriodo}
                                className='btn btn-success'
                                data-qa={`btn-${textoBotaoConcluir(statusPrestacaoDeConta)}`}
                                type="button">{textoBotaoConcluir(statusPrestacaoDeConta)}
                            </button>
                        }
                    </div>
                </div>
            </form>
        </>
    )
};