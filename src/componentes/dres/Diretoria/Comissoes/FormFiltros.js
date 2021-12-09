import React from "react";

export const Filtros = ({listaComissoes, handleOnChangeFiltros, estadoFiltros, handleOnSubmitFiltros, handleOnLimparFiltros}) => {

    return (
        <form className="mt-3" onSubmit={handleOnSubmitFiltros}>
            <div className="form-row">
                <div className="form-group col-md-5">
                    <label htmlFor="filtrar_por_rf_ou_nome">Filtrar por nome ou RF</label>
                    <input 
                        onChange={(e) => handleOnChangeFiltros(e.target.name, e.target.value)}
                        name="filtrar_por_rf_ou_nome" 
                        id="filtrar_por_rf_ou_nome" 
                        type="text" 
                        className="form-control"
                        placeholder="Escreva o nome ou RF"
                        value={estadoFiltros.filtrar_por_rf_ou_nome}
                    />
                </div>

                <div className="form-group col-md-5">
                    <label htmlFor="filtar_por_comissao">Filtrar por comissão</label>
                    <select 
                        onChange={(e) => handleOnChangeFiltros(e.target.name, e.target.value)} 
                        name="filtar_por_comissao"
                        id="filtar_por_comissao" 
                        className="form-control"
                        value={estadoFiltros.filtar_por_comissao}
                    >
                        <option key={0} value="">Selecione a comissão</option>
                        {listaComissoes && listaComissoes.length > 0 && listaComissoes.map(item => (
                            <option key={item.id} value={item.uuid}>{item.nome}</option>
                        ))}
                    </select>

                    
                </div>

                <div className="form-group col-md-2">
                    <button
                        onClick={(e) => {handleOnLimparFiltros()}}
                        type="button"
                        className="btn btn-success btn-limpar"  
                    >
                        <strong>Limpar</strong>
                    </button>

                    <button
                        type="submit"
                        className="btn btn-filtrar float-right"
                        
                    >
                        <strong>Filtrar</strong>
                    </button>
                </div>
            </div>   
        </form>
    )
}