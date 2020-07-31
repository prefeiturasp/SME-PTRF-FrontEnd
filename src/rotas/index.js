import React from "react";
import {Route, Switch, Redirect} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/escolas/404";
import {DashboardPage} from "../paginas/escolas/Dashboard";
import {CadastroDeDespesa} from "../paginas/escolas/Despesas/CadastroDeDespesas";
import {EdicaoDeDespesa} from "../paginas/escolas/Despesas/EdicaoDeDespesa";
import { ListaDeDespesasPage } from '../paginas/escolas/Despesas/ListaDeDespesas'
import { CadastroDeReceita } from '../paginas/escolas/Receitas/CadastroReceita';
import { EdicaoDeReceita } from '../paginas/escolas/Receitas/EdicaoReceita';
import { ListaDeReceitasPage } from "../paginas/escolas/Receitas/ListaDeReceitas";
import {DadosDaAssociacaoPage} from "../paginas/escolas/Associacao";
import {PrestacaoDeContasPage} from "../paginas/escolas/PrestacaoDeContas";
import {DetalheDasPrestacoes} from "../componentes/escolas/PrestacaoDeContas/DetalheDasPrestacoes";
import {VisualizacaoDaAta} from "../componentes/escolas/GeracaoDaAta/VisualizacaoDaAta";
import {MembrosDaAssociacaoPage} from "../paginas/escolas/MembrosDaAssociacao";
import {ValoresReprogramadosPage} from "../paginas/escolas/ValoresReprogramados";
import {DadosDasContasPage} from "../paginas/escolas/DadosDasContasAssociacao";
import {EsqueciMinhaSenhaPage} from "../paginas/Login/EsqueciMinhaSenha";
import {RedefinirSenhaPage} from "../paginas/Login/RedefinirMinhaSenha";
import {MeusDadosPage} from "../paginas/escolas/MeusDados";

import { authService } from '../services/auth.service';

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
      component: DetalheDasPrestacoes
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
        path: "/",
        component: DadosDaAssociacaoPage
    },
]

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

export const Rotas = (props) => {
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
}

