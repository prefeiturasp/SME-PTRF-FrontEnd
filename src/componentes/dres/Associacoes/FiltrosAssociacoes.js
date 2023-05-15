import React from "react";
import { Select } from 'antd';

export const FiltrosAssociacoes = ({tabelaAssociacoes, stateFiltros, handleChangeFiltrosAssociacao, handleSubmitFiltrosAssociacao, limpaFiltros, handleOnChangeMultipleSelectStatus}) =>{
    
    const { Option } = Select;

    return(
        <>
            <form onSubmit={handleSubmitFiltrosAssociacao}>
                <div className="row">
                    <div className="col-4 col-md-4">
                        <label htmlFor="unidade_escolar_ou_associacao">Filtrar por Unidade Escolar ou Associação</label>
                        <input
                            value={stateFiltros.unidade_escolar_ou_associacao}
                            onChange={(e) => handleChangeFiltrosAssociacao(e.target.name, e.target.value)}
                            name="unidade_escolar_ou_associacao"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o termo que deseja filtrar"
                        />
                    </div>
                    <div className="col-4 col-md-4">
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="tipo_de_unidade">Filtrar por tipo de unidade</label>
                                <select
                                    value={stateFiltros.tipo_de_unidade}
                                    onChange={(e) => handleChangeFiltrosAssociacao(e.target.name, e.target.value)}
                                    name="tipo_de_unidade"
                                    id="tipo_de_unidade"
                                    className="form-control"
                                >
                                    <option value="">Selecione um tipo</option>
                                    {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.filter(element=> element.id !== 'ADM' && element.id !== 'DRE' && element.id !== 'IFSP' && element.id !== 'CMCT').map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="col-4 col-md-4">
                    <label htmlFor="filtro_status">Informações</label>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Selecione as informações"
                            name="filtro_status"
                            id="filtro_status"
                            value={stateFiltros.filtro_status}
                            onChange={handleOnChangeMultipleSelectStatus}
                            className='multiselect-lista-valores-reprogramados'
                        >
                            {tabelaAssociacoes.filtro_informacoes && tabelaAssociacoes.filtro_informacoes.length > 0 && tabelaAssociacoes.filtro_informacoes.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                        </Select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button onClick={()=>limpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    <button type="bu" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};