import React, { useEffect } from "react";

export const BarraDeStatusPorDiretoria = ({statusRelatorio}) =>{
    const [textStatus, setTextStatus] = React.useState("");

    useEffect(() => {
        statusRelatorio.status === "EM_ANDAMENTO" ? setTextStatus("Período de análise das prestações de contas pelas DREs em andamento.") : setTextStatus("Período de análise das prestações de contas pelas DREs concluído.");
    }, [statusRelatorio])

    const BarraStyle = {
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "16px",
    };

    const BarraCor = {
        1: {backgroundColor: '#D06D12'},
        2: {backgroundColor: '#297805'}
    };

    return(
        <div className="row" style={BarraStyle}>
            <div className={`col-12`} style={BarraCor[statusRelatorio.cor_idx]}>
                <p className="titulo-status pt-1 pb-1 mb-0">{textStatus}</p>
            </div>
        </div>
    );
};