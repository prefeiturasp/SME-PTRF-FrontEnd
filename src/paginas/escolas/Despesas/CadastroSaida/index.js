import React, {useContext, useEffect} from "react";
import {PaginasContainer} from "../../../PaginasContainer";
import {CadastroSaidaForm} from "../../../../componentes/escolas/Despesas/CadastroDeDespesas/CadastroSaidaForm";

export const CadastroSaida = () => {

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Cadastro de Saída</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <CadastroSaidaForm
                    verbo_http={"POST"}
                />
            </div>
        </PaginasContainer>

    );
}