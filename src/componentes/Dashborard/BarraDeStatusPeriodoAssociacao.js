import React from 'react'

export const BarraDeStatusPeriodoAssociacao = ({
  statusPeriodoAssociacao,
  corBarraDeStatusPeriodoAssociacao,
  textoBarraDeStatusPeriodoAssociacao,
}) => {
  return (
    statusPeriodoAssociacao !== undefined && (
      <div className="row">
        <div
          className={`col-12 barra-status-${corBarraDeStatusPeriodoAssociacao}`}
        >
          <p className="titulo-status pt-1 pb-1 mb-0">
            {textoBarraDeStatusPeriodoAssociacao}
          </p>
        </div>
      </div>
    )
  )
}
