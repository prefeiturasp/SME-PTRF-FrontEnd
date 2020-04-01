import React, {useContext, useEffect} from "react";
import {Despesa} from "../../../componentes/Formularios/Despesa";
import {PaginasContainer} from "../../PaginasContainer";
import {DadosDoGastoContext} from "../../../context/DadosDoGasto";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";
import {useParams} from 'react-router-dom'

export const EdicaoDeDespesa = ()=>{

    let {associacao} = useParams();

    useEffect(()=>{
        dadosApiContext.getDespesa(associacao)
        .then(resposta_api => {
            dadosDoGastoContext.setInitialValues(resposta_api.data)
        })

    }, [])


    const dadosDoGastoContext = useContext(DadosDoGastoContext);
    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    return(
        <PaginasContainer>

            <h1 className="titulo-itens-painel mt-5">Edição de Despesa</h1>
            <div className="page-content-inner ">
                <Despesa/>
            </div>
        </PaginasContainer>
    )

}