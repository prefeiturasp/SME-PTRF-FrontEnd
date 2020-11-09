import React, {useState} from "react";
import NumberFormat from "react-number-format";
import {calculaValorRateio, trataNumericos, processoIncorporacaoMask} from "../../../../utils/ValidacoesAdicionaisFormularios";
import CurrencyInput from "react-currency-input";
import MaskedInput from "react-text-mask";
import {visoesService} from "../../../../services/visoes.service";

export const CadastroFormCapital = (propriedades) => {
    const {formikProps, rateio, rateios, index, despesasTabelas, especificaoes_capital, verboHttp, disabled, errors, exibeMsgErroValorRecursos, exibeMsgErroValorOriginal, setFieldValue} = propriedades;
    //const [valorItemRateio, setValorItemRateio] = useState({[index]: rateio.valor_rateio});

    const handleChangeData = (quantidade, valor, setFieldValue) => {
        let val = calculaValorRateio(quantidade, trataNumericos(valor));
        /*let d = {
            ...valorItemRateio,
            [index]: val
        };
        setValorItemRateio(d);*/
        setFieldValue(`rateios[${index}].valor_rateio`, val)

    };

    const handleChangeQtdeItens = (valor, setFieldValue) => {
        if (formikProps.values.mais_de_um_tipo_despesa === 'nao' && valor !== '1'){
            setFieldValue(`rateios[${index}].valor_item_capital`, 0)
        }
    };

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
                        disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                        disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                onChange={(e) => {
                                    formikProps.handleChange(e);
                                    handleChangeQtdeItens(e.target.value, formikProps.setFieldValue);
                                    handleChangeData(e.target.value, rateio.valor_item_capital, formikProps.setFieldValue);

                                }}
                                name={`rateios[${index}].quantidade_itens_capital`}
                                decimalScale={0}
                                id="quantidade_itens_capital"
                                className={`${(!rateio.quantidade_itens_capital || rateio.quantidade_itens_capital === '0') && verboHttp === "PUT" ? "is_invalid" : ""} form-control`}
                                disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                onChangeEvent={(e) => {
                                    formikProps.handleChange(e);
                                    handleChangeData(rateio.quantidade_itens_capital, e.target.value, formikProps.setFieldValue);
                                }}
                                disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="numero_processo_incorporacao_capital">Número do processo de incorporação</label>
                    <MaskedInput
                        disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                        mask={(valor) => processoIncorporacaoMask(valor)}
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].numero_processo_incorporacao_capital`}
                        className={`${!rateio.numero_processo_incorporacao_capital && verboHttp === "PUT" && "is_invalid "} form-control`}
                        placeholder="Escreva o número do processo"
                        defaultValue={rateio.numero_processo_incorporacao_capital}
                        id='numero_processo_incorporacao_capital'
                    />
                </div>


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
                            disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                        >
                            <option key={0} value="">Selecione uma conta</option>
                            {despesasTabelas.contas_associacao && despesasTabelas.contas_associacao.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="valor_original">Valor total do capital</label>
                        <CurrencyInput
                            allowNegative={false}
                            prefix='R$'
                            decimalSeparator=","
                            thousandSeparator="."
                            value={calculaValorRateio(rateio.valor_item_capital, rateio.quantidade_itens_capital)}
                            name={`rateios[${index}].valor_original`}
                            id="valor_original"
                            className={`${ trataNumericos(rateio.valor_original) === 0 && verboHttp === "PUT" ? "is_invalid" : ""} form-control`}
                            onChangeEvent={formikProps.handleChange}
                            disabled={true}
                        />
                        {errors.valor_original && exibeMsgErroValorOriginal && <span className="span_erro text-danger mt-1"> A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.</span>}
                    </div>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="valor_rateio" className="label-valor-realizado">Valor realizado</label>
                        <CurrencyInput
                            allowNegative={false}
                            prefix='R$'
                            decimalSeparator=","
                            thousandSeparator="."
                            value={rateio.valor_rateio}
                            name={`rateios[${index}].valor_rateio`}
                            id="valor_rateio"
                            className={`${ trataNumericos(rateio.valor_rateio) === 0 && verboHttp === "PUT" ? "is_invalid" : ""} form-control ${trataNumericos(rateio.valor_rateio) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
                            onChangeEvent={(e) => {
                                formikProps.handleChange(e);
                                //setValorItemRateio({...valorItemRateio, [index]: e.target.value})
                            }}
                            disabled={disabled || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                        />
                        {errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span className="span_erro text-danger mt-1"> A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.</span>}
                    </div>
                </div>
        </>
    )
};