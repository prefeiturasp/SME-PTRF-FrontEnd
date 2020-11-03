import React from "react";

export const BarraDeStatus = ({statusRelatorio}) =>{
    return(
        <div className="row">
            <div className={`col-12 barra-status-legenda-cor-${statusRelatorio.cor_idx}`}>
                <p className="titulo-status pt-1 pb-1 mb-0">{statusRelatorio.status_txt ? statusRelatorio.status_txt : ""}</p>
            </div>
        </div>
    );
};