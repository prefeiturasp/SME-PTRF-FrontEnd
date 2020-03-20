import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {SidebarContextProvider} from "./context/Sidebar";
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <SidebarContextProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </SidebarContextProvider>
    , document.getElementById("root"));

serviceWorker.unregister();
