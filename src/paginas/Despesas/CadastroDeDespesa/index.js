import React, {useEffect, useContext} from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {Despesa} from "../../../componentes/Formularios/Despesa";
import {DadosDoGastoContext} from "../../../context/DadosDoGasto";

export const CadastroDeDespesa = () => {

    const dadosDoGastoContext = useContext(DadosDoGastoContext);

    useEffect(() => {
        (async function setValoresIniciais() {
            await dadosDoGastoContext.setInitialValues(dadosDoGastoContext.valoresIniciaisFormDespesa);
            await dadosDoGastoContext.setVerboHttp("POST");
            dadosDoGastoContext.setIdDespesa("");
        })();
    }, []);



    return (
        <PaginasContainer>

            <h1 className="titulo-itens-painel mt-5">Cadastro de Despesa</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <Despesa/>
            </div>
        </PaginasContainer>

    );
}