import React from "react";
import NumberFormat from "react-number-format";
import {calculaValorRateio, currencyFormatter} from "../../../utils/ValidacoesAdicionaisFormularios";
import CurrencyInput from "react-currency-input";

export const CadastroFormCapital = (propriedades) => {
    const {formikProps, rateio, index, despesasTabelas, especificaoes_capital} = propriedades

    return (
        <>
            <div className="row mt-4">
                <div className="col-12">
                    <label htmlFor="especificacao_material_servico">Especificação do material ou serviço</label>
                    <select
                        value={
                            rateio.especificacao_material_servico !== null ? (
                                typeof rateio.especificacao_material_servico === "object" ? rateio.especificacao_material_servico.id : rateio.especificacao_material_servico
                            ) : 0
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].especificacao_material_servico`}
                        id='especificacao_material_servico'
                        className="form-control"
                    >
                        <option key={0} value={0}>Selecione uma especificação</option>
                        {especificaoes_capital && especificaoes_capital.map((item) => (
                            <option key={item.id} value={item.id}>{item.descricao}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="acao_associacao">Ação</label>
                    <select
                        //value={rateio.acao_associacao.uuid}
                        value={
                            rateio.acao_associacao !== null ? (
                                typeof rateio.acao_associacao === "object" ? rateio.acao_associacao.uuid : rateio.acao_associacao
                            ) : 0
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].acao_associacao`}
                        //name='acao_associacao'
                        id='acao_associacao'
                        className="form-control"
                    >
                        <option value="0">Selecione uma ação</option>
                        {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.map(item => (
                            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-6">
                    <div className='row'>
                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="quantidade_itens_capital">Quantidade de itens</label>
                            <NumberFormat
                                defaultValue={rateio.quantidade_itens_capital}
                                onChange={formikProps.handleChange}
                                name={`rateios[${index}].quantidade_itens_capital`}
                                decimalScale={0}
                                id="quantidade_itens_capital"
                                className="form-control"
                            />
                        </div>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="valor_item_capital">Valor unitário </label>
                            <CurrencyInput
                                allowNegative={false}
                                prefix='R$'
                                decimalSeparator=","
                                thousandSeparator="."
                                value={rateio.valor_item_capital}
                                name={`rateios[${index}].valor_item_capital`}
                                id="valor_item_capital"
                                className="form-control"
                                onChangeEvent={formikProps.handleChange}
                            />
                            {/*<NumberFormat
                                format={currencyFormatter}
                                value={rateio.valor_item_capital}
                                onChange={formikProps.handleChange}
                                name={`rateios[${index}].valor_item_capital`}
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                decimalScale={2}
                                prefix={'R$ '}
                                id="valor_item_capital"
                                className="form-control"
                            />*/}
                        </div>
                    </div>
                </div>


                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="numero_processo_incorporacao_capital">Número do processo de incorporação</label>
                    <input
                        defaultValue={rateio.numero_processo_incorporacao_capital}
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].numero_processo_incorporacao_capital`}

                        type='text'
                        id='numero_processo_incorporacao_capital'
                        className="form-control"
                        placeholder="Escreva o número do processo"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <div className='row'>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="conta_associacao">Tipo de conta utilizada</label>
                            <select
                                //defaultValue={rateio.conta_associacao !== null ? rateio.conta_associacao.uuid : 0}
                                value={
                                    rateio.conta_associacao !== null ? (
                                        typeof rateio.conta_associacao === "object" ? rateio.conta_associacao.uuid : rateio.conta_associacao
                                    ) : 0
                                }
                                onChange={formikProps.handleChange}
                                //name='conta_associacao'
                                name={`rateios[${index}].conta_associacao`}

                                id='conta_associacao'
                                className="form-control"
                            >
                                <option key={0} value={0}>Selecione uma conta</option>
                                {despesasTabelas.contas_associacao && despesasTabelas.contas_associacao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="valor_rateio">Valor do custeio</label>
                            <NumberFormat
                                //format={currencyFormatter}
                                value={calculaValorRateio(rateio.valor_item_capital, rateio.quantidade_itens_capital)}
                                onChange={formikProps.handleChange}
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                decimalScale={2}
                                prefix={'R$ '}
                                name={`rateios[${index}].valor_rateio`}
                                id="valor_rateio"
                                className="form-control"
                                readOnly={true}
                            />
                        </div>


                    </div>
                </div>


            </div>
        </>
    )
}