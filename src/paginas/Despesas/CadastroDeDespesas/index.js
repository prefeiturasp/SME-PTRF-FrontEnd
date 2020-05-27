import React, {useContext, useEffect} from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {CadastroDeDespesas} from "../../../componentes/Despesas/CadastroDeDespesas";
import {DespesaContext} from "../../../context/Despesa";

export const CadastroDeDespesa = () => {

    const despesaContext = useContext(DespesaContext)

    useEffect(() => {
        (async function setValoresIniciais() {
            await despesaContext.setVerboHttp("POST");
            await despesaContext.setIdDespesa("");
            await despesaContext.setInitialValues(despesaContext.valores_iniciais)
        })();
    }, []);

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Cadastro de Despesa</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <CadastroDeDespesas
                    verbo_http={"POST"}
                />
            </div>
        </PaginasContainer>

    );
}