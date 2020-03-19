import React, {useState} from "react";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import "./siderbarLeft.scss"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faHome } from '@fortawesome/free-solid-svg-icons'

import IconeMenuPainel from "../../assets/img/icone-menu-painel.svg"
import IconeMenuGastosDaEscola from "../../assets/img/icone-menu-gastos-da-escola.svg"
import IconeMenuCreditosDaEscola from "../../assets/img/icone-menu-creditos-da-escola.svg"
import IconeMenuCadastroDeDespesa from "../../assets/img/icone-menu-cadastro-de-despesa.svg"
import IconeMenuCadastroDeCredito from "../../assets/img/icone-menu-cadastro-de-credito.svg"
import IconeMenuPrestacaoDeContas from "../../assets/img/icone-menu-prestacao-de-contas.svg"
import IconeMenuDadosDaAssociacao from "../../assets/img/icone-menu-dados-da-associacao.svg"

import $ from 'jquery';

export const SidebarLeft = () => {

    const onToggle= () =>{
        setExpanded(!expanded)
        $('#content').toggleClass('active');
    }


    const [expanded, setExpanded] = useState(true)

    return (
        <>

        <SideNav
            expanded = {expanded}
            onSelect={(selected) => {
                // Add your code here
            }}
            onToggle={onToggle}
        >

            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="painel">
                <div className="justify-content-center mx-auto align-items-center sidebar-brand-text mx-3 pt-2">
                    <p><strong>Escola Municipal de Educação Infantil Emílio Ribas</strong></p>
                </div>

                {/*<NavItem eventKey="nomeInstituicao">

                    <NavText>
                        <div className="container-nome-instituicao">
                            <p><strong>Escola Municipal de Educação Infantil Emílio Ribas</strong></p>
                        </div>
                    </NavText>
                </NavItem>*/}

                <NavItem eventKey="painel">
                    <NavIcon>
                        <img src={IconeMenuPainel} alt=""/>
                    </NavIcon>
                    <NavText>
                        Painel
                    </NavText>
                </NavItem>
                <NavItem eventKey="gastosDaEscola">
                    <NavIcon>
                        <img src={IconeMenuGastosDaEscola} alt=""/>
                    </NavIcon>
                    <NavText>
                        Gastos da Escola
                    </NavText>
                </NavItem>


                <NavItem eventKey="creditosDaEscola">
                    <NavIcon>
                        <img src={IconeMenuCreditosDaEscola} alt=""/>
                    </NavIcon>
                    <NavText>
                        Créditos da escola
                    </NavText>
                </NavItem>

                <NavItem eventKey="cadastroDeDespesa">
                    <NavIcon>
                        <img src={IconeMenuCadastroDeDespesa} alt=""/>
                    </NavIcon>
                    <NavText>
                        Cadastro de despesa
                    </NavText>
                </NavItem>

                <NavItem eventKey="cadastroCredito">
                    <NavIcon>
                        <img src={IconeMenuCadastroDeCredito} alt=""/>
                    </NavIcon>
                    <NavText>
                        Cadastro de crédito
                    </NavText>
                </NavItem>

                <NavItem eventKey="prestacaoDeContas">
                    <NavIcon>
                        <img src={IconeMenuPrestacaoDeContas} alt=""/>
                    </NavIcon>
                    <NavText>
                        Prestação de contas
                    </NavText>
                </NavItem>

                <NavItem eventKey="dadosAssociacao">
                    <NavIcon>
                        <img src={IconeMenuDadosDaAssociacao} alt=""/>
                    </NavIcon>
                    <NavText>
                        Dados da Associação
                    </NavText>
                </NavItem>

            </SideNav.Nav>
        </SideNav>
            </>

    );
}