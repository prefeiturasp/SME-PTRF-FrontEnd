import React from "react";
import { Select } from 'antd';
const { Option } = Select;

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, listaTiposDeAcao, handleOnChangeMultipleSelectStatus, tabelaAssociacoes}) =>{
    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-3">
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
                            <option value=''>Selecione a ação</option>
                            {listaTiposDeAcao && listaTiposDeAcao.length > 0 && listaTiposDeAcao.map(item => (
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
                            <option value=''>Selecione o status</option>
                            <option value='ATIVA'>Ativa</option>
                            <option value='INATIVA'>Inativa</option>
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtro_informacoes">Filtrar por informações</label>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Selecione as informações"
                            name="filtro_informacoes"
                            id="filtro_informacoes"
                            value={stateFiltros.filtro_informacoes}
                            onChange={handleOnChangeMultipleSelectStatus}
                            className='multiselect-lista-valores-reprogramados'
                        >
                            {tabelaAssociacoes.filtro_informacoes && tabelaAssociacoes.filtro_informacoes.length > 0 && tabelaAssociacoes.filtro_informacoes.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                        </Select>
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