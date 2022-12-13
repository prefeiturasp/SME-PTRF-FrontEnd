import React from "react";

export const BarraTotalAssociacoes = ({totalUnidades}) => {
    return (
        <>
            <div className="col-12 mt-3 barra-de-status">
                <p className="mb-0">Total de associações das Diretoria: <strong>{totalUnidades} associações </strong></p>
            </div>
        </>
    )
};