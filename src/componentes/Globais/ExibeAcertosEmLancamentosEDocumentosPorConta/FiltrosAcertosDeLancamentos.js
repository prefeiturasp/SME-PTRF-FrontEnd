import React from "react";

export const FiltrosAcertosDeLancamentos = ({stateFiltros, listaTiposDeAcertoLancamentos, tabelasDespesa, handleChangeFiltros, handleSubmitFiltros, limpaFiltros})=>{

    return(
        <>
            <form>
                <div className="form-row align-items-center">
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
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_tipo_de_ajuste">Filtrar por tipo de ajuste</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_ajuste}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_tipo_de_ajuste`}
                            id={`filtrar_por_tipo_de_ajuste`}
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo de ajuste</option>
                            {listaTiposDeAcertoLancamentos && listaTiposDeAcertoLancamentos.length > 0 && listaTiposDeAcertoLancamentos.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
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