import React, {useContext, useEffect, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {YupSignupSchemaCadastroDespesa, validaPayloadDespesas, cpfMaskContitional, calculaValorRecursoAcoes, round, periodoFechado, calculaValorOriginal} from "../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from 'react-text-mask'
import {getDespesasTabelas, criarDespesa, alterarDespesa, deleteDespesa, getEspecificacoesCapital, getEspecificacoesCusteio, getNomeRazaoSocial, getDespesaCadastrada} from "../../../../services/escolas/Despesas.service";
import {getVerificarSaldo} from "../../../../services/escolas/RateiosDespesas.service";
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

export const CadastroForm = ({verbo_http}) => {

    let {origem} = useParams();

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
    const [valorOriginalAlterado, setValorOriginalAlterado] = useState(false);
    const [valorRateioOriginalAlterado, setValorRateioOriginalAlterado] = useState(false);

    useEffect(()=>{
        if (despesaContext.initialValues.tipo_transacao && verbo_http === "PUT"){
            exibeDocumentoTransacao(despesaContext.initialValues.tipo_transacao.id);
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

    const getPath = () => {
        let path;
        if (origem === undefined){
            path = `/lista-de-despesas`;
        }else {
            path = `/detalhe-das-prestacoes`;
        }
        window.location.assign(path)
    };

    const verificarSaldo = async (payload) => {
        return await getVerificarSaldo(payload, despesaContext.idDespesa);
    };

    const onCancelarTrue = () => {
        setShow(false);
        setLoading(true);
        getPath();
    };

    const onHandleClose = () => {
        setShow(false);
        setShowDelete(false);
        setShowAvisoCapital(false);
        setShowSaldoInsuficiente(false);
        setShowPeriodoFechado(false);
        setShowSaldoInsuficienteConta(false);
    };

    const onShowModal = () => {
        setShow(true);
    };

    const onShowAvisoCapitalModal = () => {
        setShowAvisoCapital(true);
    };

    const onShowDeleteModal = () => {
        setShowDelete(true);
    };

    const onDeletarTrue = () => {
        setShowDelete(false);
        setLoading(true);
        deleteDespesa(despesaContext.idDespesa)
        .then(response => {
            console.log("Despesa deletada com sucesso.");
            getPath();
        })
        .catch(error => {
            console.log(error);
            setLoading(false);
            alert("Um Problema Ocorreu. Entre em contato com a equipe para reportar o problema, obrigado.");
        });
    };

    const handleAvisoCapital = (value) => {
        if (value === "CAPITAL"){
            onShowAvisoCapitalModal()
        }
    };

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    };

    const get_nome_razao_social = async (cpf_cnpj, setFieldValue) => {
        let resp = await getNomeRazaoSocial(cpf_cnpj);
        if (resp && resp.length > 0 && resp[0].nome){
            setFieldValue("nome_fornecedor", resp[0].nome);
        }else {
            setFieldValue("nome_fornecedor", "");
        }
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

            let retorno_saldo = await verificarSaldo(values);

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
                    getPath();
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
                    getPath();
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    const setaValoresCusteioCapital = (mais_de_um_tipo_de_despesa = null, values, setFieldValue) =>{
        if (mais_de_um_tipo_de_despesa && mais_de_um_tipo_de_despesa === 'nao'){
            setFieldValue('rateios[0].valor_rateio', calculaValorRecursoAcoes(values));
            setFieldValue('rateios[0].quantidade_itens_capital', 1);
            setFieldValue('rateios[0].valor_item_capital', calculaValorRecursoAcoes(values));
        }else {
            setFieldValue('rateios[0].valor_rateio', 0);
            setFieldValue('rateios[0].quantidade_itens_capital', "");
            setFieldValue('rateios[0].valor_item_capital', 0);
        }
    };


    const setValorOriginal = (values)=>{
        //debugger
        let valor_dos_rateios_original=0;
        if (valorRateioOriginalAlterado){
            values.rateios.map((rateio)=>{
                console.log('Dentro do array ', rateio.valor_original)
                valor_dos_rateios_original = valor_dos_rateios_original + trataNumericos(rateio.valor_original)
            })

            console.log('setValorOriginal ', valor_dos_rateios_original)
            values.valor_original = valor_dos_rateios_original
        }



    };


    const setValoresRateiosOriginal = (values) =>{

        if (!valorRateioOriginalAlterado){
            let valor_ptfr_original;
            let valor_rateio;

            if (verbo_http === "POST"){
                if (!valorOriginalAlterado){
                    valor_ptfr_original = trataNumericos(values.valor_total) - trataNumericos(values.valor_recursos_proprios);
                }else{
                    valor_ptfr_original = trataNumericos(values.valor_original)
                }
            }else{
                valor_ptfr_original = trataNumericos(values.valor_original)
            }

            valor_rateio = valor_ptfr_original / values.rateios.length;

            values.rateios.map((rateio)=>{
                if (rateio.aplicacao_recurso){
                    rateio.valor_original = valor_rateio
                }
            })
        }


    };

    const getErroValorOriginalRateios = (values) =>{
        let valor_ptfr_original;

        if (verbo_http === "POST"){
            if (!valorOriginalAlterado){
                valor_ptfr_original = trataNumericos(values.valor_total) - trataNumericos(values.valor_recursos_proprios);
            }else{
                valor_ptfr_original = trataNumericos(values.valor_original)
            }
        }else{
            valor_ptfr_original = trataNumericos(values.valor_original)
        }

        let valor_total_dos_rateios_original = 0;
        let valor_total_dos_rateios_capital_original = 0;
        let valor_total_dos_rateios_custeio_original = 0;

        values.rateios.map((rateio)=>{
            if (rateio.aplicacao_recurso === "CAPITAL"){
                valor_total_dos_rateios_capital_original = valor_total_dos_rateios_capital_original + trataNumericos(rateio.valor_original)
            }else{
                valor_total_dos_rateios_custeio_original = valor_total_dos_rateios_custeio_original + trataNumericos(rateio.valor_original)
            }
        });

        valor_total_dos_rateios_original = valor_total_dos_rateios_capital_original + valor_total_dos_rateios_custeio_original
        return round(valor_ptfr_original, 2) !== round(valor_total_dos_rateios_original, 2)

    };

    const getErroValorRealizadoRateios = (values) =>{

        let var_valor_recursos_acoes = trataNumericos(values.valor_total) - trataNumericos(values.valor_recursos_proprios);
        let var_valor_total_dos_rateios = 0;
        let var_valor_total_dos_rateios_capital = 0;
        let var_valor_total_dos_rateios_custeio = 0;

        values.rateios.map((rateio) => {
            if (rateio.aplicacao_recurso === "CAPITAL"){
                var_valor_total_dos_rateios_capital = var_valor_total_dos_rateios_capital + trataNumericos(rateio.quantidade_itens_capital) * trataNumericos(rateio.valor_item_capital)
            }else{
                var_valor_total_dos_rateios_custeio = var_valor_total_dos_rateios_custeio + trataNumericos(rateio.valor_rateio)
            }
        });

        var_valor_total_dos_rateios = var_valor_total_dos_rateios_capital + var_valor_total_dos_rateios_custeio;

        return round(var_valor_recursos_acoes, 2) !== round(var_valor_total_dos_rateios, 2);

    };

    const validateFormDespesas = async (values) => {
        setExibeMsgErroValorRecursos(false);
        setExibeMsgErroValorOriginal(false);

        values.qtde_erros_form_despesa = document.getElementsByClassName("is_invalid").length;

        setValoresRateiosOriginal(values);
        setValorOriginal(values)

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
        if (getErroValorRealizadoRateios(values)){
            errors.valor_recusos_acoes = 'O total das despesas classificadas deve corresponder ao valor total dos recursos do Programa.';
        }
        if (getErroValorOriginalRateios(values)){
            errors.valor_original = "ERRO VALOR ORIGINAL"
        }

        return errors;
    };

    const exibeDocumentoTransacao = (valor) => {
        if (valor){
            let exibe_documento_transacao =  despesasTabelas.tipos_transacao.find(element => element.id === Number(valor));
            if (exibe_documento_transacao.tem_documento){
                setCssEscondeDocumentoTransacao("");
                setLabelDocumentoTransacao(exibe_documento_transacao.nome);
            }else {
                setCssEscondeDocumentoTransacao("escondeItem");
            }
        }else {
            setCssEscondeDocumentoTransacao("escondeItem");
        }
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
                                                    get_nome_razao_social(e.target.value, setFieldValue)

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
                                                //disabled={readOnlyCampos}
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
                                                //onChange={props.handleChange}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    exibeDocumentoTransacao(e.target.value)
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
                                            <label htmlFor="valor_total">Valor total do documento</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={props.values.valor_total}
                                                name="valor_total"
                                                id="valor_total"
                                                className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                onChangeEvent={props.handleChange}
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
                                                value={props.values.valor_recursos_proprios}
                                                name="valor_recursos_proprios"
                                                id="valor_recursos_proprios"
                                                className="form-control"
                                                onChangeEvent={props.handleChange}
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

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_original">Valor do ORIGINAL</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                //value={props.values.valor_original }
                                                value={verbo_http === "PUT" ? props.values.valor_original : !valorOriginalAlterado ? calculaValorRecursoAcoes(values) : props.values.valor_original }
                                                name="valor_original"
                                                id="valor_original"
                                                className="form-control"
                                                //onChangeEvent={props.handleChange}
                                                onChangeEvent={(e) => {
                                                    props.handleChange(e);
                                                    setValorOriginalAlterado(true)
                                                    setValorRateioOriginalAlterado(false)
                                                }}
                                                disabled={readOnlyCampos}
                                            />
                                            {errors.valor_original && exibeMsgErroValorOriginal && <span className="span_erro text-danger mt-1"> ERRO VALOR ORIGINAL DENTRO DO SPAN CADASTRO FORM</span>}
                                        </div>
                                    </div>
                                    
                                    <hr/>
                                    <h2 className="subtitulo-itens-painel">Dados do gasto</h2>
                                    <p>Esse gasto se encaixa em mais de um tipo de despesa ou ação do programa?</p>
                                    <div className="form-row">
                                        <div className="col-12 col-md-3 ">
                                            <select
                                                value={props.values.mais_de_um_tipo_despesa}
                                                //onChange={props.handleChange}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    setaValoresCusteioCapital(e.target.value, values, setFieldValue);
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
                                                                <div className="col-12">
                                                                    <Tags
                                                                        formikProps={props}
                                                                        rateio={rateio}
                                                                        rateios={values.rateios}
                                                                        index={index}
                                                                        verboHttp={despesaContext.verboHttp}
                                                                        disabled={readOnlyCampos}
                                                                        errors={errors}
                                                                        setFieldValue={setFieldValue}
                                                                        despesasTabelas={despesasTabelas}
                                                                    />
                                                                </div>
                                                                <div className="col-12 col-md-6 mt-4">

                                                                    <label htmlFor="aplicacao_recurso">Tipo de aplicação do recurso</label>
                                                                    <select
                                                                        value={rateio.aplicacao_recurso ? rateio.aplicacao_recurso : ""}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                            handleAvisoCapital(e.target.value);
                                                                            setaValoresCusteioCapital(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
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
                                                                        index={index}
                                                                        despesasTabelas={despesasTabelas}
                                                                        especificacoes_custeio={especificacoes_custeio}
                                                                        verboHttp={despesaContext.verboHttp}
                                                                        disabled={readOnlyCampos}
                                                                        errors={errors}
                                                                        exibeMsgErroValorRecursos={exibeMsgErroValorRecursos}
                                                                        exibeMsgErroValorOriginal={exibeMsgErroValorOriginal}
                                                                        setValorRateioOriginalAlterado={setValorRateioOriginalAlterado}
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
                                                        onClick={() => push(
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
                                    <div className="d-flex  justify-content-end pb-3 mt-3">
                                        <button type="reset" onClick={onShowModal}
                                                className="btn btn btn-outline-success mt-2 mr-2">Voltar
                                        </button>
                                        {despesaContext.idDespesa
                                            ? <button disabled={readOnlyBtnAcao} type="reset" onClick={onShowDeleteModal}
                                                      className="btn btn btn-danger mt-2 mr-2">Deletar</button>
                                            : null}
                                        <button disabled={btnSubmitDisable || readOnlyBtnAcao} type="button"
                                                onClick={() => onShowSaldoInsuficiente(values, errors, setFieldValue, {resetForm})}
                                                className="btn btn-success mt-2">Salvar
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        {errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span className="span_erro text-danger mt-1"> {errors.valor_recusos_acoes}</span>}
                                    </div>
                                    <section>
                                        <SaldoInsuficiente
                                            saldosInsuficientesDaAcao={saldosInsuficientesDaAcao}
                                            show={showSaldoInsuficiente} handleClose={onHandleClose}
                                            onSaldoInsuficienteTrue={() => onSubmit(values, {resetForm})}
                                        />
                                    </section>
                                    <section>
                                        <SaldoInsuficienteConta
                                            saldosInsuficientesDaConta={saldosInsuficientesDaConta}
                                            show={showSaldoInsuficienteConta}
                                            handleClose={onHandleClose}
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
                <CancelarModal show={show} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
            <section>
                <AvisoCapitalModal show={showAvisoCapital} handleClose={onHandleClose} />
            </section>
            {despesaContext.idDespesa
                ?
                <DeletarModal show={showDelete} handleClose={onHandleClose} onDeletarTrue={onDeletarTrue}/>
                : null
            }
            <section>
                <PeriodoFechado show={showPeriodoFechado} handleClose={onHandleClose}/>
            </section>
            <section>
                <ErroGeral show={showErroGeral} handleClose={onHandleClose}/>
            </section>
        </>
    );
};