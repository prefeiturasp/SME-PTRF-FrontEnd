import React, {useEffect, useRef} from "react";
import {Field, useFormikContext} from "formik";
import MaskedInput from "react-text-mask";
import {visoesService} from "../../../../../services/visoes.service";
import {
    trataNumericos,
    calculaValorRecursoAcoes,
    cpfMaskContitional,
} from "../utils";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {ReactNumberFormatInput as CurrencyInput} from "../../../../Globais/ReactNumberFormatInput";
import {FEATURE_FLAGS} from "../../../../../constantes/featureFlags";
import {ComprovacaoFiscal} from "../../ComprovacaoFiscal";
import {
    useDespesaTabelasCtx,
    useDespesaUiCtx,
    useDespesaFluxoCtx,
} from "../context/DespesaFormPipelineContext";

export const DocumentoSection = () => {
    const props = useFormikContext();
    const {values, setFieldValue, errors} = props;
    const dataTransacaoRef = useRef(values.data_transacao);

    useEffect(() => {
        dataTransacaoRef.current = values.data_transacao;
    }, [values.data_transacao]);

    const {
        despesaContext,
        despesasTabelas,
        aux,
        verbo_http,
        limparSelecaoContasDesabilitadas,
    } = useDespesaTabelasCtx();

    const {
        readOnlyCampos,
        setFormErrors,
        formErrors,
        numeroDocumentoReadOnly,
        setCssEscondeDocumentoTransacao,
        setLabelDocumentoTransacao,
        cssEscondeDocumentoTransacao,
        labelDocumentoTransacao,
        exibeMsgErroValorOriginal,
        exibeMsgErroValorRecursos,
        eh_despesa_com_comprovacao_fiscal,
        eh_despesa_reconhecida,
        limpa_campos_sem_comprovacao_fiscal,
    } = useDespesaUiCtx();

    const {
        validacoesPersonalizadas,
        onCalendarCloseDataPagamento,
        onCalendarCloseDataDoDocumento,
    } = useDespesaFluxoCtx();

    const setaValorRealizado = (valuesArg, valor) => {
        valuesArg.valor_total = valor;
    };

return (
        <>
                                <div className="form-row">
                                    <div className="col-12">
                                        <ComprovacaoFiscal
                                            formikProps={props}
                                            eh_despesa_com_comprovacao_fiscal={eh_despesa_com_comprovacao_fiscal}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            eh_despesa_reconhecida={eh_despesa_reconhecida}
                                            limpa_campos_sem_comprovacao_fiscal={limpa_campos_sem_comprovacao_fiscal}
                                            setFormErrors={setFormErrors}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                        <MaskedInput
                                            data-qa="cadastro-edicao-despesa-cnpj-cpf-fornecedor"
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            mask={(valor) => cpfMaskContitional(valor)}
                                            value={props.values.cpf_cnpj_fornecedor}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                            }}
                                            onBlur={async () => {
                                                const _erros = await validacoesPersonalizadas(values, setFieldValue);
                                                if (_erros != null) setFormErrors(_erros);
                                            }}
                                            onClick={() => {
                                                setFormErrors({cpf_cnpj_fornecedor: ""})
                                            }}
                                            name="cpf_cnpj_fornecedor" id="cpf_cnpj_fornecedor" type="text"
                                            className={
                                                !eh_despesa_com_comprovacao_fiscal(props.values)
                                                    ? "form-control"
                                                    : `${!props.values.cpf_cnpj_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.cpf_cnpj_fornecedor && 'despesa_incompleta'} form-control`
                                            }
                                            placeholder="Digite o número do CNPJ ou CPF"
                                        />
                                        {/* Validações personalizadas */}
                                        {formErrors.cpf_cnpj_fornecedor && <p className='mb-0'><span
                                            data-qa="cadastro-edicao-despesa-erro-cnpj-cpf-fornecedor"
                                            className="span_erro text-danger mt-1">{formErrors.cpf_cnpj_fornecedor}</span>
                                        </p>}
                                    </div>
                                    <div className="col-12 col-md-6  mt-4">
                                        <label htmlFor="nome_fornecedor">Razão social do fornecedor</label>
                                        <input
                                            data-qa="cadastro-edicao-despesa-razao-social-fornecedor"
                                            value={props.values.nome_fornecedor}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            name="nome_fornecedor" id="nome_fornecedor" type="text"
                                            className={
                                                !eh_despesa_com_comprovacao_fiscal(props.values)
                                                    ? "form-control"
                                                    : `${!props.values.nome_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.nome_fornecedor && 'despesa_incompleta'} form-control`
                                            }
                                            placeholder="Digite o nome"
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="tipo_documento">Tipo de documento</label>
                                        <select
                                            data-qa="cadastro-edicao-despesa-tipo-de-documento"
                                            value={
                                                props.values.tipo_documento !== null ? (
                                                    props.values.tipo_documento === "object" ? props.values.tipo_documento.id : props.values.tipo_documento.id
                                                ) : ""
                                            }
                                            onChange={(e) => {                                              
                                                props.handleChange(e);

                                                if(despesasTabelas && despesasTabelas.tipos_documento) {
                                                    const documento = despesasTabelas.tipos_documento.find(
                                                        item => item.id === Number(e.target.value)
                                                    );

                                                    if (!documento?.pode_reter_imposto) {
                                                        props.setFieldValue("retem_imposto", false);
                                                    }
                                                }

                                            }}
                                            onBlur={props.handleBlur}
                                            name='tipo_documento'
                                            id='tipo_documento'
                                            className={!eh_despesa_com_comprovacao_fiscal(props.values) ? "form-control" : `${!props.values.tipo_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.tipo_documento && "despesa_incompleta"} form-control`}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                        >
                                            <option data-qa={`cadastro-edicao-despesa-tipo-de-documento-option-${0}`} value="">Selecione o tipo</option>
                                            {despesasTabelas && despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.length > 0 && despesasTabelas.tipos_documento.map((item, key) =>
                                                <option data-qa={`cadastro-edicao-despesa-tipo-de-documento-option-${key + 1}`} className={!item.documento_comprobatorio_de_despesa ? 'esconde-especificacao-material-servico' : ''} key={item.id} value={item.id}>{item.nome}</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="data_documento">Data do documento</label>
                                        <DatePickerField
                                            dataQa="cadastro-edicao-despesa-data-do-documento"
                                            name="data_documento"
                                            id="data_documento"
                                            value={values.data_documento !== null ? values.data_documento : ""}
                                            onChange={setFieldValue}
                                            onCalendarClose={async () => {
                                                onCalendarCloseDataDoDocumento(values, setFieldValue, "data_documento")
                                                setFieldValue('')
                                            }}
                                            className={
                                                !eh_despesa_com_comprovacao_fiscal(props.values)
                                                    ? "form-control"
                                                    : `${!props.values.data_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.data_documento && "despesa_incompleta"} form-control`
                                            }
                                            about={despesaContext.verboHttp}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            maxDate={new Date()}
                                        />
                                        {props.errors.data_documento && <span
                                            data-qa="cadastro-edicao-despesa-erro-1-data-do-documento"
                                            className="span_erro text-danger mt-1"> {props.errors.data_documento}</span>}
                                        {formErrors.data_documento && <span
                                            data-qa="cadastro-edicao-despesa-erro-2-data-do-documento"
                                            className="span_erro text-danger mt-1"> {formErrors.data_documento}</span>}
                                    </div>     

                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="numero_documento">Número do documento</label>
                                        <input
                                            data-qa="cadastro-edicao-despesa-numero-do-documento"
                                            value={props.values.numero_documento}
                                            onChange={(e) => {
                                                aux.onHandleChangeApenasNumero(e, setFieldValue, "numero_documento");
                                            }}
                                            onBlur={props.handleBlur}
                                            name="numero_documento"
                                            id="numero_documento" type="text"
                                            className={
                                                !eh_despesa_com_comprovacao_fiscal(props.values)
                                                    ? "form-control"
                                                    : `${!numeroDocumentoReadOnly && !props.values.numero_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!numeroDocumentoReadOnly && !props.values.numero_documento && "despesa_incompleta"} form-control`
                                            }
                                            placeholder={numeroDocumentoReadOnly ? "" : "Digite o número"}
                                            disabled={readOnlyCampos || numeroDocumentoReadOnly || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                        />
                                        {props.errors.numero_documento && <span
                                            data-qa="cadastro-edicao-despesa-erro-numero-do-documento"
                                            className="span_erro text-danger mt-1"> {props.errors.numero_documento}</span>}
                                    </div>

                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="tipo_transacao">Forma de pagamento</label>
                                        <select
                                            data-qa="cadastro-edicao-despesa-forma-de-pagamento"
                                            value={
                                                props.values.tipo_transacao !== null ? (
                                                    props.values.tipo_transacao === "object" ? props.values.tipo_transacao.id : props.values.tipo_transacao.id
                                                ) : ""
                                            }
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                aux.exibeDocumentoTransacao(e.target.value, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas)
                                            }}
                                            onBlur={props.handleBlur}
                                            name='tipo_transacao'
                                            id='tipo_transacao'
                                            className={`${!props.values.tipo_transacao && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.tipo_transacao && "despesa_incompleta"} form-control`}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                        >
                                            <option data-qa={`cadastro-edicao-despesa-forma-de-pagamento-option-${0}`} key={0} value="">Selecione o tipo</option>
                                            {despesasTabelas.tipos_transacao && despesasTabelas.tipos_transacao.map((item, key) => (
                                                <option data-qa={`cadastro-edicao-despesa-forma-de-pagamento-option-${key + 1}`} key={item.id} value={item.id}>{item.nome}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="data_transacao">Data do pagamento</label>
                                        <DatePickerField
                                            dataQa="cadastro-edicao-despesa-data-da-transacao"
                                            name="data_transacao"
                                            id="data_transacao"
                                            value={values.data_transacao != null ? values.data_transacao : ""}
                                            onChange={(name, value) => {
                                                dataTransacaoRef.current = value;
                                                setFieldValue(name, value, true);
                                            }}
                                            onCalendarClose={async () => {
                                                // Formik ainda pode ter values stale aqui — usa a data do onChange.
                                                const valuesAtualizados = {
                                                    ...values,
                                                    data_transacao: dataTransacaoRef.current,
                                                };
                                                limparSelecaoContasDesabilitadas(setFieldValue, valuesAtualizados);
                                                const erros = await validacoesPersonalizadas(
                                                    valuesAtualizados,
                                                    setFieldValue,
                                                    "despesa_principal"
                                                );
                                                if (erros != null) {
                                                    setFormErrors(erros);
                                                }
                                                onCalendarCloseDataPagamento(valuesAtualizados, setFieldValue);
                                            }}
                                            about={despesaContext.verboHttp}
                                            className={`${!values.data_transacao && verbo_http === "PUT" ? 'is_invalid' : ""} ${!values.data_transacao && "despesa_incompleta"} form-control`}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            maxDate={new Date()}
                                        />
                                        {props.errors.data_transacao &&
                                            <span
                                                data-qa="cadastro-edicao-despesa-erro-1-data-da-transacao"
                                                className="span_erro text-danger mt-1"> {props.errors.data_transacao}</span>}
                                        {formErrors.data_transacao &&
                                            <span
                                                data-qa="cadastro-edicao-despesa-erro-2-data-da-transacao"
                                                className="span_erro text-danger mt-1"> {formErrors.data_transacao}</span>}
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <div className={cssEscondeDocumentoTransacao}>
                                            <label htmlFor="documento_transacao">Número
                                                do {labelDocumentoTransacao}</label>
                                            <input
                                                data-qa="cadastro-edicao-despesa-numero-do-documento-de-transacao"
                                                value={props.values.documento_transacao}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                name="documento_transacao"
                                                id="documento_transacao"
                                                type="text"
                                                className={`${aux.documentoTransacaoObrigatorio(values.tipo_transacao, despesasTabelas) && !values.documento_transacao && verbo_http === "PUT" ? 'is_invalid' : ""} ${aux.documentoTransacaoObrigatorio(values.tipo_transacao, despesasTabelas) && !values.documento_transacao && "despesa_incompleta"} form-control`}
                                                placeholder="Digite o número do documento"
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            />
                                            {props.errors.documento_transacao && <span
                                                data-qa="cadastro-edicao-despesa-erro-numero-do-documento-de-transacao"
                                                className="span_erro text-danger mt-1"> {props.errors.documento_transacao}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="valor_original_form_principal">Valor total do documento</label>
                                        <CurrencyInput
                                            data-qa="cadastro-edicao-despesa-valor-total-do-documento"
                                            allowNegative={false}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={props.values.valor_original}
                                            name="valor_original"
                                            id="valor_original_form_principal"
                                            className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} ${trataNumericos(props.values.valor_total) === 0 && "despesa_incompleta"} form-control`}
                                            selectAllOnFocus={true}
                                            onChangeEvent={(e) => {
                                                setaValorRealizado(props.values, e.target.value)
                                                props.handleChange(e);
                                            }}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                        />
                                        {props.errors.valor_original && exibeMsgErroValorOriginal &&
                                            <span data-qa="cadastro-edicao-despesa-erro-valor-total-do-documento" className="span_erro text-danger mt-1"> A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.</span>}
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="valor_total" className="label-valor-realizado">Valor
                                            realizado</label>
                                        <CurrencyInput
                                            data-qa="cadastro-edicao-despesa-valor-realizado"
                                            allowNegative={false}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={values.valor_total}
                                            name="valor_total"
                                            id="valor_total"
                                            className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control ${trataNumericos(props.values.valor_total) === 0 && "despesa_incompleta"} ${trataNumericos(props.values.valor_total) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
                                            selectAllOnFocus={true}
                                            onChangeEvent={(e) => {
                                                props.handleChange(e);
                                            }}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                        />
                                        {props.errors.valor_total &&
                                            <span
                                                data-qa="cadastro-edicao-despesa-erro-valor-realizado"
                                                className="span_erro text-danger mt-1"> {props.errors.valor_total}</span>}
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="valor_recursos_proprios">
                                            { 
                                                visoesService.featureFlagAtiva(FEATURE_FLAGS.PREMIO_EXCELENCIA) 
                                                    ? 'Valor de outros recursos'
                                                    : 'Valor do recurso próprio'
                                            }
                                        </label>
                                        <CurrencyInput
                                            data-qa="cadastro-edicao-despesa-valor-recurso-proprio"
                                            allowNegative={false}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={values.valor_recursos_proprios}
                                            name="valor_recursos_proprios"
                                            id="valor_recursos_proprios"
                                            className="form-control"
                                            selectAllOnFocus={true}
                                            onChangeEvent={(e) => {
                                                props.handleChange(e);
                                            }}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                        />
                                        {props.errors.valor_recursos_proprios && <span
                                            data-qa="cadastro-edicao-despesa-erro-valor-recurso-proprio"
                                            className="span_erro text-danger mt-1"> {props.errors.valor_recursos_proprios}</span>}
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="valor_recusos_acoes">
                                            {
                                                visoesService.featureFlagAtiva(FEATURE_FLAGS.PREMIO_EXCELENCIA)
                                                    ? 'Valor do recurso selecionado'
                                                    : 'Valor do PTRF'
                                            }
                                        </label>
                                        <Field name="valor_recusos_acoes">
                                            {({field, form, meta}) => (
                                                <CurrencyInput
                                                    data-qa="cadastro-edicao-despesa-valor-do-ptrf"
                                                    allowNegative={false}
                                                    prefix='R$'
                                                    decimalSeparator=","
                                                    thousandSeparator="."
                                                    value={calculaValorRecursoAcoes(values)}
                                                    id="valor_recusos_acoes"
                                                    name="valor_recusos_acoes"
                                                    className="form-control"
                                                    onChangeEvent={props.handleChange}
                                                    readOnly={true}
                                                    disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                                />
                                            )}
                                        </Field>
                                        {errors.valor_recusos_acoes && exibeMsgErroValorRecursos &&
                                            <span data-qa="cadastro-edicao-despesa-erro-valor-do-ptrf" className="span_erro text-danger mt-1"> A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.</span>}
                                    </div>
                                </div>

                                {!eh_despesa_com_comprovacao_fiscal(props.values) && !eh_despesa_reconhecida(props.values) &&
                                    <div className="form-row">
                                        <div className="col-md-3 mt-4">
                                            <label htmlFor="numero_boletim_ocorrencia">Número do Boletim de
                                                Ocorrência</label>

                                            <input
                                                data-qa="cadastro-edicao-despesa-numero-boletim-de-ocorrencia"
                                                value={props.values.numero_boletim_de_ocorrencia ? props.values.numero_boletim_de_ocorrencia : ""}
                                                onChange={(e) => {
                                                    aux.onHandleChangeApenasNumero(e, setFieldValue, "numero_boletim_de_ocorrencia");
                                                }}
                                                onBlur={async () => {
                                                    const _erros = await validacoesPersonalizadas(values, setFieldValue);
                                                if (_erros != null) setFormErrors(_erros);
                                                }}
                                                onClick={() => {
                                                    setFormErrors({numero_boletim_de_ocorrencia: ""})
                                                }}
                                                name="numero_boletim_de_ocorrencia"
                                                id="numero_boletim_de_ocorrencia" type="text"
                                                className={
                                                    eh_despesa_reconhecida(props.values)
                                                        ? "form-control"
                                                        : `${!props.values.numero_boletim_de_ocorrencia && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.numero_boletim_de_ocorrencia && "despesa_incompleta"} form-control`
                                                }
                                                placeholder={"Digite o número"}
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !props.values.despesa_anterior_ao_uso_do_sistema_editavel}
                                            />
                                            {formErrors.numero_boletim_de_ocorrencia && <p className='mb-0'><span
                                                data-qa="cadastro-edicao-despesa-erro-numero-boletim-de-ocorrencia"
                                                className="span_erro text-danger mt-1">{formErrors.numero_boletim_de_ocorrencia}</span>
                                            </p>}
                                        </div>
                                    </div>
                                }


        </>
    );
};
