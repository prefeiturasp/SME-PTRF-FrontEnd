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
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

if (process.env.NODE_ENV === "production") {
    const SENTRY_URL = "SENTRY_URL_REPLACE_ME";
    Sentry.init({dsn: SENTRY_URL});
}

let REACT_QUERY_DEV_TOOLS = "REACT_QUERY_DEV_TOOLS_REPLACE_ME";

if (process.env.REACT_APP_NODE_ENV === "local") {
  REACT_QUERY_DEV_TOOLS = process.env.REACT_APP_REACT_QUERY_DEV_TOOLS;
}


const queryClient = new QueryClient();

ReactDOM.render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
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
            {REACT_QUERY_DEV_TOOLS === "true" && <ReactQueryDevtools initialIsOpen={false} />}
            </QueryClientProvider>
    </Provider>

    , document.getElementById("root"));
serviceWorker.unregister();
