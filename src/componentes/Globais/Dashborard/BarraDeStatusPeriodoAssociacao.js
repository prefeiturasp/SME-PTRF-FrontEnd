import React from 'react'

export const BarraDeStatusPeriodoAssociacao = ({ statusPeriodoAssociacao, corBarraDeStatusPeriodoAssociacao, textoBarraDeStatusPeriodoAssociacao,
}) => {
  return (
    statusPeriodoAssociacao !== undefined && (
        <div className={`col-12 barra-status-${corBarraDeStatusPeriodoAssociacao} mb-3`}
        >
          <p className="titulo-status pt-1 pb-1 mb-0">
            {textoBarraDeStatusPeriodoAssociacao}
          </p>
        </div>
    )
  )
};
