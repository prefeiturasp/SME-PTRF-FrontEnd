import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DespesaContextProvider} from "./context/Despesa";
import {NotificacaoContextProvider} from "./context/Notificacoes";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <NotificacaoContextProvider>
        <DespesaContextProvider>
            <SidebarContextProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </SidebarContextProvider>
        </DespesaContextProvider>
    </NotificacaoContextProvider>

    , document.getElementById("root"));
serviceWorker.unregister();
