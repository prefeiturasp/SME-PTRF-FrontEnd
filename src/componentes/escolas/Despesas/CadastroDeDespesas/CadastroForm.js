import React, {useCallback, useContext, useEffect, useState} from "react";
import {
    validaPayloadDespesas,
    periodoFechado,
    comparaObjetos, valida_cpf_cnpj,
    periodoFechadoImposto
} from "../../../../utils/ValidacoesAdicionaisFormularios";
import {
    getDespesasTabelas,
    criarDespesa,
    alterarDespesa,
    getEspecificacoesCapital,
    getEspecificacoesCusteio,
    getDespesaCadastrada, deleteDespesa,
    getMotivosPagamentoAntecipado,
    marcarLancamentoAtualizado,
    marcarLancamentoExcluido,
    marcarGastoIncluido
} from "../../../../services/escolas/Despesas.service";
import {useParams, useLocation} from 'react-router-dom';
import {DespesaContext} from "../../../../context/Despesa";
import HTTP_STATUS from "http-status-codes";
import {
    AvisoCapitalModal,
    CancelarModal,
    DeletarModal,
    ErroGeral,
    PeriodoFechado,
    PeriodoFechadoImposto,
    DespesaIncompletaNaoPermitida
} from "../../../../utils/Modais"
import "./cadastro-de-despesas.scss"
import {trataNumericos} from "../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../utils/Loading";
import {metodosAuxiliares} from "../metodosAuxiliares";
import moment from "moment";
import {getPeriodoFechado} from "../../../../services/escolas/Associacao.service";
import {ModalErroDeletarCadastroDespesa} from "./ModalErroDeletarCadastroDespesa";
import { CadastroFormFormik } from "./CadastroFormFormik";
import { getPeriodoPorUuid } from "../../../../services/sme/Parametrizacoes.service";

export const CadastroForm = ({verbo_http}) => {

    let {origem} = useParams();
    const aux = metodosAuxiliares;
    const parametroLocation = useLocation();

    const despesaContext = useContext(DespesaContext);

    const [despesasTabelas, setDespesasTabelas] = useState([]);
    const [show, setShow] = useState(false);
    const [showAvisoCapital, setShowAvisoCapital] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [textoModalDelete, setShowTextoModalDelete] = useState('')
    const [showPeriodoFechado, setShowPeriodoFechado] = useState(false);
    const [showPeriodoFechadoImposto, setShowPeriodoFechadoImposto] = useState(false);
    const [showErroGeral, setShowErroGeral] = useState(false);
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
    const [mensagensAceitaCusteioCapital, setMensagensAceitaCusteioCapital] = useState([]);
    const [showDeletarRateioComEstorno, setShowDeletarRateioComEstorno] = useState(false);

    const [showRetencaoImposto, setShowRetencaoImposto] = useState(false);
    const [cssEscondeDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto] = useState([]);
    const [labelDocumentoTransacaoImposto, setLabelDocumentoTransacaoImposto] = useState([]);
    const [readOnlyCamposImposto, setReadOnlyCamposImposto] = useState([]);
    const [showExcluirImposto, setShowExcluirImposto] = useState(false);
    const [formErrorsImposto, setFormErrorsImposto] = useState([])
    const [disableBtnAdicionarImposto, setDisableBtnAdicionarImposto] = useState(false);
    const [objetoParaComparacao, setObjetoParaComparacao] = useState({});
    const [despesaIncompleta, setDespesaIncompleta] = useState(false);
    const [showDespesaIncompletaNaoPermitida, setShowDespesaIncompletaNaoPermitida] = useState(false);

    const retornaPeriodo = async (periodo_uuid) => {
        let periodo = await getPeriodoPorUuid(periodo_uuid);
        return periodo;
    }


    useEffect(() => {
        if (despesaContext.initialValues.tipo_transacao && verbo_http === "PUT") {
            aux.exibeDocumentoTransacao(despesaContext.initialValues.tipo_transacao.id, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas);
            aux.exibeDocumentoTransacaoImpostoUseEffect(despesaContext.initialValues.despesas_impostos, setLabelDocumentoTransacaoImposto, labelDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto, cssEscondeDocumentoTransacaoImposto, despesasTabelas);
        }
        if (despesaContext.initialValues.data_transacao && verbo_http === "PUT") {
            if(aux.origemAnaliseLancamento(parametroLocation)){
                validateFormDespesas(initialValues());
                aux.bloqueiaCamposDespesaPrincipal(parametroLocation, setReadOnlyCampos, setReadOnlyBtnAcao)
            }
            else{
                periodoFechado(despesaContext.initialValues.data_transacao, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
            }

            if (despesaContext && despesaContext.initialValues && despesaContext.initialValues.despesas_impostos){
                if(aux.origemAnaliseLancamento(parametroLocation)){
                    validateFormDespesas(initialValues());
                    aux.bloqueiaCamposDespesaImposto(
                        parametroLocation, setReadOnlyCamposImposto,
                        setDisableBtnAdicionarImposto, despesaContext
                    )
                }
                else{
                    periodoFechadoImposto(despesaContext.initialValues.despesas_impostos, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral);
                }
            }
        }
        if (verbo_http === "PUT") {
            setObjetoParaComparacao(despesaContext.initialValues)
        }
    }, [despesaContext.initialValues]);

    useEffect(() => {
        const carregaTabelasDespesas = async () => {
            let resp;

            if(aux.origemAnaliseLancamento(parametroLocation)){
                resp = await getDespesasTabelas(parametroLocation.state.uuid_associacao);
            }
            else{
                resp = await getDespesasTabelas();
            }

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

    const validacoesPersonalizadas = useCallback(async (values, setFieldValue, origem=null, index=null) => {

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

        if(aux.origemAnaliseLancamento(parametroLocation)){
            if (values.data_transacao && origem==="despesa_principal"){
                let data = moment(values.data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");

                try {
                    let periodo_da_data = await getPeriodoFechado(data);
                    let periodo_da_analise = await retornaPeriodo(parametroLocation.state.periodo_uuid);

                    if(periodo_da_data && periodo_da_analise && periodo_da_data.periodo_referencia === periodo_da_analise.referencia){
                        setReadOnlyBtnAcao(false);
                        erros = {
                            data_transacao: null
                        }
                    }
                    else{
                        setReadOnlyBtnAcao(true);
                        erros = {
                            data_transacao: "Permitido apenas datas dentro do período referente à devolução"
                        }
                    }
                }
                catch (e) {
                    console.log("Erro ao buscar perído ", e)
                }
            }
        }

        // Verifica se deve utilizar logica de periodo fechado
        if(!aux.origemAnaliseLancamento(parametroLocation)){
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
        }

        /* validacoes imposto */
        if(origem === "despesa_imposto" && values.despesas_impostos && values.despesas_impostos[index].data_transacao){
            if(values.data_transacao){
                let data_despesa_principal = moment(values.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                let data_despesa_imposto = moment(values.despesas_impostos[index].data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                
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

                    if(!aux.origemAnaliseLancamento(parametroLocation)){
                        try{
                            let data = moment(values.despesas_impostos[index].data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");
                            let periodo_fechado = await getPeriodoFechado(data);
                            if (!periodo_fechado.aceita_alteracoes) {
                                erros = {
                                    despesa_imposto_data_transacao: null
                                }
                                setEnviarFormulario(false)
                                setReadOnlyBtnAcao(true);
                                setShowPeriodoFechadoImposto(true);
                                setDisableBtnAdicionarImposto(true);
                                setReadOnlyCamposImposto(prevState => ({...prevState, [index]: true}));
                            } else {
                                setEnviarFormulario(true)
                                setReadOnlyBtnAcao(false);
                                setShowPeriodoFechadoImposto(false);
                                setDisableBtnAdicionarImposto(false);
                                setReadOnlyCamposImposto(prevState => ({...prevState, [index]: false}));
                            }
                        }
                        catch (e) {
                            setReadOnlyBtnAcao(true);
                            setShowPeriodoFechadoImposto(true);
                            setDisableBtnAdicionarImposto(true);
                            setReadOnlyCamposImposto(prevState => ({...prevState, [index]: true}));
                            onShowErroGeral();
                            console.log("Erro ao buscar perído ", e)
                        }
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

    const liberaBtnSalvar = (values) => {
        values.despesas_impostos.map((despesa_imposto) => {
            if(values.data_transacao && despesa_imposto.data_transacao){
                let data_despesa_principal = moment(values.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                let data_despesa_imposto = moment(despesa_imposto.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                
                let diff = moment(data_despesa_imposto,"YYYY-MM-DD HH:mm:ss").diff(moment(data_despesa_principal,"YYYY-MM-DD HH:mm:ss"));
                let dias = moment.duration(diff).asDays();

                if(dias < 0){
                    setEnviarFormulario(false)
                    setBtnSubmitDisable(true)
                }
                
            }
        })
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

                // Verificação criada caso seja acrescentada outra ação além de CAPITAL OU CUSTEIO
                let aceita_selecionado  = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_' + id_categoria_receita_lower);

                let aceita_capital = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_capital');
                let aceita_custeio = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_custeio');

                // Caso aceite livre automaticamente aceita qualquer ação CAPITAL, CUSTEIO ou qualquer outra que seja criada
                let aceita_livre = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_livre');

                if(!aceita_livre && !aceita_selecionado && !aceita_capital && !aceita_custeio){
                    let mensagem = `A ação selecionada não aceita despesas de nenhum tipo (capital ou custeio). Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
                else if(!aceita_livre && !aceita_selecionado && aceita_capital){
                    let mensagem = `A ação selecionada aceita apenas despesas de capital. Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
                else if(!aceita_livre && !aceita_selecionado && aceita_custeio){
                    let mensagem = `A ação selecionada aceita apenas despesas de custeio. Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação?`
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



    const onSubmit = async (values, setFieldValue) => {
        // Inclusão de validações personalizadas para reduzir o numero de requisições a API Campo: cpf_cnpj_fornecedor
        // Agora o campo cpf_cnpj_fornecedor, é validado no onBlur e quando o form tenta ser submetido
        // A chamada a api /api/fornecedores/?uuid=&cpf_cnpj=${cpf_cnpj}, só é realizada quando um cpf for válido
        setFormErrors(await validacoesPersonalizadas(values, setFieldValue));
        let erros_personalizados = await validacoesPersonalizadas(values, setFieldValue)

        if (enviarFormulario && Object.keys(erros_personalizados).length === 0) {
            setLoading(true);

            setBtnSubmitDisable(true);

            validaPayloadDespesas(values, despesasTabelas, parametroLocation);

            values.motivos_pagamento_antecipado = montaPayloadMotivosPagamentoAntecipado()
            values.outros_motivos_pagamento_antecipado = txtOutrosMotivosPagamentoAntecipado.trim() && checkBoxOutrosMotivosPagamentoAntecipado ? txtOutrosMotivosPagamentoAntecipado : ""

            if(aux.origemAnaliseLancamento(parametroLocation)){
                if(despesaIncompleta){
                    setLoading(false);
                    setBtnSubmitDisable(false);
                    setShowDespesaIncompletaNaoPermitida(true);
                }
                else{
                    if (despesaContext.verboHttp === "POST"){
                        try {
                            const response = await criarDespesa(values);
                            if (response.status === HTTP_STATUS.CREATED){
                                console.log("Operação realizada com sucesso!");

                                let uuid_despesa = response.data.uuid;

                                let uuid_acerto_documento = parametroLocation.state.uuid_acerto_documento;

                                let payload = {
                                    uuid_gasto_incluido: uuid_despesa,
                                    uuid_solicitacao_acerto: uuid_acerto_documento,
                                }

                                let response_gasto_incluido = await marcarGastoIncluido(payload);
                                
                                if (response_gasto_incluido.status === 200) {
                                    console.log("Gasto incluido com sucesso!");
                                }
                                else{
                                    setLoading(false);
                                }

                                aux.getPath(origem, parametroLocation);
                            }
                            else {
                                setLoading(false);
                            }
                        } catch (error) {
                            console.log(error);
                            setLoading(false);
                        }
                    }
                    else if (despesaContext.verboHttp === "PUT"){
                        try {
                            const response = await alterarDespesa(values, despesaContext.idDespesa);

                            if (response.status === 200){
                                console.log("Operação realizada com sucesso!");

                                // verificar se é atualizacao lancamento
                                if(aux.ehOperacaoAtualizacao(parametroLocation)){
                                    let uuid_analise_lancamento = parametroLocation.state.uuid_analise_lancamento;
                                    let response_atualiza_lancamento = await marcarLancamentoAtualizado(uuid_analise_lancamento);
                                    
                                    if (response_atualiza_lancamento.status === 200) {
                                        console.log("Atualizacao de lancamento realizada com sucesso!");
                                    }
                                    else{
                                        setLoading(false);
                                    }
                                }

                                aux.getPath(origem, parametroLocation);
                                
                            }
                            else {
                                setLoading(false);
                            }
                        } catch (error) {
                            console.log(error);
                            setLoading(false);
                        }
                    }
                }
            }
            else{
                // Caso não seja origem de analise lancamento (reabertura seletiva), deve seguir o fluxo normal

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
                }
                else if (despesaContext.verboHttp === "PUT") {
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
        }
    };

    const validateFormDespesas = async (values) => {
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
            let documento;
            // verificando se despesasTabelas já está preenchido
            if (despesasTabelas && despesasTabelas.tipos_documento) {
                if (values.tipo_documento.id) {
                    documento = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento.id));
                } else {
                    documento = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento));
                }
            }

            // Verificando se exibe campo Número do Documento
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
                values.retem_imposto = false;
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
        aux.getPath(origem, parametroLocation);
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

            if(aux.origemAnaliseLancamento(parametroLocation)){
                let uuid_analise_lancamento = parametroLocation.state.uuid_analise_lancamento;
                let response_exclui_lancamento = await marcarLancamentoExcluido(uuid_analise_lancamento);
                
                if (response_exclui_lancamento.status === 200) {
                    console.log("Exclusão de lancamento realizada com sucesso!");
                }
            }

            aux.getPath(origem, parametroLocation);
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

    const preenche_tipo_despesa_custeio = (values, index) => {
        let tributo_tarifas;
        if(despesasTabelas && despesasTabelas.tipos_custeio){
            tributo_tarifas = despesasTabelas.tipos_custeio.find(element => element.eh_tributos_e_tarifas === true);
            values.despesas_impostos[index].rateios[0].tipo_custeio = tributo_tarifas.id.toString();
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

    const setValorRateioRealizadoImposto = (setFieldValue, valor, index) =>{
        setFieldValue(`despesas_impostos[${index}].rateios[0].valor_rateio`, trataNumericos(valor))
    };

    const mostraModalExcluirImposto = () => {
        if(verbo_http === "PUT"){
            setShowExcluirImposto(true);
        }
    }

    const cancelarExclusaoImposto = (setFieldValue) => {
        setFieldValue("retem_imposto", true);
        setShowExcluirImposto(false);
    }

    const [listaDemotivosPagamentoAntecipado, setListaDemotivosPagamentoAntecipado] = useState([]);
    const [selectMotivosPagamentoAntecipado, setSelectMotivosPagamentoAntecipado] = useState([]);
    const [checkBoxOutrosMotivosPagamentoAntecipado, setCheckBoxOutrosMotivosPagamentoAntecipado] = useState(false);
    const [txtOutrosMotivosPagamentoAntecipado, setTxtOutrosMotivosPagamentoAntecipado] = useState('');

    useEffect(()=>{
        setCheckBoxOutrosMotivosPagamentoAntecipado(!!despesaContext.initialValues.outros_motivos_pagamento_antecipado.trim())
    }, [despesaContext.initialValues.outros_motivos_pagamento_antecipado])


    const handleChangeCheckBoxOutrosMotivosPagamentoAntecipado = (event) =>{
        setCheckBoxOutrosMotivosPagamentoAntecipado(event.target.checked);
        if (!event.target.checked){
            setCheckBoxOutrosMotivosPagamentoAntecipado(false);
            setTxtOutrosMotivosPagamentoAntecipado("")
        }
    };

    const handleChangeTxtOutrosMotivosPagamentoAntecipado = (event) =>{
        setTxtOutrosMotivosPagamentoAntecipado(event.target.value)
    };

    const montaPayloadMotivosPagamentoAntecipado = () =>{
        let motivos = [];
        if (selectMotivosPagamentoAntecipado && selectMotivosPagamentoAntecipado.length > 0){
            selectMotivosPagamentoAntecipado.map((motivo)=>
                motivos.push(motivo.id)
            )
        }
        return motivos
    }

    const bloqueiaLinkCadastrarEstorno = (rateio) => {
        let bloqueia_link = true;

        if(rateio.conta_associacao && rateio.acao_associacao && rateio.aplicacao_recurso && trataNumericos(rateio.valor_rateio) !== 0){
            bloqueia_link = false;
        }

        if(aux.origemAnaliseLancamento(parametroLocation)){
            if(!aux.temPermissaoEdicao(parametroLocation)){
                bloqueia_link = true;
            }
        }

        return bloqueia_link;
    }

    const bloqueiaCamposDespesa = () => {
        let bloqueia_link = false;

        if(readOnlyCampos){
            bloqueia_link = true;
        }

        if(aux.origemAnaliseLancamento(parametroLocation)){
            if(!aux.temPermissaoEdicao(parametroLocation)){
                bloqueia_link = true;
            }
        }

        return bloqueia_link;
    }

    const bloqueiaRateioEstornado = (rateio) => {
        if(rateio.estorno && rateio.estorno.uuid){
            return true;
        }

        return false;
    }

    const [modalState, setModalState] = useState("saldo-insuficiente-conta" | "acao-nao-aceita-tipo-de-aplicacao" | "saldo-insuficiente-acao" | "despesa-ja-demonstrada" | "despesa-ja-cadastrada" | "pagamento-antecipado" | "despesa-imcompleta" | "close" )

    const verificaSaldoInsuficienteConta = async (values, errors, setFieldValue) =>{
        validaPayloadDespesas(values);
        if (values.data_transacao) {
            let retorno_saldo = await aux.verificarSaldo(values, despesaContext);
            if (retorno_saldo.situacao_do_saldo === "saldo_conta_insuficiente" || retorno_saldo.situacao_do_saldo === "lancamento_anterior_implantacao") {
                setSaldosInsuficientesDaConta(retorno_saldo);
                setModalState('saldo-insuficiente-conta')
            }else{
                await serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_conta_validado')
            }
        }else {
            await serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_conta_validado')
        }
    }

    const verificaSeAcaoAceitaTipoDeRecurso = async (values, errors, setFieldValue) => {
        let acoes = acaoNaoAceitaTipoRecurso(values);
        if(acoes.length > 0){
            setModalState('acao-nao-aceita-tipo-de-aplicacao');
        }else {
            await serviceSubmitModais(values, setFieldValue, errors, 'acao_nao_aceita_tipo_de_aplicacao_validado')
        }
    }

    const verificaSaldoInsuficienteAcao = async (values, errors, setFieldValue) =>{
        validaPayloadDespesas(values);
        if (values.data_transacao) {
            let retorno_saldo = await aux.verificarSaldo(values, despesaContext);
            if (retorno_saldo.situacao_do_saldo === "saldo_insuficiente") {
                setSaldosInsuficientesDaAcao(retorno_saldo.saldos_insuficientes);
                setModalState('saldo-insuficiente-acao');
            }else{
                await serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_acao_validado')
            }
        }else {
            await serviceSubmitModais(values, setFieldValue, errors, 'saldo_insuficiente_acao_validado')
        }
    }

    const verificaSeDespesaJaDemonstrada = async (values, errors, setFieldValue) =>{
        validaPayloadDespesas(values);

        if(aux.origemAnaliseLancamento(parametroLocation)){
            aux.mantemConciliacaoAtual(values);
            await serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_demonstrada_validado')
        }
        else{
            if (values.rateios.find(element => element.conferido)) {
                setModalState("despesa-ja-demonstrada")
            }else{
                await serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_demonstrada_validado')
            }
        }
    }

    const verificaSeDespesaJaCadastrada = async (values, errors, setFieldValue) =>{
        validaPayloadDespesas(values);
        if (values.tipo_documento && values.numero_documento && !values.uuid) {
            let despesa_cadastrada = await getDespesaCadastrada(values.tipo_documento, values.numero_documento, values.cpf_cnpj_fornecedor, despesaContext.idDespesa);
            if (despesa_cadastrada.despesa_ja_lancada) {
                setModalState("despesa-ja-cadastrada")
            }else {
                await serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_cadastrada_validado')
            }
        }else{
            await serviceSubmitModais(values, setFieldValue, errors, 'despesa_ja_cadastrada_validado')
        }
    }

    const validaMotivosPagamentoAntecipado = async (values, errors, setFieldValue) =>{
        validaPayloadDespesas(values);
        let data_transacao = values.data_transacao
        let data_documento = values.data_documento
        if (data_transacao && data_documento) {
            if (data_transacao < data_documento) {
                let motivos = await getMotivosPagamentoAntecipado()
                setListaDemotivosPagamentoAntecipado(motivos)
                setSelectMotivosPagamentoAntecipado(despesaContext.initialValues.motivos_pagamento_antecipado)
                setTxtOutrosMotivosPagamentoAntecipado(despesaContext.initialValues.outros_motivos_pagamento_antecipado)
                setModalState('pagamento-antecipado')
            }else {
                await serviceSubmitModais(values, setFieldValue, errors, 'pagamento_antecipado_validado')
            }
        }else{
            await serviceSubmitModais(values, setFieldValue, errors, 'pagamento_antecipado_validado')
        }
    }

    const verificaSeDespesaIncompleta = async (values, errors, setFieldValue) =>{
        values.despesa_incompleta = document.getElementsByClassName("despesa_incompleta").length
        validaPayloadDespesas(values);
        if (values.despesa_incompleta > 0 ) {
            setModalState('despesa-imcompleta')
            setDespesaIncompleta(true);
        }else {
            setDespesaIncompleta(false);
            await serviceSubmitModais(values, setFieldValue, errors, 'despesa_incompleta_validado')
        }
    }

    const serviceIniciaEncadeamentoDosModais = async (values, errors, setFieldValue) =>{

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
            await verificaSaldoInsuficienteConta(values, errors, setFieldValue)
        }
    }

    const serviceSubmitModais = async (values, setFieldValue, errors, msg) =>{

        if (msg === 'saldo_insuficiente_conta_validado'){
            await verificaSeAcaoAceitaTipoDeRecurso(values, errors, setFieldValue)

        }else if(msg === 'acao_nao_aceita_tipo_de_aplicacao_validado'){
            await verificaSaldoInsuficienteAcao(values, errors, setFieldValue)

        }else if(msg === 'saldo_insuficiente_acao_validado'){
            await verificaSeDespesaJaDemonstrada(values, errors, setFieldValue)

        }else if(msg === 'despesa_ja_demonstrada_validado'){
            await verificaSeDespesaJaCadastrada(values, errors, setFieldValue)

        }else if(msg === 'despesa_ja_cadastrada_validado'){
            await validaMotivosPagamentoAntecipado(values, errors, setFieldValue)

        }else if(msg === 'pagamento_antecipado_validado'){
            await verificaSeDespesaIncompleta(values, errors, setFieldValue)

        }else if(msg === 'despesa_incompleta_validado'){
            setModalState('close')
            await onSubmit(values, setFieldValue);
        }
    }

    const numeroDocumentoImpostoReadOnly = (tipo_documento, index, values) => {
        let documento_imposto;
        if(despesasTabelas && despesasTabelas.tipos_documento){
            if(tipo_documento && tipo_documento.id){
                documento_imposto = despesasTabelas.tipos_documento.find(element => element.id === Number(tipo_documento.id));
            }
            else if(tipo_documento){
                documento_imposto = despesasTabelas.tipos_documento.find(element => element.id === Number(tipo_documento));
            }
        }

        if(documento_imposto && !documento_imposto.numero_documento_digitado){
            values.despesas_impostos[index].numero_documento = ""
            return true;
        }
        else{
            return false;
        }
    }

    const onCalendarCloseDataPagamento = async (values, setFieldValue) => {
        for(let despesa_imposto = 0; despesa_imposto <= values.despesas_impostos.length -1; despesa_imposto ++){
                                                    
            let erro = await validacoesPersonalizadas(values, setFieldValue, "despesa_imposto", despesa_imposto)
            
            setFormErrorsImposto(prevState => ({...prevState, [despesa_imposto] : erro}))
        }
    }

    const onCalendarCloseDataPagamentoImposto = async(values, setFieldValue, index) => {
        let erro = await validacoesPersonalizadas(values, setFieldValue, "despesa_imposto", index)
        setFormErrorsImposto({
            ...formErrorsImposto,
            [index]: erro
        })
        liberaBtnSalvar(values);
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
                        saldosInsuficientesDaAcao={saldosInsuficientesDaAcao}
                        setShow={setShow}
                        saldosInsuficientesDaConta={saldosInsuficientesDaConta}
                        mensagensAceitaCusteioCapital={mensagensAceitaCusteioCapital}
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
                        readOnlyCamposImposto={readOnlyCamposImposto}
                        setShowExcluirImposto={setShowExcluirImposto}
                        showExcluirImposto={showExcluirImposto}
                        cancelarExclusaoImposto={cancelarExclusaoImposto}
                        mostraModalExcluirImposto={mostraModalExcluirImposto}
                        validaMotivosPagamentoAntecipado={validaMotivosPagamentoAntecipado}
                        listaDemotivosPagamentoAntecipado={listaDemotivosPagamentoAntecipado}
                        selectMotivosPagamentoAntecipado={selectMotivosPagamentoAntecipado}
                        setSelectMotivosPagamentoAntecipado={setSelectMotivosPagamentoAntecipado}
                        checkBoxOutrosMotivosPagamentoAntecipado={checkBoxOutrosMotivosPagamentoAntecipado}
                        txtOutrosMotivosPagamentoAntecipado={txtOutrosMotivosPagamentoAntecipado}
                        handleChangeCheckBoxOutrosMotivosPagamentoAntecipado={handleChangeCheckBoxOutrosMotivosPagamentoAntecipado}
                        handleChangeTxtOutrosMotivosPagamentoAntecipado={handleChangeTxtOutrosMotivosPagamentoAntecipado}
                        bloqueiaLinkCadastrarEstorno={bloqueiaLinkCadastrarEstorno}
                        bloqueiaRateioEstornado={bloqueiaRateioEstornado}
                        modalState={modalState}
                        setModalState={setModalState}
                        serviceIniciaEncadeamentoDosModais={serviceIniciaEncadeamentoDosModais}
                        serviceSubmitModais={serviceSubmitModais}
                        formErrorsImposto={formErrorsImposto}
                        disableBtnAdicionarImposto={disableBtnAdicionarImposto}
                        onCalendarCloseDataPagamento={onCalendarCloseDataPagamento}
                        onCalendarCloseDataPagamentoImposto={onCalendarCloseDataPagamentoImposto}
                        parametroLocation={parametroLocation}
                        bloqueiaCamposDespesa={bloqueiaCamposDespesa}
                    />
            </>
            }
            <section>
                <CancelarModal
                    show={show}
                    handleClose={() => setShow(false)}
                    onCancelarTrue={() => aux.onCancelarTrue(setShow, setLoading, origem, parametroLocation)}
                />
            </section>
            <section>
                <AvisoCapitalModal
                    show={showAvisoCapital}
                    handleClose={() => setShowAvisoCapital(false)}
                />
            </section>
            {despesaContext.idDespesa
                ?
                <DeletarModal
                    show={showDelete}
                    handleClose={()=>setShowDelete(false)}
                    onDeletarTrue={() => onDeletarTrue(setShowDelete, setLoading, despesaContext, origem)}
                    texto={textoModalDelete}
                />
                : null
            }
            <section>
                <PeriodoFechado
                    show={showPeriodoFechado}
                    handleClose={()=>setShowPeriodoFechado(false)}
                />
            </section>
            <section>
                <PeriodoFechadoImposto
                    show={showPeriodoFechadoImposto}
                    handleClose={()=>setShowPeriodoFechadoImposto(false)}
                />
            </section>
            <section>
                <ErroGeral
                    show={showErroGeral}
                    handleClose={()=>setShowErroGeral(false)}
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
            <section>
                <DespesaIncompletaNaoPermitida
                    show={showDespesaIncompletaNaoPermitida}
                    handleClose={()=>setShowDespesaIncompletaNaoPermitida(false)}
                />
            </section>
        </>
    );
};