import React from 'react';
import { useHistory } from "react-router-dom";
import {Rotas} from "./rotas";
import "./assets/css/styles.scss"


export const App = ()=> {
    const pathName = useHistory().location.pathname

  return (
    <section role="main" id="main" className='row'>
        <Rotas/>


    </section>
  );
}

export default App;
