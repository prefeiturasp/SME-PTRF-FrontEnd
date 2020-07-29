import React from "react";

export const BarraDeStatusPrestacaoDeContas = ({statusPrestacaoConta, corBarraDeStatusPrestacaoDeContas, textoBarraDeStatusPrestacaoDeContas}) =>{
    return(
        statusPrestacaoConta !== undefined && (
            <div className="row">
                <div className={`col-12 barra-status-${corBarraDeStatusPrestacaoDeContas}`}>
                    <p className="titulo-status pt-1 pb-1 mb-0">{textoBarraDeStatusPrestacaoDeContas}</p>
                </div>
            </div>
        )

    );
}