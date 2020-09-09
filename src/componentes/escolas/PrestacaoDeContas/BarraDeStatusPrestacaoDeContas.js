import React from "react";

export const BarraDeStatusPrestacaoDeContas = ({statusPrestacaoDeConta}) =>{
    return(
        statusPrestacaoDeConta && Object.entries(statusPrestacaoDeConta).length > 0  && (
            <div className="row">
                <div className={`col-12 barra-status-legenda-cor-${statusPrestacaoDeConta.prestacao_contas_status.legenda_cor ? statusPrestacaoDeConta.prestacao_contas_status.legenda_cor : ""}`}>
                    <p className="titulo-status pt-1 pb-1 mb-0">{statusPrestacaoDeConta.prestacao_contas_status.texto_status ? statusPrestacaoDeConta.prestacao_contas_status.texto_status : ""}</p>
                </div>
            </div>
        )
    );
};