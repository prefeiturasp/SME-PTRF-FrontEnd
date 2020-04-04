import React, {useContext, useEffect} from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {CadastroDeDespesas} from "../../../componentes/Despesas/CadastroDeDespesas";
import {DespesaContext} from "../../../context/Despesa";
import {getDespesasTabelas} from "../../../services/Despesas.service";

export const CadastroDeDespesa = () => {

    const despesaContext = useContext(DespesaContext)

    useEffect(() => {
        const setaVerboHttp = async () => {
            const resp = await despesaContext.setVerboHttp("POST");
        };
        setaVerboHttp();

    }, [])

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Cadastro de Despesa</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <CadastroDeDespesas/>
            </div>
        </PaginasContainer>

    );
}