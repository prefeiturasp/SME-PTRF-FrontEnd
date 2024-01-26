import React from 'react'
import {useHistory} from 'react-router-dom'
import {Rotas} from './rotas'
import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import './assets/css/styles.scss'
import {Cabecalho} from './componentes/Globais/Cabecalho'
import {SidebarLeft} from './componentes/Globais/SidebarLeft'
import {ToastContainer} from "react-toastify";
import Modal from './componentes/Globais/Modal/Modal'

export const App = () => {
    const pathName = useHistory().location.pathname;
    return (
        <>
            <ToastContainer/>
            <section role="main" id="main" className="row">
                {pathName === '/login' || pathName === '/login-suporte' ||
                pathName === '/esqueci-minha-senha/' ||
                pathName.match(/\/redefinir-senha\/[a-zA-Z0-9]/) ? (
                    <Rotas/>
                ) :
                    pathName.match(/\/visualizacao-da-ata\/[a-zA-Z0-9]/) ||
                    pathName.match(/\/edicao-da-ata\/[a-zA-Z0-9]/) ||
                    pathName.match(/\/visualizacao-da-ata-parecer-tecnico\/[a-zA-Z0-9]/) ||
                    pathName.match(/\/edicao-da-ata-parecer-tecnico\/[a-zA-Z0-9]/) ||
                    pathName.match(/\/dre-relatorio-consolidado-apuracao\/[a-zA-Z0-9]/) ||
                    pathName.match(/\/dre-relatorio-consolidado-em-tela\/[a-zA-Z0-9]/) ||
                    pathName.match(/\/dre-relatorio-consolidado-dados-das-ues\/[a-zA-Z0-9]/) ? (
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
                <Modal/>
            </section>
        </>
    )
};

export default App