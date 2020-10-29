import React from "react";

export const BoxAtaRetificadora = ({corBoxAtaRetificadora, textoBoxAtaRetificadora, dataBoxAtaRetificadora, onClickVisualizarAta}) => {
    return (
        <div className="row mt-2">
            <div className="col-12">
                <div className="col-12">
                    <div className="row mt-3 container-box-prestacao-de-contas-por-periodo pt-4 pb-4">
                        <div className="col-12 col-md-8">
                            <p className='fonte-14 mb-1'><strong>{textoBoxAtaRetificadora}</strong></p>
                            <p className={`fonte-12 mb-1 status-data-${corBoxAtaRetificadora}`}>{dataBoxAtaRetificadora}</p>
                        </div>
                        <div className="col-12 col-md-4 align-self-center">
                            <button onClick={()=>onClickVisualizarAta()}  type="button" className="btn btn-success float-right">Visualizar ata</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};