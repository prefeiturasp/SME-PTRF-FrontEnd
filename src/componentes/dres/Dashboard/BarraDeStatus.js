import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/free-solid-svg-icons";
export const BarraDeStatus = ({itensDashboard, handleClickVerPrestacaoes}) => {
    return (
        <>
            <div className="col-12 mt-3 barra-de-status d-flex bd-highlight border-bottom">
                <div className="flex-grow-1 bd-highlight align-self-center">
                    <p className="mb-0">Total de associações da Diretoria: <strong>{itensDashboard.total_associacoes_dre} unidades</strong></p>
                </div>
                <div className="bd-highlight">
                    <button
                        onClick={() => handleClickVerPrestacaoes('TODOS')}
                        className="btn btn-outline-success btn-ver-todas-as-prestacoes">
                        <FontAwesomeIcon
                            style={{marginRight: "3px", color: '#fff'}}
                            icon={faEye}
                        />
                       Ver todas as prestações
                    </button>
                </div>
            </div>
        </>
    )
};