import React from "react";
import {TextoExplicativo} from "./TextoExplicativoDaPagina"
export const SuporteAsUnidades = (props) =>{

    const {visao} = props

    return(
        <TextoExplicativo visao={visao}/>
    )
}
