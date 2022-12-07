import React, {useContext} from 'react'
import SideNav, {NavItem, NavIcon, NavText} from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import './siderbarLeft.scss'
import LogoSP from '../../../assets/img/logo-menu-tratado.png'
import {SidebarContext} from '../../../context/Sidebar'
import {useHistory} from 'react-router-dom'
import {Versao} from "../Versao";
import ReactTooltip from "react-tooltip";
import {getUrls} from "./getUrls";
import {NotificacaoContext} from "../../../context/Notificacoes";
import {CentralDeDownloadContext} from "../../../context/CentralDeDownloads";
import {visoesService} from "../../../services/visoes.service";
import {Ambientes} from "../Ambientes";
import {AmbientesApi} from "../AmbientesApi";

import { useLocation } from 'react-router-dom'

export const SidebarLeft = () => {
    const sidebarStatus = useContext(SidebarContext);
    const notificacaoContext = useContext(NotificacaoContext);
    const centralDeDownloadContext = useContext(CentralDeDownloadContext)
    let history = useHistory();

    const location = useLocation();

    const onToggle = () => {
        sidebarStatus.setSideBarStatus(!sidebarStatus.sideBarStatus)
    };

    let urls = getUrls.GetUrls();

    const qtdeNotificacoesNaoLidas = async () => {
        await notificacaoContext.getQtdeNotificacoesNaoLidas()
    };

    const qdteCentralDeDownloadsNaoLidas = async () => {
        await centralDeDownloadContext.getQtdeNotificacoesNaoLidas()
    };

    const getPathnameExcecoes = (url) =>{

        if(url.match(/parametro-/)){
            return 'painel-parametrizacoes'
        }else {
            switch (url) {
                case 'cadastro-de-despesa-recurso-proprio':
                    return 'lista-de-despesas'
                case 'cadastro-de-despesa':
                    return 'lista-de-despesas'
                case 'edicao-de-despesa':
                    return 'lista-de-despesas'
                case 'cadastro-de-credito':
                    return 'lista-de-receitas'
                case 'edicao-de-receita':
                    return 'lista-de-receitas'
                case 'gestao-de-perfis-form':
                    return 'gestao-de-perfis'
                case 'dre-lista-prestacao-de-contas':
                    return 'dre-dashboard'
                case 'dre-detalhe-prestacao-de-contas':
                    return 'dre-dashboard'
                default:
                    return false
            }
        }
    }

    const getPathname = () => {
        let array_pathname = location.pathname.split('/');
        return getPathnameExcecoes(array_pathname[1]) ? getPathnameExcecoes(array_pathname[1]) : array_pathname[1]
    }

    const validaPermissao = (url) => {
        let possui_permissao_sub_item = false

        if(url.subItens){
            for(let subItem=0; subItem<=url.subItens.length-1; subItem++){
                if(visoesService.getPermissoes(url.subItens[subItem].permissoes)){
                    possui_permissao_sub_item = true;
                }
            }
            if(visoesService.getPermissoes(url.permissoes) && possui_permissao_sub_item ){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            if(visoesService.getPermissoes(url.permissoes)){
                return true;
            }
            else{
                return false;
            }
        }
    }

    return (
        <>
            <SideNav
                id="sideBarLeft"
                className="sideNavCustomizado"
                expanded={sidebarStatus.sideBarStatus}
                onSelect={(selected) => {
                    qtdeNotificacoesNaoLidas();
                    qdteCentralDeDownloadsNaoLidas();
                    visoesService.forcarNovoLogin();
                    const to = '/' + selected;
                    if (history.location.pathname !== to) {
                        if(sidebarStatus.irParaUrl){
                            history.push(to)
                        }
                    }
                }}
                onToggle={onToggle}
            >
                <SideNav.Toggle/>
                {/*<SideNav.Nav defaultSelected={urls.dados_iniciais.default_selected}>*/}
                <SideNav.Nav defaultSelected={getPathname()}>
                    {urls && urls.lista_de_urls.length > 0 && urls.lista_de_urls.map((url, index) => {
                            return (
                                validaPermissao(url) ? (
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
                                            visoesService.getPermissoes(subItem.permissoes) ? (
                                            <NavItem
                                                key={index}
                                                navitemClassName="sub-menu-item"
                                                eventKey={subItem.url}
                                                id={subItem.id}
                                            >
                                                <NavText>
                                                    {subItem.label}
                                                </NavText>
                                            </NavItem>): null
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
                        <NavText>
                            <Versao/>
                        </NavText>
                    </NavItem>
                    <NavItem
                        navitemClassName={!sidebarStatus.sideBarStatus ? 'escondeItem' : 'navItemCustomizadoNome'}
                        eventKey={urls.dados_iniciais.default_selected}
                    >
                        <NavText>
                            <Ambientes/>
                        </NavText>
                    </NavItem>
                    <NavItem
                        navitemClassName={!sidebarStatus.sideBarStatus ? 'escondeItem' : 'navItemCustomizadoNome'}
                        eventKey={urls.dados_iniciais.default_selected}
                    >
                        <NavText>
                            <AmbientesApi/>
                        </NavText>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        </>
    )
};
