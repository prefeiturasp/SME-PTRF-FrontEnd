import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {NotificacaoContextProvider} from "./context/Notificacao/NotificacaoContext";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <NotificacaoContextProvider>
        <SidebarContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </SidebarContextProvider>
    </NotificacaoContextProvider>
    ,document.getElementById("root"));

serviceWorker.unregister();
