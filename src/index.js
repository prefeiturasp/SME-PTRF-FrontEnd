import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DadosDoGastoContextProvider} from "./context/DadosDoGasto";
import {GetDadosApiDespesaContextProvider} from "./context/GetDadosApiDespesa";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <GetDadosApiDespesaContextProvider>
        <DadosDoGastoContextProvider>
            <SidebarContextProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </SidebarContextProvider>
        </DadosDoGastoContextProvider>
    </GetDadosApiDespesaContextProvider>
    , document.getElementById("root"));

serviceWorker.unregister();
