import React, {useContext, Fragment} from 'react'
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import './siderbarLeft.scss'
import IconeMenuPainel from '../../../assets/img/icone-menu-painel.svg'
import IconeMenuGastosDaEscola from '../../../assets/img/icone-menu-gastos-da-escola.svg'
import IconeMenuCreditosDaEscola from '../../../assets/img/icone-menu-creditos-da-escola.svg'
import IconeMenuPrestacaoDeContas from '../../../assets/img/icone-menu-prestacao-de-contas.svg'
import IconeMenuDadosDaAssociacao from '../../../assets/img/icone-menu-dados-da-associacao.svg'
import IconeMenuMeuPerfil from '../../../assets/img/icone-menu-meu-perfil.png'
import LogoSP from '../../../assets/img/logo-menu-tratado.png'
import {SidebarContext} from '../../../context/Sidebar'
import {useHistory} from 'react-router-dom'
import {Versao} from '../Versao'
import ReactTooltip from "react-tooltip";
import {getUrls} from "./getUrls";

export const SidebarLeft = () => {
    const sidebarStatus = useContext(SidebarContext);
    let history = useHistory();

    const onToggle = () => {
        sidebarStatus.setSideBarStatus(!sidebarStatus.sideBarStatus)
    };

    let urls = getUrls.GetUrls();

    return (
        <>
            {console.log(urls)}
            <SideNav
                id="sideBarLeft"
                className="sideNavCustomizado"
                expanded={sidebarStatus.sideBarStatus}
                onSelect={(selected) => {
                    const to = '/' + selected;
                    if (history.location.pathname !== to) {
                        history.push(to)
                    }
                }}
                onToggle={onToggle}
            >
                <SideNav.Toggle/>
                <SideNav.Nav defaultSelected="dashboard">

                    {sidebarStatus.sideBarStatus &&
                    <>
                        <NavItem
                            navitemClassName={sidebarStatus.sideBarStatus ? 'navItemCustomizadoNome esconde-icone mb-n2' : 'navItemCustomizadoNome'}
                            eventKey="dashboard"
                        >
                            <NavIcon>&nbsp;</NavIcon>
                            <NavText>
                                <div className="container-nome-instituicao">
                                  <span className="border border-white rounded-pill px-4 py-1">
                                  {urls
                                      ? urls.dados_iniciais.usuario
                                      : ''}
                                  </span>
                                </div>
                            </NavText>
                        </NavItem>
                    </>
                    }
                    <NavItem
                        data-tip="Meus Dados" data-for='meus_dados'
                        eventKey="meus-dados"
                    >
                        <NavIcon>{!sidebarStatus.sideBarStatus ? <img src={IconeMenuMeuPerfil} alt=""/> : ""} </NavIcon>
                        <NavText>
                            <div className="container-meus-dados mt-n4 d-flex justify-content-center align-items-center">
                                {sidebarStatus.sideBarStatus ? <img src={IconeMenuMeuPerfil} className="mr-1" alt=""/> : ""}
                                Meus Dados
                            </div>
                        </NavText>
                    </NavItem>
                    <ReactTooltip disable={sidebarStatus.sideBarStatus} id='meus_dados'>{}</ReactTooltip>

                    {sidebarStatus.sideBarStatus &&
                    <>
                        <NavItem
                            navitemClassName="navItemCustomizadoNome"
                            eventKey="dashboard"
                        >
                            <NavIcon>&nbsp;</NavIcon>
                            <NavText>
                                <div className="container-nome-instituicao mt-n4 mb-4">
                                    {`${urls ? urls.dados_iniciais.associacao_tipo_escola : ""} ${urls ? urls.dados_iniciais.associacao_nome_escola : ""}`}
                                </div>
                            </NavText>
                        </NavItem>
                    </>
                    }

                    {urls && urls.lista_de_urls.length > 0 && urls.lista_de_urls.map((url, index)=>
                        <NavItem
                            key={index}
                            navitemClassName="d-flex align-items-end"
                            data-tip={url.label}  data-for={url.dataFor}
                            eventKey={url.url}
                        >
                            <NavIcon>
                                <img src={url.icone} alt=""/>
                            </NavIcon>
                            <NavText>{url.label}</NavText>
                            <ReactTooltip disable={sidebarStatus.sideBarStatus} id={url.dataFor}>{}</ReactTooltip>
                        </NavItem>
                        )
                    }

                    {/*

                    <NavItem
                        navitemClassName="d-flex align-items-end"
                        data-tip="Prestação de contas" data-for='prestacao_de_contas'
                        eventKey="prestacao-de-contas"
                    >
                        <NavIcon>
                            <img src={IconeMenuPrestacaoDeContas} alt=""/>
                        </NavIcon>
                        <NavText>Prestação de contas</NavText>
                    </NavItem>
                    <ReactTooltip disable={sidebarStatus.sideBarStatus} id='prestacao_de_contas'>{}</ReactTooltip>*/}

                    <NavItem
                        eventKey="dashboard"
                        navitemClassName={
                            !sidebarStatus.sideBarStatus
                                ? 'escondeItem'
                                : 'navItemCustomizadoNome'
                        }
                    >
                        <NavIcon>&nbsp;</NavIcon>
                        <NavText>
                            <div className="container-nome-instituicao mt-n4">
                                <img src={LogoSP} alt=""/>
                            </div>
                        </NavText>
                    </NavItem>
                    <NavItem
                        eventKey="dashboard"
                        navitemClassName={
                            !sidebarStatus.sideBarStatus
                                ? 'escondeItem'
                                : 'navItemCustomizadoNome'
                        }
                    >
                        <NavIcon>&nbsp;</NavIcon>
                        <NavText>
                            <div>
                                <Versao/>
                            </div>
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        </>
    )
};
