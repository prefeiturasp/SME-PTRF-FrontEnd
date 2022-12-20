import React from "react";

export const BarraDeStatus = ({statusRelatorio}) =>{
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
                <p className="titulo-status pt-1 pb-1 mb-0">{statusRelatorio.status_txt ? statusRelatorio.status_txt : ""}</p>
            </div>
        </div>
    );
};