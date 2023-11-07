import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import AssociacaoEPeriodoDoCabecalho from "../../AssociacaoEPeriodoDoCabecalho";

export const TopoComBotoes = ({validaContaAoSalvar, onClickBtnVoltar, prestacaoDeContas}) =>{
    return(
        <>
        <div className="d-flex bd-highlight mt-3 mb-0">
            <AssociacaoEPeriodoDoCabecalho prestacaoDeContas={prestacaoDeContas} />
            
            <div className="ml-auto p-2 bd-highlight">
                <button onClick={onClickBtnVoltar} className="btn btn btn-outline-success mr-2" style={{ whiteSpace: 'nowrap' }}>
                    <FontAwesomeIcon
                        style={{color: "#00585E", fontSize: '15px', marginRight: "3px"}}
                        icon={faArrowLeft}
                    />
                    Voltar
                </button>
            </div>
            <div className="p-2 bd-highlight">
                <button onClick={validaContaAoSalvar} className="btn btn btn-success">Salvar</button>
            </div>
        </div>
        <div className="pt-2 mb-4 flex-grow-1 bd-highlight">
            <h5 className="titulo-itens-painel mb-0">Ajustes no documento</h5>
        </div>
        </>
    )
}