import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

export const TrilhaDeStatusConcluida = () => {
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
                            <p className='mt-2'><strong>Não publicada no <br/> Diário Oficial</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-passado'>
                                    <FontAwesomeIcon
                                        style={{color: '#fff'}}
                                        icon={faCheck}
                                    />
                            </span>
                            <p className='mt-2 texto-inativo'><strong>Publicada no <br/> Diário Oficial</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo-passado'>
                                    <FontAwesomeIcon
                                        style={{color: '#fff'}}
                                        icon={faCheck}
                                    />
                            </span>
                            <p className='mt-2 texto-inativo'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo'>4</span>
                            <p className='mt-2 texto-inativo'><strong>Concluída</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};