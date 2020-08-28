import React, {useContext, useEffect, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {YupSignupSchemaCadastroDespesa, validaPayloadDespesas, cpfMaskContitional, calculaValorRecursoAcoes, periodoFechado} from "../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from 'react-text-mask'
import {getDespesasTabelas, criarDespesa, alterarDespesa, getEspecificacoesCapital, getEspecificacoesCusteio, getDespesaCadastrada} from "../../../../services/escolas/Despesas.service";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {useParams} from 'react-router-dom';
import {CadastroFormCusteio} from "./CadastroFormCusteio";
import {CadastroFormCapital} from "./CadastroFormCapital";
import {DespesaContext} from "../../../../context/Despesa";
import HTTP_STATUS from "http-status-codes";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import CurrencyInput from "react-currency-input";
import { AvisoCapitalModal, CancelarModal, DeletarModal, ErroGeral, PeriodoFechado, SaldoInsuficiente, SaldoInsuficienteConta, ChecarDespesaExistente, } from "../../../../utils/Modais"
import "./cadastro-de-despesas.scss"
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../utils/Loading";
import {Tags} from "../Tags";
import {metodosAuxiliares} from "../metodosAuxiliares";

export const CadastroForm = ({verbo_http}) => {

    let {origem} = useParams();
    const aux = metodosAuxiliares;

    const despesaContext = useContext(DespesaContext);

    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [show, setShow] = useState(false);
    const [showAvisoCapital, setShowAvisoCapital] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showSaldoInsuficiente, setShowSaldoInsuficiente] = useState(false);
    const [showSaldoInsuficienteConta, setShowSaldoInsuficienteConta] = useState(false);
    const [showPeriodoFechado, setShowPeriodoFechado] = useState(false);
    const [showErroGeral, setShowErroGeral] = useState(false);
    const [showDespesaCadastrada, setShowDespesaCadastrada] = useState(false);
    const [especificaoes_capital, set_especificaoes_capital] = useState("");
    const [especificacoes_custeio, set_especificacoes_custeio] = useState([]);
    const [btnSubmitDisable, setBtnSubmitDisable] = useState(false);
    const [saldosInsuficientesDaAcao, setSaldosInsuficientesDaAcao] = useState([]);
    const [saldosInsuficientesDaConta, setSaldosInsuficientesDaConta] = useState([]);
    const [readOnlyBtnAcao, setReadOnlyBtnAcao] = useState(false);
    const [readOnlyCampos, setReadOnlyCampos] = useState(false);
    const [cssEscondeDocumentoTransacao, setCssEscondeDocumentoTransacao] = useState('escondeItem');
    const [labelDocumentoTransacao, setLabelDocumentoTransacao] = useState('');
    const [loading, setLoading] = useState(true);
    const [exibeMsgErroValorRecursos, setExibeMsgErroValorRecursos] = useState(false);
    const [exibeMsgErroValorOriginal, setExibeMsgErroValorOriginal] = useState(false);
    const [numreoDocumentoReadOnly, setNumreoDocumentoReadOnly] = useState(false);

    useEffect(()=>{
        if (despesaContext.initialValues.tipo_transacao && verbo_http === "PUT"){
            aux.exibeDocumentoTransacao(despesaContext.initialValues.tipo_transacao.id, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas);
        }
        if (despesaContext.initialValues.data_documento && verbo_http === "PUT"){
            periodoFechado(despesaContext.initialValues.data_documento, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
        }
    }, [despesaContext.initialValues]);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);

            const array_tipos_custeio = resp.tipos_custeio;
            let let_especificacoes_custeio = [];

            array_tipos_custeio.map( async (tipoCusteio) => {
                const resposta = await getEspecificacoesCusteio(tipoCusteio.id);
                let_especificacoes_custeio[tipoCusteio.id] = await resposta
            });
            set_especificacoes_custeio(let_especificacoes_custeio)
        };
        carregaTabelasDespesas();
    }, []);

    useEffect(() => {
        (async function get_especificacoes_capital() {
            const resp = await getEspecificacoesCapital();
            set_especificaoes_capital(resp)
        })();
    }, []);

    useEffect(()=>{
        setLoading(false)
    }, []);

    const initialValues = () => {
        return despesaContext.initialValues;
    };

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    };

    const onShowSaldoInsuficiente = async (values, errors, setFieldValue) => {
        // Necessário atribuir o valor ao campo cpf_cnpj_fornecedor para chamar o YupSignupSchemaCadastroDespesa
        setFieldValue("cpf_cnpj_fornecedor", values.cpf_cnpj_fornecedor);

        if (errors && errors.valor_recusos_acoes){
            setExibeMsgErroValorRecursos(true)
        }else {
            setExibeMsgErroValorRecursos(false)
        }

        if (errors && errors.valor_original){
            setExibeMsgErroValorOriginal(true)
        }else {
            setExibeMsgErroValorOriginal(false)
        }

        validaPayloadDespesas(values);

        if (Object.entries(errors).length === 0 && values.cpf_cnpj_fornecedor) {

            let retorno_saldo = await aux.verificarSaldo(values, despesaContext);

            if (retorno_saldo.situacao_do_saldo === "saldo_conta_insuficiente"){
                setSaldosInsuficientesDaConta(retorno_saldo);
                setShowSaldoInsuficienteConta(true)

            }else if (retorno_saldo.situacao_do_saldo === "saldo_insuficiente") {
                setSaldosInsuficientesDaAcao(retorno_saldo.saldos_insuficientes);
                setShowSaldoInsuficiente(true);

                // Checando se depesa já foi cadastrada
            }else if (values.tipo_documento && values.numero_documento) {
                try {
                    let despesa_cadastrada = await getDespesaCadastrada(values.tipo_documento, values.numero_documento, values.cpf_cnpj_fornecedor, despesaContext.idDespesa);
                    if (despesa_cadastrada.despesa_ja_lancada){
                        setShowDespesaCadastrada(true)
                    }else {
                        onSubmit(values);
                    }
                }catch (e) {
                    console.log("Erro ao buscar despesa cadastrada ", e);
                }
            } else {
                onSubmit(values);
            }
        }
    };

    const onSubmit = async (values) => {

        setLoading(true);

        setBtnSubmitDisable(true);
        setShowSaldoInsuficiente(false);

        validaPayloadDespesas(values, despesasTabelas);

        if( despesaContext.verboHttp === "POST"){
            try {
                const response = await criarDespesa(values);
                if (response.status === HTTP_STATUS.CREATED) {
                    console.log("Operação realizada com sucesso!");
                    //resetForm({values: ""})
                    aux.getPath(origem);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }else if(despesaContext.verboHttp === "PUT"){

            try {
                const response = await alterarDespesa(values, despesaContext.idDespesa);
                if (response.status === 200) {
                    console.log("Operação realizada com sucesso!");
                    //resetForm({values: ""})
                    aux.getPath(origem);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    const validateFormDespesas = async (values) => {
        setExibeMsgErroValorRecursos(false);
        setExibeMsgErroValorOriginal(false);

        values.qtde_erros_form_despesa = document.getElementsByClassName("is_invalid").length;

        // Verifica período fechado para a receita
        if (values.data_documento){
            await periodoFechado(values.data_documento, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
        }

        const errors = {};

        // Validando se tipo de documento aceita apenas numéricos e se exibe campo Número do Documento
        if (values.tipo_documento){
            let exibe_campo_numero_documento;
            let so_numeros;
            if (values.tipo_documento.id){
                so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento.id));
            }else {
                so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento));
            }

            // Verificando se exibe campo Número do Documento
            exibe_campo_numero_documento = so_numeros;
            if (exibe_campo_numero_documento && !exibe_campo_numero_documento.numero_documento_digitado){
                values.numero_documento = "";
                setNumreoDocumentoReadOnly(true)
            }else {
                setNumreoDocumentoReadOnly(false)
            }

            if (so_numeros && so_numeros.apenas_digitos && values.numero_documento){
                if (isNaN(values.numero_documento)){
                    errors.numero_documento="Este campo deve conter apenas algarismos numéricos."
                }
            }
        }

        // Verificando erros nos valores de rateios e rateios original
        if (aux.getErroValorRealizadoRateios(values) !== 0){
            let diferenca = Number(aux.getErroValorRealizadoRateios(values)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            errors.valor_recusos_acoes = 'O total das despesas classificadas deve corresponder ao valor total dos recursos do Programa. Difrerença de  R$ '+ diferenca;
        }
        if (aux.getErroValorOriginalRateios(values) !== 0){
            let diferenca = Number(aux.getErroValorOriginalRateios(values)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            errors.valor_original = "O total das despesas originais deve corresponder ao valor total dos recursos originais. Difrerença de  R$ " + diferenca
        }
        return errors;
    };

    return (
        <>
            {loading ?
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="50"
                    marginBottom="0"
                />
                :
                <Formik
                    initialValues={initialValues()}
                    validationSchema={YupSignupSchemaCadastroDespesa}
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
                                {props.values.qtde_erros_form_despesa > 0 && despesaContext.verboHttp === "PUT" &&
                                <div className="col-12 barra-status-erros pt-1 pb-1">
                                    <p className="titulo-status pt-1 pb-1 mb-0">O cadastro
                                        possui {props.values.qtde_erros_form_despesa} campos não preechidos, você pode
                                        completá-los agora ou terminar depois.</p>
                                </div>
                                }
                                <form onSubmit={props.handleSubmit}>
                                    <div className="form-row">
                                        <div className="col-12 col-md-6 mt-4">
                                            <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                            <MaskedInput
                                                disabled={readOnlyCampos}
                                                mask={(valor) => cpfMaskContitional(valor)}
                                                value={props.values.cpf_cnpj_fornecedor}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    aux.get_nome_razao_social(e.target.value, setFieldValue)
                                                }
                                                }
                                                onBlur={props.handleBlur}
                                                name="cpf_cnpj_fornecedor" id="cpf_cnpj_fornecedor" type="text"
                                                className={`${!props.values.cpf_cnpj_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                placeholder="Digite o número do CNPJ ou CPF (apenas algarismos)"
                                            />
                                            {props.errors.cpf_cnpj_fornecedor && <span
                                                className="span_erro text-danger mt-1"> {props.errors.cpf_cnpj_fornecedor}</span>}
                                        </div>
                                        <div className="col-12 col-md-6  mt-4">
                                            <label htmlFor="nome_fornecedor">Razão social do fornecedor</label>
                                            <input
                                                value={props.values.nome_fornecedor}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                name="nome_fornecedor" id="nome_fornecedor" type="text"
                                                className={`${!props.values.nome_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                placeholder="Digite o nome"
                                                disabled={readOnlyCampos}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="tipo_documento">Tipo de documento</label>
                                            <select
                                                value={
                                                    props.values.tipo_documento !== null ? (
                                                        props.values.tipo_documento === "object" ? props.values.tipo_documento.id : props.values.tipo_documento.id
                                                    ) : ""
                                                }
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                name='tipo_documento'
                                                id='tipo_documento'
                                                className={`${!props.values.tipo_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                disabled={readOnlyCampos}
                                            >
                                                <option key={0} value="">Selecione o tipo</option>
                                                {despesasTabelas.tipos_documento && despesasTabelas.tipos_documento.map(item =>
                                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                                )
                                                }
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="data_documento">Data do documento</label>
                                            <DatePickerField
                                                name="data_documento"
                                                id="data_documento"
                                                value={values.data_documento != null ? values.data_documento : ""}
                                                onChange={setFieldValue}
                                                about={despesaContext.verboHttp}
                                            />
                                            {props.errors.data_documento && <span className="span_erro text-danger mt-1"> {props.errors.data_documento}</span>}
                                        </div>

                                        <div className="col-12 col-md-6 mt-4">
                                            <label htmlFor="numero_documento">Número do documento</label>
                                            <input
                                                value={props.values.numero_documento}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                name="numero_documento"
                                                id="numero_documento" type="text"
                                                className={`${!props.values.numero_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                placeholder="Digite o número"
                                                disabled={readOnlyCampos || numreoDocumentoReadOnly}
                                            />
                                            {props.errors.numero_documento && <span className="span_erro text-danger mt-1"> {props.errors.numero_documento}</span>}
                                        </div>

                                        <div className="col-12 col-md-6 mt-4">
                                            <label htmlFor="tipo_transacao">Tipo de transação</label>
                                            <select
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
                                                className={`${!props.values.tipo_transacao && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                disabled={readOnlyCampos}
                                            >
                                                <option key={0} value="">Selecione o tipo</option>
                                                {despesasTabelas.tipos_transacao && despesasTabelas.tipos_transacao.map(item => (
                                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="data_transacao">Data da transação</label>
                                            <DatePickerField
                                                name="data_transacao"
                                                id="data_transacao"
                                                value={values.data_transacao != null ? values.data_transacao : ""}
                                                onChange={setFieldValue}
                                                about={despesaContext.verboHttp}
                                                disabled={readOnlyCampos}
                                            />
                                            {props.errors.data_transacao &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.data_transacao}</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <div className={cssEscondeDocumentoTransacao}>
                                                <label htmlFor="documento_transacao">Número do {labelDocumentoTransacao}</label>
                                                <input
                                                    value={props.values.documento_transacao}
                                                    onChange={props.handleChange}
                                                    onBlur={props.handleBlur}
                                                    name="documento_transacao"
                                                    id="documento_transacao"
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Digite o número do documento"
                                                    disabled={readOnlyCampos}
                                                />
                                                {props.errors.documento_transacao && <span className="span_erro text-danger mt-1"> {props.errors.documento_transacao}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_original">Valor total do documento</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                //value={verbo_http === "PUT" ? props.values.valor_original : !valorOriginalAlterado && !valorRateioOriginalAlterado ? calculaValorOriginal(values) : props.values.valor_original }
                                                value={ props.values.valor_original }
                                                name="valor_original"
                                                id="valor_original"
                                                className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                selectAllOnFocus={true}
                                                onChangeEvent={(e) => {
                                                    props.handleChange(e);
                                                    aux.setValorRealizado(setFieldValue, e.target.value);
                                                }}
                                                disabled={readOnlyCampos}
                                            />
                                            {errors.valor_original && exibeMsgErroValorOriginal && <span className="span_erro text-danger mt-1"> A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_total" className="label-valor-realizado">Valor realizado</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={values.valor_total}
                                                name="valor_total"
                                                id="valor_total"
                                                className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control ${trataNumericos(props.values.valor_total) === 0 ? " input-valor-realizado-vazio" : " input-valor-realizado-preenchido"}`}
                                                selectAllOnFocus={true}
                                                onChangeEvent={(e) => {
                                                    props.handleChange(e);
                                                }}
                                                disabled={readOnlyCampos}
                                            />
                                            {props.errors.valor_total &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.valor_total}</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_recursos_proprios">Valor do recurso próprio</label>
                                            <CurrencyInput
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
                                                disabled={readOnlyCampos}
                                            />
                                            {props.errors.valor_recursos_proprios && <span
                                                className="span_erro text-danger mt-1"> {props.errors.valor_recursos_proprios}</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_recusos_acoes">Valor do PTRF</label>
                                            <Field name="valor_recusos_acoes">
                                                {({field, form, meta}) => (
                                                    <CurrencyInput
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
                                                        disabled={readOnlyCampos}
                                                    />
                                                )}
                                            </Field>
                                            {errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span className="span_erro text-danger mt-1"> A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.</span>}
                                        </div>
                                    </div>

                                    <hr/>
                                    <h2 className="subtitulo-itens-painel">Dados do gasto</h2>
                                    <p>Esse gasto se encaixa em mais de um tipo de despesa ou ação do programa?</p>
                                    <div className="form-row">
                                        <div className="col-12 col-md-3 ">
                                            <select
                                                value={props.values.mais_de_um_tipo_despesa}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    aux.setaValoresCusteioCapital(e.target.value, values, setFieldValue);
                                                    aux.setValoresRateiosOriginal(e.target.value, values, setFieldValue);
                                                }}
                                                name='mais_de_um_tipo_despesa'
                                                id='mais_de_um_tipo_despesa'
                                                className={`${!props.values.mais_de_um_tipo_despesa && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                disabled={readOnlyCampos}
                                            >
                                                <option value="">Selecione</option>
                                                <option value="nao">Não</option>
                                                <option value="sim">Sim</option>
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
                                                            <div className="form-row">

                                                                <div className="col-12 mt-4 ml-0">
                                                                    <p className='mb-0'><strong>Despesa {index + 1}</strong>
                                                                    </p>
                                                                    <hr className='mt-0 mb-1'/>
                                                                </div>

                                                                <div className="col-12 col-md-6 mt-4">

                                                                    <label htmlFor="aplicacao_recurso">Tipo de aplicação do recurso</label>
                                                                    <select
                                                                        value={rateio.aplicacao_recurso ? rateio.aplicacao_recurso : ""}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                            aux.handleAvisoCapital(e.target.value, setShowAvisoCapital);
                                                                            aux.setaValoresCusteioCapital(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
                                                                            aux.setValoresRateiosOriginal(props.values.mais_de_um_tipo_despesa, values, setFieldValue);

                                                                        }}
                                                                        name={`rateios[${index}].aplicacao_recurso`}
                                                                        id='aplicacao_recurso'
                                                                        className={`${!rateio.aplicacao_recurso && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                                        disabled={readOnlyCampos}
                                                                    >
                                                                        <option key={0} value="">Escolha uma opção</option>
                                                                        {despesasTabelas.tipos_aplicacao_recurso && despesasTabelas.tipos_aplicacao_recurso.map(item => (
                                                                            <option key={item.id}
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
                                                                    />
                                                                ) :
                                                                rateio.aplicacao_recurso && rateio.aplicacao_recurso === 'CAPITAL' ? (
                                                                    <CadastroFormCapital
                                                                        formikProps={props}
                                                                        rateio={rateio}
                                                                        index={index}
                                                                        despesasTabelas={despesasTabelas}
                                                                        especificaoes_capital={especificaoes_capital}
                                                                        verboHttp={despesaContext.verboHttp}
                                                                        disabled={readOnlyCampos}
                                                                        errors={errors}
                                                                        exibeMsgErroValorRecursos={exibeMsgErroValorRecursos}
                                                                        exibeMsgErroValorOriginal={exibeMsgErroValorOriginal}
                                                                    />
                                                                ) : null}

                                                            {index >= 1 && values.rateios.length > 1 && (
                                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                                        onClick={() => remove(index)}
                                                                    >
                                                                        - Remover Despesa
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div> /*div key*/
                                                    )
                                                })}

                                                {props.values.mais_de_um_tipo_despesa === "sim" &&
                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                        onChange={(e) => {
                                                            props.handleChange(e);
                                                            aux.handleAvisoCapital(e.target.value, setShowAvisoCapital);
                                                            aux.setaValoresCusteioCapital(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
                                                            aux.setValoresRateiosOriginal(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
                                                        }}
                                                        onClick={() =>  {
                                                            push(
                                                                {
                                                                    associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                                                    escolha_tags:"",
                                                                    tag:"",
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
                                        <button type="reset" onClick={()=>aux.onShowModal(setShow)}
                                                className="btn btn btn-outline-success mt-2 mr-2">Voltar
                                        </button>
                                        {despesaContext.idDespesa
                                            ? <button disabled={readOnlyBtnAcao} type="reset" onClick={()=>aux.onShowDeleteModal(setShowDelete)}
                                                      className="btn btn btn-danger mt-2 mr-2">Deletar</button>
                                            : null}
                                        <button disabled={btnSubmitDisable || readOnlyBtnAcao} type="button"
                                                onClick={() => onShowSaldoInsuficiente(values, errors, setFieldValue, {resetForm})}
                                                className="btn btn-success mt-2">Salvar
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <p>{errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span className="span_erro text-danger mt-1"> {errors.valor_recusos_acoes}</span>}</p>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <p>{errors.valor_original && exibeMsgErroValorOriginal && <span className="span_erro text-danger mt-1"> {errors.valor_original}</span>}</p>
                                    </div>

                                    <section>
                                        <SaldoInsuficiente
                                            saldosInsuficientesDaAcao={saldosInsuficientesDaAcao}
                                            show={showSaldoInsuficiente} handleClose={()=>aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                                            onSaldoInsuficienteTrue={() => onSubmit(values, {resetForm})}
                                        />
                                    </section>
                                    <section>
                                        <SaldoInsuficienteConta
                                            saldosInsuficientesDaConta={saldosInsuficientesDaConta}
                                            show={showSaldoInsuficienteConta}
                                            handleClose={()=>aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                                            onSaldoInsuficienteContaTrue={() => onSubmit(values, {resetForm})}
                                        />
                                    </section>
                                    <section>
                                        <ChecarDespesaExistente
                                            show={showDespesaCadastrada}
                                            handleClose={()=>setShowDespesaCadastrada(false)}
                                            onSalvarDespesaCadastradaTrue={ () => onSubmit(values, {resetForm}) }/>
                                    </section>
                                </form>
                            </>
                        ); /*Return metodo principal*/
                    }}
                </Formik>
            }
            <section>
                <CancelarModal show={show} handleClose={()=>aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)} onCancelarTrue={()=>aux.onCancelarTrue (setShow, setLoading, origem)}/>
            </section>
            <section>
                <AvisoCapitalModal show={showAvisoCapital} handleClose={()=>aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)} />
            </section>
            {despesaContext.idDespesa
                ?
                <DeletarModal show={showDelete} handleClose={()=>aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)} onDeletarTrue={()=>aux.onDeletarTrue(setShowDelete, setLoading, despesaContext, origem)}/>
                : null
            }
            <section>
                <PeriodoFechado show={showPeriodoFechado} handleClose={()=>aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}/>
            </section>
            <section>
                <ErroGeral show={showErroGeral} handleClose={()=>aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}/>
            </section>
        </>
    );
};