import React from "react";

export const BarraTotalAssociacoes = ({itensDashboard}) => {
    return (
        <>
            <div className="col-12 mt-3 barra-de-status">
                <p className="mb-0">Total de associações das Diretoria: <strong>{itensDashboard?.total_associacoes_dre} associações </strong></p>
            </div>
        </>
    )
};