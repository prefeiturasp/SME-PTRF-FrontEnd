import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

export const TrilhaDeStatusReprovadaNaoApresentacao = () => {
    return (
        <>
            <div className='row mt-5'>
                <div className="col-12">
                    <div id="timeline">&nbsp;</div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className='container-circulo'>
                            <span data-qa="circulo-nao-recebido-trilha-status-pc"
                                  className='circulo circulo-ativo-passado'>
                                <FontAwesomeIcon
                                    style={{color: '#fff'}}
                                    icon={faCheck}
                                />
                            </span>
                            <p data-qa="status-trilha-nao-recebido" className='mt-2'><strong>Não recebido</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <div className='container-circulo'>
                                <span data-qa="circulo-nao-recebido-trilha-status-pc"
                                      className='circulo circulo-ativo-passado'>
                                    <FontAwesomeIcon
                                        style={{color: '#fff'}}
                                        icon={faCheck}
                                    />
                                </span>
                                <p data-qa="status-trilha-nao-recebido" className='mt-2'><strong>Reprovada</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};