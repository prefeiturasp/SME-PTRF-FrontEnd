import React from "react";
import NumberFormat from "react-number-format";
import {calculaValorRateio, cpfMaskContitional, trataNumericos, processoIncorporacaoMask} from "../../../../utils/ValidacoesAdicionaisFormularios";
import CurrencyInput from "react-currency-input";
import MaskedInput from "react-text-mask";

export const CadastroFormCapital = (propriedades) => {
    const {formikProps, rateio, index, despesasTabelas, especificaoes_capital, verboHttp, disabled, errors, exibeMsgErroValorRecursos} = propriedades

    return (
        <>
            <div className="row mt-4">
                <div className="col-12">
                    <label htmlFor="especificacao_material_servico">Especificação do material ou serviço</label>
                    <select
                        value={
                            rateio.especificacao_material_servico !== null ? (
                                typeof rateio.especificacao_material_servico === "object" ? rateio.especificacao_material_servico.id : rateio.especificacao_material_servico
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].especificacao_material_servico`}
                        id='especificacao_material_servico'
                        className={`${!rateio.especificacao_material_servico && verboHttp === "PUT" && "is_invalid "} form-control`}
                        disabled={disabled}
                    >
                        <option key={0} value="">Selecione uma especificação</option>
                        {especificaoes_capital && especificaoes_capital.map((item) => (
                            <option key={item.id} value={item.id}>{item.descricao}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="acao_associacao">Ação</label>
                    <select
                        value={
                            rateio.acao_associacao !== null ? (
                                typeof rateio.acao_associacao === "object" ? rateio.acao_associacao.uuid : rateio.acao_associacao
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].acao_associacao`}
                        id='acao_associacao'
                        className={`${!rateio.acao_associacao && verboHttp === "PUT" && "is_invalid "} form-control`}
                        disabled={disabled}
                    >
                        <option value="">Selecione uma ação</option>
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
                                value={rateio.quantidade_itens_capital}
                                onChange={formikProps.handleChange}
                                name={`rateios[${index}].quantidade_itens_capital`}
                                decimalScale={0}
                                id="quantidade_itens_capital"
                                className={`${(!rateio.quantidade_itens_capital || rateio.quantidade_itens_capital === '0') && verboHttp === "PUT" ? "is_invalid" : ""} form-control`}
                                disabled={disabled}
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
                                className={`${trataNumericos(rateio.valor_item_capital) === 0 && verboHttp === "PUT" ? "is_invalid" : ""} form-control`}
                                onChangeEvent={formikProps.handleChange}
                                disabled={disabled}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="numero_processo_incorporacao_capital">Número do processo de incorporação</label>
                    <MaskedInput
                        disabled={disabled}
                        mask={(valor) => processoIncorporacaoMask(valor)}
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].numero_processo_incorporacao_capital`}
                        className={`${!rateio.numero_processo_incorporacao_capital && verboHttp === "PUT" && "is_invalid "} form-control`}
                        placeholder="Escreva o número do processo"
                        defaultValue={rateio.numero_processo_incorporacao_capital}
                        id='numero_processo_incorporacao_capital'
                    />
                </div>

                <div className="col-12 col-md-6">
                    <div className='row'>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="conta_associacao">Tipo de conta utilizada</label>
                            <select
                                value={
                                    rateio.conta_associacao !== null ? (
                                        typeof rateio.conta_associacao === "object" ? rateio.conta_associacao.uuid : rateio.conta_associacao
                                    ) : ""
                                }
                                onChange={formikProps.handleChange}
                                name={`rateios[${index}].conta_associacao`}
                                id='conta_associacao'
                                className={`${!rateio.conta_associacao && verboHttp === "PUT" && "is_invalid "} form-control`}
                                disabled={disabled}
                            >
                                <option key={0} value="">Selecione uma conta</option>
                                {despesasTabelas.contas_associacao && despesasTabelas.contas_associacao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="valor_rateio">Valor</label>
                            <CurrencyInput
                                allowNegative={false}
                                prefix='R$'
                                decimalSeparator=","
                                thousandSeparator="."
                                value={calculaValorRateio(rateio.valor_item_capital, rateio.quantidade_itens_capital)}
                                name={`rateios[${index}].valor_rateio`}
                                id="valor_rateio"
                                className="form-control"
                                onChangeEvent={formikProps.handleChange}
                                disabled={true}
                            />
                            {errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span className="span_erro text-danger mt-1"> A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}