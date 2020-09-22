import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/escolas/404";
import {DashboardPage} from "../paginas/Dashboard";
import {CadastroDeDespesa} from "../paginas/escolas/Despesas/CadastroDeDespesas";
import {EdicaoDeDespesa} from "../paginas/escolas/Despesas/EdicaoDeDespesa";
import {ListaDeDespesasPage} from '../paginas/escolas/Despesas/ListaDeDespesas'
import {CadastroDeReceita} from '../paginas/escolas/Receitas/CadastroReceita';
import {EdicaoDeReceita} from '../paginas/escolas/Receitas/EdicaoReceita';
import {ListaDeReceitasPage } from "../paginas/escolas/Receitas/ListaDeReceitas";
import {DadosDaAssociacaoPage} from "../paginas/escolas/Associacao";
import {PrestacaoDeContasPage} from "../paginas/escolas/PrestacaoDeContas";
import {DetalhedasPrestacoesPage} from "../paginas/escolas/DetalheDasPrestacoes";
import {VisualizacaoDaAta} from "../componentes/escolas/GeracaoDaAta/VisualizacaoDaAta";
import {MembrosDaAssociacaoPage} from "../paginas/escolas/MembrosDaAssociacao";
import {ValoresReprogramadosPage} from "../paginas/escolas/ValoresReprogramados";
import {DadosDasContasPage} from "../paginas/escolas/DadosDasContasAssociacao";
import {EsqueciMinhaSenhaPage} from "../paginas/Login/EsqueciMinhaSenha";
import {RedefinirSenhaPage} from "../paginas/Login/RedefinirMinhaSenha";
import {MeusDadosPage} from "../paginas/escolas/MeusDados";
import {AssociacoesPage} from "../paginas/dres/Associacoes";
import {ProcessosSeiPage} from "../paginas/dres/Associacoes/ProcessosSei";
import {CentralDeNotificacoesPage} from "../paginas/CentralDeNotificacoes";
import { authService } from '../services/auth.service';
// Faz o redirect de acordo com a Visao Selecionada
import {RedirectLoginVisaoUe} from "../utils/RedirectLoginVisaoUe";
import {DadosDaUnidadeEducacionalPage} from "../paginas/dres/Associacoes/DadosDaUnidadeEducacional";
import {DadosDaAssociacaoDrePage} from "../paginas/dres/Associacoes/DadosDaAssociacao";
import {DadosDasContasDrePage} from "../paginas/dres/Associacoes/DadosDasContas";
import {PaginaRegularidadeUnidadeEducacional} from "../paginas/dres/Associacoes/RegularidadeUnidadeEducacional"
import {DadosDaDiretoriaDrePage} from "../paginas/dres/Diretoria/DadosDaDiretoria";
import {TecnicosDaDiretoriaDrePage} from "../paginas/dres/Diretoria/TecnicosDaDiretoria";
import {FaqDrePage} from "../paginas/dres/ApoioDiretoria/Faq";
import {SituacaoFinanceiraUnidadeEducacionalPage} from "../paginas/dres/Associacoes/SituacaoFinanceiraUnidadeEducacional";
import {AtribuicoesPage} from "../paginas/dres/Diretoria/Atribuicoes";
import {DreDashboardPage} from "../paginas/dres/DreDashboard";
import {ListaPrestacaoDeContas} from "../componentes/dres/PrestacaoDeContas/ListaPrestacaoDeContas";


const routesConfig = [
    {
        exact: true,
        path: "/dashboard",
        component: DashboardPage
    },
    { 
        exact: true,
        path: "/cadastro-de-despesa/:origem?",
        component: CadastroDeDespesa
    },
    { 
        exact: true,
        path: "/lista-de-despesas",
        component: ListaDeDespesasPage
    },
    { 
        exact: true,
        path: "/edicao-de-despesa/:associacao/:origem?",
        component: EdicaoDeDespesa
    },
    {
        exact: true,
        path: "/cadastro-de-credito/:origem?",
        component: CadastroDeReceita
    },
    {
        exact: true,
        path: "/edicao-de-receita/:uuid/:origem?",
        component: EdicaoDeReceita
    },
    {
      exact: true,
      path: "/lista-de-receitas",
      component: ListaDeReceitasPage
    },
    {
      exact: true,
      path: "/cadastro-de-valores-reprogramados",
      component: ValoresReprogramadosPage
    },
    {
      exact: true,
      path: "/dados-da-associacao",
      component: DadosDaAssociacaoPage
    },
    {
      exact: true,
      path: "/membros-da-associacao",
      component: MembrosDaAssociacaoPage
    },
    {
      exact: true,
      path: "/dados-das-contas-da-associacao",
      component: DadosDasContasPage
    },
    {
      exact: true,
      path: "/prestacao-de-contas",
      component: PrestacaoDeContasPage
    },
    {
      exact: true,
      path: "/detalhe-das-prestacoes",
      component: DetalhedasPrestacoesPage
    },
    {
      exact: true,
      path: "/visualizacao-da-ata",
      component: VisualizacaoDaAta
    },
    {
      exact: true,
      path: "/meus-dados",
      component: MeusDadosPage
    },
    {
        exact: true,
        path: "/dre-associacoes",
        component: AssociacoesPage
    },
    {
        exact: true,
        path: "/dre-dados-da-unidade-educacional",
        component: DadosDaUnidadeEducacionalPage
    },
    {
        exact: true,
        path: "/dre-dados-da-associacao",
        component: DadosDaAssociacaoDrePage
    },
    {
        exact: true,
        path: "/dre-dados-das-contas",
        component: DadosDasContasDrePage
    },
    {
        exact: true,
        path: "/dre-processos-sei",
        component: ProcessosSeiPage
    },
    {
        exact: true,      
        path: "/dre-dados-da-diretoria",
        component: DadosDaDiretoriaDrePage
    },
    {
      exact: true,
      path: "/dre-regularidade-unidade-educacional",
      component: PaginaRegularidadeUnidadeEducacional
    },
    {
      exact: true,
      path: "/dre-situacao-financeira-unidade-educacional",
      component: SituacaoFinanceiraUnidadeEducacionalPage
    },
    {
        exact: true,
        path: "/dre-tecnicos-da-diretoria",
        component: TecnicosDaDiretoriaDrePage
    },
    {
        exact: true,
        path: "/dre-faq",
        component: FaqDrePage
    },
    {
        exact: true,
        path: "/central-de-notificacoes",
        component: CentralDeNotificacoesPage
    },
    {
        exact: true,
        path: "/dre-atribuicoes/:tecnico_uuid?",
        component: AtribuicoesPage
    },
    {
        exact: true,
        path: "/dre-dashboard",
        component: DreDashboardPage
    },
    {
        exact: true,
        path: "/dre-lista-prestacao-de-contas",
        component: ListaPrestacaoDeContas
    },
    {
        exact: true,
        path: "/",
        component: RedirectLoginVisaoUe
    },
];

const PrivateRouter = (
    { component: Component, ...rest } // eslint-disable-line
  ) => (
    <Route
      {...rest}
      render={props =>
        authService.isLoggedIn() ? (
          <Component {...props} />
        ) :
            window.location.assign("/login")
          /* <Redirect
            to={{ pathname: "/login", state: { from: props.location } }} // eslint-disable-line
          /> */
      }
    />
  );

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/login" component={Login}/>
            <Route strict path="/esqueci-minha-senha/" component={EsqueciMinhaSenhaPage}/>
            <Route exact={true} path="/redefinir-senha/:uuid/" component={RedefinirSenhaPage}/>
            {routesConfig.map(
                (value, key) => {
                return (
                    <PrivateRouter
                        key={key}
                        exact={value.exact}
                        path={value.path}
                        component={value.component}
                    />
                );
            })}
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
};

