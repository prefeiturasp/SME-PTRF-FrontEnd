import React from "react";
import "./barraMensagem.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle, faInfoCircle} from "@fortawesome/free-solid-svg-icons";


const BarraMensagemCustom = (mensagem, textoBotao, handleClickBotao, mostraBotao, tipo, icone) => {
    
    return (
        <>
            <div className={`col-12 mt-3 barra-mensagem d-flex ${tipo === 'info-branco' ? 'barra-mensagem-info-inativa' : '' || tipo === 'info-acerto' ? 'barra-mensagem-info-acerto' : ''}`}>
                <div className='col-auto align-self-center'>
                    <FontAwesomeIcon className={`icone-alert-barra-mensagem ${tipo}`} 
                        icon={icone}
                    />
                </div>
                <div className="flex-grow-1 bd-highlight align-self-center">
                    <p className="mb-0">{tipo === 'info-branco' ? <strong> {mensagem}</strong> : mensagem}</p>
                </div>
                <div className="bd-highlight">
                    { mostraBotao
                        ?
                            <button
                                onClick={() => handleClickBotao()}
                                className="btn btn-outline-success btn-barra-mensagem">
                                {textoBotao}
                            </button>
                        :
                            null
                    }      
                </div>
            </div>

            
        </>
    )

}

const BarraMensagemSucessAzul = (mensagem, textoBotao=null, handleClickBotao=null, mostraBotao=false, tipo='sucess-azul', icone=faExclamationCircle) =>{
    return BarraMensagemCustom(mensagem, textoBotao, handleClickBotao, mostraBotao, tipo, icone)
}

const BarraMensagemAcertoExterno = (mensagem, textoBotao=null, handleClickBotao=null, mostraBotao=false, tipo='info-acerto', icone=faExclamationCircle) =>{
    return BarraMensagemCustom(mensagem, textoBotao, handleClickBotao, mostraBotao, tipo, icone)
}

const BarraMensagemSucessLaranja = (mensagem, textoBotao, handleClickBotao, mostraBotao, tipo='sucess-laranja', icone=faExclamationCircle) =>{
    return BarraMensagemCustom(mensagem, textoBotao, handleClickBotao, mostraBotao, tipo, icone)
}

const BarraMensagemInativa = (mensagem, textoBotao, handleClickBotao, mostraBotao, tipo='info-branco', icone=faInfoCircle) =>{
    return BarraMensagemCustom(mensagem, textoBotao, handleClickBotao, mostraBotao, tipo, icone)
}

export const barraMensagemCustom = {
    BarraMensagemSucessAzul,
    BarraMensagemSucessLaranja,
    BarraMensagemAcertoExterno,
    BarraMensagemInativa
}
