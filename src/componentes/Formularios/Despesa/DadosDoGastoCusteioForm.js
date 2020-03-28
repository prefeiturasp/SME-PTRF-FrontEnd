import React, {Fragment, useContext} from "react";
import NumberFormat from "react-number-format";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";


export const DadosDoGastoCusteioForm = (propriedades) => {

    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa} = propriedades
    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    return (
        <div className="col-12 mt-4">
            <div className="form-row">

                {dadosDoGastoContext.inputFields && dadosDoGastoContext.inputFields.map((inputField, index) => {
                    return (
                        <Fragment key={`${inputField}~${index}`}>

                            {gastoEmMaisDeUmaDespesa !== 0 && (
                                <div className="col-12">
                                    <p className='mb-0'><strong>Despesa {index + 1}</strong></p>
                                    <hr className='mt-0'/>
                                </div>
                            )}

                            <div className="col-12">
                                <label htmlFor="tipo_custeio">Tipo de custeio</label>
                                <select

                                    value={inputField.tipo_custeio}
                                    onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                                    name='tipo_custeio'
                                    id='tipo_custeio'
                                    className="form-control"
                                >
                                    {dadosApiContext.tiposCusteio.length > 0 && dadosApiContext.tiposCusteio.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 mt-4">
                                <label htmlFor="especificacao_material_servico">Especificação do material ou
                                    serviço</label>
                                <select
                                    value={inputField.especificacao_material_servico}
                                    onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                                    name='especificacao_material_servico'
                                    id='especificacao_material_servico'
                                    className="form-control"
                                >
                                    <option value="0">Selecione uma ação</option>
                                    {dadosApiContext.especificacaoMaterialServico.length > 0 && dadosApiContext.especificacaoMaterialServico.map(item => (
                                        <option key={item.id} value={item.id}>{item.descricao}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-6 mt-4">
                                <label htmlFor="acao_associacao">Ação</label>
                                <select
                                    value={inputField.acao_associacao}
                                    onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                                    name='acao_associacao'
                                    id='acao_associacao'
                                    className="form-control"
                                >
                                    <option value="0">Selecione uma ação</option>
                                    {dadosApiContext.acoesAssociacao.length > 0 && dadosApiContext.acoesAssociacao.map(item => (
                                        <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className='row'>

                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="conta_associacao">Tipo de conta utilizada</label>
                                        <select
                                            value={inputField.conta_associacao}
                                            onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                                            name='conta_associacao'
                                            id='conta_associacao'
                                            className="form-control"
                                        >
                                            <option value="0">Selecione uma conta</option>
                                            {dadosApiContext.contaAssociacao.length > 0 && dadosApiContext.contaAssociacao.map(item => (
                                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="valor_rateio">Valor do custeio</label>
                                        <NumberFormat

                                            value={inputField.valor_rateio}
                                            onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            decimalScale={2}
                                            prefix={'R$ '}
                                            name="valor_rateio"
                                            id="valor_rateio"
                                            className="form-control"
                                        />
                                    </div>

                                </div>

                            </div>
                            {gastoEmMaisDeUmaDespesa !== 0 && (
                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                    {dadosDoGastoContext.inputFields.length > 1 && (
                                        <button
                                            className="btn btn btn-outline-success mt-2 mr-2"
                                            type="button"
                                            onClick={() => dadosDoGastoContext.handleRemoveFields(index)}
                                        >
                                            - Remover Despesa
                                        </button>
                                    )}
                                </div>
                            )}
                        </Fragment>
                    )
                })}
                {gastoEmMaisDeUmaDespesa !== 0 && (
                    <div className="d-flex  justify-content-start mt-3 mb-3">
                        <button
                            className="btn btn btn-outline-success mt-2 mr-2"
                            type="button"
                            onClick={(e) => dadosDoGastoContext.handleAddFields()}
                        >
                            + Adicionar despesa parcial
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}