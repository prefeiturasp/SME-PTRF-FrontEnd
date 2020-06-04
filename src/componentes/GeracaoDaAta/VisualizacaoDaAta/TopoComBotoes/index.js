import React from "react";

export const TopoComBotoes = (props) =>{
    //console.log("TopoComBotoes ", props)
    return(
        <div className="row">
            <div className='col-12 col-md-5 mt-2'>
                <p className='titulo-visualizacao-da-ata'>Visualização da ata</p>
            </div>

            <div className='col-12 col-md-7 text-right'>
                <button onClick={props.handleClickEditarAta} type="button" className="btn btn-success mr-2 mt-2"> <strong>Editar ata</strong></button>
                <button type="button" className="btn btn-outline-success mr-2 mt-2"><strong>Selecionar e copiar</strong></button>
                <button type="button" className="btn btn-outline-success mt-2"><strong>Fechar</strong></button>
            </div>
        </div>
    )
}