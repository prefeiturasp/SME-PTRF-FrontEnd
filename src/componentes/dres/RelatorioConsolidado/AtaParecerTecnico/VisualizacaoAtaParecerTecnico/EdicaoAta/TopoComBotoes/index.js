import React from "react";

export const TopoComBotoes = ({onSubmitFormEdicaoAta, handleClickFecharAta, disableBtnSalvar, formRef}) =>{
    return(
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='titulo-edicao-ata'><strong>Editar ata de Parecer Técnico</strong></p>
                
            </div>

            <div className='col-12 col-md-7 text-right'>
                <button type="button" onClick={handleClickFecharAta} className="btn btn-outline-success mr-2 mt-2"><strong>Voltar para ata</strong></button>
                <button type="button" disabled={disableBtnSalvar} onClick={onSubmitFormEdicaoAta} className="btn btn-success mr-2 mt-2"> <strong>Salvar edições</strong></button>
            </div>
        </div>
    )
};