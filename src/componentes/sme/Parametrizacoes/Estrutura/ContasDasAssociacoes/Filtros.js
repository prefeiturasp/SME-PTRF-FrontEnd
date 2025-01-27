import React from "react";
import { Select } from 'antd';
const { Option } = Select;

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, listaTiposDeConta, tabelaAssociacoes}) =>{
    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="filtrar_por_associacao_nome">Filtrar por associação</label>
                        <input
                            value={stateFiltros.filtrar_por_associacao_nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_associacao_nome'
                            id="filtrar_por_associacao_nome"
                            type="text"
                            className="form-control"
                            maxlength="160"
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_tipo_conta">Filtrar por tipo de conta</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_conta}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_tipo_conta'
                            id="filtrar_por_tipo_conta"
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo de conta</option>
                            {listaTiposDeConta && listaTiposDeConta.length > 0 && listaTiposDeConta.map(item => (
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
                    <div className="form-group col-md-2">
                        <div className="d-flex  justify-content-end mt-n2">
                            <button onClick={()=>limpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                            <button onClick={handleSubmitFiltros} type="button" className="btn btn-success mt-2">Filtrar</button>
                        </div>       
                    </div>
                </div>
            </form>
        </>
    );
};