import React from 'react';
import { useHistory } from "react-router-dom";
import {Rotas} from "./rotas";
import "./assets/css/styles.scss"
import {Cabecalho} from "./componentes/Cabecalho";
import {SidebarLeft} from "./componentes/SidebarLeft";
import {Rodape} from "./componentes/Rodape";


export const App = ()=> {
    const pathName = useHistory().location.pathname

  return (
    <section role="main" id="main" className='row'>

        {pathName !== "/login" ? (
            <>
            {/*<Cabecalho/>*/}
            <SidebarLeft/>
            <Rotas/>
            </>
        ) : <Rotas/> }




    </section>
  );
}

export default App;
