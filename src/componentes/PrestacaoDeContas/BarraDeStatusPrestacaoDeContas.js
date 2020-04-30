import React from "react";

export const BarraDeStatusPrestacaoDeContas = ({statusPrestacaoConta, corBarraDeStatusPrestacaoDeContas}) =>{
    return(
        statusPrestacaoConta && (
            <div className="row">
                <div className={`col-12 barra-status-${corBarraDeStatusPrestacaoDeContas}`}>
                    <p className="titulo-status pt-1 pb-1 mb-0">A prestação de contas deste período está aberta.</p>
                </div>
            </div>
        )

    );
}