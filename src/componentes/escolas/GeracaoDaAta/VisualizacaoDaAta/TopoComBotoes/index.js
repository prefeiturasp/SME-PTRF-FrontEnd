import React from "react";

export const TopoComBotoes = ({dadosAta, prestacaoDeContasDetalhe, handleClickEditarAta, handleClickFecharAta, handleClickCopiarAta}) =>{
    return(
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='titulo-visualizacao-da-ata'>{dadosAta.tipo_ata === 'RETIFICACAO' ? 'Visualização da ata de retificação' : 'Visualização da ata'}</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                { prestacaoDeContasDetalhe && prestacaoDeContasDetalhe.status && prestacaoDeContasDetalhe.status === 'DEVOLVIDA' && dadosAta && dadosAta.uuid && dadosAta.tipo_ata === 'RETIFICACAO' ?
                    <button onClick={handleClickEditarAta} type="button" className="btn btn-success mr-2 mt-2"> <strong>Editar ata de retificação</strong></button>
                    : ( dadosAta.tipo_ata !== 'RETIFICACAO' ?
                            <button onClick={handleClickEditarAta} type="button" className="btn btn-success mr-2 mt-2"> <strong>Editar ata</strong></button>
                        : null
                    )
                }
                <button onClick={handleClickCopiarAta} type="button" className="btn btn-outline-success mr-2 mt-2"><strong>Selecionar e copiar</strong></button>
                <button onClick={handleClickFecharAta} type="button" className="btn btn-outline-success mt-2"><strong>Fechar</strong></button>
            </div>
        </div>
    )
};