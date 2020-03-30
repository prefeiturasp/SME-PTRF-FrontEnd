import React, {useContext} from "react";
import NumberFormat from "react-number-format";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";
import {FieldArray} from 'formik';


export const DadosDoGastoCusteio = (propriedades) => {

    const {gastoEmMaisDeUmaDespesa, formikProps} = propriedades
    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    return (
        <div className="col-12 mt-4">

            <FieldArray
                name="rateios"
                render={({insert, remove, push}) => (
                    <>
                        {formikProps.values.rateios.length > 0 && formikProps.values.rateios.map((rateio, index) => {

                            return (

                                <div className="row" key={index}>

                                    {gastoEmMaisDeUmaDespesa !== 0 && (
                                        <div className="col-12">
                                            <p className='mb-0'><strong>Despesa {index + 1}</strong></p>
                                            <hr className='mt-0'/>
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <label htmlFor="tipo_custeio">Tipo de custeio</label>
                                        <select

                                            defaultValue={rateio.tipo_custeio.id}
                                            onChange={formikProps.handleChange}
                                            name={`rateios[${index}].tipo_custeio`}
                                            //name='tipo_custeio'
                                            id='tipo_custeio'
                                            className="form-control"
                                        >
                                            {dadosApiContext.tiposCusteio.length > 0 && dadosApiContext.tiposCusteio.map(item => (
                                                <option key={item.id} value={item.id}>{item.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <label htmlFor="especificacao_material_servico">Especificação do
                                            material ou serviço</label>
                                        <select
                                            defaultValue={rateio.especificacao_material_servico.id}
                                            onChange={formikProps.handleChange}
                                            name={`rateios[${index}].especificacao_material_servico`}
                                            //name='especificacao_material_servico'
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
                                            defaultValue={rateio.acao_associacao.uuid}
                                            onChange={formikProps.handleChange}
                                            name={`rateios[${index}].acao_associacao`}
                                            //name='acao_associacao'
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
                                                    defaultValue={rateio.conta_associacao.uuid}
                                                    onChange={formikProps.handleChange}
                                                    //name='conta_associacao'
                                                    name={`rateios[${index}].conta_associacao`}
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

                                                    defaultValue={rateio.valor_rateio}
                                                    onChange={formikProps.handleChange}
                                                    thousandSeparator={'.'}
                                                    decimalSeparator={','}
                                                    decimalScale={2}
                                                    prefix={'R$ '}
                                                    name={`rateios[${index}].valor_rateio`}

                                                    id="valor_rateio"
                                                    className="form-control"
                                                />
                                            </div>

                                        </div>

                                    </div>
                                    {index >= 1 && gastoEmMaisDeUmaDespesa !== 0 && (
                                        <div className="col-12">
                                            <div className="d-flex  justify-content-start mt-3 mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn btn-outline-success mt-2 mr-2"
                                                    onClick={() => remove(index)}
                                                >
                                                    - Remover Despesa
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {gastoEmMaisDeUmaDespesa !== 0 &&
                        <div className="d-flex  justify-content-start mt-3 mb-3">

                            <button
                                type="button"
                                className="btn btn btn-outline-success mt-2 mr-2"
                                onClick={() => push(
                                    {
                                        associacao: "DADOS DO GASTO - 07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
                                        aplicacao_recurso: "",
                                        tipo_aplicacao_recurso: "CUSTEIO",
                                        tipo_custeio: 1,
                                        especificacao_material_servico: "",
                                        conta_associacao: "conta1",
                                        acao_associacao: "",
                                        valor_rateio: 0,
                                        //Capital
                                        quantidade_itens_capital: 0,
                                        valor_item_capital: 0,
                                        numero_processo_incorporacao_capital: "",
                                    }
                                )
                                }
                            >
                                + Adicionar despesa parcial
                            </button>
                        </div>
                        }
                    </>
                )}
            />


        </div>
    )
}