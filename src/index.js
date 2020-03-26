import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DadosDoGastoContextProvider} from "./context/DadosDoGasto";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <DadosDoGastoContextProvider>
        <SidebarContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </SidebarContextProvider>
    </DadosDoGastoContextProvider>
    , document.getElementById("root"));

serviceWorker.unregister();
