import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros}) => {
    return (
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label htmlFor="filtrar_por_motivo">Filtrar por motivo de pagamento antecipado</label>
                        <input
                            data-qa="campo-filtrar-por-motivo-motivo-pagamento-antecipado"
                            value={stateFiltros.filtrar_por_motivo}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_motivo'
                            id="filtrar_por_motivo"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome do motivo'
                        />
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-n2">
                    <button
                        data-qa="botao-limpar-filtros-motivo-pagamento-antecipado"
                        onClick={() => limpaFiltros()} type="button" className="btn btn btn-outline-success mr-2">Limpar</button>
                    <button
                        data-qa="botao-filtrar-motivo-pagamento-antecipado"
                        onClick={handleSubmitFiltros} type="button" className="btn btn-success">Filtrar</button>
                </div>
            </form>
        </>
    );
};
