import React, {useCallback, useContext, useEffect, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {
    validaPayloadDespesas,
    cpfMaskContitional,
    calculaValorRecursoAcoes,
    periodoFechado,
    comparaObjetos, valida_cpf_cnpj_permitindo_cnpj_zerado, valida_cpf_cnpj
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
import {Link, useParams} from 'react-router-dom';
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
    PeriodoFechadoImposto,
    SaldoInsuficiente,
    SaldoInsuficienteConta,
    ChecarDespesaExistente,
    TipoAplicacaoRecursoNaoAceito
} from "../../../../utils/Modais"
import {ModalDespesaConferida} from "./ModalDespesaJaConferida";
import "./cadastro-de-despesas.scss"
import {trataNumericos, round} from "../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../utils/Loading";
import {Tags} from "../Tags";
import {metodosAuxiliares} from "../metodosAuxiliares";
import {visoesService} from "../../../../services/visoes.service";
import moment from "moment";
import {getPeriodoFechado} from "../../../../services/escolas/Associacao.service";
import {ModalDespesaIncompleta} from "./ModalDespesaIncompleta";
import {ModalErroDeletarCadastroDespesa} from "./ModalErroDeletarCadastroDespesa";
import {ModalDeletarRateioComEstorno} from "./ModalDeletarRateioComEstorno";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { apenasNumero } from "../../../../utils/ValidacoesAdicionaisFormularios";
import { CadastroFormFormik } from "./CadastroFormFormik";

export const CadastroForm = ({verbo_http}) => {

    let {origem} = useParams();
    const aux = metodosAuxiliares;

    const despesaContext = useContext(DespesaContext);

    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [show, setShow] = useState(false);
    const [showAvisoCapital, setShowAvisoCapital] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [textoModalDelete, setShowTextoModalDelete] = useState('')
    const [showSaldoInsuficiente, setShowSaldoInsuficiente] = useState(false);
    const [showSaldoInsuficienteConta, setShowSaldoInsuficienteConta] = useState(false);
    const [showPeriodoFechado, setShowPeriodoFechado] = useState(false);
    const [showPeriodoFechadoImposto, setShowPeriodoFechadoImposto] = useState(false);
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
    const [showDespesaConferida, setShowDespesaConferida] = useState(false);
    const [mensagensAceitaCusteioCapital, setMensagensAceitaCusteioCapital] = useState([]);
    const [showMensagemAceitaCusteioCapital, setShowMensagemAceitaCusteioCapital] = useState(false);
    const [showDeletarRateioComEstorno, setShowDeletarRateioComEstorno] = useState(false);

    const [showRetencaoImposto, setShowRetencaoImposto] = useState(false);
    const [numeroDocumentoImpostoReadOnly, setNumeroDocumentoImpostoReadOnly] = useState(false);
    const [cssEscondeDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto] = useState('escondeItem');
    const [labelDocumentoTransacaoImposto, setLabelDocumentoTransacaoImposto] = useState('');
    const [readOnlyCamposImposto, setReadOnlyCamposImposto] = useState(false);

    const [objetoParaComparacao, setObjetoParaComparacao] = useState({});

    useEffect(() => {
        if (despesaContext.initialValues.tipo_transacao && verbo_http === "PUT") {
            aux.exibeDocumentoTransacao(despesaContext.initialValues.tipo_transacao.id, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas);
            aux.exibeDocumentoTransacao(despesaContext.initialValues.tipo_transacao.id, setCssEscondeDocumentoTransacaoImposto, setLabelDocumentoTransacaoImposto, despesasTabelas);
        }
        if (despesaContext.initialValues.data_transacao && verbo_http === "PUT") {
            periodoFechado(despesaContext.initialValues.data_transacao, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
            periodoFechado(despesaContext.initialValues.despesa_imposto.data_transacao, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, onShowErroGeral);
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

    const validacoesPersonalizadas = useCallback(async (values, setFieldValue, origem=null) => {

        let erros = {};
        let cpf_cnpj_valido;

        if(values.cpf_cnpj_fornecedor){
            cpf_cnpj_valido = !(!values.cpf_cnpj_fornecedor || values.cpf_cnpj_fornecedor.trim() === "" || !valida_cpf_cnpj(values.cpf_cnpj_fornecedor));
        }
        else{
            cpf_cnpj_valido = true;
        }

        if(!eh_despesa_reconhecida(values) && !values.numero_boletim_de_ocorrencia){
            erros = {
                numero_boletim_de_ocorrencia: "Digite um número de boletim de ocorrência"
            }
            setEnviarFormulario(false)
            setBtnSubmitDisable(true)
        }
        else{
            setEnviarFormulario(true)
            setBtnSubmitDisable(false)
        }
        
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
        if (values.data_transacao && origem==="despesa_principal") {
            let data = moment(values.data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");
            try {
                let periodo_fechado = await getPeriodoFechado(data);

                if (!periodo_fechado.aceita_alteracoes) {
                    erros = {
                        data_transacao: "Período Fechado"
                    }

                    if(values.retem_imposto){
                        setEnviarFormulario(true)
                    }
                    else{
                        setEnviarFormulario(false)
                    }

                    /* setEnviarFormulario(false) */
                    setReadOnlyBtnAcao(true);
                    console.log("entrei aqui")
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

        /* validacoes imposto */
        if(values.despesa_imposto && values.despesa_imposto.data_transacao){
            if(values.data_transacao){
                let data_despesa_principal = moment(values.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                let data_despesa_imposto = moment(values.despesa_imposto.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                
                let diff = moment(data_despesa_imposto,"YYYY-MM-DD HH:mm:ss").diff(moment(data_despesa_principal,"YYYY-MM-DD HH:mm:ss"));
                let dias = moment.duration(diff).asDays();

                if(dias < 0){
                    erros = {
                        despesa_imposto_data_transacao: "Data do imposto menor que data da despesa"
                    }
                    setEnviarFormulario(false)
                    setBtnSubmitDisable(true)
                }
                // logica periodo fechado
                else{
                    setEnviarFormulario(true)
                    setBtnSubmitDisable(false)

                    try{
                        let data = moment(values.despesa_imposto.data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");
                        let periodo_fechado = await getPeriodoFechado(data);
                        if (!periodo_fechado.aceita_alteracoes) {
                            erros = {
                                despesa_imposto_data_transacao: null
                            }
                            setEnviarFormulario(false)
                            setReadOnlyBtnAcao(true);
                            setShowPeriodoFechadoImposto(true);
                            setReadOnlyCamposImposto(true);
                        } else {
                            setEnviarFormulario(true)
                            setReadOnlyBtnAcao(false);
                            setShowPeriodoFechadoImposto(false);
                            setReadOnlyCamposImposto(false);
                        }
                    }
                    catch (e) {
                        setReadOnlyBtnAcao(true);
                        setShowPeriodoFechadoImposto(true);
                        setReadOnlyCamposImposto(true);
                        onShowErroGeral();
                        console.log("Erro ao buscar perído ", e)
                    }
                }
                
            }
            else{
                erros = {
                    despesa_imposto_data_transacao: "Data do imposto sem data de despesa"
                }
                setEnviarFormulario(false)
                setBtnSubmitDisable(true)
            }
        }
        return erros;
    }, [aux])

    const eh_despesa_sem_comprovacao_fiscal = (cpf_cnpj) => {
        return cpf_cnpj === "00.000.000/0000-00";
    }

    const removeRateio = (remove, index, rateio) => {
        if(rateio && rateio.estorno && rateio.estorno.uuid){
            setShowDeletarRateioComEstorno(true);
        }
        else{
            remove(index)
        }
    }

    const acaoNaoAceitaTipoRecurso = (values) => {
        let mensagens = []
        values.rateios.map((rateio, indexRateio) => {
            let index = indexRateio + 1;
            let uuid_acao = null;
            
            if(rateio.acao_associacao && rateio.acao_associacao.uuid){
                uuid_acao = rateio.acao_associacao.uuid;
            }
            else if(rateio.acao_associacao){
                uuid_acao = rateio.acao_associacao;
            }

            if(uuid_acao){
                let id_categoria_receita_lower = rateio.aplicacao_recurso.toLowerCase();
                let aceita_selecionado  = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_' + id_categoria_receita_lower);
                let aceita_capital = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_capital');
                let aceita_custeio = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_custeio');
                
                if(!aceita_selecionado && !aceita_capital && !aceita_custeio){
                    let mensagem = `A ação selecionada não aceita despesas de nenhum tipo(capital ou custeio). Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação ?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
                else if(!aceita_selecionado && aceita_capital){
                    let mensagem = `A ação selecionada aceita apenas despesas de capital. Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação ?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
                else if(!aceita_selecionado && aceita_custeio){
                    let mensagem = `A ação selecionada aceita apenas despesas de custeio. Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação ?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
            }
        });
        setMensagensAceitaCusteioCapital(mensagens)
        return mensagens;
    }

    const onShowMensagemNaoAceitaTipoRecurso = (values, erros) => {
        if (Object.entries(erros).length === 0) {
            let acoes = acaoNaoAceitaTipoRecurso(values);

            if(acoes.length > 0){
                setShowMensagemAceitaCusteioCapital(true);
            }
        }
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
                let acoes = acaoNaoAceitaTipoRecurso(values);
                if(acoes.length === 0){
                    setShowModalDespesaIncompleta(true)
                }
            }else if (values.data_transacao) {
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
                            let acoes = acaoNaoAceitaTipoRecurso(values);
                            if(acoes.length === 0){
                                onSubmit(values, setFieldValue);
                            }
                        }
                    } catch (e) {
                        console.log("Erro ao buscar despesa cadastrada ", e);
                    }
                } else {
                    
                    let acoes = acaoNaoAceitaTipoRecurso(values);
                    if(acoes.length === 0){
                        onSubmit(values, setFieldValue);
                    }
                }
            } else {
                let acoes = acaoNaoAceitaTipoRecurso(values);
                if(acoes.length === 0){
                    onSubmit(values, setFieldValue);
                }
            }
        }
    };

    const onSubmit = async (values, setFieldValue) => {
        console.log(values)
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
        /* rever */
        values.despesa_imposto.rateios[0].tipo_custeio = preenche_tipo_despesa_custeio().id.toString()
        values.qtde_erros_form_despesa = document.getElementsByClassName("is_invalid").length;

        const errors = {};

        // Validando se datas são maiores que data de hoje

        let hoje = moment(new Date());
        let data_digitada_documento = moment(values.data_documento);
        let data_digitada_transacao = moment(values.data_transacao);

        if (data_digitada_documento > hoje){
            errors.data_documento = "Data do documento não pode ser maior que a data de hoje"
        }
        if (data_digitada_transacao > hoje){
            errors.data_transacao = "Data do pagamento não pode ser maior que a data de hoje"
        }



        // Validando se tipo de documento aceita apenas numéricos e se exibe campo Número do Documento
        if (values.tipo_documento) {
            let exibe_campo_numero_documento;
            /* let so_numeros; */
            let documento;
            let documento_imposto;
            // verificando se despesasTabelas já está preenchido
            if (despesasTabelas && despesasTabelas.tipos_documento) {
                if (values.tipo_documento.id) {
                    /* so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento.id)); */
                    documento = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento.id));
                } else {
                    /* so_numeros = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento)); */
                    documento = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento));
                }
            }

            // Verificando se exibe campo Número do Documento
            /* exibe_campo_numero_documento = so_numeros; */
            exibe_campo_numero_documento = documento;
            
            if (exibe_campo_numero_documento && !exibe_campo_numero_documento.numero_documento_digitado) {
                values.numero_documento = "";
                setNumeroDocumentoReadOnly(true)
            } else {
                setNumeroDocumentoReadOnly(false)
            }

            if (documento && documento.apenas_digitos && values.numero_documento) {
                if (isNaN(values.numero_documento)) {
                    errors.numero_documento = "Este campo deve conter apenas algarismos numéricos."
                }
            }

            /* validacoes imposto */
            if(documento && documento.pode_reter_imposto){
                setShowRetencaoImposto(true);
            }
            else{
                setShowRetencaoImposto(false);
            }

            if (despesasTabelas && despesasTabelas.tipos_documento) {
                if (values.despesa_imposto && values.despesa_imposto.tipo_documento && values.despesa_imposto.tipo_documento.id) {
                    console.log( values.despesa_imposto.tipo_documento.id)
                    documento_imposto = despesasTabelas.tipos_documento.find(element => element.id === Number(values.despesa_imposto.tipo_documento.id));
                }
                else if(values.despesa_imposto && values.despesa_imposto.tipo_documento){
                    documento_imposto = despesasTabelas.tipos_documento.find(element => element.id === Number(values.despesa_imposto.tipo_documento));
                }
                    /* } else {
                    
                    documento_imposto = despesasTabelas.tipos_documento.find(element => element.id === Number(values.despesa_imposto.tipo_documento));
                } */
            }
            
            
            // Verificando se exibe campo Número do Documento imposto
            if(documento_imposto && !documento_imposto.numero_documento_digitado){
                values.despesa_imposto.numero_documento = "";
                setNumeroDocumentoImpostoReadOnly(true);
            }
            else{
                setNumeroDocumentoImpostoReadOnly(false);
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

    const eh_despesa_com_comprovacao_fiscal = (values) => {
        if(!values.eh_despesa_sem_comprovacao_fiscal || values.eh_despesa_sem_comprovacao_fiscal === undefined){
            return true
        }
        else{
            return false;
        }
    }


    const eh_despesa_reconhecida = (values) => {
        if(values.eh_despesa_reconhecida_pela_associacao || values.eh_despesa_reconhecida_pela_associacao === undefined){
            return true;
        }
        else{
            return false;
        }
    }

    const limpa_campos_sem_comprovacao_fiscal = (values, setFieldValue) => {
        setFieldValue("cpf_cnpj_fornecedor", "")
        setFieldValue("tipo_documento", null)
        setFieldValue("data_documento", "")
        setFieldValue("numero_documento", "")

        for(let rateio=0; rateio<=values.rateios.length-1; rateio++){
            setFieldValue(`rateios[${rateio}].tipo_custeio`, "")
            setFieldValue(`rateios[${rateio}].especificacao_material_servico`, "")
        }
    }

    const eh_despesa_com_retencao_imposto = (values) => {
        if(!values.retem_imposto || values.retem_imposto === undefined){
            return false;
        }
        else{
            return true;
        }
    }

    const tipos_documento_com_recolhimento_imposto = () => {
        let tipos_documento = [];

        if(despesasTabelas && despesasTabelas.tipos_documento){
            for(let documento=0; documento<=despesasTabelas.tipos_documento.length-1; documento++){
                let tipo_documento = despesasTabelas.tipos_documento[documento];
                if(tipo_documento.eh_documento_de_retencao_de_imposto){
                    tipos_documento.push(tipo_documento)
                }
            }
        }
    
        return tipos_documento;
    }

    const preenche_tipo_despesa_custeio = () => {
        let tributo_tarifas;
        if(despesasTabelas && despesasTabelas.tipos_custeio){
            tributo_tarifas = despesasTabelas.tipos_custeio.find(element => element.eh_tributos_e_tarifas === true);
        }        
        
        return tributo_tarifas ? tributo_tarifas : ""
    }

    const acoes_custeio = () => {
        let acoes = [];

        if(despesasTabelas && despesasTabelas.acoes_associacao){
            for(let acao=0; acao<=despesasTabelas.acoes_associacao.length-1; acao++){
                let objeto_acao = despesasTabelas.acoes_associacao[acao];
                if(!objeto_acao.e_recursos_proprios && objeto_acao.acao.aceita_custeio){   
                    acoes.push(objeto_acao)
                }
            }
        }
        return acoes;
    }

    const setValorRateioRealizadoImposto = (setFieldValue, valor) =>{
        setFieldValue("despesa_imposto.rateios[0].valor_rateio", trataNumericos(valor))
    };

    const setValorDescontadoImposto = (values) => {
        

        let valor_ptrf = calculaValorRecursoAcoes(values);
        let valor_realizado_imposto = trataNumericos(values.despesa_imposto.rateios[0].valor_rateio);
        let valor_descontado_imposto = round(valor_ptrf - valor_realizado_imposto, 2);

        /* console.log("valor ptrf", valor_ptrf);
        console.log("valor imposto", valor_realizado_imposto)
        console.log("valor descontado o imposto", valor_descontado_imposto) */

        return valor_descontado_imposto;
    }

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
                <>
                    <CadastroFormFormik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        validateFormDespesas={validateFormDespesas}
                        despesaContext={despesaContext}
                        readOnlyCampos={readOnlyCampos}
                        setFormErrors={setFormErrors}
                        validacoesPersonalizadas={validacoesPersonalizadas}
                        formErrors={formErrors}
                        eh_despesa_sem_comprovacao_fiscal={eh_despesa_sem_comprovacao_fiscal}
                        despesasTabelas={despesasTabelas}
                        numeroDocumentoReadOnly={numeroDocumentoReadOnly}
                        aux={aux}
                        setCssEscondeDocumentoTransacao={setCssEscondeDocumentoTransacao}
                        setLabelDocumentoTransacao={setLabelDocumentoTransacao}
                        verbo_http={verbo_http}
                        cssEscondeDocumentoTransacao={cssEscondeDocumentoTransacao}
                        labelDocumentoTransacao={labelDocumentoTransacao}
                        exibeMsgErroValorOriginal={exibeMsgErroValorOriginal}
                        exibeMsgErroValorRecursos={exibeMsgErroValorRecursos}
                        removeRateio={removeRateio}
                        setShowAvisoCapital={setShowAvisoCapital}
                        especificacoes_custeio={especificacoes_custeio}
                        especificaoes_capital={especificaoes_capital}
                        showDeletarRateioComEstorno={showDeletarRateioComEstorno}
                        setShowDeletarRateioComEstorno={setShowDeletarRateioComEstorno}
                        houveAlteracoes={houveAlteracoes}
                        onShowModal={onShowModal}
                        onCancelarTrue={onCancelarTrue}
                        readOnlyBtnAcao={readOnlyBtnAcao}
                        setShowDelete={setShowDelete}
                        setShowTextoModalDelete={setShowTextoModalDelete}
                        btnSubmitDisable={btnSubmitDisable}
                        onShowMensagemNaoAceitaTipoRecurso={onShowMensagemNaoAceitaTipoRecurso}
                        onShowSaldoInsuficiente={onShowSaldoInsuficiente}
                        saldosInsuficientesDaAcao={saldosInsuficientesDaAcao}
                        showSaldoInsuficiente={showSaldoInsuficiente}
                        setShow={setShow}
                        setShowSaldoInsuficiente={setShowSaldoInsuficiente}
                        setShowPeriodoFechado={setShowPeriodoFechado}
                        setShowPeriodoFechadoImposto={setShowPeriodoFechadoImposto}
                        setShowSaldoInsuficienteConta={setShowSaldoInsuficienteConta}
                        saldosInsuficientesDaConta={saldosInsuficientesDaConta}
                        showSaldoInsuficienteConta={showSaldoInsuficienteConta}
                        showDespesaCadastrada={showDespesaCadastrada}
                        setShowDespesaCadastrada={setShowDespesaCadastrada}
                        showDespesaConferida={showDespesaConferida}
                        setShowDespesaConferida={setShowDespesaConferida}
                        showModalDespesaIncompleta={showModalDespesaIncompleta}
                        setShowModalDespesaIncompleta={setShowModalDespesaIncompleta}
                        mensagensAceitaCusteioCapital={mensagensAceitaCusteioCapital}
                        showMensagemAceitaCusteioCapital={showMensagemAceitaCusteioCapital}
                        setShowMensagemAceitaCusteioCapital={setShowMensagemAceitaCusteioCapital}
                        eh_despesa_com_comprovacao_fiscal={eh_despesa_com_comprovacao_fiscal}
                        eh_despesa_reconhecida={eh_despesa_reconhecida}
                        limpa_campos_sem_comprovacao_fiscal={limpa_campos_sem_comprovacao_fiscal}
                        showRetencaoImposto={showRetencaoImposto}
                        eh_despesa_com_retencao_imposto={eh_despesa_com_retencao_imposto}
                        tipos_documento_com_recolhimento_imposto={tipos_documento_com_recolhimento_imposto}
                        numeroDocumentoImpostoReadOnly={numeroDocumentoImpostoReadOnly}
                        preenche_tipo_despesa_custeio={preenche_tipo_despesa_custeio}
                        setCssEscondeDocumentoTransacaoImposto={setCssEscondeDocumentoTransacaoImposto}
                        setLabelDocumentoTransacaoImposto={setLabelDocumentoTransacaoImposto}
                        cssEscondeDocumentoTransacaoImposto={cssEscondeDocumentoTransacaoImposto}
                        labelDocumentoTransacaoImposto={labelDocumentoTransacaoImposto}
                        acoes_custeio={acoes_custeio}
                        setValorRateioRealizadoImposto={setValorRateioRealizadoImposto}
                        setValorDescontadoImposto={setValorDescontadoImposto}
                        readOnlyCamposImposto={readOnlyCamposImposto}
                    />
            </>
            }
            <section>
                <CancelarModal
                    show={show}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta, setShowPeriodoFechadoImposto)}
                    onCancelarTrue={() => aux.onCancelarTrue(setShow, setLoading, origem)}
                />
            </section>
            <section>
                <AvisoCapitalModal
                    show={showAvisoCapital}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta, setShowPeriodoFechadoImposto)}
                />
            </section>
            {despesaContext.idDespesa
                ?
                <DeletarModal
                    show={showDelete}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta, setShowPeriodoFechadoImposto)}
                    onDeletarTrue={() => onDeletarTrue(setShowDelete, setLoading, despesaContext, origem)}
                    texto={textoModalDelete}
                />
                : null
            }
            <section>
                <PeriodoFechado
                    show={showPeriodoFechado}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta, setShowPeriodoFechadoImposto)}
                />
            </section>
            <section>
                <PeriodoFechadoImposto
                    show={showPeriodoFechadoImposto}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta, setShowPeriodoFechadoImposto)}
                />
            </section>
            <section>
                <ErroGeral
                    show={showErroGeral}
                    handleClose={() => aux.onHandleClose(setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta, setShowPeriodoFechadoImposto)}
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