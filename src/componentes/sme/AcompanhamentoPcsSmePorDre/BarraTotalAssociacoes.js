import React from "react";

export const BarraTotalAssociacoes = ({totalAssociacoes}) => {
    return (
        <>
            <div className="col-12 mt-3 barra-de-status">
                <p className="mb-0">Total de associações das Diretoria: <strong>{totalAssociacoes} associações </strong></p>
            </div>
        </>
    )
};