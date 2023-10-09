import React from "react";
import {Formik, FieldArray, Field} from "formik";
import MaskedInput from 'react-text-mask'
import {visoesService} from "../../../../services/visoes.service";
import {
    cpfMaskContitional,
    trataNumericos,
    calculaValorRecursoAcoes,
} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {DatePickerField} from "../../../Globais/DatePickerField";
import CurrencyInput from "react-currency-input";
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {CadastroFormCusteio} from "./CadastroFormCusteio";
import {CadastroFormCapital} from "./CadastroFormCapital";
import {CadastroFormDespesaImposto} from "./CadastroFormDespesaImposto";
import {Tags} from "../Tags";
import {ComprovacaoFiscal} from "../ComprovacaoFiscal";
import {ModalDeletarRateioComEstorno} from "./ModalDeletarRateioComEstorno";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import {
    SaldoInsuficiente,
    SaldoInsuficienteConta,
    ChecarDespesaExistente,
    TipoAplicacaoRecursoNaoAceito,
    ExcluirImposto
} from "../../../../utils/Modais"
import {ModalDespesaConferida} from "./ModalDespesaJaConferida";
import {ModalDespesaIncompleta} from "./ModalDespesaIncompleta";
import ModalMotivosPagamentoAntecipado from "./ModalMotivosPagamentoAntecipado";
import ExibeMotivosPagamentoAntecipadoNoForm from "./ExibeMotivosPagamentoAntecipadoNoForm";
import { RetemImposto } from "../RetemImposto";


export const CadastroFormFormik = ({
                                       initialValues,
                                       onSubmit,
                                       validateFormDespesas,
                                       despesaContext,
                                       readOnlyCampos,
                                       setFormErrors,
                                       validacoesPersonalizadas,
                                       formErrors,
                                       despesasTabelas,
                                       numeroDocumentoReadOnly,
                                       aux,
                                       setCssEscondeDocumentoTransacao,
                                       setLabelDocumentoTransacao,
                                       verbo_http,
                                       cssEscondeDocumentoTransacao,
                                       labelDocumentoTransacao,
                                       exibeMsgErroValorOriginal,
                                       exibeMsgErroValorRecursos,
                                       removeRateio,
                                       setShowAvisoCapital,
                                       especificacoes_custeio,
                                       especificaoes_capital,
                                       showDeletarRateioComEstorno,
                                       setShowDeletarRateioComEstorno,
                                       houveAlteracoes,
                                       onShowModal,
                                       onCancelarTrue,
                                       readOnlyBtnAcao,
                                       setShowDelete,
                                       setShowTextoModalDelete,
                                       btnSubmitDisable,
                                       desabilitaBtnSalvar,
                                       saldosInsuficientesDaAcao,
                                       saldosInsuficientesDaConta,
                                       mensagensAceitaCusteioCapital,
                                       eh_despesa_com_comprovacao_fiscal,
                                       eh_despesa_reconhecida,
                                       limpa_campos_sem_comprovacao_fiscal,
                                       showRetencaoImposto,
                                       eh_despesa_com_retencao_imposto,
                                       tipos_documento_com_recolhimento_imposto,
                                       numeroDocumentoImpostoReadOnly,
                                       preenche_tipo_despesa_custeio,
                                       setCssEscondeDocumentoTransacaoImposto,
                                       setLabelDocumentoTransacaoImposto,
                                       cssEscondeDocumentoTransacaoImposto,
                                       labelDocumentoTransacaoImposto,
                                       acoes_custeio,
                                       setValorRateioRealizadoImposto,
                                       readOnlyCamposImposto,
                                       setShowExcluirImposto,
                                       showExcluirImposto,
                                       cancelarExclusaoImposto,
                                       mostraModalExcluirImposto,
                                       listaDemotivosPagamentoAntecipado,
                                       selectMotivosPagamentoAntecipado,
                                       setSelectMotivosPagamentoAntecipado,
                                       checkBoxOutrosMotivosPagamentoAntecipado,
                                       txtOutrosMotivosPagamentoAntecipado,
                                       handleChangeCheckBoxOutrosMotivosPagamentoAntecipado,
                                       handleChangeTxtOutrosMotivosPagamentoAntecipado,
                                       bloqueiaLinkCadastrarEstorno,
                                       bloqueiaRateioEstornado,
                                       modalState,
                                       setModalState,
                                       serviceIniciaEncadeamentoDosModais,
                                       serviceSubmitModais,
                                       formErrorsImposto,
                                       disableBtnAdicionarImposto,
                                       onCalendarCloseDataPagamento,
                                       onCalendarCloseDataPagamentoImposto,
                                       parametroLocation,
                                       bloqueiaCamposDespesa,
                                       onCalendarCloseDataDoDocumento,
                                       renderContaAssociacaoOptions,
                                       filterContas
                                   }) => {

    // Corrigi Cálculo validação dos valores
    const setaValorRealizado = (values, valor) =>{
        values.valor_total = valor
    }
    return (
        <>
            <Formik
                initialValues={initialValues()}
                validateOnBlur={true}
                onSubmit={onSubmit}
                enableReinitialize={true}
                validate={validateFormDespesas}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                        resetForm,
                        errors,
                    } = props;

                    return (
                        <>
                            {props.values.status === 'COMPLETO' ? null :
                                props.values.qtde_erros_form_despesa > 0 && despesaContext.verboHttp === "PUT" &&
                                <div className="col-12 barra-status-erros pt-1 pb-1">
                                    <p data-qa="cadastro-edicao-despesa-erro-campos-nao-preenchidos" className="titulo-status pt-1 pb-1 mb-0">O cadastro
                                        possui {props.values.qtde_erros_form_despesa} campos não preenchidos, você pode
                                        completá-los agora ou terminar depois.</p>
                                </div>
                            }
                            <form onSubmit={props.handleSubmit}>
                                <div className="form-row">
                                    <div className="col-12">
                                        <ComprovacaoFiscal
                                            formikProps={props}
                                            eh_despesa_com_comprovacao_fiscal={eh_despesa_com_comprovacao_fiscal}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                            eh_despesa_reconhecida={eh_despesa_reconhecida}
                                            limpa_campos_sem_comprovacao_fiscal={limpa_campos_sem_comprovacao_fiscal}
                                            setFormErrors={setFormErrors}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 mt-4">
                                        <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                        <MaskedInput
                                            data-qa="cadastro-edicao-despesa-cnpj-cpf-fornecedor"
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values)}
                                            mask={(valor) => cpfMaskContitional(valor)}
                                            value={props.values.cpf_cnpj_fornecedor}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                            }}
                                            onBlur={async () => {
                                                setFormErrors(await validacoesPersonalizadas(values, setFieldValue));
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
                                            placeholder="Digite o número do CNPJ ou CPF (apenas algarismos)"
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
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values)}
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
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            name='tipo_documento'
                                            id='tipo_documento'
                                            className={!eh_despesa_com_comprovacao_fiscal(props.values) ? "form-control" : `${!props.values.tipo_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.tipo_documento && "despesa_incompleta"} form-control`}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values)}
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
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values)}
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
                                            disabled={readOnlyCampos || numeroDocumentoReadOnly || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || !eh_despesa_com_comprovacao_fiscal(props.values)}
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
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                setFieldValue(name, value, true);
                                            }}
                                            onCalendarClose={async () => {
                                                setFormErrors(await validacoesPersonalizadas(values, setFieldValue, "despesa_principal"));
                                                onCalendarCloseDataPagamento(values, setFieldValue);
                                            }}
                                            about={despesaContext.verboHttp}
                                            className={`${!values.data_transacao && verbo_http === "PUT" ? 'is_invalid' : ""} ${!values.data_transacao && "despesa_incompleta"} form-control`}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                        />
                                        {props.errors.valor_total &&
                                            <span
                                                data-qa="cadastro-edicao-despesa-erro-valor-realizado"
                                                className="span_erro text-danger mt-1"> {props.errors.valor_total}</span>}
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="valor_recursos_proprios">Valor do recurso próprio</label>
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
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                        />
                                        {props.errors.valor_recursos_proprios && <span
                                            data-qa="cadastro-edicao-despesa-erro-valor-recurso-proprio"
                                            className="span_erro text-danger mt-1"> {props.errors.valor_recursos_proprios}</span>}
                                    </div>

                                    <div className="col-12 col-md-3 mt-4">
                                        <label htmlFor="valor_recusos_acoes">Valor do PTRF</label>
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
                                                    disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                    setFormErrors(await validacoesPersonalizadas(values, setFieldValue));
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
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                            />
                                            {formErrors.numero_boletim_de_ocorrencia && <p className='mb-0'><span
                                                data-qa="cadastro-edicao-despesa-erro-numero-boletim-de-ocorrencia"
                                                className="span_erro text-danger mt-1">{formErrors.numero_boletim_de_ocorrencia}</span>
                                            </p>}
                                        </div>
                                    </div>
                                }

                                {showRetencaoImposto &&
                                    <div className="container-retencao-imposto mt-2">
                                        <div className="form-row mt-4">
                                            <div className="col-12">
                                                <RetemImposto
                                                    formikProps={props}
                                                    eh_despesa_com_retencao_imposto={eh_despesa_com_retencao_imposto}
                                                    disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                    mostraModalExcluirImposto={mostraModalExcluirImposto}
                                                />
                                                
                                                <FieldArray
                                                    name="despesas_impostos"
                                                    render={({remove, push}) => (
                                                        <>
                                                            {values.despesas_impostos.length > 0 && values.despesas_impostos.map((despesa_imposto, index) => {
                                                                return (
                                                                    <div key={index}>
                                                                        <CadastroFormDespesaImposto
                                                                            formikProps={props}
                                                                            eh_despesa_com_retencao_imposto={eh_despesa_com_retencao_imposto}
                                                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                                            tipos_documento_com_recolhimento_imposto={tipos_documento_com_recolhimento_imposto}
                                                                            numeroDocumentoImpostoReadOnly={numeroDocumentoImpostoReadOnly}
                                                                            aux={aux}
                                                                            preenche_tipo_despesa_custeio={preenche_tipo_despesa_custeio}
                                                                            especificacoes_custeio={especificacoes_custeio}
                                                                            despesasTabelas={despesasTabelas}
                                                                            cssEscondeDocumentoTransacaoImposto={cssEscondeDocumentoTransacaoImposto}
                                                                            labelDocumentoTransacaoImposto={labelDocumentoTransacaoImposto}
                                                                            setCssEscondeDocumentoTransacaoImposto={setCssEscondeDocumentoTransacaoImposto}
                                                                            setLabelDocumentoTransacaoImposto={setLabelDocumentoTransacaoImposto}
                                                                            readOnlyCamposImposto={readOnlyCamposImposto}
                                                                            despesaContext={despesaContext}
                                                                            acoes_custeio={acoes_custeio}
                                                                            setValorRateioRealizadoImposto={setValorRateioRealizadoImposto}
                                                                            index={index}
                                                                            despesa_imposto={despesa_imposto}
                                                                            remove={remove}
                                                                            formErrorsImposto={formErrorsImposto}
                                                                            onCalendarCloseDataPagamentoImposto={onCalendarCloseDataPagamentoImposto}
                                                                            renderContaAssociacaoOptions={renderContaAssociacaoOptions}
                                                                            filterContas={filterContas}
                                                                        />
                                                                    </div>
                                                                )
                                                            })}

                                                            {eh_despesa_com_retencao_imposto(values) &&
                                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                                    <button
                                                                        data-qa="cadastro-edicao-despesa-btn-adicionar-imposto"
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                                        disabled={disableBtnAdicionarImposto || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                        }}
                                                                        onClick={() => {
                                                                            push(
                                                                                {
                                                                                    associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                                                    tipo_documento: "",
                                                                                    numero_documento: "",
                                                                                    tipo_transacao: "",
                                                                                    documento_transacao: "",
                                                                                    data_transacao: "",
                                                                                    despesas_impostos: [],
                                                                                    motivos_pagamento_antecipado: [],
                                                                                    rateios: [
                                                                                        {
                                                                                            tipo_custeio: "",
                                                                                            especificacao_material_servico: "",
                                                                                            acao_associacao: "",
                                                                                            aplicacao_recurso: "CUSTEIO",
                                                                                            associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                                                            conta_associacao: "",
                                                                                            escolha_tags:"",
                                                                                            tag: "",
                                                                                            numero_processo_incorporacao_capital: "",
                                                                                            quantidade_itens_capital: 0,
                                                                                            valor_item_capital: 0,
                                                                                            valor_original: "",
                                                                                            valor_rateio: ""
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            )
                                                                        }}
                                                                    >
                                                                        + Adicionar imposto
                                                                    </button>
                                                                </div>
                                                            }
                                                        </>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }

                                <hr/>
                                <h2 className="subtitulo-itens-painel">Dados do gasto</h2>
                                <p>Esse gasto se encaixa em mais de um tipo de despesa ou ação do programa?</p>
                                <div className="form-row">
                                    <div className="col-12 col-md-3 ">
                                        <select
                                            data-qa="cadastro-edicao-despesa-gasto-tem-rateios"
                                            value={props.values.mais_de_um_tipo_despesa}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                aux.setaValoresCusteioCapital(e.target.value, values, setFieldValue);
                                                aux.setValoresRateiosOriginal(e.target.value, values, setFieldValue);
                                            }}
                                            name='mais_de_um_tipo_despesa'
                                            id='mais_de_um_tipo_despesa'
                                            className={`${!props.values.mais_de_um_tipo_despesa && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!values.mais_de_um_tipo_despesa && "despesa_incompleta"} form-control`}
                                            disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                        >
                                            <option data-qa="cadastro-edicao-despesa-gasto-tem-rateios-option-0" value="">Selecione</option>
                                            <option data-qa="cadastro-edicao-despesa-gasto-tem-rateios-option-1" value="nao">Não</option>
                                            <option data-qa="cadastro-edicao-despesa-gasto-tem-rateios-option-2" value="sim">Sim</option>
                                        </select>
                                    </div>
                                </div>

                                <FieldArray
                                    name="rateios"
                                    render={({remove, push}) => (
                                        <>
                                            {values.rateios.length > 0 && values.rateios.map((rateio, index) => {
                                                return (
                                                    <div key={index}>

                                                        <div
                                                            className="d-flex bd-highlight border-bottom mt-4 align-items-center">
                                                            <div className="flex-grow-1 bd-highlight">
                                                                <p className='mb-0'><strong>Despesa {index + 1}</strong>
                                                                </p>
                                                            </div>
                                                            <div className="bd-highlight">
                                                                <div className="d-flex justify-content-start">
                                                                    {rateio && rateio.uuid && !aux.origemAnaliseLancamento(parametroLocation) && (
                                                                        rateio.estorno && rateio.estorno.uuid
                                                                            ?
                                                                            <Link
                                                                                data-qa={`cadastro-edicao-despesa-rateio-${index}-acessar-estorno`}
                                                                                to={
                                                                                    {
                                                                                        pathname: `/edicao-de-receita/${rateio.estorno.uuid}`,

                                                                                    }
                                                                                }
                                                                                className={`btn btn-link btn-remover-despesa mr-2 d-flex align-items-center ${bloqueiaLinkCadastrarEstorno(rateio) ? 'desabilita-link-estorno' : ''}`}
                                                                                disabled={bloqueiaLinkCadastrarEstorno(rateio)}
                                                                            >
                                                                                Acessar estorno
                                                                            </Link>
                                                                            :
                                                                            <Link
                                                                                data-qa={`cadastro-edicao-despesa-rateio-${index}-cadastrar-estorno`}
                                                                                to={
                                                                                    {
                                                                                        pathname: `/cadastro-de-credito/`,
                                                                                        state: {
                                                                                            uuid_rateio: rateio.uuid,
                                                                                        }
                                                                                    }
                                                                                }
                                                                                className={`btn btn-link btn-remover-despesa mr-2 d-flex align-items-center ${bloqueiaLinkCadastrarEstorno(rateio) ? 'desabilita-link-estorno' : ''}`}
                                                                                disabled={bloqueiaLinkCadastrarEstorno(rateio)}
                                                                            >
                                                                                Cadastrar estorno
                                                                            </Link>
                                                                    )}

                                                                    {index >= 1 && values.rateios.length > 1 && (
                                                                        <button
                                                                            data-qa={`cadastro-edicao-despesa-rateio-${index}-btn-remover-despesa`}
                                                                            type="button"
                                                                            className={`btn btn-link btn-remover-despesa mr-2 d-flex align-items-center ${bloqueiaCamposDespesa() ? 'desabilita-link-remover-despesa' : ''}`}
                                                                            onClick={() => removeRateio(remove, index, rateio)}
                                                                            disabled={!visoesService.getPermissoes(['delete_despesa']) || bloqueiaCamposDespesa()}
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                style={{
                                                                                    fontSize: '17px',
                                                                                    marginRight: "4px",
                                                                                    color: "#B40C02"
                                                                                }}
                                                                                icon={faTimesCircle}
                                                                            />
                                                                            Remover Despesa
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            {rateio && rateio.uuid && rateio.estorno && rateio.estorno.uuid &&
                                                                <div className="col-12 ">
                                                                    <p data-qa={`cadastro-edicao-despesa-rateio-${index}-mensagem-edicao-bloqueada`} className="mb-0 mt-3 texto-rateio-estornado-bloqueado">
                                                                        Esta seção da despesa encontra-se bloqueada para edição. Para editar seus campos, deve-se primeiro deletar o estorno cadastrado.
                                                                    </p>
                                                                </div>
                                                            }

                                                            <div className="col-12 col-md-6 mt-4">

                                                                <label htmlFor={`aplicacao_recurso_${index}`}>Tipo de
                                                                    aplicação do recurso</label>
                                                                <select
                                                                    data-qa={`cadastro-edicao-despesa-rateio-${index}-tipo-de-aplicacao-do-recurso`}
                                                                    value={rateio.aplicacao_recurso ? rateio.aplicacao_recurso : ""}
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                        aux.handleAvisoCapital(e.target.value, setShowAvisoCapital);
                                                                        aux.setaValoresCusteioCapital(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
                                                                        aux.setValoresRateiosOriginal(props.values.mais_de_um_tipo_despesa, values, setFieldValue);

                                                                    }}
                                                                    name={`rateios[${index}].aplicacao_recurso`}
                                                                    id={`aplicacao_recurso_${index}`}
                                                                    className={`${!rateio.aplicacao_recurso && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!rateio.aplicacao_recurso && "despesa_incompleta"} form-control`}
                                                                    disabled={readOnlyCampos || bloqueiaRateioEstornado(rateio) || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                                >
                                                                    <option data-qa={`cadastro-edicao-despesa-rateio-${index}-tipo-de-aplicacao-do-recurso-option-${0}`} key={0} value="">Escolha uma opção
                                                                    </option>
                                                                    {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map((item, key) => (
                                                                        <option data-qa={`cadastro-edicao-despesa-rateio-${index}-tipo-de-aplicacao-do-recurso-option-${key + 1}`} key={item.id}
                                                                                value={item.id}>{item.nome}</option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CUSTEIO' ? (
                                                                <CadastroFormCusteio
                                                                    formikProps={props}
                                                                    rateio={rateio}
                                                                    rateios={values.rateios}
                                                                    index={index}
                                                                    despesasTabelas={despesasTabelas}
                                                                    especificacoes_custeio={especificacoes_custeio}
                                                                    verboHttp={despesaContext.verboHttp}
                                                                    disabled={readOnlyCampos}
                                                                    errors={errors}
                                                                    exibeMsgErroValorRecursos={exibeMsgErroValorRecursos}
                                                                    exibeMsgErroValorOriginal={exibeMsgErroValorOriginal}
                                                                    cpf_cnpj={props.values.cpf_cnpj_fornecedor}
                                                                    eh_despesa_com_comprovacao_fiscal={eh_despesa_com_comprovacao_fiscal}
                                                                    eh_despesa_com_retencao_imposto={eh_despesa_com_retencao_imposto}
                                                                    bloqueiaRateioEstornado={bloqueiaRateioEstornado}
                                                                    renderContaAssociacaoOptions={renderContaAssociacaoOptions}
                                                                    filterContas={filterContas}
                                                                />
                                                            ) :
                                                            rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CAPITAL' ? (
                                                                <CadastroFormCapital
                                                                    formikProps={props}
                                                                    rateio={rateio}
                                                                    rateios={values.rateios}
                                                                    index={index}
                                                                    despesasTabelas={despesasTabelas}
                                                                    especificaoes_capital={especificaoes_capital}
                                                                    verboHttp={despesaContext.verboHttp}
                                                                    disabled={readOnlyCampos}
                                                                    errors={errors}
                                                                    exibeMsgErroValorRecursos={exibeMsgErroValorRecursos}
                                                                    exibeMsgErroValorOriginal={exibeMsgErroValorOriginal}
                                                                    eh_despesa_com_comprovacao_fiscal={eh_despesa_com_comprovacao_fiscal}
                                                                    eh_despesa_com_retencao_imposto={eh_despesa_com_retencao_imposto}
                                                                    bloqueiaRateioEstornado={bloqueiaRateioEstornado}
                                                                    renderContaAssociacaoOptions={renderContaAssociacaoOptions}
                                                                    filterContas={filterContas}
                                                                />
                                                            ) : null
                                                        }


                                                        <div className="row">
                                                            <div className="col-12">

                                                                <Tags
                                                                    formikProps={props}
                                                                    rateio={rateio}
                                                                    rateios={values.rateios}
                                                                    index={index}
                                                                    verboHttp={despesaContext.verboHttp}
                                                                    disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                                    errors={errors}
                                                                    setFieldValue={setFieldValue}
                                                                    despesasTabelas={despesasTabelas}
                                                                    bloqueiaRateioEstornado={bloqueiaRateioEstornado}
                                                                />
                                                            </div>
                                                        </div>

                                                        <ExibeMotivosPagamentoAntecipadoNoForm
                                                            values={values}
                                                        />

                                                        <section>
                                                            <ModalDeletarRateioComEstorno
                                                                show={showDeletarRateioComEstorno}
                                                                handleClose={() => setShowDeletarRateioComEstorno(false)}
                                                                titulo="Remover Despesa"
                                                                texto="A exclusão desse rateio resultará na exclusão do crédito de estorno vinculado. Confirma?"
                                                                onDeletarRateio={() => {
                                                                    remove(index)
                                                                    setShowDeletarRateioComEstorno(false)
                                                                }}
                                                            />
                                                        </section>

                                                    </div> /*div key*/
                                                )
                                            })}

                                            {props.values.mais_de_um_tipo_despesa === "sim" &&
                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                    <button
                                                        data-qa="cadastro-edicao-despesa-btn-adicionar-despesa-parcial"
                                                        type="button"
                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                        disabled={![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes) || bloqueiaCamposDespesa()}
                                                        onChange={(e) => {
                                                            props.handleChange(e);
                                                            aux.handleAvisoCapital(e.target.value, setShowAvisoCapital);
                                                            aux.setaValoresCusteioCapital(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
                                                            aux.setValoresRateiosOriginal(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
                                                        }}
                                                        onClick={() => {
                                                            push(
                                                                {
                                                                    associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                                    escolha_tags: "",
                                                                    tag: "",
                                                                    conta_associacao: "",
                                                                    acao_associacao: "",
                                                                    aplicacao_recurso: "",
                                                                    tipo_custeio: "",
                                                                    especificacao_material_servico: "",
                                                                    valor_rateio: "",
                                                                    quantidade_itens_capital: "",
                                                                    valor_item_capital: "",
                                                                    valor_original: "",
                                                                    numero_processo_incorporacao_capital: ""
                                                                }
                                                            );
                                                        }}
                                                    >
                                                        + Adicionar despesa parcial
                                                    </button>
                                                </div>
                                            }
                                        </>
                                    )}
                                />
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button data-qa={`cadastro-edicao-despesa-btn-voltar`}
                                            type="reset"
                                            onClick={houveAlteracoes(values) ? onShowModal : onCancelarTrue}
                                            className="btn btn btn-outline-success mt-2 mr-2">Voltar
                                    </button>

                                    {aux.mostraBotaoDeletar(despesaContext.idDespesa, parametroLocation)
                                        ? 
                                            <button
                                                data-qa={`cadastro-edicao-despesa-btn-deletar`}
                                                disabled={readOnlyBtnAcao || !visoesService.getPermissoes(["delete_despesa"])}
                                                type="reset"
                                                onClick={() => aux.onShowDeleteModal(setShowDelete, setShowTextoModalDelete, values)}
                                                className="btn btn btn-danger mt-2 mr-2"
                                            >
                                                Deletar
                                            </button>
                                        : 
                                            null
                                    }
                                    
                                    {!aux.ehOperacaoExclusao(parametroLocation) &&
                                        <button
                                            data-qa={`cadastro-edicao-despesa-btn-salvar`}
                                            disabled={
                                                eh_despesa_reconhecida(props.values)
                                                    ? btnSubmitDisable || readOnlyBtnAcao || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)
                                                    : !props.values.numero_boletim_de_ocorrencia || btnSubmitDisable || readOnlyBtnAcao || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)
                                            }
                                            type="button"
                                            onClick={async (e) => {
                                                desabilitaBtnSalvar();
                                                serviceIniciaEncadeamentoDosModais(values, errors, setFieldValue, {resetForm});
                                            }}
                                            className="btn btn-success mt-2"
                                        >
                                            Salvar
                                        </button>
                                    }
                                    
                                </div>
                                <div className="d-flex justify-content-end">
                                    <p>{errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span
                                        data-qa={`cadastro-edicao-despesa-msg-erro-valor-recursos`}
                                        className="span_erro text-danger mt-1"> {errors.valor_recusos_acoes}</span>}</p>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <p>{errors.valor_original && exibeMsgErroValorOriginal && <span
                                        data-qa={`cadastro-edicao-despesa-msg-erro-valor-original`}
                                        className="span_erro text-danger mt-1"> {errors.valor_original}</span>}</p>
                                </div>

                                <section>
                                    <SaldoInsuficienteConta
                                        saldosInsuficientesDaConta={saldosInsuficientesDaConta}
                                        show={modalState === 'saldo-insuficiente-conta'}
                                        handleClose={()=>setModalState("close")}
                                        onSaldoInsuficienteContaTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_conta_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <TipoAplicacaoRecursoNaoAceito
                                        mensagensAceitaCusteioCapital={mensagensAceitaCusteioCapital}
                                        show={modalState === 'acao-nao-aceita-tipo-de-aplicacao'}
                                        onSalvarTipoRecursoNaoAceito={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'acao_nao_aceita_tipo_de_aplicacao_validado')
                                        }}
                                        handleClose={()=>setModalState("close")}
                                    />
                                </section>

                                <section>
                                    <SaldoInsuficiente
                                        saldosInsuficientesDaAcao={saldosInsuficientesDaAcao}
                                        show={modalState === 'saldo-insuficiente-acao'}
                                        handleClose={()=>setModalState("close")}
                                        onSaldoInsuficienteTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_acao_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <ModalDespesaConferida
                                        show={modalState === 'despesa-ja-demonstrada'}
                                        handleClose={()=>setModalState("close")}
                                        onSalvarDespesaConferida={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_demonstrada_validado')
                                        }}
                                        titulo="Despesa já demonstrada"
                                        texto="<p>Atenção. Essa despesa já foi demonstrada, caso a alteração seja gravada ela voltará a ser não demonstrada. Confirma a gravação?</p>"
                                    />
                                </section>

                                <section>
                                    <ChecarDespesaExistente
                                        show={modalState === 'despesa-ja-cadastrada'}
                                        handleClose={()=>setModalState("close")}
                                        onSalvarDespesaCadastradaTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_cadastrada_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <ModalMotivosPagamentoAntecipado
                                        show={modalState === 'pagamento-antecipado'}
                                        handleClose={()=>setModalState("close")}
                                        listaDemotivosPagamentoAntecipado={listaDemotivosPagamentoAntecipado}
                                        selectMotivosPagamentoAntecipado={selectMotivosPagamentoAntecipado}
                                        setSelectMotivosPagamentoAntecipado={setSelectMotivosPagamentoAntecipado}
                                        checkBoxOutrosMotivosPagamentoAntecipado={checkBoxOutrosMotivosPagamentoAntecipado}
                                        txtOutrosMotivosPagamentoAntecipado={txtOutrosMotivosPagamentoAntecipado}
                                        handleChangeCheckBoxOutrosMotivosPagamentoAntecipado={handleChangeCheckBoxOutrosMotivosPagamentoAntecipado}
                                        handleChangeTxtOutrosMotivosPagamentoAntecipado={handleChangeTxtOutrosMotivosPagamentoAntecipado}
                                        onSalvarMotivosAntecipadosTrue={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'pagamento_antecipado_validado')
                                        }}
                                    />
                                </section>

                                <section>
                                    <ModalDespesaIncompleta
                                        show={modalState === 'despesa-imcompleta'}
                                        handleClose={()=>setModalState("close")}
                                        onSalvarDespesaIncompleta={() => {
                                            serviceSubmitModais(values, setFieldValue, errors, 'despesa_incompleta_validado')
                                        }}
                                        titulo="Cadastro da despesa"
                                        texto="<p>O cadastro desta despesa está incompleto. Você deseja finalizá-lo agora?</p>"
                                    />
                                </section>

                                <section>
                                    <ExcluirImposto
                                        show={showExcluirImposto}
                                        cancelarExclusaoImposto={() => cancelarExclusaoImposto(setFieldValue)}
                                        handleClose={() => setShowExcluirImposto(false)}
                                    />
                                </section>
                            </form>
                        </>
                    ); /*Return metodo principal*/
                }}
            </Formik>
        </>
    )
}