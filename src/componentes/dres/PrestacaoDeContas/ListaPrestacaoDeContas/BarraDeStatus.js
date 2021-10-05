import React from "react";
export const BarraDeStatus = ({qtdeUnidadesDre, prestacaoDeContas}) => {
    return (
        <>
            {qtdeUnidadesDre && prestacaoDeContas &&
                <div className="col-12 mt-3 barra-de-status">
                    <p className="mb-0"><strong>{prestacaoDeContas.length} de {qtdeUnidadesDre}</strong> unidades</p>
                </div>
            }
        </>
    )
};