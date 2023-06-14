import React from "react";

export const TopoComBotoes = ({dadosAta, onSubmitFormEdicaoAta, handleClickFecharAta, disableBtnSalvar}) =>{
    return(
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='titulo-visualizacao-da-ata'>{dadosAta.tipo_ata === 'RETIFICACAO' ? 'Edição da Ata de Retificação da prestação de contas' : 'Edição da Ata de Apresentação da PC'}</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                <button type="button" onClick={handleClickFecharAta} className="btn btn-outline-success mr-2 mt-2"><strong>Voltar para ata</strong></button>
                <button disabled={disableBtnSalvar} type="button" onClick={onSubmitFormEdicaoAta} className="btn btn-success mr-2 mt-2"> <strong>Salvar edições</strong></button>
            </div>
        </div>
    )
};