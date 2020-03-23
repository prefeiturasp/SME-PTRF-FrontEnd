import React from "react";
import {Route, Switch} from 'react-router-dom'
import {Login} from "../paginas/Login";
import {Pagina404} from "../paginas/404";
import {Painel} from "../paginas/Painel/Painel";
import {CadastroDeDespesa} from "../paginas/Painel/CadastroDeDespesa";

export const Rotas = () => {
    return(
        <Switch>
            <Route path="/login" component={Login}/>
            <Route path="/painel" component={Painel}/>
            <Route path="/cadastro-de-despesa" component={CadastroDeDespesa}/>
            <Route path="*" component={Pagina404}/>
        </Switch>
    )
}