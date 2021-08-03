import React, {useCallback, useContext, useEffect, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {
    validaPayloadDespesas,
    cpfMaskContitional,
    calculaValorRecursoAcoes,
    periodoFechado,
    comparaObjetos, valida_cpf_cnpj_permitindo_cnpj_zerado
} from "../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from 'react-text-mask'
import {
    getDespesasTabelas,
    criarDespesa,
    alterarDespesa,
    getEspecificacoesCapital,
    getEspecificacoesCusteio,
    getDespesaCadastrada, deleteDespesa
} from "../../../../services/escolas/Despesas.service";
import {DatePickerField} from "../../../Globais/DatePickerField";
import {useParams} from 'react-router-dom';
import {CadastroFormCusteio} from "./CadastroFormCusteio";
import {CadastroFormCapital} from "./CadastroFormCapital";
import {DespesaContext} from "../../../../context/Despesa";
import HTTP_STATUS from "http-status-codes";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import CurrencyInput from "react-currency-input";
import {
    AvisoCapitalModal,
    CancelarModal,
    DeletarModal,
    ErroGeral,
    PeriodoFechado,
    SaldoInsuficiente,
    SaldoInsuficienteConta,
    ChecarDespesaExistente,
} from "../../../../utils/Modais"
import {ModalDespesaConferida} from "./ModalDespesaJaConferida";
import "./cadastro-de-despesas.scss"
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../utils/Loading";
import {Tags} from "../Tags";
import {metodosAuxiliares} from "../metodosAuxiliares";
import {visoesService} from "../../../../services/visoes.service";
import moment from "moment";
import {getPeriodoFechado} from "../../../../services/escolas/Associacao.service";
import {ModalDespesaIncompleta} from "./ModalDespesaIncompleta";
import {ModalErroDeletarCadastroDespesa} from "./ModalErroDeletarCadastroDespesa";
import {ModalDeletarDespesa} from "./ModalDeletarDespesa";

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
    const [numeroDocumentoReadOnly, setNumeroDocumentoReadOnly] = useState(false);
    const [razaoSocialReadOnly, setRazaoSocialReadOnly] = useState(false);
    const [showDespesaConferida, setShowDespesaConferida] = useState(false);

    const [objetoParaComparacao, setObjetoParaComparacao] = useState({});

    useEffect(() => {
        if (despesaContext.initialValues.tipo_transacao && verbo_http === "PUT") {
            aux.exibeDocumentoTransacao(despesaContext.initialValues.tipo_transacao.id, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas);
        }
        if (despesaContext.initialValues.data_documento && verbo_http === "PUT") {
            periodoFechado(despesaContext.initialValues.data_documento, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
        }
        if (verbo_http === "PUT") {
            setObjetoParaComparacao(despesaContext.initialValues)
        }
    }, [despesaContext.initialValues]);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            const resp = await getDespesasTabelas();
            setDespesasTabelas(resp);

            const array_tipos_custeio = resp.tipos_custeio;
            let let_especificacoes_custeio = [];

            array_tipos_custeio.map(async (tipoCusteio) => {
                const resposta = await getEspecificacoesCusteio(tipoCusteio.id);
                let_especificacoes_custeio[tipoCusteio.id] = await resposta
            });
            set_especificacoes_custeio(let_especificacoes_custeio);
            setLoading(false);
        };
        carregaTabelasDespesas();   
    }, []);

    useEffect(() => {
        (async function get_especificacoes_capital() {
            const resp = await getEspecificacoesCapital();
            set_especificaoes_capital(resp)
        })();
    }, []);

    const initialValues = () => {
        return despesaContext.initialValues;
    };

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    };

    // Validações adicionais
    const [formErrors, setFormErrors] = useState({});
    const [enviarFormulario, setEnviarFormulario] = useState(true);
    const [showModalDespesaIncompleta, setShowModalDespesaIncompleta] = useState(false);

    const validacoesPersonalizadas = useCallback(async (values, setFieldValue) => {

        let erros = {};
        let cpf_cnpj_valido = !(!values.cpf_cnpj_fornecedor || values.cpf_cnpj_fornecedor.trim() === "" || !valida_cpf_cnpj_permitindo_cnpj_zerado(values.cpf_cnpj_fornecedor));

        
        if (!cpf_cnpj_valido) {
            erros = {
                cpf_cnpj_fornecedor: "Digite um CPF ou um CNPJ válido"
            }
            setEnviarFormulario(false)
            setBtnSubmitDisable(true)
        } else {
            aux.get_nome_razao_social(values.cpf_cnpj_fornecedor, setFieldValue, values.nome_fornecedor);
            setEnviarFormulario(true)
            setBtnSubmitDisable(false)
        }

        // Verifica período fechado para a receita
        if (values.data_documento) {
            let data = moment(values.data_documento, "YYYY-MM-DD").format("YYYY-MM-DD");
            try {
                let periodo_fechado = await getPeriodoFechado(data);

                if (!periodo_fechado.aceita_alteracoes) {
                    erros = {
                        data_documento: "Período Fechado"
                    }
                    setEnviarFormulario(false)
                    setReadOnlyBtnAcao(true);
                    setShowPeriodoFechado(true);
                    setReadOnlyCampos(true);
                } else {
                    setEnviarFormulario(true)
                    setReadOnlyBtnAcao(false);
                    setShowPeriodoFechado(false);
                    setReadOnlyCampos(false);
                }
            } catch (e) {
                setReadOnlyBtnAcao(true);
                setShowPeriodoFechado(true);
                setReadOnlyCampos(true);
                onShowErroGeral();
                console.log("Erro ao buscar perído ", e)
            }
        }
        return erros;
    }, [aux])

    const eh_despesa_sem_comprovacao_fiscal = (cpf_cnpj) => {
        if(cpf_cnpj == "00.000.000/0000-00"){
            return true;
        }

        return false;
    }

    const onShowSaldoInsuficiente = async (values, errors, setFieldValue) => {
        values.despesa_incompleta = document.getElementsByClassName("despesa_incompleta").length

        if (errors && errors.valor_recusos_acoes) {
            setExibeMsgErroValorRecursos(true)
        } else {
            setExibeMsgErroValorRecursos(false)
        }

        if (errors && errors.valor_original) {
            setExibeMsgErroValorOriginal(true)
        } else {
            setExibeMsgErroValorOriginal(false)
        }

        validaPayloadDespesas(values);


        if (Object.entries(errors).length === 0) {

            setFormErrors(await validacoesPersonalizadas(values, setFieldValue));
            let erros_personalizados = await validacoesPersonalizadas(values, setFieldValue)

            if (values.despesa_incompleta > 0 && enviarFormulario && Object.keys(erros_personalizados).length === 0) {
                setShowModalDespesaIncompleta(true)

            }else if (values.data_documento) {
                let retorno_saldo = await aux.verificarSaldo(values, despesaContext);

                if (retorno_saldo.situacao_do_saldo === "saldo_conta_insuficiente" ||
                    retorno_saldo.situacao_do_saldo === "lancamento_anterior_implantacao") {
                    setSaldosInsuficientesDaConta(retorno_saldo);
                    setShowSaldoInsuficienteConta(true)

                } else if (retorno_saldo.situacao_do_saldo === "saldo_insuficiente") {
                    setSaldosInsuficientesDaAcao(retorno_saldo.saldos_insuficientes);
                    setShowSaldoInsuficiente(true);

                    // Checando se despesa já foi conferida
                } else if (values.rateios.find(element => element.conferido)) {
                    setShowDespesaConferida(true)

                    // Checando se despesa já foi cadastrada
                } else if (values.tipo_documento && values.numero_documento) {
                    try {
                        let despesa_cadastrada = await getDespesaCadastrada(values.tipo_documento, values.numero_documento, values.cpf_cnpj_fornecedor, despesaContext.idDespesa);
                        if (despesa_cadastrada.despesa_ja_lancada) {
                            setShowDespesaCadastrada(true)
                        } else {
                            onSubmit(values, setFieldValue);
                        }
                    } catch (e) {
                        console.log("Erro ao buscar despesa cadastrada ", e);
                    }
                } else {
                    onSubmit(values, setFieldValue);
                }
            } else {
                onSubmit(values, setFieldValue)
            }
        }
    };

    const onSubmit = async (values, setFieldValue) => {

        // Inclusão de validações personalizadas para reduzir o numero de requisições a API Campo: cpf_cnpj_fornecedor
        // Agora o campo cpf_cnpj_fornecedor, é validado no onBlur e quando o form tenta ser submetido
        // A chamada a api /api/fornecedores/?uuid=&cpf_cnpj=${cpf_cnpj}, só é realizada quando um cpf for válido
        setFormErrors(await validacoesPersonalizadas(values, setFieldValue));
        let erros_personalizados = await validacoesPersonalizadas(values, setFieldValue)

        if (enviarFormulario && Object.keys(erros_personalizados).length === 0) {

            setLoading(true);

            setBtnSubmitDisable(true);
            setShowSaldoInsuficiente(false);

            validaPayloadDespesas(values, despesasTabelas);

            if (despesaContext.verboHttp === "POST") {
                try {
                    const response = await criarDespesa(values);
                    if (response.status === HTTP_STATUS.CREATED) {
                        console.log("Operação realizada com sucesso!");
                        aux.getPath(origem);
                    } else {
                        setLoading(false);
                    }
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            } else if (despesaContext.verboHttp === "PUT") {

                try {
                    const response = await alterarDespesa(values, despesaContext.idDespesa);
                    if (response.status === 200) {
                        console.log("Operação realizada com sucesso!");
                        aux.getPath(origem);
                    } else {
                        setLoading(false);
                    }
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            }
        }
    };

    const validateFormDespesas = async (values) => {

        values.qtde_erros_form_despesa = document.getElementsByClassName("is_invalid").length;

        const errors = {};

        // Validando se tipo de documento aceita apenas numéricos e se exibe campo Número do Documento
        if (values.tipo_documento) {
            let exibe_campo_numero_documento;
            let so_numeros;
            // verificando se despesasTabelas já está preenchido
            if (despesasTabelas && despesasTabelas.tipos_documento) {
                if (values.tipo_documento.id) {
                    so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento.id));
                } else {
                    so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento));
                }
            }

            // Verificando se exibe campo Número do Documento
            exibe_campo_numero_documento = so_numeros;
            if (exibe_campo_numero_documento && !exibe_campo_numero_documento.numero_documento_digitado) {
                values.numero_documento = "";
                setNumeroDocumentoReadOnly(true)
            } else {
                setNumeroDocumentoReadOnly(false)
            }

            if (so_numeros && so_numeros.apenas_digitos && values.numero_documento) {
                if (isNaN(values.numero_documento)) {
                    errors.numero_documento = "Este campo deve conter apenas algarismos numéricos."
                }
            }
        }

        // Verificando erros nos valores de rateios e rateios original
        if (await aux.getErroValorRealizadoRateios(values) !== 0) {
            let diferenca = Number(aux.getErroValorRealizadoRateios(values)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            errors.valor_recusos_acoes = 'O total das despesas classificadas deve corresponder ao valor total dos recursos do Programa. Diferença de  R$ ' + diferenca;
        }
        if (await aux.getErroValorOriginalRateios(values) !== 0) {
            let diferenca = Number(aux.getErroValorOriginalRateios(values)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            errors.valor_original = "O total das despesas originais deve corresponder ao valor total dos recursos originais. Diferença de  R$ " + diferenca
        }
        return errors;
    };

    const onCancelarTrue = () => {
        setShow(false);
        aux.getPath(origem);
    };

    const onShowModal = () => {
        setShow(true);
    };

    const setReadOnlyRazaoSocial = (value) => {
        if(eh_despesa_sem_comprovacao_fiscal(value)){
            setRazaoSocialReadOnly(true);
        }
        else{
            setRazaoSocialReadOnly(false);
        }
    }

    const houveAlteracoes = (values) => {
        return !comparaObjetos(values, objetoParaComparacao)
    }

    const [showModalErroDeletarDespesa, setShowModalErroDeletarDespesa] = useState(false)
    const [textoModalErroDeletarDespesa, setTextoModalErroDeletarDespesa] = useState('')

    const onDeletarTrue = async (setShowDelete, setLoading, despesaContext, origem) => {
        setShowDelete(false);
        setLoading(true);

        try {
            await deleteDespesa(despesaContext.idDespesa)
            console.log("Despesa deletada com sucesso.");
            aux.getPath(origem);
        }catch (error){
            console.log(error.response);
            let texto_erro = ''
            if (error && error.response && error.response.data && error.response.data.error && error.response.data.error.itens_erro && error.response.data.error.itens_erro.length > 0){
                texto_erro += '<p class="mb-2">Despesa não pode ser apagada porque os seguintes itens fazem referência a ela:</p>'
                error.response.data.error.itens_erro.map((erro)=>(
                    texto_erro += `<p class="mb-1"><small>${erro}</small></p>`
                ))
            }else {
                texto_erro += '<p class="mb-0">Despesa não pode ser apagada porque é referenciada no sistema</p>'
            }
            setTextoModalErroDeletarDespesa(texto_erro)
            setShowModalErroDeletarDespesa(true)
            setLoading(false);
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
                                        <p className="titulo-status pt-1 pb-1 mb-0">O cadastro possui {props.values.qtde_erros_form_despesa} campos não preechidos, você pode completá-los agora ou terminar depois.</p>
                                    </div>
                                }
                                <form onSubmit={props.handleSubmit}>
                                    <div className="form-row">
                                        <div className="col-12 col-md-6 mt-4">
                                            <label htmlFor="cpf_cnpj_fornecedor">CNPJ ou CPF do fornecedor</label>
                                            <MaskedInput
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                mask={(valor) => cpfMaskContitional(valor)}
                                                value={props.values.cpf_cnpj_fornecedor}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                }}
                                                onBlur={async () => {
                                                    setFormErrors(await validacoesPersonalizadas(values, setFieldValue));
                                                    setReadOnlyRazaoSocial(props.values.cpf_cnpj_fornecedor);
                                                }}
                                                onClick={() => {
                                                    setFormErrors({cpf_cnpj_fornecedor: ""})
                                                }}
                                                name="cpf_cnpj_fornecedor" id="cpf_cnpj_fornecedor" type="text"
                                                className={`${!props.values.cpf_cnpj_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.cpf_cnpj_fornecedor && 'despesa_incompleta'} form-control`}
                                                placeholder="Digite o número do CNPJ ou CPF (apenas algarismos)"
                                            />
                                            {/* Validações personalizadas */}
                                            {formErrors.cpf_cnpj_fornecedor && <p className='mb-0'><span className="span_erro text-danger mt-1">{formErrors.cpf_cnpj_fornecedor}</span>
                                            </p>}
                                        </div>
                                        <div className="col-12 col-md-6  mt-4">
                                            <label htmlFor="nome_fornecedor">Razão social do fornecedor</label>
                                            <input
                                                readOnly={razaoSocialReadOnly}
                                                value={props.values.nome_fornecedor}
                                                onChange={props.handleChange}
                                                onBlur={props.handleBlur}
                                                name="nome_fornecedor" id="nome_fornecedor" type="text"
                                                className={`${!props.values.nome_fornecedor && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.nome_fornecedor && 'despesa_incompleta'} form-control`}
                                                placeholder="Digite o nome"
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                className={
                                                    eh_despesa_sem_comprovacao_fiscal(props.values.cpf_cnpj_fornecedor) 
                                                    ? "form-control"
                                                    : `${!props.values.tipo_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.tipo_documento && "despesa_incompleta"} form-control`
                                                }
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                onCalendarClose={async () => {
                                                    setFormErrors(await validacoesPersonalizadas(values, setFieldValue));
                                                }}
                                                className={
                                                    eh_despesa_sem_comprovacao_fiscal(props.values.cpf_cnpj_fornecedor) 
                                                    ? "form-control"
                                                    : `${!props.values.data_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!props.values.data_documento && "despesa_incompleta"} form-control`
                                                }
                                                about={despesaContext.verboHttp}
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                className={
                                                    eh_despesa_sem_comprovacao_fiscal(props.values.cpf_cnpj_fornecedor) 
                                                    ? "form-control"
                                                    : `${!numeroDocumentoReadOnly && !props.values.numero_documento && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!numeroDocumentoReadOnly && !props.values.numero_documento && "despesa_incompleta"} form-control`
                                                }
                                                placeholder={numeroDocumentoReadOnly ? "" : "Digite o número"}
                                                disabled={readOnlyCampos || numeroDocumentoReadOnly || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                className={`${!props.values.tipo_transacao && despesaContext.verboHttp === "PUT" && "is_invalid "} ${ !props.values.tipo_transacao && "despesa_incompleta"} form-control`}
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                className={`${ !values.data_transacao && verbo_http === "PUT" ? 'is_invalid' : ""} ${ !values.data_transacao && "despesa_incompleta"} form-control`}
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                            />
                                            {props.errors.data_transacao &&
                                            <span
                                                className="span_erro text-danger mt-1"> {props.errors.data_transacao}</span>}
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
                                                    disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                />
                                                {props.errors.documento_transacao && <span
                                                    className="span_erro text-danger mt-1"> {props.errors.documento_transacao}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_original_form_principal">Valor total do documento</label>
                                            <CurrencyInput
                                                allowNegative={false}
                                                prefix='R$'
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                value={props.values.valor_original}
                                                name="valor_original"
                                                id="valor_original_form_principal"
                                                className={`${trataNumericos(props.values.valor_total) === 0 && despesaContext.verboHttp === "PUT" && "is_invalid "} ${ trataNumericos(props.values.valor_total) === 0 && "despesa_incompleta"} form-control`}
                                                selectAllOnFocus={true}
                                                onChangeEvent={(e) => {
                                                    props.handleChange(e);
                                                    aux.setValorRealizado(setFieldValue, e.target.value);
                                                }}
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                            />
                                            {props.errors.valor_original && exibeMsgErroValorOriginal &&
                                            <span className="span_erro text-danger mt-1"> A soma dos valores originais do rateio não está correspondendo ao valor total original utilizado com recursos do Programa.</span>}
                                        </div>

                                        <div className="col-12 col-md-3 mt-4">
                                            <label htmlFor="valor_total" className="label-valor-realizado">Valor
                                                realizado</label>
                                            <CurrencyInput
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
                                                className="span_erro text-danger mt-1"> {props.errors.valor_total}</span>}
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
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                        disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                    />
                                                )}
                                            </Field>
                                            {errors.valor_recusos_acoes && exibeMsgErroValorRecursos &&
                                            <span className="span_erro text-danger mt-1"> A soma dos valores do rateio não está correspondendo ao valor total utilizado com recursos do Programa.</span>}
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
                                                className={`${!props.values.mais_de_um_tipo_despesa && despesaContext.verboHttp === "PUT" && "is_invalid "} ${!values.mais_de_um_tipo_despesa && "despesa_incompleta"} form-control`}
                                                disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                                                    <p className='mb-0'>
                                                                        <strong>Despesa {index + 1}</strong>
                                                                    </p>
                                                                    <hr className='mt-0 mb-1'/>
                                                                </div>

                                                                <div className="col-12 col-md-6 mt-4">

                                                                    <label htmlFor={`aplicacao_recurso_${index}`}>Tipo de aplicação do recurso</label>
                                                                    <select
                                                                        value={rateio.aplicacao_recurso ? rateio.aplicacao_recurso : ""}
                                                                        onChange={(e) => {
                                                                            props.handleChange(e);
                                                                            aux.handleAvisoCapital(e.target.value, setShowAvisoCapital);
                                                                            aux.setaValoresCusteioCapital(props.values.mais_de_um_tipo_despesa, values, setFieldValue);
                                                                            aux.setValoresRateiosOriginal(props.values.mais_de_um_tipo_despesa, values, setFieldValue);

                                                                        }}
                                                                        name={`rateios[${index}].aplicacao_recurso`}
                                                                        id={`aplicacao_recurso_${index}`}
                                                                        className={`${!rateio.aplicacao_recurso && despesaContext.verboHttp === "PUT" && "is_invalid "} form-control`}
                                                                        disabled={readOnlyCampos || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                                                    >
                                                                        <option key={0} value="">Escolha uma opção
                                                                        </option>
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
                                                                        eh_despesa_sem_comprovacao_fiscal={eh_despesa_sem_comprovacao_fiscal}
                                                                        cpf_cnpj={props.values.cpf_cnpj_fornecedor}
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
                                                                    />
                                                                ) : null}

                                                            {index >= 1 && values.rateios.length > 1 && (
                                                                <div
                                                                    className="d-flex  justify-content-start mt-3 mb-3">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                                        onClick={() => remove(index)}
                                                                        disabled={!visoesService.getPermissoes(['delete_despesa'])}
                                                                    >
                                                                        - Remover Despesa
                                                                    </button>
                                                                </div>
                                                            )}
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
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div> /*div key*/
                                                    )
                                                })}

                                                {props.values.mais_de_um_tipo_despesa === "sim" &&
                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn btn-outline-success mt-2 mr-2"
                                                        disabled={![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
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
                                        <button type="reset"
                                                onClick={houveAlteracoes(values) ? onShowModal : onCancelarTrue}
                                                className="btn btn btn-outline-success mt-2 mr-2">Voltar
                                        </button>
                                        {despesaContext.idDespesa
                                            ? <button
                                                disabled={readOnlyBtnAcao || !visoesService.getPermissoes(["delete_despesa"])}
                                                type="reset" onClick={() => aux.onShowDeleteModal(setShowDelete)}
                                                className="btn btn btn-danger mt-2 mr-2"
                                            >Deletar
                                            </button>
                                            : null}
                                        <button
                                            disabled={!props.values.cpf_cnpj_fornecedor || btnSubmitDisable || readOnlyBtnAcao || ![['add_despesa'], ['change_despesa']].some(visoesService.getPermissoes)}
                                            type="button"
                                            onClick={() => onShowSaldoInsuficiente(values, errors, setFieldValue, {resetForm})}
                                            className="btn btn-success mt-2">Salvar
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <p>{errors.valor_recusos_acoes && exibeMsgErroValorRecursos && <span
                                            className="span_erro text-danger mt-1"> {errors.valor_recusos_acoes}</span>}</p>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <p>{errors.valor_original && exibeMsgErroValorOriginal && <span
                                            className="span_erro text-danger mt-1"> {errors.valor_original}</span>}</p>
                                    </div>

                                    <section>
                                        <SaldoInsuficiente
                                            saldosInsuficientesDaAcao={saldosInsuficientesDaAcao}
                                            show={showSaldoInsuficiente}
                                            handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                                            onSaldoInsuficienteTrue={() => onSubmit(values, setFieldValue)}
                                        />
                                    </section>
                                    <section>
                                        <SaldoInsuficienteConta
                                            saldosInsuficientesDaConta={saldosInsuficientesDaConta}
                                            show={showSaldoInsuficienteConta}
                                            handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                                            onSaldoInsuficienteContaTrue={() => onSubmit(values, setFieldValue)}
                                        />
                                    </section>
                                    <section>
                                        <ChecarDespesaExistente
                                            show={showDespesaCadastrada}
                                            handleClose={() => setShowDespesaCadastrada(false)}
                                            onSalvarDespesaCadastradaTrue={() => onSubmit(values, setFieldValue)}/>
                                    </section>
                                    <section>
                                        <ModalDespesaConferida
                                            show={showDespesaConferida}
                                            handleClose={() => setShowDespesaConferida(false)}
                                            onSalvarDespesaConferida={() => onSubmit(values, setFieldValue)}
                                            titulo="Despesa já demonstrada"
                                            texto="<p>Atenção. Essa despesa já foi demonstrada, caso a alteração seja gravada ela voltará a ser não demonstrada. Confirma a gravação?</p>"
                                        />
                                    </section>
                                    <section>
                                        <ModalDespesaIncompleta
                                            show={showModalDespesaIncompleta}
                                            handleClose={() => setShowModalDespesaIncompleta(false)}
                                            onSalvarDespesaIncompleta={() => onSubmit(values, setFieldValue)}
                                            titulo="Cadastro da despesa"
                                            texto="<p>O cadastro desta despesa está incompleto. Você deseja finalizá-lo agora?</p>"
                                        />
                                    </section>
                                </form>
                            </>
                        ); /*Return metodo principal*/
                    }}
                </Formik>
            }
            <section>
                <CancelarModal
                    show={show}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                    onCancelarTrue={() => aux.onCancelarTrue(setShow, setLoading, origem)}
                />
            </section>
            <section>
                <AvisoCapitalModal
                    show={showAvisoCapital}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                />
            </section>
            {despesaContext.idDespesa
                ?
                <DeletarModal
                    show={showDelete}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                    onDeletarTrue={() => onDeletarTrue(setShowDelete, setLoading, despesaContext, origem)}
                />
                : null
            }
            <section>
                <PeriodoFechado
                    show={showPeriodoFechado}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                />
            </section>
            <section>
                <ErroGeral
                    show={showErroGeral}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta)}
                />
            </section>
            <section>
                <ModalErroDeletarCadastroDespesa
                    show={showModalErroDeletarDespesa}
                    handleClose={() => setShowModalErroDeletarDespesa(false)}
                    titulo="Exclusão de Despesa"
                    texto={textoModalErroDeletarDespesa}
                />
            </section>
        </>
    );
};