import React from 'react'
import { useHistory } from 'react-router-dom'
import { Rotas } from './rotas'

import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import './assets/css/styles.scss'
import { Cabecalho } from './componentes/Cabecalho'
import { SidebarLeft } from './componentes/SidebarLeft'

export const App = () => {
  const pathName = useHistory().location.pathname

  const conditionalRender = () => {
    if (pathName === '/login'){
      return(
          <Rotas />
      )
    }else if (pathName === '/detalhe-das-prestacoes'){
      return (
          <>
            <Cabecalho />
            <Rotas />
          </>
      )
    }else {
      return (
          <>
            <Cabecalho />
            <SidebarLeft />
            <Rotas />
          </>
      )
    }

  }

  return (
    <section role="main" id="main" className="row">
      {conditionalRender()}
    </section>
  )
}

export default App
