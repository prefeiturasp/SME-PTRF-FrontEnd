import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/404";
import {Dashboard} from "../paginas/Dashboard";
import {CadastroDeDespesa} from "../paginas/Despesas/CadastroDeDespesa";
import {EdicaoDeDespesa} from "../paginas/Despesas/EdicaoDeDespesa";

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path="/cadastro-de-despesa" component={CadastroDeDespesa}/>
            <Route path="/edicao-de-despesa/:associacao?" component={EdicaoDeDespesa}/>
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
}