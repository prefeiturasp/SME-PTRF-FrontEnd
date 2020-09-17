import React from "react";
export const BarraDeStatus = ({ObjetoDashboard}) => {
    return (
        <>
            <div className="col-12 mt-3 barra-de-status">
                <p className="mb-0">Total de associações da Diretoria: <strong>{ObjetoDashboard.total_associacoes_dre} unidades</strong></p>
            </div>
        </>
    )
};