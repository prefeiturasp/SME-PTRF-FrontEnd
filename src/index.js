import * as Sentry from "@sentry/browser";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DespesaContextProvider} from "./context/Despesa";
import {NotificacaoContextProvider} from "./context/Notificacoes";
import {CentralDeDownloadContextProvider } from "./context/CentralDeDownloads";
import * as serviceWorker from './serviceWorker';

if (process.env.NODE_ENV === "production") {
    const SENTRY_URL = "SENTRY_URL_REPLACE_ME";
    Sentry.init({ dsn: SENTRY_URL });
}

ReactDOM.render(
    <NotificacaoContextProvider>
    <CentralDeDownloadContextProvider>
        <DespesaContextProvider>
            <SidebarContextProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </SidebarContextProvider>
        </DespesaContextProvider>
    </CentralDeDownloadContextProvider>
    </NotificacaoContextProvider>

    , document.getElementById("root"));
serviceWorker.unregister();
