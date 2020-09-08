import React from "react";

export const BarraDeStatusPrestacaoDeContas = ({statusPrestacaoDeConta}) =>{
    return(
        statusPrestacaoDeConta && (
            <div className="row">
                <div className={`col-12 barra-status-legenda-cor-${statusPrestacaoDeConta.prestacao_contas_status.legenda_cor}`}>
                    <p className="titulo-status pt-1 pb-1 mb-0">{statusPrestacaoDeConta.prestacao_contas_status.texto_status}</p>
                </div>
            </div>
        )
    );
}