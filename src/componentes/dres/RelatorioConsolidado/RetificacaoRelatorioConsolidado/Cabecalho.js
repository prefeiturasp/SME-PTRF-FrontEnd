import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const Cabecalho = ({relatorioConsolidado, onClickVoltar, formataPeriodo}) => {
    return (
        <div className="row p-2">
            <div className="col-5">
                <span className="referencia-e-periodo-relatorio">Referência do relatório:</span>
                <br/>
                <span className="texto.referencia-e-periodo-relatorio">Publicação {relatorioConsolidado.tipo_relatorio}</span>
            </div>

            <div className="col-5">
                <span className="referencia-e-periodo-relatorio">Período:</span>
                <br/>
                <span className="texto.referencia-e-periodo-relatorio">{formataPeriodo()}</span>
            </div>

            <div className="col-2 d-flex justify-content-end p-2">
                <button
                    className="btn btn-outline-success btn-ir-para-listagem ml-2"
                    onClick={onClickVoltar}
                >
                    <FontAwesomeIcon
                        style={{marginRight: "5px", color: '#00585E'}}
                        icon={faArrowLeft}
                    />
                    Voltar
                </button>
            </div>

            
        </div>
    )
}