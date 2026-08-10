import React from "react";

export const TrilhaDeStatusNaoPublicada = ({ text_for_status_track_first_step, text_for_status_track_second_step }) => {
    return (
        <>
            <div className='row mt-3'>
                <div className="col-12">
                    <div id="timeline">&nbsp;</div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className='container-circulo'>
                        <span className='circulo circulo-ativo'>1</span>
                            <p className='mt-2'>{text_for_status_track_first_step}</p>
                        </div>
                        <div className='container-circulo'>
                        <span className='circulo circulo'>2</span>
                            <p className='mt-2 texto-inativo'>{text_for_status_track_second_step}</p>
                        </div>
                        <div className='container-circulo'>
                        <span className='circulo circulo'>3</span>
                            <p className='mt-2 texto-inativo'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo circulo'>4</span>
                            <p className='mt-2 texto-inativo'><strong>Concluída</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
