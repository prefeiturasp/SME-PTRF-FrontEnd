import React from "react";
import {DatePickerField} from "../DatePickerField";

export const FormFiltrosDownloads = ({handleSubmitFormFiltros, stateFormFiltros, handleChangeFormFiltros, listaStatus}) => {
    return (
        <>
            
                <h5>Filtros</h5>
                <form onSubmit={handleSubmitFormFiltros}>
                    <div className="form-row align-items-center">
                        <div className="form-group col">
                            <label htmlFor="filtro_por_identificador">Filtrar por identificador</label>
                            <input 
                                id="filtro_por_identificador"
                                name="filtro_por_identificador"
                                className="form-control" 
                                type="text" 
                                placeholder="Escreva uma palavra" 
                                value={stateFormFiltros.filtro_por_identificador}
                                onChange={(e) => handleChangeFormFiltros(e.target.name, e.target.value)}
                            />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="filtro_por_status">Filtrar por status</label>
                            <select
                                name="filtro_por_status"
                                id="filtro_por_status"
                                className="form-control"
                                value={stateFormFiltros.filtro_por_status}
                                onChange={(e) => handleChangeFormFiltros(e.target.name, e.target.value)}
                            >
                                <option value="">Selecione o status</option>
                                {listaStatus && listaStatus.length > 0 && listaStatus.map((value, index) =>
                                    <option key={index} value={value.id}>{value.nome}</option>
                                )}
                            </select>
                        </div>

                        <div className="form-group col">
                            <label htmlFor="filtro_por_atualizacao">Filtrar por atualização</label>
                            <DatePickerField
                                name="filtro_por_atualizacao"
                                id="filtro_por_atualizacao"
                                value={stateFormFiltros.filtro_por_atualizacao}
                                onChange={handleChangeFormFiltros}
                                placeholderText="Selecione a data"
                            />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="filtro_por_visto">Filtrar por visto</label>
                            <select
                                name="filtro_por_visto"
                                id="filtro_por_visto"
                                className="form-control"
                                value={stateFormFiltros.filtro_por_visto}
                                onChange={(e) => handleChangeFormFiltros(e.target.name, e.target.value)}
                            >
                                <option value="">Selecione uma opção</option>
                                <option value={true}>Visto</option>
                                <option value={false}>Não visto</option>
                                
                            </select>
                        </div>

                        <div className="justify-content-end">
                            <button className="btn btn-success ml-md-2 mt-3">Filtrar</button>
                        </div>
                    </div>
                </form>

            
        </>
    )
}