import React from "react";
import { Select } from 'antd';
const { Option } = Select;

export const Filtros = ({
    estadoFiltros,
    mudancasFiltros,
    enviarFiltrosAssociacao,
    limparFiltros, 
    handleOnChangeMultipleSelectStatus, 
    tabelaAssociacoes}) => {
    return (
        <div className="row lista-de-despesas-visible">
            <div className="col-12">
                <form onSubmit={enviarFiltrosAssociacao}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_nome">Pesquisar unidades vinculadas à ação</label>
                            <input onChange={(e) => mudancasFiltros(e.target.name, e.target.value)}
                               name="filtrar_por_nome"
                               id="filtrar_por_nome"
                               type="text" 
                               className="form-control"
                               placeholder="Código EOL, nomes da UE ou Associação..."
                               value={estadoFiltros.filtrar_por_termo}
                            />
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
                                value={estadoFiltros.filtro_informacoes}
                                onChange={handleOnChangeMultipleSelectStatus}
                                className='multiselect-lista-valores-reprogramados'
                            >
                                {tabelaAssociacoes.filtro_informacoes && tabelaAssociacoes.filtro_informacoes.length > 0 && tabelaAssociacoes.filtro_informacoes.map(item => (
                                    <Option key={item.id} value={item.id}>{item.nome}</Option>
                                ))}
                            </Select>
                        </div>                         
                    </div>
                    <div className="d-flex justify-content-end pb-3 mt-3">
                        <button
                            onClick={(e) => {limparFiltros()}
                            }
                            className="btn btn-outline-success mt-2"
                            type="button"
                        >
                            Limpar filtro
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success mt-2 ml-2"
                        >
                            Filtrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
