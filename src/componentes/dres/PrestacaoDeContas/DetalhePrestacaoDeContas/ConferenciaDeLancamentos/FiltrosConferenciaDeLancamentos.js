import React from 'react';
import {DatePicker, Space} from "antd";
import locale from 'antd/es/date-picker/locale/pt_BR';
import moment from "moment";
import './../../../../sme/ExtracaoDados/extracao-dados.scss'


export const FiltrosConferenciaDeLancamentos = ({stateFiltros, tabelasDespesa, handleChangeFiltros, handleSubmitFiltros, limpaFiltros})=>{

    return(
        <>
            <form>
                <div className="form-row align-items-center">
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_acao">Filtrar por ação</label>
                        <select
                            value={stateFiltros.filtrar_por_acao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_acao`}
                            id={`filtrar_por_acao`}
                            className="form-control"
                        >
                            <option value=''>Selecione a ação</option>
                            {tabelasDespesa && tabelasDespesa.acoes_associacao && tabelasDespesa.acoes_associacao.length > 0 && tabelasDespesa.acoes_associacao.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_nome_fornecedor">Filtrar por fornecedor</label>
                        <input value={stateFiltros.filtrar_por_nome_fornecedor}
                               onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                               name={`filtrar_por_nome_fornecedor`}
                               id={`filtrar_por_nome_fornecedor`}
                               type="text"
                               className="form-control"
                               placeholder="Escreva a razão social do fornecedor"
                        />
                    </div>
                </div>

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
                        <label htmlFor="filtrar_por_numero_de_documento">Filtrar por número de documento</label>
                        <input value={stateFiltros.filtrar_por_numero_de_documento}
                               onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                               name="filtrar_por_numero_de_documento"
                               id="filtrar_por_numero_de_documento"
                               type="text"
                               className="form-control"
                               placeholder="Digite o número"
                        />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_tipo_de_documento">Filtrar por tipo de documento</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_documento}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_tipo_de_documento`}
                            id={`filtrar_por_tipo_de_documento`}
                            className="form-control"
                        >
                            <option value="">Selecione o tipo</option>
                            {tabelasDespesa && tabelasDespesa.tipos_documento && tabelasDespesa.tipos_documento.length > 0 && tabelasDespesa.tipos_documento.map(item =>
                                <option className='form-control' key={item.id} value={item.id}>{item.nome}</option>
                            )}
                        </select>
                    </div>
                </div>
                <div className="form-row align-items-center">
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_tipo_de_pagamento">Filtrar por tipo de transação/pagamento</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_pagamento}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_tipo_de_pagamento`}
                            id={`filtrar_por_tipo_de_pagamento`}
                            className="form-control"
                        >
                            <option key='' value="">Selecione o tipo</option>
                            {tabelasDespesa.tipos_transacao && tabelasDespesa.tipos_transacao.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                    <Space className='extracao-space' direction='vertical'>
                    <span>Filtrar por período</span>
                    <DatePicker.RangePicker
                        locale={locale}
                        format={'DD/MM/YYYY'}
                        disabledDate={(date) => (
                            (date).startOf('day').toDate().valueOf() >
                            moment().startOf('day').toDate().valueOf()
                        )}
                        allowEmpty={[true, true]}
                        className='form-control pr-3 w-50'
                        placeholder={['data inicial', 'data final']}
                        id="data_range"
                        defaultValue={[
                            stateFiltros.filtrar_por_data_inicio ? moment(stateFiltros.filtrar_por_data_inicio) : '',
                            stateFiltros.filtrar_por_data_fim ? moment(stateFiltros.filtrar_por_data_fim): ''
                        ]}
                        
                        onCalendarChange={(date) => {
                            if(!date){
                                handleChangeFiltros("filtrar_por_data_inicio", '');
                                handleChangeFiltros("filtrar_por_data_fim", '');
                            }
                            else {
                                date[0] && handleChangeFiltros("filtrar_por_data_inicio", date[0].format('YYYY-MM-DD'));
                                date[1] && handleChangeFiltros("filtrar_por_data_fim", date[1].format('YYYY-MM-DD'));
                            }
                        }
                    }
                    />
                    </Space>
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button onClick={()=>limpaFiltros()} type="button" className="btn btn-success ml-md-2 mt-1">Limpar</button>
                    <button onClick={()=>handleSubmitFiltros()} type="button" className="btn btn-success ml-md-2 mt-1">Filtrar</button>
                </div>
            </form>
        </>
    )
};