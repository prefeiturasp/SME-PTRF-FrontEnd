import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/404";
import {Dashboard} from "../paginas/Dashboard";
import {CadastroDeDespesa} from "../paginas/Despesas/CadastroDeDespesa";
import { ListaDeDespesasPage } from '../paginas/Despesas/ListaDeDespesas'

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/cadastro-de-despesa" component={CadastroDeDespesa}/>
            <Route path="/lista-de-despesas" component={ListaDeDespesasPage} />
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
}

