import React from "react";
import {Link} from "react-router-dom";
import {exibeDataPT_BR} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const TopoSelectPeriodoBotaoVoltar = ({periodos, periodoEscolhido, handleChangePeriodos}) =>{
    return (
        <>
            <div className="d-flex bd-highlight border-bottom">
                <div className="p-2 flex-grow-1 bd-highlight">
                    <form id="periodo_conta">
                        <div className="row pt-3">
                            <div className="col-md-12 col-lg-8 col-xl-6 mb-md-2">
                                <div className="row">
                                    <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0 mr-xl-n3 mr-lg-n2">
                                        <label htmlFor="periodo" className="">Período:</label>
                                    </div>
                                    <div className="col-12 col-sm-7 col-md-9 pl-0">
                                        <select
                                            value={periodoEscolhido}
                                            onChange={(e) => handleChangePeriodos(e.target.value)}
                                            name="periodo"
                                            id="periodo"
                                            className="form-control"
                                        >
                                            {periodos && periodos.map((periodo)=>
                                                <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="p-2 bd-highlight pt-3">
                    <Link
                        to='/dre-dashboard'
                        className="btn btn-success ml-2"
                    >
                        <FontAwesomeIcon
                            style={{marginRight: "5px", color: '#fff'}}
                            icon={faArrowLeft}
                        />
                        Voltar para painel geral
                    </Link>
                </div>

            </div>
        </>
    );
};