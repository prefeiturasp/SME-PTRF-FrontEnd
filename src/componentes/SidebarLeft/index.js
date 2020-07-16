import React, { useContext } from 'react'
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav'
import '@trendmicro/react-sidenav/dist/react-sidenav.css'
import './siderbarLeft.scss'
import IconeMenuPainel from '../../assets/img/icone-menu-painel.svg'
import IconeMenuGastosDaEscola from '../../assets/img/icone-menu-gastos-da-escola.svg'
import IconeMenuCreditosDaEscola from '../../assets/img/icone-menu-creditos-da-escola.svg'
import IconeMenuPrestacaoDeContas from '../../assets/img/icone-menu-prestacao-de-contas.svg'
import IconeMenuDadosDaAssociacao from '../../assets/img/icone-menu-dados-da-associacao.svg'
import LogoSP from '../../assets/img/logo-menu-tratado.png'
import { SidebarContext } from '../../context/Sidebar'
import { useHistory } from 'react-router-dom'
import { USUARIO_NOME, ASSOCIACAO_NOME_ESCOLA, ASSOCIACAO_TIPO_ESCOLA } from '../../services/auth.service'
import { Versao } from '../Versao'
import ReactTooltip from "react-tooltip";

export const SidebarLeft = () => {
  const sidebarStatus = useContext(SidebarContext);
  let history = useHistory();

  const onToggle = () => {
    sidebarStatus.setSideBarStatus(!sidebarStatus.sideBarStatus)
  };

  return (
    <>

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
        <SideNav.Toggle />
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
                {localStorage.getItem(USUARIO_NOME)
                      ? localStorage.getItem(USUARIO_NOME).split(' ')[0]
                      : ''}
                </span>
                </div>
              </NavText>
            </NavItem>

            <NavItem
                navitemClassName="navItemCustomizadoNome"
                eventKey="dashboard"
            >
              <NavIcon>&nbsp;</NavIcon>
              <NavText>
                <div className="container-nome-instituicao mt-n4 mb-4">
                    {`${localStorage.getItem(ASSOCIACAO_TIPO_ESCOLA)} ${localStorage.getItem(ASSOCIACAO_NOME_ESCOLA)}`}
                </div>
              </NavText>
            </NavItem>
          </>
          }

          <NavItem
              /*data-toggle="tooltip" data-placement="top" title={!sidebarStatus.sideBarStatus ? "Dados da Associação" : ""}*/
              data-tip="Dados da Associação" data-for='dados_da_associacao'
              eventKey="dados-da-associacao"
          >
            <NavIcon>
              <img src={IconeMenuDadosDaAssociacao} alt="" />
            </NavIcon>
            <NavText>Dados da Associação</NavText>
          </NavItem>
          <ReactTooltip disable={sidebarStatus.sideBarStatus} id='dados_da_associacao'>{}</ReactTooltip>

            <NavItem
                /*data-toggle="tooltip" data-placement="top" title={!sidebarStatus.sideBarStatus ? "Dados da Associação" : ""}*/
                data-tip="Dados da Associação" data-for='dados_da_associacao'
                eventKey="dados-da-associacao"
            >
              <NavIcon>
                <img src={IconeMenuDadosDaAssociacao} alt="" />
              </NavIcon>
              <NavText>Dados da Associação</NavText>
            </NavItem>
            <ReactTooltip disable={sidebarStatus.sideBarStatus} id='dados_da_associacao'>{}</ReactTooltip>

          <NavItem
              data-tip="Resumo dos recursos" data-for='resumo_dos_recursos'
              eventKey="dashboard"
          >
            <NavIcon>
              <img src={IconeMenuPainel} alt="" />
            </NavIcon>
            <NavText>Resumo dos recursos</NavText>
          </NavItem>
          <ReactTooltip disable={sidebarStatus.sideBarStatus} id='resumo_dos_recursos'>{}</ReactTooltip>

          <NavItem
              data-tip="Créditos da escola" data-for='creditos_da_escola'
              eventKey="lista-de-receitas"
          >
            <NavIcon>
              <img src={IconeMenuCreditosDaEscola} alt="" />
            </NavIcon>
            <NavText>Créditos da escola</NavText>
          </NavItem>
          <ReactTooltip disable={sidebarStatus.sideBarStatus} id='creditos_da_escola'>{}</ReactTooltip>

          <NavItem
              data-tip="Gastos da escola" data-for='gastos_da_escola'
              eventKey="lista-de-despesas"
          >
            <NavIcon>
              <img src={IconeMenuGastosDaEscola} alt="" />
            </NavIcon>
            <NavText>Gastos da escola</NavText>
          </NavItem>
          <ReactTooltip disable={sidebarStatus.sideBarStatus} id='gastos_da_escola'>{}</ReactTooltip>

          <NavItem
              data-tip="Prestação de contas"  data-for='prestacao_de_contas'
              eventKey="prestacao-de-contas"
          >
            <NavIcon>
              <img src={IconeMenuPrestacaoDeContas} alt="" />
            </NavIcon>
            <NavText>Prestação de contas</NavText>
          </NavItem>
          <ReactTooltip disable={sidebarStatus.sideBarStatus} id='prestacao_de_contas'>{}</ReactTooltip>

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
                <img src={LogoSP} alt="" />
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
                <Versao />
              </div>
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </>
  )
};
