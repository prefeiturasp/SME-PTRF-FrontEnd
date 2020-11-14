import React from "react";
import {Link} from "react-router-dom";

export const TopoComBotoes = ({dadosDaAssociacao}) =>{
    return(
        <>
            <div className="d-flex bd-highlight">
                <div className="p-2 flex-grow-1 bd-highlight">
                    <h1 className="titulo-itens-painel mt-5">{dadosDaAssociacao.dados_da_associacao.nome}</h1>
                </div>
                <div className="p-2 bd-highlight mt-5">
                    <Link to="/dre-associacoes" className="btn btn btn-success">Voltar</Link>
                </div>
            </div>

            <div className="d-flex justify-content-between p-3 mb-4 mt-2 bg-white container-menu-dados-das-associacoes">
                <Link to="/dre-dados-da-unidade-educacional">Dados da unidade</Link>
                <Link to="/dre-regularidade-unidade-educacional">Regularidade</Link>
                <Link to="/dre-situacao-financeira-unidade-educacional">Situação financeira</Link>
                <Link to="/dre-situacao-financeira-unidade-educacional">Situação patrimonial</Link>
            </div>
        </>
    );
};