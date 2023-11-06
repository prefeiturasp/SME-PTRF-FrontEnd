import React from "react";

export const TrilhaDeStatusNaoRecebida = () => {
    return (
        <>
            <div className='row'>
                <div className="col-12">
                    <div id="timeline">&nbsp;</div>
                    <div className="d-flex justify-content-between mb-3">
                        <div className='container-circulo'>
                            <span data-qa="circulo-nao-recebido-trilha-status-pc" className='circulo circulo-ativo'>1</span>
                            <p data-qa="status-trilha-nao-recebido" className='mt-2'><strong>Não recebido</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span data-qa="circulo-recebida-trilha-status-pc" className='circulo'>2</span>
                            <p data-qa="status-trilha-recebida" className='mt-2 texto-inativo'><strong>Recebida e <br/> aguardando análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span data-qa="circulo-em-analise-trilha-status-pc" className='circulo'>3</span>
                            <p data-qa="status-trilha-em-analise" className='mt-2 texto-inativo'><strong>Em análise</strong></p>
                        </div>
                        <div className='container-circulo'>
                            <span data-qa="circulo-conclusao-analise-trilha-status-pc" className='circulo'>4</span>
                            <p data-qa="status-trilha-conclusao-analise" className='mt-2 texto-inativo'><strong>Conclusão <br/> da análise</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};