import React from "react";
import "./barraMensagem.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const BarraDeMensagem = ({mensagem, textoBotao, handleClickBotao, icone}) => {
    return (
        <>
            <div className="col-12 mt-3 barra-mensagem d-flex">
                <div className='col-auto'>
                    <FontAwesomeIcon className='icone-alert-barra-mensagem'
                        icon={icone}
                    />
                </div>
                <div className="flex-grow-1 bd-highlight align-self-center">
                    <p className="mb-0">{mensagem}</p>
                </div>
                <div className="bd-highlight">
                    <button
                        onClick={() => handleClickBotao()}
                        className="btn btn-outline-success btn-barra-mensagem">
                        {textoBotao}
                    </button>
                </div>
            </div>
        </>
    )
};