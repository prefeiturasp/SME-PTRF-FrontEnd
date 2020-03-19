import React, {useState} from "react";
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import "./siderbarLeft.scss"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faSchool } from '@fortawesome/free-solid-svg-icons'

import IconeMenuPainel from "../../assets/img/icone-menu-painel.svg"
import IconeMenuGastosDaEscola from "../../assets/img/icone-menu-gastos-da-escola.svg"
import IconeMenuCreditosDaEscola from "../../assets/img/icone-menu-creditos-da-escola.svg"
import IconeMenuCadastroDeDespesa from "../../assets/img/icone-menu-cadastro-de-despesa.svg"
import IconeMenuCadastroDeCredito from "../../assets/img/icone-menu-cadastro-de-credito.svg"
import IconeMenuPrestacaoDeContas from "../../assets/img/icone-menu-prestacao-de-contas.svg"
import IconeMenuDadosDaAssociacao from "../../assets/img/icone-menu-dados-da-associacao.svg"
import LogoSP from "../../assets/img/logo-menu.png"

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
            className="sideNavCustomizado"
            expanded = {expanded}
            onSelect={(selected) => {
                // Add your code here
            }}
            onToggle={onToggle}
            //componentClass="sideNavCustomizado"
        >

            <SideNav.Toggle />
            <SideNav.Nav defaultSelected="painel">
                <NavItem
                    navitemClassName="navItemCustomizado"
                >
                    <NavIcon>
                        <FontAwesomeIcon style={{fontSize: "25px"}} className={expanded ? "escondeItem" : ""} src={IconeMenuDadosDaAssociacao} icon={faUser}/>
                    </NavIcon>
                    <NavText>
                        <div className="container-nome-instituicao mt-n4 mb-4">Escola Municipal de Educação Infantil Emílio Ribas</div>
                    </NavText>
                </NavItem>

                <NavItem
                    navitemClassName="navItemCustomizado"
                >
                    <NavIcon>
                        <FontAwesomeIcon style={{fontSize: "25px"}} className={expanded ? "escondeItem" : ""} src={IconeMenuDadosDaAssociacao} icon={faSchool}/>
                    </NavIcon>
                    <NavText>
                        <div className="container-nome-instituicao mt-n4 mb-4"><span className="border border-white rounded-pill px-4 py-1">Eduardo Ramos</span></div>
                    </NavText>
                </NavItem>

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
                <NavItem
                    navitemClassName= {!expanded ? "escondeItem" : "navItemCustomizado"}
                >
                    <NavIcon>

                    </NavIcon>
                    <NavText>
                        <div className="container-nome-instituicao mt-n4 mb-4"><img src={LogoSP} alt=""/></div>
                    </NavText>
                </NavItem>


            </SideNav.Nav>
        </SideNav>
            </>

    );
}