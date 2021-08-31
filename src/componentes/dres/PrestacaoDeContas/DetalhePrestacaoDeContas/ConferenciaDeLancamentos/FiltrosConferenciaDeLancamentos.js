import React from "react";

export const FiltrosConferenciaDeLancamentos = ({stateFiltros, tabelasDespesa, handleChangeFiltros, handleSubmitFiltros, limpaFiltros})=>{

    return(
        <>
            <form>
                <div className="form-row align-items-center">
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_acao">Filtrar por ação</label>
                        <select
                            value={stateFiltros.filtrar_por_acao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_acao`}
                            id={`filtrar_por_acao`}
                            className="form-control"
                        >
                            <option value=''>Selecione a ação</option>
                            {tabelasDespesa && tabelasDespesa.acoes_associacao && tabelasDespesa.acoes_associacao.length > 0 && tabelasDespesa.acoes_associacao.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_lancamento">Filtrar por tipo de lançamento</label>
                        <select
                            value={stateFiltros.filtrar_por_lancamento}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_lancamento`}
                            id={`filtrar_por_lancamento`}
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo de lançamento</option>
                            <option value='CREDITOS'>Créditos</option>
                            <option value='GASTOS'>Gastos</option>
                        </select>
                    </div>

                    <div className="justify-content-end">
                        <button onClick={()=>limpaFiltros()} type="button" className="btn btn-success ml-md-2 mt-3">Limpar</button>
                        <button onClick={()=>handleSubmitFiltros()} type="button" className="btn btn-success ml-md-2 mt-3">Filtrar</button>
                    </div>
                </div>
            </form>
        </>
    )
};