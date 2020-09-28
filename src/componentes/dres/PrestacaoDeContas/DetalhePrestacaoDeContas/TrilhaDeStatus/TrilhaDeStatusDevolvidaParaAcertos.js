import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faExclamation} from "@fortawesome/free-solid-svg-icons";

export const TrilhaDeStatusDevolvidaParaAcertos = () => {
    return (
        <>
            <div className='row'>
                <div className="col-12">
                    <div id="timeline">&nbsp;</div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-passado'>
                                <FontAwesomeIcon
                                    style={{color: '#fff'}}
                                    icon={faCheck}
                                />
                            </span>
                            <p className='mt-2'><strong>Não recebido</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>2</span>
                            <p className='mt-2 texto-inativo'><strong>Recebida e <br/> aguardando análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-devolvido-para-acertos'>
                                <FontAwesomeIcon
                                    style={{color: '#fff'}}
                                    icon={faExclamation}
                                />
                            </span>
                            <p className='mt-2'><strong>Devolvido <br/> para acertos</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>3</span>
                            <p className='mt-2 texto-inativo'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>4</span>
                            <p className='mt-2 texto-inativo'><strong>Conclusão <br/> da análise</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};