import React from "react";
import {Route, Switch, Redirect} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/404";
import {DashboardPage} from "../paginas/Dashboard";
import {CadastroDeDespesa} from "../paginas/Despesas/CadastroDeDespesas";
import {EdicaoDeDespesa} from "../paginas/Despesas/EdicaoDeDespesa";
import { ListaDeDespesasPage } from '../paginas/Despesas/ListaDeDespesas'
import { CadastroDeReceita } from '../paginas/Receitas/CadastroReceita';
import { EdicaoDeReceita } from '../paginas/Receitas/EdicaoReceita';
import { ListaDeReceitasPage } from "../paginas/Receitas/ListaDeReceitas";
import {DadosDaAssociacaoPage} from "../paginas/Associacao";
import {PrestacaoDeContasPage} from "../paginas/PrestacaoDeContas";
import {DetalheDasPrestacoes} from "../componentes/PrestacaoDeContas/DetalheDasPrestacoes";

import { authService } from '../services/auth.service';

const routesConfig = [
    {
      exact: true,
        path: "/edicao-de-receita/:uuid",
        component: EdicaoDeReceita
    },
    {
        exact: true,
        path: "/dashboard",
        component: DashboardPage
    },
    { 
        exact: true,
        path: "/cadastro-de-despesa",
        component: CadastroDeDespesa
    },
    { 
        exact: true,
        path: "/lista-de-despesas",
        component: ListaDeDespesasPage
    },
    { 
        exact: true,
        path: "/edicao-de-despesa/:associacao",
        component: EdicaoDeDespesa
    },
    {
        exact: true,
        path: "/cadastro-de-credito",
        component: CadastroDeReceita
    },
    {
      exact: true,
      path: "/lista-de-receitas",
      component: ListaDeReceitasPage
    },
    {
      exact: true,
      path: "/dados-da-associacao",
      component: DadosDaAssociacaoPage
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
        path: "/",
        component: DashboardPage
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
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }} // eslint-disable-line
          />
        )
      }
    />
  );

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/login" component={Login}/>
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

