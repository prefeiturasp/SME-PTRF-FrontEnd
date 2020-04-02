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
                                            {dadosApiContext.despesastabelas.tipos_custeio.length > 0 && dadosApiContext.despesastabelas.tipos_custeio.map(item => (
                                                <option key={item.id} value={item.id}>{item.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 mt-4">
                                        <label htmlFor="especificacao_material_servico">Especificação do material ou serviço</label>
                                        <select
                                            defaultValue={rateio.especificacao_material_servico.id}
                                            onChange={formikProps.handleChange}
                                            name={`rateios[${index}].especificacao_material_servico`}
                                            //name='especificacao_material_servico'
                                            id='especificacao_material_servico'
                                            className="form-control"
                                        >
                                            <option value="0">Selecione uma ação</option>
                                            <option key="1" value={1} >Material Elétrico</option>
                                            {/*{dadosApiContext.especificacaoMaterialServico.length > 0 && dadosApiContext.especificacaoMaterialServico.map(item => (
                                                <option key={item.id} value={item.id}>{item.descricao}</option>
                                            ))}*/}
                                        </select>
                                    </div>

                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="acao_associacao">Ação</label>
                                        <select
                                            value={rateio.acao_associacao.uuid}
                                            onChange={formikProps.handleChange}
                                            name={`rateios[${index}].acao_associacao`}
                                            //name='acao_associacao'
                                            id='acao_associacao'
                                            className="form-control"
                                        >
                                            <option value="0">Selecione uma ação</option>
                                            {dadosApiContext.despesastabelas.acoes_associacao.length > 0 && dadosApiContext.despesastabelas.acoes_associacao.map(item => (
                                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className='row'>

                                            <div className="col-12 col-md-6 mt-4">
                                                <label htmlFor="conta_associacao">Tipo de conta utilizada - UUID: {rateio.conta_associacao.uuid}</label>
                                                <select
                                                    value={rateio.conta_associacao.uuid}
                                                    onChange={formikProps.handleChange}
                                                    //name='conta_associacao'
                                                    name={`rateios[${index}].conta_associacao`}
                                                    id='conta_associacao'
                                                    className="form-control"
                                                >
                                                    <option value="0">Selecione uma conta</option>
                                                    {dadosApiContext.despesastabelas.contas_associacao.length > 0 && dadosApiContext.despesastabelas.contas_associacao.map(item => (
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
                                        associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
                                        aplicacao_recurso: "",
                                        tipo_aplicacao_recurso: "",
                                        tipo_custeio: 1,
                                        especificacao_material_servico: "",
                                        conta_associacao: "",
                                        acao_associacao: "",
                                        valor_rateio: "",
                                        quantidade_itens_capital: "",
                                        valor_item_capital: "",
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