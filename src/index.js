import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DadosDoGastoContextProvider} from "./context/DadosDoGasto";
import {GetDadosApiDespesaContextProvider} from "./context/GetDadosApiDespesa";
import {NotificacaoContextProvider} from "./context/Notificacao/NotificacaoContext";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <NotificacaoContextProvider>
        <GetDadosApiDespesaContextProvider>
            <DadosDoGastoContextProvider>
                <SidebarContextProvider>
                    <BrowserRouter>
                        <App/>
                    </BrowserRouter>
                </SidebarContextProvider>
            </DadosDoGastoContextProvider>
        </GetDadosApiDespesaContextProvider>
    </NotificacaoContextProvider>
    , document.getElementById("root"));

serviceWorker.unregister();
