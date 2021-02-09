import React from "react";
import {DatePickerField} from "../DatePickerField";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, tabelaArquivos}) => {
    return (
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-5">
                        <label htmlFor="filtrar_por_identificador">Filtrar por identificador</label>
                        <input
                            value={stateFiltros.filtrar_por_identificador}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_identificador'
                            id="filtrar_por_identificador"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome da associação'
                        />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_status">Filtrar por status</label>
                        <select
                            value={stateFiltros.filtrar_por_status}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_status'
                            id="filtrar_por_status"
                            className="form-control"
                        >
                            <option value=''>Selecione o status</option>
                            {tabelaArquivos && tabelaArquivos.status && tabelaArquivos.status.length > 0 && tabelaArquivos.status.map(status => (
                                <option key={status.id} value={status.id}>{status.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_data_de_execucao">Filtrar por data de execução</label>
                        <DatePickerField
                            name="filtrar_por_data_de_execucao"
                            id="filtrar_por_data_de_execucao"
                            value={stateFiltros.filtrar_por_data_de_execucao ? stateFiltros.filtrar_por_data_de_execucao : ''}
                            onChange={handleChangeFiltros}
                            placeholderText=''
                        />
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={() => limpaFiltros()} type="button"
                            className="btn btn btn-outline-success mr-2">Limpar
                    </button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success">Filtrar</button>
                </div>
            </form>
        </>
    );
};