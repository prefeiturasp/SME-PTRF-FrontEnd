import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, despesasTabelas}) =>{

    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_nome_cod_eol">Filtrar por nome ou código EOL</label>
                        <input
                            value={stateFiltros.filtrar_por_nome_cod_eol}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome_cod_eol'
                            id="filtrar_por_nome_cod_eol"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_acao">Filtrar por ação</label>
                        <select
                            value={stateFiltros.filtrar_por_acao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_acao'
                            id="filtrar_por_acao"
                            className="form-control"
                        >
                            <option>Selecione a ação</option>
                            <option value='ATIVA ação'>Ativa ação</option>
                            <option value='INATIVA ação'>Inativa ação</option>
                            {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_status">Filtrar por status</label>
                        <select
                            value={stateFiltros.filtrar_por_status}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_status'
                            id="filtrar_por_status"
                            className="form-control"
                        >
                            <option>Selecione o status</option>
                            <option value='ATIVA'>Ativa</option>
                            <option value='INATIVA'>Inativa</option>
                        </select>
                    </div>
                </div>

                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={()=>limpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};