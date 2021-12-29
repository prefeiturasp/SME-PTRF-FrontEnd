import React from "react";

export const NomeAssociacaoBotaoVoltar = ({nomeAssociacao}) => {
    const path =  `/regularidade-associacoes`;
    return (
        <>
            <div className="d-flex bd-highlight">
                <div className="p-2 flex-grow-1 bd-highlight">
                    { nomeAssociacao  &&
                        <h1 className="titulo-itens-painel mt-5">{nomeAssociacao}</h1>
                    }

                </div>
                <div className="p-2 bd-highlight mt-5">
                    <button onClick={() => window.location.assign(path)} className="btn btn btn-outline-success">Voltar</button>
                </div>
            </div>

        </>
    );
};