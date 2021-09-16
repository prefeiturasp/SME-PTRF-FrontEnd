import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const TopoComBotoes = ({onSubmitFormAcertos, onClickBtnVoltar}) =>{
    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="pt-2 flex-grow-1 bd-highlight">
                <h5 className="titulo-itens-painel mb-0">Ajustes no documento</h5>
            </div>
            <div className="p-2 bd-highlight">
                <button onClick={onClickBtnVoltar} className="btn btn btn-outline-success mr-2">
                    <FontAwesomeIcon
                        style={{color: "#00585E", fontSize: '15px', marginRight: "3px"}}
                        icon={faArrowLeft}
                    />
                    Voltar
                </button>
                <button onClick={onSubmitFormAcertos} className="btn btn btn-success">Salvar</button>
            </div>
        </div>
    )
}