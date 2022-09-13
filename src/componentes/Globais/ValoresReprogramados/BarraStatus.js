import React from "react";

export const BarraStatus = ({statusValoresReprogramados, defineCorBarraStatus}) => {
    return (
        <div className={`mt-2 col-12 d-flex align-items-center ${defineCorBarraStatus(statusValoresReprogramados.cor)}`}>
            <p className={`barra-status pt-1 pb-1 mb-0`}>{statusValoresReprogramados.texto}</p>
        </div>
    )
}