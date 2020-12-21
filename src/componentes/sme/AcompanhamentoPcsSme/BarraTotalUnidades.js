import React from "react";
export const BarraTotalUnidades = ({totalUnidades}) => {
    return (
        <>
            <div className="col-12 mt-3 barra-de-status">
                <p className="mb-0">Total de associações das Unidades Educacionais: <strong>{totalUnidades} unidades</strong></p>
            </div>
        </>
    )
};