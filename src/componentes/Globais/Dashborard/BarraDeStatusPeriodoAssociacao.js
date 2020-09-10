import React from 'react'
export const BarraDeStatusPeriodoAssociacao = ({ statusPeriodoAssociacao}) => {
    return(
        statusPeriodoAssociacao && Object.entries(statusPeriodoAssociacao).length > 0  && (
            <div className={`col-12 mb-3 barra-status-legenda-cor-${statusPeriodoAssociacao.prestacao_contas_status.legenda_cor ? statusPeriodoAssociacao.prestacao_contas_status.legenda_cor : ""}`}>
                <p className="titulo-status pt-1 pb-1 mb-0">{statusPeriodoAssociacao.prestacao_contas_status.texto_status ? statusPeriodoAssociacao.prestacao_contas_status.texto_status : ""}</p>
            </div>
        )
    );
};
