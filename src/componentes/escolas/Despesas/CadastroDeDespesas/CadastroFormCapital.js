import React from "react";
import NumberFormat from "react-number-format";
import {
    calculaValorRateio,
    trataNumericos,
    processoIncorporacaoMask
} from "../../../../utils/ValidacoesAdicionaisFormularios";
import { ReactNumberFormatInput as CurrencyInput } from "../../../Globais/ReactNumberFormatInput";
import MaskedInput from "react-text-mask";
import {visoesService} from "../../../../services/visoes.service";

export const CadastroFormCapital = (propriedades) => {
    const {
        formikProps,
        rateio,
        index,
        despesasTabelas,
        especificaoes_capital,
        verboHttp,
        disabled,
        errors,
        exibeMsgErroValorRecursos,
        exibeMsgErroValorOriginal,
        eh_despesa_com_comprovacao_fiscal,
        eh_despesa_com_retencao_imposto,
        bloqueiaRateioEstornado,
        renderContaAssociacaoOptions,
        filterContas
    } = propriedades;

    const handleChangeData = (quantidade, valor, setFieldValue) => {
        let val = calculaValorRateio(quantidade, trataNumericos(valor));
        setFieldValue(`rateios[${index}].valor_rateio`, val)
    };

    const handleChangeQtdeItens = (valor, setFieldValue) => {
        if (formikProps.values.mais_de_um_tipo_despesa === 'nao' && valor !== '1') {
            setFieldValue(`rateios[${index}].valor_item_capital`, 0)
        }
    };

    return (
        <>
            <div className="row mt-4">
                <div className="col-12">
                    <label htmlFor={`especificacao_material_servico_${index}`}>Especificação do bem, material ou serviço</label>
                    <select
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-especificacao-material`}
                        value={
                            rateio.especificacao_material_servico !== null ? (
                                typeof rateio.especificacao_material_servico === "object" ? rateio.especificacao_material_servico.id : rateio.especificacao_material_servico
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].especificacao_material_servico`}
                        id={`especificacao_material_servico_${index}`}
                        className={
                            !eh_despesa_com_comprovacao_fiscal(formikProps.values)
                            ? "form-control"
                            : `${!rateio.especificacao_material_servico && verboHttp === "PUT" && "is_invalid "} ${!rateio.especificacao_material_servico && 'despesa_incompleta'} form-control`
                        }
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(formikProps.values)}
                    >
                        <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-especificacao-material-option-${0}`} key={0} value="">Selecione uma especificação</option>
                        {especificaoes_capital && especificaoes_capital.map((item, key) => (
                            <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-especificacao-material-option-${key + 1}`} className={!item.ativa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.descricao}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor={`acao_associacao_form_capital_${index}`}>Ação</label>
                    <select
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-acao`}
                        value={
                            rateio.acao_associacao !== null ? (
                                typeof rateio.acao_associacao === "object" ? rateio.acao_associacao.uuid : rateio.acao_associacao
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].acao_associacao`}
                        id={`acao_associacao_form_capital_${index}`}
                        className={`${!rateio.acao_associacao && verboHttp === "PUT" && "is_invalid "} ${!rateio.acao_associacao && 'despesa_incompleta'} form-control`}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                    >
                        <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-acao-option-${0}`} value="">Selecione uma ação</option>
                        {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.filter(acao => !acao.e_recursos_proprios).map((item, key) => (
                            <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-acao-option-${key + 1}`} key={item.uuid} value={item.uuid}>{item.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-6">
                    <div className='row'>
                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="quantidade_itens_capital">Quantidade de itens</label>
                            <NumberFormat
                                data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-quantidade-de-itens`}
                                value={rateio.quantidade_itens_capital}
                                onChange={(e) => {
                                    formikProps.handleChange(e);
                                    handleChangeQtdeItens(e.target.value, formikProps.setFieldValue);
                                    handleChangeData(e.target.value, rateio.valor_item_capital, formikProps.setFieldValue);

                                }}
                                name={`rateios[${index}].quantidade_itens_capital`}
                                decimalScale={0}
                                id={`quantidade_itens_capital_${index}`}
                                className={`${(!rateio.quantidade_itens_capital || rateio.quantidade_itens_capital === '0') && verboHttp === "PUT" ? "is_invalid" : ""} ${(!rateio.quantidade_itens_capital || rateio.quantidade_itens_capital === '0') && 'despesa_incompleta'} form-control`}
                                disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                            />
                        </div>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor={`valor_item_capital_${index}`}>Valor unitário </label>
                            <CurrencyInput
                                data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-valor-unitario`}
                                allowNegative={false}
                                prefix='R$'
                                decimalSeparator=","
                                thousandSeparator="."
                                value={rateio.valor_item_capital}
                                name={`rateios[${index}].valor_item_capital`}
                                id={`valor_item_capital_${index}`}
                                className={`${trataNumericos(rateio.valor_item_capital) === 0 && verboHttp === "PUT" ? "is_invalid" : ""} ${trataNumericos(rateio.valor_item_capital) === 0 && 'despesa_incompleta'} form-control`}
                                onChangeEvent={(e) => {
                                    formikProps.handleChange(e);
                                    handleChangeData(rateio.quantidade_itens_capital, e.target.value, formikProps.setFieldValue);
                                }}
                                disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor={`numero_processo_incorporacao_capital_${index}`}>Número do processo de
                        incorporação</label>
                    <MaskedInput
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-numero-do-processo-incorporacao`}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                        mask={(valor) => processoIncorporacaoMask(valor)}
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].numero_processo_incorporacao_capital`}
                        className={`${!rateio.numero_processo_incorporacao_capital && verboHttp === "PUT" && "is_invalid "} ${!rateio.numero_processo_incorporacao_capital && 'despesa_incompleta'} form-control`}
                        placeholder="Escreva o número do processo"
                        defaultValue={rateio.numero_processo_incorporacao_capital}
                        id={`numero_processo_incorporacao_capital_${index}`}
                    />
                </div>
                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor={`conta_associacao_${index}`}>Tipo de conta</label>
                    <select
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-tipo-conta`}
                        value={
                            rateio.conta_associacao !== null ? (
                                typeof rateio.conta_associacao === "object" ? rateio.conta_associacao.uuid : rateio.conta_associacao
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].conta_associacao`}
                        id={`conta_associacao_${index}`}
                        className={`${!rateio.conta_associacao && verboHttp === "PUT" && "is_invalid "} ${!rateio.conta_associacao && 'despesa_incompleta'} form-control`}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !formikProps.values['data_transacao']}
                    >
                        <option key={0} value="">Selecione uma conta</option>
                        {renderContaAssociacaoOptions(formikProps.values.data_transacao)}
                    </select>
                    {
                        (formikProps.values.data_transacao && !filterContas(formikProps.values.data_transacao).length) ?
                        <span data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-erro-conta-associacao`} 
                            className="mt-1 span_erro text-danger">
                                Não existem contas disponíveis para a data do pagamento
                        </span> : null
                    }                    
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor={`valor_original_form_capital_${index}`}>{eh_despesa_com_retencao_imposto(formikProps.values) ? 'Valor líquido total do capital' : 'Valor total do capital'}</label>
                    <CurrencyInput
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-valor`}
                        allowNegative={false}
                        prefix='R$'
                        decimalSeparator=","
                        thousandSeparator="."
                        value={calculaValorRateio(rateio.valor_item_capital, rateio.quantidade_itens_capital)}
                        name={`rateios[${index}].valor_original`}
                        id={`valor_original_form_capital_${index}`}
                        className={`${calculaValorRateio(rateio.valor_item_capital, rateio.quantidade_itens_capital) === 0 && verboHttp === "PUT" ? "is_invalid" : ""} ${calculaValorRateio(rateio.valor_item_capital, rateio.quantidade_itens_capital) === 0 && 'despesa_incompleta'} form-control`}
                        onChangeEvent={formikProps.handleChange}
                        disabled={true}
                    />
                    {errors.valor_original && exibeMsgErroValorOriginal &&
                    <span data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-erro-valor`} className="span_erro text-danger mt-1"> A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.</span>}
                </div>

                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor={`valor_rateio_${index}`} className="label-valor-realizado">{eh_despesa_com_retencao_imposto(formikProps.values) ? 'Valor líquido realizado' : 'Valor realizado'}</label>
                    <CurrencyInput
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-valor-realizado`}
                        allowNegative={false}
                        prefix='R$'
                        decimalSeparator=","
                        thousandSeparator="."
                        value={rateio.valor_rateio}
                        name={`rateios[${index}].valor_rateio`}
                        id={`valor_rateio_${index}`}
                        className={`${trataNumericos(rateio.valor_rateio) === 0 && verboHttp === "PUT" ? "is_invalid" : ""} ${trataNumericos(rateio.valor_rateio) === 0 && 'despesa_incompleta'} form-control ${trataNumericos(rateio.valor_rateio) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
                        onChangeEvent={(e) => {
                            formikProps.handleChange(e);
                        }}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                    />
                    {errors.valor_recusos_acoes && exibeMsgErroValorRecursos &&
                    <span data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-capital-erro-valor-realizado`} className="span_erro text-danger mt-1"> A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.</span>}
                </div>
            </div>
        </>
    )
};