import React from "react";
import {Link} from "react-router-dom";

export const TopoComBotoes = ({dadosDaAssociacao}) =>{
    return(
        <>
        <div className="d-flex bd-highlight">
            <div className="p-2 flex-grow-1 bd-highlight">
                <h1 className="titulo-itens-painel mt-5">{dadosDaAssociacao.dados_da_associacao.nome}</h1>
            </div>
            {/*<div className="p-2 bd-highlight mt-5">
                <Link to="/dre-situacao-financeira-unidade-educacional" type="button" className="btn btn-outline-success">Ver situação financeira</Link>
            </div>
            <div className="p-2 bd-highlight mt-5">
                <Link to="/dre-regularidade-unidade-educacional" className="btn btn btn-outline-success">Ver regularidade</Link>
            </div>
            */}
            <div className="p-2 bd-highlight mt-5">
                <Link to="/dre-associacoes" className="btn btn btn-success">Voltar</Link>
            </div>
        </div>
        </>
    );
};