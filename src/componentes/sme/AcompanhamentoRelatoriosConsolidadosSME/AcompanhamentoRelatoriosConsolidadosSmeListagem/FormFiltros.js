import React from "react";
import './multiselect.scss'
import { Select } from 'antd';


export const FormFiltros = ({stateFiltros, selectedStatusPc, listaFiltroDre, listaFiltroTipoRelatorio, listaFiltroStatusSme, handleChangeFiltros, handleChangeSelectStatusPc, handleLimpaFiltros, handleSubmitFiltros}) => {

    const { Option } = Select;

    return (
        <>
            <form method="post">
                <div className="row mt-3">
                <div className="col">
                        <label htmlFor="filtrar_por_dre">Filtrar por DRE</label>
                        <select
                            value={stateFiltros.filtrar_por_dre}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_dre"
                            id="filtrar_por_dre"
                            className="form-control"
                        >
                            <option value="">Selecione uma DRE</option>
                            {listaFiltroDre && listaFiltroDre.length > 0 && listaFiltroDre.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col">
                        <label htmlFor="filtrar_por_tipo_de_relatorio">Filtrar por Publicação</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_relatorio}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_tipo_de_relatorio"
                            id="filtrar_por_tipo_de_relatorio"
                            className="form-control"
                        >
                            <option value="">Selecione um tipo</option>
                            {listaFiltroTipoRelatorio && listaFiltroTipoRelatorio.length > 0 && listaFiltroTipoRelatorio.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}

                        </select>
                    </div>

                    <div className="col">
                        <label htmlFor="filtrar_por_status_sme">Filtrar por status</label>

                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Selecione os status"
                            value={selectedStatusPc}
                            onChange={handleChangeSelectStatusPc}
                            className='multiselect-filtrar-por-status'
                        >
                            <Option value='TODOS'>Todos</Option>
                            {listaFiltroStatusSme && listaFiltroStatusSme.length > 0 && listaFiltroStatusSme.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
                
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button onClick={()=>handleLimpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar filtros</button>
                    <button
                        onClick={handleSubmitFiltros}
                        type="button"
                        className="btn btn-success mt-2"
                    >
                        Filtrar
                    </button>
                </div>
            </form>
        </>
    )
};