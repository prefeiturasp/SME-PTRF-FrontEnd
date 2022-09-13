import React from "react";

export const BarraDeStatus = ({statusBarraDeStatus}) =>{
    return(
        <div className="row">
            <div className={`col-12 barra-status-legenda-cor-${statusBarraDeStatus.cor_idx}`}>
                <p className="titulo-status pt-1 pb-1 mb-0">{statusBarraDeStatus.status_txt ? statusBarraDeStatus.status_txt : ""}</p>
            </div>
        </div>
    );
};