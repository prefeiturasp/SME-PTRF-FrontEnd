import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

export const TrilhaDeStatusPublicada = ({ text_for_status_track_first_step, text_for_status_track_second_step }) => {
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
                            <p className='mt-2'>{text_for_status_track_first_step}</p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo'>2</span>
                            <p className='mt-2'>{text_for_status_track_second_step}</p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>3</span>
                            <p className='mt-2 texto-inativo'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>4</span>
                            <p className='mt-2 texto-inativo'><strong>Concluída</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
