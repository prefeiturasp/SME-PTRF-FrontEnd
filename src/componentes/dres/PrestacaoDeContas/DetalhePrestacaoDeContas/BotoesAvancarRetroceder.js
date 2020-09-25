import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDoubleLeft, faAngleDoubleRight} from "@fortawesome/free-solid-svg-icons";

export const BotoesAvancarRetroceder = ({prestacaoDeContas}) =>{
    return(
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                <div className="d-flex bd-highlight mt-3 mb-3 container-cabecalho">
                    <div className="flex-grow-1 bd-highlight">
                        <Link
                            to={`/dre-lista-prestacao-de-contas/${prestacaoDeContas.periodo_uuid}/${prestacaoDeContas.status}`}
                            className="btn btn-success ml-2"
                        >
                            <FontAwesomeIcon
                                style={{marginRight: "5px", color: '#fff'}}
                                icon={faAngleDoubleLeft}
                            />
                            Reabrir PC
                        </Link>
                    </div>
                    <div className="p-2 bd-highlight">
                        <Link
                            to={`/dre-lista-prestacao-de-contas/${prestacaoDeContas.periodo_uuid}/${prestacaoDeContas.status}`}
                            className="btn btn-success ml-2"
                        >
                            Receber
                            <FontAwesomeIcon
                                style={{marginLeft: "5px", color: '#fff'}}
                                icon={faAngleDoubleRight}
                            />
                        </Link>
                    </div>
                </div>
            </>
            }
        </>
    )
};