import React from 'react'
import { PaginasContainer } from '../../PaginasContainer'
import { ListaDeDespesas } from '../../../componentes/Despesas/ListaDeDespesas'

export const ListaDeDespesasPage = () => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Gastos da minha escola</h1>
      <div className="page-content-inner ">
        <ListaDeDespesas />
      </div>
    </PaginasContainer>
  )
}
