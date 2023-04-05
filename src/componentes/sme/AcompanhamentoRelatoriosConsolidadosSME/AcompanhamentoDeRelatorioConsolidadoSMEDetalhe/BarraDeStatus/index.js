import React from "react";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";

export const BarraDeStatus = ({statusRelatorio, relatorioConsolidado}) => {
    const dataTemplate = useDataTemplate()
    
    const BarraStyle = {
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "16px",
    };

    const BarraCor = {
        1: {backgroundColor: '#297805'},
        2: {backgroundColor: '#D06D12'}
    };

    return(
        <div className="row" style={BarraStyle}>
            <div className={`col-12`} style={BarraCor[statusRelatorio.cor_idx]}>
                <p className="titulo-status pt-1 pb-1 mb-0">{statusRelatorio.status_txt ? statusRelatorio.status_txt + dataTemplate(null, null, relatorioConsolidado.data_publicacao) : ""}</p>
            </div>
        </div>
    );
};