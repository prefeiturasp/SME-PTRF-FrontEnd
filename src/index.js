import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DadosDoGastoNaoContextProvider} from "./context/DadosDoGastoNao";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <DadosDoGastoNaoContextProvider>
        <SidebarContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </SidebarContextProvider>
    </DadosDoGastoNaoContextProvider>
    , document.getElementById("root"));

serviceWorker.unregister();
