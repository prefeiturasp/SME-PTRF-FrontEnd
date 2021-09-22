import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const TopoComBotoes = ({onClickBtnVoltar, devolverParaAcertos, dataLimiteDevolucao, qtdeAjustesLancamentos, qtdeAjustesDocumentos}) => {
    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="py-2 flex-grow-1 bd-highlight">
                <h5 className="titulo-explicativo mb-0">Resumo de acertos</h5>
            </div>
            <div className="p-2 bd-highlight">
                <button onClick={onClickBtnVoltar} className="btn btn-outline-success mr-2">
                    <FontAwesomeIcon
                        style={{color: "#00585E", fontSize: '15px', marginRight: "3px"}}
                        icon={faArrowLeft}
                    />
                    Voltar
                </button>
                <button className="btn btn-outline-success mr-2">Imprimir relatório</button>
                <button
                    disabled={!dataLimiteDevolucao || (qtdeAjustesLancamentos <= 0 && qtdeAjustesDocumentos <= 0)}
                    onClick={devolverParaAcertos}
                    className="btn btn-secondary"
                >
                    Devolver para Associação
                </button>
            </div>
        </div>
    )
}