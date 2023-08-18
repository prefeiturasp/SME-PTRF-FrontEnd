import React from "react";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";
import {formataData} from "../../../utils/FormataData";

export const SelectPeriodoConta = ({periodoConta, handleChangePeriodoConta, periodosAssociacao, contasAssociacao}) => {
        return(
            <>
            <form id="periodo_conta">
                <div className="row pt-4">
                    <div className="col-md-12 col-lg-7 col-xl-5 mb-md-2">
                        <div className="row">
                            <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0 mr-xl-n3 mr-lg-n2">
                                <label htmlFor="periodo" className="">Período:</label>
                            </div>
                            <div className="col-12 col-sm-7 col-md-9 pl-0">
                                <select
                                    value={periodoConta.periodo}
                                    onChange={(e) => handleChangePeriodoConta(e.target.name, e.target.value)}
                                    name="periodo"
                                    id="periodo"
                                    className="form-control"
                                >
                                    <option value="">Escolha um período</option>
                                    {periodosAssociacao && periodosAssociacao.map((periodo)=>
                                        <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-12 col-lg-5 col-xl-4 offset-xl-3">

                        <div className="row">
                            <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0">
                                <label htmlFor="conta" className="">Conta:</label>
                            </div>
                            <div className="col-12 col-sm-7 col-md-9 pl-0">
                                <select
                                    value={periodoConta.conta}
                                    onChange={(e) => handleChangePeriodoConta(e.target.name, e.target.value)}
                                    name="conta"
                                    id="conta"
                                    className="form-control"
                                >
                                    <option value="">Selecione uma conta</option>
                                    {contasAssociacao && contasAssociacao.map((conta)=>
                                        <option key={conta.uuid} value={conta.uuid}>
                                            {conta.nome}
                                            {conta.solicitacao_encerramento ? ` (encerrada em ${formataData(conta.solicitacao_encerramento.data_de_encerramento_na_agencia)})` : ''}
                                        </option>
                                    )}
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            </form>

        </>

        )
}