 import React from "react";

export const SelectAcaoLancamento = ({acaoLancamento, handleChangeSelectAcoes, acoesAssociacao}) => {
    return(
        <form className="form-inline mt-5">
            <label className="my-1 mr-2" htmlFor="acao">Ação selecionada: </label>
            <select
                value={acaoLancamento.acao}
                onChange={(e) => handleChangeSelectAcoes(e.target.name, e.target.value)}
                className="form-control"
                name="acao"
            >
                <option key={0} value="">Escolha uma ação</option>
                {acoesAssociacao && acoesAssociacao.map((acao)=>
                    <option key={acao.uuid} value={acao.uuid}>{acao.nome}</option>
                )}

            </select>

            <label className="my-1 mr-2 ml-4" htmlFor="lancamento">Tipo de lançamento: </label>
            <select
                value={acaoLancamento.lancamento}
                onChange={(e) => handleChangeSelectAcoes(e.target.name, e.target.value)}
                className="form-control"
                name="lancamento"
            >
                <option value="">Escolha uma tipo</option>
                <option value="despesas-lancadas">Despesas lançadas</option>
                <option value="receitas-lancadas">Receitas lançadas</option>
            </select>

        </form>

    );
}