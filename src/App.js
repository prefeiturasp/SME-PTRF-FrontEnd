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

  var url_atual = window.location.pathname;

  //console.log("pathName ", pathName)
  console.log("url_atual ", url_atual)

  return (
    <section role="main" id="main" className="row">
      {url_atual === '/detalhe-das-prestacoes' ? (
        <>
          <Cabecalho />
          <Rotas />
        </>
      ) : url_atual === '/login' ? (
        <Rotas />
      ) :
          <>
            <Cabecalho />
            <SidebarLeft />
            <Rotas />
          </>
      }
    </section>
  )
}

export default App
