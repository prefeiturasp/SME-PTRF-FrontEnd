import React from "react";
import {Route, Switch, Redirect} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/404";
import {Dashboard} from "../paginas/Dashboard";
import {CadastroDeDespesa} from "../paginas/Despesas/CadastroDeDespesas";
import {EdicaoDeDespesa} from "../paginas/Despesas/EdicaoDeDespesa";
import { ListaDeDespesasPage } from '../paginas/Despesas/ListaDeDespesas'
import { CadastroDeReceita } from '../paginas/Receitas/CadastroReceita';
import {ListaDeReceitasPage} from "../paginas/Receitas/ListaDeReceitas";

import { authService } from '../services/auth.service';

const routesConfig = [
    {
        path: "/dashboard",
        component: Dashboard
    },
    {
        path: "/cadastro-de-despesa",
        component: CadastroDeDespesa
    },
    {
        path: "/lista-de-despesas",
        component: ListaDeDespesasPage
    },
    {
        path: "/edicao-de-despesa/:associacao?",
        component: EdicaoDeDespesa
    },
    {
        path: "/cadastro-de-credito",
        component: CadastroDeReceita
    },
    {
      path: "/lista-de-receitas",
      component: ListaDeReceitasPage
    },
    {
        path: "/",
        component: Dashboard
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
                        path={value.path}
                        component={value.component}
                    />
                );
            })}
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
}

