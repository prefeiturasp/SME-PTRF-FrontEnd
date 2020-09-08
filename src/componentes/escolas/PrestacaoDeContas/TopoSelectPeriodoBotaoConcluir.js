import React from "react";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";

export const TopoSelectPeriodoBotaoConcluir = ({periodoPrestacaoDeConta, handleChangePeriodoPrestacaoDeConta, periodosAssociacao, retornaObjetoPeriodoPrestacaoDeConta, statusPrestacaoDeConta}) => {
    //console.log("TopoSelectPeriodoBotaoConcluir Status ", statusPrestacaoDeConta)
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
                                        )
                                    }
                                    onChange={(e) => handleChangePeriodoPrestacaoDeConta(e.target.name, e.target.value)}
                                    name="periodoPrestacaoDeConta"
                                    id="periodoPrestacaoDeConta"
                                    className="form-control"
                                >
                                    <option value="">Escolha um período</option>
                                    {periodosAssociacao && periodosAssociacao.map((periodo) =>
                                        <option
                                            key={periodo.uuid}
                                            value={
                                                retornaObjetoPeriodoPrestacaoDeConta(
                                                    periodo.uuid,
                                                    periodo.data_inicio_realizacao_despesas,
                                                )}
                                        >
                                            {`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}
                                        </option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-5 col-xl-7 mb-md-2 text-right">
                        <button disabled={statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && statusPrestacaoDeConta.prestacao_contas_status.periodo_encerrado} className='btn btn-success' type="button">Concluir período</button>
                    </div>
                </div>
            </form>
        </>
    )
};