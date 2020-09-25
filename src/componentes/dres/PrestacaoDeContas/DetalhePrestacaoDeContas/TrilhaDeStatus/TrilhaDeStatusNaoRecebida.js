import React from "react";

export const TrilhaDeStatusNaoRecebida = () => {
    return (
        <>
            <div className='row'>
                <div className="col-12">
                    <div id="timeline"></div>

                    <div className="d-flex justify-content-between mb-3">
                        <div className='container-circulo'>
                            <span className='circulo circulo-ativo'>
                                1
                             </span>
                            <p className='mt-2'><strong>Não recebida</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>
                                2
                             </span>
                            <p className='mt-2'><strong>Recebida e <br/> aguardando análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>
                                3
                             </span>
                            <p className='mt-2'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span className='circulo'>
                                4
                             </span>
                            <p className='mt-2'><strong>Conclusão <br/> da análise</strong></p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};