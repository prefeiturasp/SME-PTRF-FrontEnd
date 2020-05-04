 import React from "react";

export const SelectAcaoLancamento = ({acaoLancamento, handleChangeSelectAcoes}) => {
    return(
        <form className="form-inline">
            <label className="my-1 mr-2" htmlFor="acao">Ação selecionada: </label>
            <select
                value={acaoLancamento.acao}
                onChange={(e) => handleChangeSelectAcoes(e.target.name, e.target.value)}
                className="form-control"
                name="acao"
            >
                <option value="">Escolha uma ação</option>
                <option value="role-cultural">Rolê Cultural</option>
                <option value="limao">Limão</option>
                <option value="coco">Coco</option>
                <option value="manga">Manga</option>
            </select>

            <label className="my-1 mr-2 ml-5" htmlFor="lancamento">Tipo de lançamento: </label>
            <select
                value={acaoLancamento.lancamento}
                onChange={(e) => handleChangeSelectAcoes(e.target.name, e.target.value)}
                className="form-control"
                name="lancamento"
            >
                <option value="">Escolha uma tipo</option>
                <option value="despesas-lancadas">Despesas lançadas</option>
                <option value="limao">Limão</option>
                <option value="coco">Coco</option>
                <option value="manga">Manga</option>
            </select>

        </form>

    );
}