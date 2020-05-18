import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import {DespesaContextProvider} from "./context/Despesa";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <DespesaContextProvider>
        <SidebarContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </SidebarContextProvider>
    </DespesaContextProvider>

    , document.getElementById("root"));
serviceWorker.unregister();
