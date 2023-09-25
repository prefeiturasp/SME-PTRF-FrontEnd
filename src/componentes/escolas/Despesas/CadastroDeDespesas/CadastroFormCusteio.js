import React from "react";
import CurrencyInput from "react-currency-input";
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {visoesService} from "../../../../services/visoes.service";


export const CadastroFormCusteio = (propriedades) => {

    const { formikProps, 
            rateio, 
            rateios, 
            index, 
            despesasTabelas,  
            especificacoes_custeio, 
            verboHttp, 
            disabled, 
            errors, 
            exibeMsgErroValorRecursos, 
            exibeMsgErroValorOriginal, 
            eh_despesa_com_comprovacao_fiscal, 
            eh_despesa_com_retencao_imposto, 
            bloqueiaRateioEstornado, 
            renderContaAssociacaoOptions,
            getOpcoesSelectConta } = propriedades

    const setValorRateioRealizado=(setFieldValue, index, valor)=>{
        setFieldValue(`rateios[${index}].valor_rateio`, trataNumericos(valor))
    };

    return (
        <>
            <div className="form-row">
                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="tipo_custeio">Tipo de despesa de custeio</label>
                    <select
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-tipo-de-despesa`}
                        value={
                            rateio.tipo_custeio !== null ? (
                                typeof rateio.tipo_custeio === "object" ? rateio.tipo_custeio.id : rateio.tipo_custeio
                            ) : ""
                        }
                        onChange={(e) => {
                            formikProps.handleChange(e);
                        }}
                        name={`rateios[${index}].tipo_custeio`}
                        id='tipo_custeio'
                        className={
                            !eh_despesa_com_comprovacao_fiscal(formikProps.values)
                            ? "form-control"
                            : `${!rateio.tipo_custeio && verboHttp === "PUT" && "is_invalid "} ${!rateio.tipo_custeio && "despesa_incompleta"} form-control`
                        }
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(formikProps.values)}
                    >
                        <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-tipo-de-despesa-option-${0}`} value="">Selecione um tipo</option>
                        {despesasTabelas.tipos_custeio && despesasTabelas.tipos_custeio.map((item, key) => (
                            <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-tipo-de-despesa-option-${key + 1}`} key={item.id} value={item.id}>{item.nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="col-12 mt-4">
                    <label htmlFor={`especificacao_material_servico_${index}`}>Especificação do bem, material ou serviço</label>
                    <select
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-especificacao-material`}
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
                            : `${!rateio.especificacao_material_servico && verboHttp === "PUT" && "is_invalid "} ${!rateio.especificacao_material_servico && "despesa_incompleta"} form-control`
                        }
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(formikProps.values)}
                    >
                        <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-especificacao-material-option-${0}`} key={0} value="">Selecione uma especificação</option>
                        {
                            rateio.tipo_custeio !== null && rateio.tipo_custeio !== undefined && rateio.tipo_custeio.id !== null && rateio.tipo_custeio.id !== undefined && typeof especificacoes_custeio === "object" && especificacoes_custeio[rateio.tipo_custeio.id] ? (especificacoes_custeio[rateio.tipo_custeio.id].map((item, key) => (
                                    <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-especificacao-material-option-${key + 1}`} className={!item.ativa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.descricao}</option>
                                )))
                                : (
                                    especificacoes_custeio && especificacoes_custeio[rateio.tipo_custeio] && especificacoes_custeio[rateio.tipo_custeio].map((item, key) => (
                                        <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-especificacao-material-option-${key + 1}`} className={!item.ativa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.descricao}</option>
                                    ))
                                )
                        }
                    </select>
                </div>
                <div className="col-12 col-md-3 mt-4">
                    <label htmlFor="acao_associacao">Ação</label>
                    <select
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-acao`}
                        value={
                            rateio.acao_associacao !== null ? (
                                typeof rateio.acao_associacao === "object" ? rateio.acao_associacao.uuid : rateio.acao_associacao
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].acao_associacao`}
                        id='acao_associacao'
                        className={`${!rateio.acao_associacao && verboHttp === "PUT" && "is_invalid "} ${!rateio.acao_associacao && 'despesa_incompleta'} form-control`}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                    >
                        <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-acao-option-${0}`} value="">Selecione uma ação</option>
                        {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.filter(acao => !acao.e_recursos_proprios).map((item, key) => (
                            <option data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-acao-option-${key + 1}`} key={item.uuid} value={item.uuid}>{item.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-3 mt-4">
                    <label htmlFor="conta_associacao">Tipo de conta</label>
                    <select
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-tipo-conta-utilizada`}
                        value={
                            rateio.conta_associacao !== null ? (
                                typeof rateio.conta_associacao === "object" ? rateio.conta_associacao.uuid : rateio.conta_associacao
                            ) : ""
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].conta_associacao`}
                        id='conta_associacao'
                        className={`${!rateio.conta_associacao && verboHttp === "PUT" && "is_invalid "} ${!rateio.conta_associacao && 'despesa_incompleta'} form-control`}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !formikProps.values['data_transacao']}
                    >
                        <option key={0} value="">{getOpcoesSelectConta(formikProps.values['data_transacao']).length || !formikProps.values['data_transacao'] ? 'Selecione uma conta' : 'Não existem contas disponíveis'}</option>
                        {renderContaAssociacaoOptions(formikProps.values)}
                    </select>
                    <span>
                    </span>
                </div>

                <div className="col-12 col-md-3 mt-4">
                    <label htmlFor="valor_original_form_custeio">{eh_despesa_com_retencao_imposto(formikProps.values) ? 'Valor líquido' : 'Valor'}</label>
                    <CurrencyInput
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-valor`}
                        allowNegative={false}
                        prefix='R$'
                        decimalSeparator=","
                        thousandSeparator="."
                        value={rateio.valor_original}
                        name={`rateios[${index}].valor_original`}
                        id="valor_original_form_custeio"
                        className={`form-control`}
                        onChangeEvent={(e) => {
                            formikProps.handleChange(e);
                            setValorRateioRealizado(formikProps.setFieldValue, index, e.target.value)
                        }}
                        onBlur={formikProps.handleBlur}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                    />
                    {errors.valor_original && exibeMsgErroValorOriginal && <span data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-erro-valor`} className="span_erro text-danger mt-1"> A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.</span>}
                </div>
                <div className="col-12 col-md-3 mt-4">
                    <label htmlFor="valor_rateio">{eh_despesa_com_retencao_imposto(formikProps.values) ? 'Valor líquido realizado' : 'Valor realizado'}</label>
                    <CurrencyInput
                        data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-valor-realizado`}
                        allowNegative={false}
                        prefix='R$'
                        decimalSeparator=","
                        thousandSeparator="."
                        value={rateio.valor_rateio}
                        name={`rateios[${index}].valor_rateio`}
                        id="valor_rateio"
                        className={`${ trataNumericos(rateio.valor_rateio) === 0 && verboHttp === "PUT" ? "is_invalid" : ""} ${trataNumericos(rateio.valor_rateio) === 0 && 'despesa_incompleta'} form-control ${trataNumericos(rateio.valor_rateio) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
                        onChangeEvent={formikProps.handleChange}
                        onBlur={formikProps.handleBlur}
                        disabled={disabled || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                    />
                    {errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastro-custeio-erro-valor-realizado`} className="span_erro text-danger mt-1"> A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.</span>}
                </div>
            </div>
        </>
    );
};