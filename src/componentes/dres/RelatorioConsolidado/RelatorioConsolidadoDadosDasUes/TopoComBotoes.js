import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const TopoComBotoes = ({periodoNome, contaNome, periodo_uuid, conta_uuid}) =>{
    return(
        <>
            <div className="d-flex bd-highlight mb-3">
                <div className="py-2 flex-grow-1 bd-highlight"><h4 className='pl-0'>Período {periodoNome} | Conta {contaNome}</h4></div>
                <div className="py-2 bd-highlight">
                    <button
                        onClick={()=>window.location.assign(`/dre-relatorio-consolidado-apuracao/${periodo_uuid}/${conta_uuid}/`)}
                        className="btn btn-outline-success">
                        <FontAwesomeIcon
                            style={{marginRight:'3px'}}
                            icon={faArrowLeft}
                        />
                        Voltar para síntese
                    </button>
                </div>

            </div>
        </>
    )
};