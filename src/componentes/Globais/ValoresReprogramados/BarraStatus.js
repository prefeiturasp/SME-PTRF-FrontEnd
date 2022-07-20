import React from "react";

export const BarraStatus = ({statusValoresReprogramados, defineCorBarraStatus}) => {
    return (
        <div className={`row mt-n3 barra-status ${defineCorBarraStatus(statusValoresReprogramados.cor)}`}>
            <div className="col-12">
                    <p className="mt-2">{statusValoresReprogramados.texto}</p>
            </div>
            
        </div>
    )
}