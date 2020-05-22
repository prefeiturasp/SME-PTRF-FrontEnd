import React, { useEffect, useState } from 'react'
import { PaginasContainer } from '../PaginasContainer'
import { Dashboard } from '../../componentes/Dashborard'
import { getAcoesAssociacao } from '../../services/Dashboard.service'
import {
  exibeDataPT_BR,
  getCorStatusPeriodo,
  getTextoStatusPeriodo,
} from '../../utils/ValidacoesAdicionaisFormularios'
import { BarraDeStatusPeriodoAssociacao } from '../../componentes/Dashborard/BarraDeStatusPeriodoAssociacao'

export const DashboardPage = () => {
  const [acoesAssociacao, setAcoesAssociacao] = useState({})

  useEffect(() => {
    buscaListaAcoesAssociacao()
  }, [])

  const buscaListaAcoesAssociacao = async () => {
    const listaAcoes = await getAcoesAssociacao()
    setAcoesAssociacao(listaAcoes)
  }

  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Painel</h1>
      <h2 className="subtitulo-itens-painel-out">
        {'Período: '}
        {acoesAssociacao.periodo_referencia} {' - '}
        {exibeDataPT_BR(acoesAssociacao.data_inicio_realizacao_despesas)}
        {' até '}
        {exibeDataPT_BR(acoesAssociacao.data_fim_realizacao_despesas)}
        {'.'}
      </h2>
      <BarraDeStatusPeriodoAssociacao
        statusPeriodoAssociacao={acoesAssociacao.periodo_status}
        corBarraDeStatusPeriodoAssociacao={getCorStatusPeriodo(
          acoesAssociacao.periodo_status
        )}
        textoBarraDeStatusPeriodoAssociacao={getTextoStatusPeriodo(
          acoesAssociacao.periodo_status
        )}
      />
      <div className="page-content-inner bg-transparent p-0">
        <Dashboard acoesAssociacao={acoesAssociacao} />
      </div>
    </PaginasContainer>
  )
}
