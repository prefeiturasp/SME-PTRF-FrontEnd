import React from 'react'
import {useHistory} from 'react-router-dom'
import {Rotas} from './rotas'
import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './assets/css/styles.scss'
import {Cabecalho} from './componentes/globais/Cabecalho'
import {SidebarLeft} from './componentes/globais/SidebarLeft'

export const App = () => {
    const pathName = useHistory().location.pathname;
    return (
        <section role="main" id="main" className="row">
            {pathName === '/login' ||
            pathName === '/esqueci-minha-senha/' ||
            pathName.match(/\/redefinir-senha\/[a-zA-Z0-9]/) ? (
                <Rotas/>
            ) : pathName === '/detalhe-das-prestacoes' || pathName === "/visualizacao-da-ata" ? (
                    <>
                        <Cabecalho/>
                        <Rotas/>
                    </>
                ) :
                <>
                    <Cabecalho/>
                    <SidebarLeft/>
                    <Rotas/>
                </>
            }
        </section>
    )
};

export default App