import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

export const TopoComBotaoVoltar = ({onClickVoltar, periodoFormatado}) =>{
    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="flex-grow-1 bd-highlight texto-periodo-topo">
                <p className='mb-2'>{periodoFormatado && periodoFormatado.referencia ? periodoFormatado.referencia : ''} - {periodoFormatado && periodoFormatado.data_inicio_realizacao_despesas ? periodoFormatado.data_inicio_realizacao_despesas : '-'} até {periodoFormatado && periodoFormatado.data_fim_realizacao_despesas ? periodoFormatado.data_fim_realizacao_despesas : '-'}</p>
                <h1 className="titulo-itens-painel">Devolução para acertos</h1>
            </div>
            <div className="p-2 bd-highlight">
                <button onClick={onClickVoltar} className="btn btn-outline-success ml-2"><FontAwesomeIcon
                    style={{marginRight: "5px", color: '#00585E'}}
                    icon={faArrowLeft}
                />
                    Voltar
                </button>
            </div>
        </div>
    )
}