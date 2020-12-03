import React, {useContext} from 'react'
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import './siderbarLeft.scss'
import IconeMenuMeuPerfil from '../../../assets/img/icone-menu-meu-perfil.png'
import LogoSP from '../../../assets/img/logo-menu-tratado.png'
import {SidebarContext} from '../../../context/Sidebar'
import {useHistory} from 'react-router-dom'
import {Versao} from '../Versao'
import ReactTooltip from "react-tooltip";
import {getUrls} from "./getUrls";
import {NotificacaoContext} from "../../../context/Notificacoes";
import {visoesService} from "../../../services/visoes.service";
import {authService} from "../../../services/auth.service";
import moment from "moment";

export const SidebarLeft = () => {
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);
    let history = useHistory();

    const onToggle = () => {
        sidebarStatus.setSideBarStatus(!sidebarStatus.sideBarStatus)
    };

    let urls = getUrls.GetUrls();

    const qtdeNotificacoesNaoLidas = async () => {
        await notificacaoContext.getQtdeNotificacoesNaoLidas()
    };

    const forcarNovoLogin = ()=>{
        const data_hora_atual = moment().format("YYYY-MM-DD HH:mm:ss")
        let data_hora_localstorage = localStorage.getItem('DATA_HORA_USUARIO_LOGADO')
        if(data_hora_localstorage){
            let diferenca = moment(data_hora_atual).diff(moment(data_hora_localstorage), 'minutes');
            console.log('DIFERENCA ', diferenca)

            if (diferenca >=1){
                localStorage.setItem('DATA_HORA_USUARIO_LOGADO', data_hora_atual);
                authService.logout();
            }

        }else {
            localStorage.setItem('DATA_HORA_USUARIO_LOGADO', data_hora_atual)
        }

    };

    return (
        <>
            <SideNav
                id="sideBarLeft"
                className="sideNavCustomizado"
                expanded={sidebarStatus.sideBarStatus}
                onSelect={(selected) => {
                    qtdeNotificacoesNaoLidas();
                    forcarNovoLogin();
                    const to = '/' + selected;
                    if (history.location.pathname !== to) {
                        history.push(to)
                    }
                }}
                onToggle={onToggle}
            >
                <SideNav.Toggle/>
                <SideNav.Nav defaultSelected={urls.dados_iniciais.default_selected}>

                    {sidebarStatus.sideBarStatus &&
                    <>
                        <NavItem
                            navitemClassName={sidebarStatus.sideBarStatus ? 'navItemCustomizadoNome esconde-icone mb-n2' : 'navItemCustomizadoNome'}
                            eventKey={urls.dados_iniciais.default_selected}
                        >
                            <NavIcon>&nbsp;</NavIcon>
                            <NavText>
                                <div className="container-nome-instituicao">
                                  <span className="border border-white rounded-pill px-4 py-1">
                                    {urls ? urls.dados_iniciais.usuario : ''}
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
                            <div
                                className="container-meus-dados mt-n4 d-flex justify-content-center align-items-center">
                                {sidebarStatus.sideBarStatus ?
                                    <img src={IconeMenuMeuPerfil} className="mr-1" alt=""/> : ""}
                                Meus Dados
                            </div>
                        </NavText>
                    </NavItem>
                    <ReactTooltip disable={sidebarStatus.sideBarStatus} id='meus_dados'>{}</ReactTooltip>

                    {urls && urls.lista_de_urls.length > 0 && urls.lista_de_urls.map((url, index) => {
                            return (
                                visoesService.getPermissoes(url.permissoes) ? (
                                    <NavItem
                                        key={index}
                                        navitemClassName={`d-flex align-items-end ${url.subItens && url.subItens.length > 0 ? "sub-menu" : ""}`}
                                        data-tip={url.label} data-for={url.dataFor}
                                        eventKey={url.url}
                                    >
                                        <NavIcon>
                                            <img src={url.icone} alt=""/>
                                        </NavIcon>
                                        <NavText>{url.label}</NavText>
                                        <ReactTooltip disable={sidebarStatus.sideBarStatus}
                                                      id={url.dataFor}>{}</ReactTooltip>
                                        {url.subItens && url.subItens.length > 0 && url.subItens.map((subItem, index) =>
                                            <NavItem
                                                key={index}
                                                navitemClassName="sub-menu-item"
                                                eventKey={subItem.url}
                                            >
                                                <NavText>
                                                    {subItem.label}
                                                </NavText>
                                            </NavItem>
                                        )}
                                    </NavItem>
                                ) : null
                            )
                        }
                    )
                    }
                    <NavItem
                        eventKey={urls.dados_iniciais.default_selected}
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
                        navitemClassName={!sidebarStatus.sideBarStatus ? 'escondeItem' : 'navItemCustomizadoNome'}
                        eventKey={urls.dados_iniciais.default_selected}
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
