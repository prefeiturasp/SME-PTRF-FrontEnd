import React from "react";
import {useParams} from 'react-router-dom'
import {DespesaForm} from "./DespesaForm";

export const Despesa = ()=>{
    let {associacao} = useParams();
    return (
        <>
            <DespesaForm
                idAssociacao={associacao}
            />
        </>
        );


}