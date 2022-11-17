import * as Sentry from "@sentry/browser";
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DespesaContextProvider} from "./context/Despesa";
import {NotificacaoContextProvider} from "./context/Notificacoes";
import {DataLimiteProvider} from './context/DataLimiteDevolucao';
import {CentralDeDownloadContextProvider} from "./context/CentralDeDownloads";
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import {store} from "./store";

if (process.env.NODE_ENV === "production") {
    const SENTRY_URL = "SENTRY_URL_REPLACE_ME";
    Sentry.init({dsn: SENTRY_URL});
}

ReactDOM.render(
    <Provider store={store}>
        <NotificacaoContextProvider>
            <CentralDeDownloadContextProvider>
                <DespesaContextProvider>
                    <SidebarContextProvider>
                        <DataLimiteProvider>
                            <BrowserRouter>
                                <App/>
                            </BrowserRouter>
                        </DataLimiteProvider>
                    </SidebarContextProvider>
                </DespesaContextProvider>
            </CentralDeDownloadContextProvider>
        </NotificacaoContextProvider>
    </Provider>

    , document.getElementById("root"));
serviceWorker.unregister();
