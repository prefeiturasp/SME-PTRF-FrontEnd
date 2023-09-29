import React, {useCallback, useEffect, useState} from "react";
import {
    criarReceita,
    atualizaReceita,
    deletarReceita,
    getReceita,
    getTabelasReceitaReceita,
    getRepasses,
    getListaMotivosEstorno,
    marcarLancamentoExcluido,
    marcarLancamentoAtualizado,
    marcarCreditoIncluido, getValidarDataDaReceita, getPeriodosValidosAssociacaoEncerrada
} from '../../../../services/escolas/Receitas.service';
import {getRateioPorUuid} from "../../../../services/escolas/RateiosDespesas.service";
import {deleteDespesa, getDespesa} from "../../../../services/escolas/Despesas.service";
import {getPeriodoFechado} from "../../../../services/escolas/Associacao.service";
import {round, trataNumericos, periodoFechado} from "../../../../utils/ValidacoesAdicionaisFormularios";
import moment from "moment";
import {useLocation, useParams} from 'react-router-dom';
import {ASSOCIACAO_UUID} from '../../../../services/auth.service';
import {PeriodoFechado, ErroGeral, SalvarReceita, AvisoTipoReceita, AvisoTipoReceitaEstorno} from "../../../../utils/Modais";
import {ModalDeletarReceita} from "../ModalDeletarReceita";
import {CancelarModalReceitas} from "../CancelarModalReceitas";
import "../receitas.scss"
import {ReceitaFormFormik} from "./ReceitaFormFormik";
import ReferenciaDaDespesaEstorno from "../ReferenciaDaDespesaEstorno";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {toastCustom} from "../../../Globais/ToastCustom";
import { visoesService } from "../../../../services/visoes.service";
import { getPeriodoPorUuid } from "../../../../services/sme/Parametrizacoes.service";
import { STATUS_CONTA_ASSOCIACAO, STATUS_SOLICITACAO_ENCERRAMENTO_CONTA_ASSOCIACAO } from "../../../../constantes/contaAssociacao";


export const ReceitaForm = () => {

    let {origem} = useParams();
    let {uuid} = useParams();
    const parametros = useLocation();

    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome')

    const [loading, setLoading] = useState(true);
    const [redirectTo, setRedirectTo] = useState('');
    const [uuid_receita, setUuidReceita] = useState(null);

    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const initial = {
        tipo_receita: "",
        detalhe_tipo_receita: "",
        detalhe_outros: "",
        categoria_receita: "",
        acao_associacao: "",
        conta_associacao: "",
        data: "",
        valor: "",
        referencia_devolucao: "",
        saida_do_recurso: "",
        rateio_estornado: "",
        motivos_estorno: [],
        outros_motivos_estorno: "",
    };


    const [tabelas, setTabelas] = useState(tabelaInicial);
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showPeriodoFechado, setShowPeriodoFechado] = useState(false);
    const [showErroGeral, setShowErroGeral] = useState(false);
    const [showCadastrarSaida, setShowCadastrarSaida] = useState(false);
    const [showEditarSaida, setShowEditarSaida] = useState(false);
    const [showAvisoTipoReceita, setShowAvisoTipoReceita] = useState(false);
    const [showAvisoTipoReceitaEstorno, setShowAvisoTipoReceitaEstorno] = useState(false);
    const [showSalvarReceita, setShowSalvarReceita] = useState(false);
    const [initialValue, setInitialValue] = useState(initial);
    const [objetoParaComparacao, setObjetoParaComparacao] = useState({});
    const [receita, setReceita] = useState({});
    const [readOnlyValor, setReadOnlyValor] = useState(false);
    const [readOnlyClassificacaoReceita, setreadOnlyClassificacaoReceita] = useState(false);
    const [readOnlyAcaoAssociacaoReceita, setreadOnlyAcaoAssociacaoReceita] = useState(false);
    const [readOnlyContaAssociacaoReceita, setreadOnlyContaAssociacaoReceita] = useState(false);
    const [readOnlyTipoReceita, setreadOnlyTipoReceita] = useState(false);
    const [readOnlyBtnAcao, setReadOnlyBtnAcao] = useState(false);
    const [readOnlyCampos, setReadOnlyCampos] = useState(false);
    const [readOnlyReaberturaSeletiva, setReadOnlyReaberturaSeletiva] = useState(false);
    const [repasse, setRepasse] = useState({});
    const [idxTipoDespesa, setIdxTipoDespesa] = useState(0);
    const [showReceitaRepasse, setShowReceitaRepasse] = useState(false);
    const [repasses, setRepasses] = useState([]);
    const [showSelecionaRepasse, setShowSelecionaRepasse] = useState(false);
    const [msgDeletarReceita, setmsgDeletarReceita] = useState('<p>Tem certeza que deseja excluir este crédito? A ação não poderá ser refeita.</p>')
    const [msgAvisoTipoReceita, setMsgAvisoTipoReceita] = useState('');
    const [msgAvisoTipoReceitaEstorno, setMsgTipoReceitaEstorno] = useState('');
    const [exibeModalSalvoComSucesso, setExibeModalSalvoComSucesso] = useState(true)
    const [uuid_despesa, setUuidDespesa] = useState('')
    const [exibirDeleteDespesa, setExibirDeleteDespesa] = useState(true);
    const [classificacoesAceitas, setClassificacoesAceitas] = useState([])
    const [tituloModalCancelar, setTituloModalCancelar] = useState("Deseja cancelar a inclusão de crédito?")
    const [periodosValidosAssociacaoencerrada, setPeriodosValidosAssociacaoencerrada] = useState([])
    const [mensagemDataInicialConta, setMensagemDataInicialConta] = useState("")

    // ************* Modo Estorno
    const [readOnlyEstorno, setReadOnlyEstorno] = useState(false);
    const [rateioEstorno, setRateioEstorno] = useState({});
    const [tituloPagina, setTituloPagina] = useState('')
    const [despesa, setDespesa] = useState({})
    const [idTipoReceitaEstorno, setIdTipoReceitaEstorno] = useState("")
    const [formDateErrors, setFormDateErrors] = useState('');

    const [escondeBotaoDeletar, setEscondeBotaoDeletar] = useState(false)

    useEffect(()=>{
        if(parametros && parametros.state){
            if(!parametros.state.tem_permissao_de_edicao){
                setEscondeBotaoDeletar(true);
            }
            else{
                if(parametros.state.operacao === "requer_atualizacao_lancamento_credito"){
                    setEscondeBotaoDeletar(true);
                }
                else if(parametros.state.operacao === "requer_exclusao_lancamento_credito"){
                    setEscondeBotaoDeletar(false);
                }
                else if(parametros.state.operacao === "requer_inclusao_documento_credito"){
                    setEscondeBotaoDeletar(true);
                }
            }
        }
    }, [parametros])

    const retornaPeriodo = async (periodo_uuid) => {
        let periodo = await getPeriodoPorUuid(periodo_uuid);
        return periodo;
    }

    const carregaTabelas = useCallback(async ()=>{
        let tabelas_receitas;

        if(parametros && parametros.state && parametros.state.uuid_associacao){
            tabelas_receitas = await getTabelasReceitaReceita(parametros.state.uuid_associacao)
        }
        else{
            tabelas_receitas = await getTabelasReceitaReceita()
        }
        setTabelas(tabelas_receitas)
    }, [parametros])

    useEffect(()=>{
        carregaTabelas()
    }, [carregaTabelas]);

    const carregaPeriodosValidosAssociacaoEncerrada = useCallback(async ()=>{
        let periodos

        if(parametros && parametros.state && parametros.state.uuid_associacao){
            periodos = await getPeriodosValidosAssociacaoEncerrada(parametros.state.uuid_associacao)
        }
        else{
            let associacao_uuid =  localStorage.getItem(ASSOCIACAO_UUID)
            periodos = await getPeriodosValidosAssociacaoEncerrada(associacao_uuid)
        }
        setPeriodosValidosAssociacaoencerrada(periodos)
    }, [parametros])

    useEffect(() =>{
        carregaPeriodosValidosAssociacaoEncerrada()
    }, [carregaPeriodosValidosAssociacaoEncerrada])


    const getTipoReceitaEstorno = useCallback(()=>{
        if (tabelas && tabelas.tipos_receita && tabelas.tipos_receita.length > 0){
            let tipo_de_receita = tabelas.tipos_receita.filter(element => element.e_estorno)
            let id_tipo_receita_estono = tipo_de_receita && tipo_de_receita[0] && tipo_de_receita[0].id ? tipo_de_receita[0].id : ""
            setIdTipoReceitaEstorno(id_tipo_receita_estono)
        }
    }, [tabelas])

    useEffect(()=>{
        getTipoReceitaEstorno()
    }, [getTipoReceitaEstorno])


    const carregaRateioPorUuid = async (uuid_rateio) => {
        return await getRateioPorUuid(uuid_rateio)
    }

    const consultaSeEstorno = useCallback( async () =>{

        if (parametros && parametros.state && parametros.state.uuid_rateio){
            let rateio = await carregaRateioPorUuid(parametros.state.uuid_rateio)

            // await periodoFechado(rateio.data_transacao, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
            try {
                const init_rateio = {
                    tipo_receita: idTipoReceitaEstorno,
                    detalhe_tipo_receita: rateio.detalhe_tipo_receita,
                    detalhe_outros: rateio.detalhe_outros,
                    categoria_receita: rateio.aplicacao_recurso,
                    conferido: rateio.conferido,
                    acao_associacao: rateio.acao_associacao.uuid,
                    conta_associacao: rateio.conta_associacao.uuid,
                    referencia_devolucao: rateio.referencia_devolucao,
                    data: "",
                    valor: rateio.valor_total ? Number(rateio.valor_total).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    rateio_estornado: rateio && rateio.uuid ? rateio.uuid : null,
                    motivos_estorno: [],
                    outros_motivos_estorno: "",
                };

                setInitialValue(init_rateio)
                setReadOnlyEstorno(true)
                setRateioEstorno(rateio)
                setTituloPagina('Cadastro de Estorno')
            }catch (e) {
                console.log("Erro ao atribuir rateio ", e)
            }

        }else {
            setTituloPagina('Cadastro de Crédito')
        }
    }, [parametros, idTipoReceitaEstorno])

    useEffect(()=>{
        consultaSeEstorno()
    }, [consultaSeEstorno])


    const carregaDespesaPorUuid = useCallback(async () => {
        if (rateioEstorno && rateioEstorno.despesa) {
            let despesa = await getDespesa(rateioEstorno.despesa)
            setDespesa(despesa)
        }
    }, [rateioEstorno])

    useEffect(() => {
        carregaDespesaPorUuid()
    }, [carregaDespesaPorUuid])

    // ************* Fim Modo Estorno

    // ************* Motivos Estorno
    const [showModalMotivoEstorno, setShowModalMotivoEstorno] = useState(false);
    const [listaMotivosEstorno, setListaMotivosEstorno] = useState([])
    const [selectMotivosEstorno, setSelectMotivosEstorno] = useState([]);
    const [checkBoxOutrosMotivosEstorno, setCheckBoxOutrosMotivosEstorno] = useState(false);
    const [txtOutrosMotivosEstorno, setTxtOutrosMotivosEstorno] = useState('');

    useEffect(()=>{
        setCheckBoxOutrosMotivosEstorno(!!initialValue.outros_motivos_estorno.trim())
    }, [initialValue.outros_motivos_estorno])

    const carregaListaMotivosEstorno = useCallback(async ()=>{
        let motivos = await getListaMotivosEstorno()
        setListaMotivosEstorno(motivos)
    }, [])

    useEffect(()=>{
        carregaListaMotivosEstorno()
    }, [carregaListaMotivosEstorno])

    const handleChangeCheckBoxOutrosMotivosEstorno = (event) =>{
        setCheckBoxOutrosMotivosEstorno(event.target.checked);
        if (!event.target.checked){
            setCheckBoxOutrosMotivosEstorno(false);
            setTxtOutrosMotivosEstorno("")
        }
    };

    const handleChangeTxtOutrosMotivosEstorno = (event) =>{
        setTxtOutrosMotivosEstorno(event.target.value)
    };

    const montaPayloadMotivosEstorno = () =>{
        let motivos = [];
        if (selectMotivosEstorno && selectMotivosEstorno.length > 0){
            selectMotivosEstorno.map((motivo)=>
                motivos.push(motivo.id)
            )
        }
        return motivos
    }
    // ************* FIM Motivos Estorno

    const showBotaoCadastrarSaida = useCallback((uuid_acao_associacao, values) => {
        if (tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 && uuid_acao_associacao && values && values.tipo_receita) {
            let e_recurso_proprio = tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_recursos_proprios
            let acao = tabelas.acoes_associacao.find(item => item.uuid === uuid_acao_associacao)
            if (acao && acao.e_recursos_proprios && e_recurso_proprio && !values.saida_do_recurso) {
                setShowCadastrarSaida(true);
            }
            return acao;
        } else {
            setShowCadastrarSaida(false);
            return false
        }
    }, [tabelas])

    const buscaReceita = useCallback(async ()=>{
        if (uuid) {
            let uuid_associacao = origemAnaliseLancamento() ? parametros.state.uuid_associacao : null;

            getReceita(uuid, uuid_associacao).then(async response => {
                const resp = response.data;

                if (resp && resp.saida_do_recurso && resp.saida_do_recurso.uuid){
                    setShowEditarSaida(true)
                    setShowCadastrarSaida(false)
                    setUuidDespesa(resp.saida_do_recurso.uuid)
                }

                // Verificar se existe um rateio atrelado a receita
                if (resp && resp.rateio_estornado && resp.rateio_estornado.uuid){
                    setTituloPagina(defineTituloPagina(true))
                    setRateioEstorno(resp.rateio_estornado)
                    setreadOnlyTipoReceita(true)
                }else {
                    setTituloPagina(defineTituloPagina())
                }

                const init = {
                    tipo_receita: resp.tipo_receita.id,
                    detalhe_tipo_receita: resp.detalhe_tipo_receita,
                    detalhe_outros: resp.detalhe_outros,
                    categoria_receita: resp.categoria_receita,
                    conferido: resp.conferido,
                    acao_associacao: resp.acao_associacao.uuid,
                    conta_associacao: resp.conta_associacao.uuid,
                    referencia_devolucao: resp.referencia_devolucao,
                    data: resp.data,
                    valor: resp.valor ? Number(resp.valor).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    rateio_estornado: resp.rateio_estornado && resp.rateio_estornado.uuid ? resp.rateio_estornado.uuid : null,
                    motivos_estorno: resp.motivos_estorno,
                    outros_motivos_estorno: resp.outros_motivos_estorno,
                };
                setObjetoParaComparacao(init);
                setInitialValue(init);
                setReceita(resp);
                setSelectMotivosEstorno(resp.motivos_estorno)
                setCheckBoxOutrosMotivosEstorno(resp.outros_motivos_estorno)
                setTxtOutrosMotivosEstorno(resp.outros_motivos_estorno)

                getClassificacaoReceitaInicial(resp.tipo_receita.id);

                if (resp && resp.acao_associacao && resp.acao_associacao.uuid){
                    setUuidReceita(uuid)
                    showBotaoCadastrarSaida(resp.acao_associacao.uuid, init)
                }

                if(origemAnaliseLancamento()){
                    if(visao_selecionada === "DRE"){
                        setTituloModalCancelar("Deseja realmente voltar?");
                    }
                    else if(parametros.state.operacao === 'requer_inclusao_documento_credito'){
                        setTituloModalCancelar("Deseja cancelar a edição do crédito?")
                    }
                    else{
                        if(ehOperacaoExclusaoReaberturaSeletiva()){
                            setTituloModalCancelar("Deseja cancelar a exclusão do crédito?")
                        }
                        else if(ehOperacaoAtualizacaoReaberturaSeletiva()){
                            setTituloModalCancelar("Deseja cancelar a edição do crédito?")
                        }
                    }

                    bloqueiaCamposReceitaReaberturaSeletiva();
                }
                else{
                    periodoFechado(resp.data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
                    setTituloModalCancelar("Deseja cancelar as alterações feitas no crédito?")
                }

                getAvisoTipoReceita(resp.tipo_receita.id);
                if (resp.repasse !== null) {
                    setRepasse(resp.repasse);
                    setReadOnlyValor(true);
                    setreadOnlyClassificacaoReceita(true);
                    setreadOnlyTipoReceita(true);
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }, [uuid, showBotaoCadastrarSaida]);

    useEffect(()=>{
        buscaReceita()
    }, [buscaReceita])

    useEffect(() => {
        if (tabelas.tipos_receita.length > 0 && initialValue.tipo_receita !== undefined) {
            setaDetalhesTipoReceita(initialValue.tipo_receita);
        }
    }, [tabelas, initialValue.tipo_receita]);

    const servicoDeVerificacoes = (e, values, errors) =>{
        // Valida se despesa é do tipo Repasse
        if (!exibirDeleteDespesa) {
            e.preventDefault();
            setShowReceitaRepasse(true)
        }

        if (values.tipo_receita === idTipoReceitaEstorno && Object.keys(errors).length === 0 && values.data){
            e.preventDefault()
            setShowModalMotivoEstorno(true)
        }

    };

    const exibeMsgSalvoComSucesso = (payload) =>{

        let msg_salva_com_sucesso

        if (payload.tipo_receita === idTipoReceitaEstorno){
            msg_salva_com_sucesso = {
                titulo: "Estorno salvo com sucesso",
                mensagem: "O estorno referente a despesa selecionada foi salvo com sucesso."
            }
        }else {
            msg_salva_com_sucesso = {
                titulo: "Salvar cadastro de crédito.",
                mensagem: "Crédito salvo com sucesso."
            }
        }

        toastCustom.ToastCustomSuccess(msg_salva_com_sucesso.titulo, msg_salva_com_sucesso.mensagem, 'success', 'top-right', true, getPath)

    }

    const onSubmit = async (values, errors) => {
        setReadOnlyBtnAcao(true)

        // Validando e ou removendo e_devolucao
        if (!verificaSeDevolucao(values.tipo_receita)){
            delete values.referencia_devolucao
        }else if (uuid){
            if (values.referencia_devolucao && values.referencia_devolucao.uuid){
                values.referencia_devolucao = values.referencia_devolucao.uuid
            }
        }
        values.valor = round(trataNumericos(values.valor), 2);
        values.data = moment(values.data).format("YYYY-MM-DD");
        values.conferido = true;
        values.motivos_estorno = montaPayloadMotivosEstorno()
        values.outros_motivos_estorno = txtOutrosMotivosEstorno.trim() && checkBoxOutrosMotivosEstorno ? txtOutrosMotivosEstorno : ""

        const payload = {
            ...values,
            associacao: localStorage.getItem(ASSOCIACAO_UUID),
            detalhe_tipo_receita: values.detalhe_tipo_receita && values.detalhe_tipo_receita.id !== undefined ? values.detalhe_tipo_receita.id : values.detalhe_tipo_receita,
        };

        if (Object.keys(repasse).length !== 0) {
            payload['repasse'] = repasse.uuid;
        }

        setLoading(true);
        if (uuid) {
            // Editar Receita
            try {
                let response = await atualizaReceita(uuid, payload)
                console.log('UPDATE ==========>>>>>>', response)
                if(origemAnaliseLancamento()){
                    await atualizaLancamento()
                }
                if (exibeModalSalvoComSucesso){
                    exibeMsgSalvoComSucesso(payload)
                }else {
                    getPath()
                }
            }catch (e) {
                console.log("Erro ao editar receita em atualizaReceita ", e)
            }
        } else {
            // Criar Receita
            try {
                let resultCadastrar = await criarReceita(payload)
                console.log('CREATE ==========>>>>>>', resultCadastrar)
                if (exibeModalSalvoComSucesso){
                    setShowSalvarReceita(true);
                    setUuidReceita(resultCadastrar);
                    let uuidAcertoDocumento = parametros?.state?.uuid_acerto_documento;
                    if (uuidAcertoDocumento){
                        let payloadReceita = {"uuid_credito_incluido": resultCadastrar.data.uuid, 'uuid_solicitacao_acerto': uuidAcertoDocumento}
                        let responseCreditoIncluido = await marcarCreditoIncluido(payloadReceita);
                        if (responseCreditoIncluido.status === 200) {
                            console.log("Crédito marcado como incluído com sucesso!");
                        }
                    }
                    exibeMsgSalvoComSucesso(payload)
                }else {
                    setUuidReceita(resultCadastrar);
                    getPath(resultCadastrar)
                }
            }catch (e) {
                console.log("Erro ao criar receita em criarReceita ", e.response.data)
                let mensagemErro = e.response && e.response.data && e.response.data.mensagem && Array.isArray(e.response.data.mensagem) ? 
                                   e.response.data.mensagem.map((msg) => msg).join(", ") : 'Verifique se os dados foram preenchidos corretamente.'
                toastCustom.ToastCustomError('Erro ao tentar criar receita.', mensagemErro)
            }
        }
        setLoading(false);
    };

    const atualizaLancamento = async () => {
        let uuid_analise_lancamento = parametros.state.uuid_analise_lancamento;
        if (uuid_analise_lancamento){
            let response_atualiza_lancamento = await marcarLancamentoAtualizado(uuid_analise_lancamento);

            if (response_atualiza_lancamento.status === 200) {
                console.log("Atualizacao de lancamento realizada com sucesso!");
            }
        }
    }

    const onCancelarTrue = () => {
        setShow(false);
        setRedirectTo('');
        getPath('');

    };

    const onHandleClose = () => {
        setShow(false);
        setShowDelete(false);
        setShowPeriodoFechado(false);
        setShowErroGeral(false);
        setShowAvisoTipoReceita(false);
        setShowAvisoTipoReceitaEstorno(false);
    };

    const fecharSalvarCredito = () => {
        setShowSalvarReceita(false);
        getPath();
    }

    const onShowModal = () => {
        setShow(true);
    };

    const onShowDeleteModal = () => {

        if (receita && receita.saida_do_recurso && receita.saida_do_recurso.uuid){
            setmsgDeletarReceita('<p>Ao excluir este crédito você excluirá também a saída do recurso vinculada. Tem certeza que deseja excluir ambos? A ação não poderá ser desfeita.</p>')
            //Manter comentario caso mensagem de não permitir exclusao do estorno for continuar
            /* setShowDelete(true); */
        }else if (initialValue.tipo_receita === idTipoReceitaEstorno){
            // TO DO
            // Analisar se será necessario manter a mensagem comentada abaixo, caso não seja, remover a mensagem e o comentario
            setmsgDeletarReceita('<p>Tem certeza que deseja excluir esse estorno? Essa ação irá desfazer o estorno da despesa relacionada.</p>')

            //Manter comentario caso mensagem de não permitir exclusao do estorno for continuar
            /* setShowAvisoTipoReceitaEstorno(true);
            setMsgTipoReceitaEstorno("Não é possivel excluir uma receita do tipo estorno. Deve ser feito a partir da despesa."); */
        }
        //Manter comentario caso mensagem de não permitir exclusao do estorno for continuar
        /* else{
            setShowDelete(true);
        } */

        //Remover caso mensagem de não permitir exclusao do estorno for continuar
        setShowDelete(true);

        // Caso a mensagem de não pemitir exclusao do estorno não for continuar, remover tambem o modal criado para a mensagem
        // modal -> AvisoTipoReceitaEstorno
    };

    const onDeletarTrue = async () => {

        if (receita && receita.saida_do_recurso && receita.saida_do_recurso.uuid){
            try {
                await deleteDespesa(receita.saida_do_recurso.uuid)
                console.log("Despesa deletada com sucesso.");
            }catch (e) {
                console.log("Erro ao excluir despesa ", e);
            }
        }

        try {
            await deletarReceita(uuid)
            console.log("Receita deletada com sucesso.");
            setShowDelete(false);

            if(origemAnaliseLancamento()){
                let uuid_analise_lancamento = parametros.state.uuid_analise_lancamento;
                let response_exclui_lancamento = await marcarLancamentoExcluido(uuid_analise_lancamento);
                if (response_exclui_lancamento.status === 200) {
                    console.log("Exclusão de lancamento realizada com sucesso!");
                }
            }

            getPath();
        }catch (e) {
            console.log("Erro ao excluir receita ", e);
            alert("Um Problema Ocorreu. Entre em contato com a equipe para reportar o problema, obrigado.");
        }
    };

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    };

    const getPath = (uuid_receita_passado='') => {
        let path;
        if (redirectTo !== '') {
            path = `${redirectTo}/${uuid_receita_passado ? uuid_receita_passado : uuid_receita}${uuid_despesa ? '/'+uuid_despesa : ''}`;
        } else if (origem === undefined) {
            path = `/lista-de-receitas`;
        } else {
            path = `/detalhe-das-prestacoes`;
        }

        if(origemAnaliseLancamento()){
            if(parametros && parametros.state && parametros.state.uuid_pc && parametros.state.origem){
                let ancora = ""
                if(parametros.state.operacao === "requer_inclusao_documento_credito"){
                    ancora = "tabela-acertos-documentos"
                }
                else if(parametros.state.operacao === "requer_atualizacao_lancamento_credito" || parametros.state.operacao === "requer_exclusao_lancamento_credito"){
                    ancora = "tabela-acertos-lancamentos"
                }

                path = `${parametros.state.origem}/${parametros.state.uuid_pc}#${ancora}`;
            }
        }

        window.location.assign(path);
    };

    const setaRepasse = async (value)=>{
        if (value) {
            setRepasse(value);
        }
    };

    const consultaRepasses = async (value) => {
        if (value) {
            let tipo_receita = tabelas.tipos_receita.find(item => item.id == value);
            if (tipo_receita.e_repasse === true) {
                setExibirDeleteDespesa(false)
                try {
                    let listaRepasses = await getRepasses();
                    setRepasses(listaRepasses);
                    setShowSelecionaRepasse(true);
                } catch (e) {
                    console.log("Erro ao obter a listagem de repasses", e);
                }

            } else {
                setExibirDeleteDespesa(true)
                setaRepasse({});
                setreadOnlyAcaoAssociacaoReceita(false);
                setreadOnlyContaAssociacaoReceita(false);
                setReadOnlyValor(false);
            }
        }
    };

    const getClassificacaoReceitaInicial = (id_tipo_receita) => {
        // Essa funcao é utilizada para carregar as classificacoes quando o formulario é carregado

        let lista = [];
        let qtdeAceitaClassificacao = [];

        if (id_tipo_receita && tabelas && tabelas.categorias_receita && tabelas.categorias_receita.length > 0) {
            tabelas.categorias_receita.map((item, index) => {
                let id_categoria_receita_lower = item.id.toLowerCase();
                let aceitaClassificacao = eval('tabelas.tipos_receita.find(element => element.id === Number(id_tipo_receita)).aceita_' + id_categoria_receita_lower);

                qtdeAceitaClassificacao.push(aceitaClassificacao);
                if (aceitaClassificacao) {
                    lista.push(id_categoria_receita_lower)
                    setreadOnlyClassificacaoReceita(true);
                }
            });

            let resultado = qtdeAceitaClassificacao.filter((value) => {
                return value === true;
            }).length;

            if (resultado > 1) {
                setreadOnlyClassificacaoReceita(false);
            }
            setClassificacoesAceitas(lista);
        }
    }

    const getClassificacaoReceita = (id_tipo_receita, setFieldValue) => {
        let lista = [];
        let qtdeAceitaClassificacao = [];
        if (id_tipo_receita) {
            tabelas.categorias_receita.map((item, index) => {
                let id_categoria_receita_lower = item.id.toLowerCase();
                let aceitaClassificacao = eval('tabelas.tipos_receita.find(element => element.id === Number(id_tipo_receita)).aceita_' + id_categoria_receita_lower);

                qtdeAceitaClassificacao.push(aceitaClassificacao);
                if (aceitaClassificacao) {
                    lista.push(id_categoria_receita_lower)
                    setFieldValue("categoria_receita", item.id);
                    setreadOnlyClassificacaoReceita(true);
                }
            });

            let resultado = qtdeAceitaClassificacao.filter((value) => {
                return value === true;
            }).length;

            if (resultado > 1) {
                setFieldValue("categoria_receita", "");
                setreadOnlyClassificacaoReceita(false);
            }
            setClassificacoesAceitas(lista);
        }
    }

    const getClasificacaoAcao = (uuid_acao, setFieldValue) => {
        let lista = classificacoesAceitas
        let qtdeAceitaClassificacao = [];


        if(uuid_acao){
            setFieldValue("categoria_receita", "");
            tabelas.categorias_receita.map((item, index) => {
                let id_categoria_receita_lower = item.id.toLowerCase();
                let aceita  = eval('tabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_' + id_categoria_receita_lower);

                if(lista.includes(id_categoria_receita_lower) && aceita){
                    qtdeAceitaClassificacao.push(aceita);
                    setFieldValue("categoria_receita", item.id);
                    setreadOnlyClassificacaoReceita(true);
                }
            });

            let resultado = qtdeAceitaClassificacao.filter((value) => {
                return value === true;
            }).length;

            if (resultado > 1) {
                setFieldValue("categoria_receita", "");
                setreadOnlyClassificacaoReceita(false);
            }
        }
    }

    const setaDetalhesTipoReceita = (id_tipo_receita) => {
        if (id_tipo_receita) {
            tabelas.tipos_receita.map((item, index) => {
                if (item.id == id_tipo_receita && index != idxTipoDespesa) {
                    setIdxTipoDespesa(index);
                    const atuReceita = receita;
                    atuReceita.detalhe_tipo_receita = null;
                    setReceita(atuReceita);
                }
            })
        }
    };

    const getAvisoTipoReceita = (id_tipo_receita) => {
        if(id_tipo_receita){
            tabelas.tipos_receita.map((item, index) => {
                if (item.id == id_tipo_receita){
                    if(item.mensagem_usuario != ""){
                        setMsgAvisoTipoReceita(item.mensagem_usuario);
                        setShowAvisoTipoReceita(true);
                    }
                }
            })
        }
    }

    const getDisplayOptionClassificacaoReceita = (id_categoria_receita, uuid_acao) => {

        let id_categoria_receita_lower = id_categoria_receita.toLowerCase();

        let aceitaClassificacao  = eval('tabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_' + id_categoria_receita_lower);

        if(classificacoesAceitas.includes(id_categoria_receita_lower) && aceitaClassificacao){

            return "block"
        }
        else{
            return "none"
        }
    };

    const getOpcoesDetalhesTipoReceita = (values) => {
        if (tabelas.tipos_receita[idxTipoDespesa] !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.length > 0) {
            return tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.map(item => {
                return (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                )
            })
        }
    };

    const temOpcoesDetalhesTipoReceita = (values) => {
        if (tabelas.tipos_receita[idxTipoDespesa] !== undefined && tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita !== undefined) {
            return (tabelas.tipos_receita[idxTipoDespesa].detalhes_tipo_receita.length > 0)
        }
        return false
    };

    const e_repasse = (values) => {
        return tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_repasse
    }

    const retornaAcoes = (values) => {
        if (tabelas.tipos_receita.length > 0 && values.tipo_receita && e_repasse(values)){
            setExibirDeleteDespesa(false)
        }
        if (tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 && values.tipo_receita && e_repasse(values) && Object.keys(repasse).length !== 0) {
            let acao_associacao = tabelas.acoes_associacao.find(item => item.uuid == repasse.acao_associacao.uuid);
            setreadOnlyAcaoAssociacaoReceita(true);
            return (
                <option key={acao_associacao.uuid} value={acao_associacao.uuid}>{acao_associacao.nome}</option>
            )
        } else if (tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 && values.tipo_receita) {
            let e_recurso_proprio = tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_recursos_proprios

            return (tabelas.acoes_associacao.filter(item => item.e_recursos_proprios == e_recurso_proprio).map((item, key) => (
                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
            )))
        }

        return tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 ?(tabelas.acoes_associacao.map((item, key) => (
            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
        ))): null
    }



    const retornaClassificacaoReceita = (values, setFieldValue) => {
        if (tabelas.categorias_receita !== undefined && tabelas.categorias_receita.length > 0 && values !== undefined && values.acao_associacao && values.tipo_receita && Object.entries(repasse).length > 0 && uuid === undefined) {
            return tabelas.categorias_receita.map((item, index) => {

                let id_categoria_receita_lower = item.id.toLowerCase();

                // Quando a flag e_repasse for true eu checo também se o valor da classificacao_receita é !== "0.00"
                if (tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita)).e_repasse) {
                    if (tabelas.acoes_associacao && tabelas.acoes_associacao.find(element => element.uuid === values.acao_associacao) && eval('repasse.valor_' + id_categoria_receita_lower) !== "0.00") {
                        return (
                            <option
                                style={{display: getDisplayOptionClassificacaoReceita(item.id, values.acao_associacao)}}
                                key={item.id}
                                value={item.id}
                            >
                                {item.nome}
                            </option>
                        );
                    }

                }else{
                    if ( tabelas.tipos_receita && tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita))){
                        return (
                            <option
                                style={{display: getDisplayOptionClassificacaoReceita(item.id, values.acao_associacao)}}
                                key={item.id}
                                value={item.id}
                            >
                                {item.nome}
                            </option>
                        );
                    }
                }
            })
        }else{
            if (tabelas.categorias_receita && tabelas.categorias_receita.length > 0 && values.acao_associacao){
                return tabelas.categorias_receita.map((item)=>{
                    return (
                        <option
                            style={{display: getDisplayOptionClassificacaoReceita(item.id, values.acao_associacao)}}
                            key={item.id}
                            value={item.id}
                        >
                            {item.nome}
                        </option>
                    );
                })
            }
        }
    };

    const filtraContasPelaDataInicial = ({contasNaoFiltradas = [], dataDigitadaFormulario = initialValue.data}) => {
        let contasFiltradasPelaDataInicial = []

        if(contasNaoFiltradas && dataDigitadaFormulario) {
            contasFiltradasPelaDataInicial = contasNaoFiltradas.filter((acc) => { 
                if (acc.data_inicio && moment(acc.data_inicio, 'YYYY-MM-DD').isValid()) {
                  return moment(acc.data_inicio, 'YYYY-MM-DD').toDate() <= moment(dataDigitadaFormulario, 'YYYY-MM-DD').toDate();
                }
                return false;
              });
            
            if(!contasFiltradasPelaDataInicial.length) {
                setMensagemDataInicialConta("Não existem contas disponíveis para a data do crédito.")
            } else {
                setMensagemDataInicialConta("")
            }
        }

        return contasFiltradasPelaDataInicial;
    }


    const retornaTiposDeContas = (values) => {
        if (tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0  && values.tipo_receita && e_repasse(values) && Object.keys(repasse).length !== 0) {
            let conta_associacao = tabelas.contas_associacao.find(conta => (repasse.conta_associacao.nome.includes(conta.nome)));
            setreadOnlyContaAssociacaoReceita(true);
            return (
                <option key={conta_associacao.uuid} value={conta_associacao.uuid}>{conta_associacao.nome}</option>
            )
        } else if (tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0  && values.tipo_receita) {

            const tipoReceita = tabelas.tipos_receita.find(element => element.id === Number(values.tipo_receita));

            // Lista dos nomes dos tipos de conta que são aceitos pelo tipo de receita selecionado.
            const tipos_conta = tipoReceita.tipos_conta.map(item => item.nome);

            const getOptionPorStatus = (item) => {
                const defaultProps = {
                    key: item.uuid,
                    value: item.uuid
                }
                if(item.status === STATUS_CONTA_ASSOCIACAO.ATIVA){
                    return  <option {...defaultProps}>{item.nome}</option>
                } else if(item.solicitacao_encerramento && item.solicitacao_encerramento.status !== STATUS_SOLICITACAO_ENCERRAMENTO_CONTA_ASSOCIACAO.APROVADA) {
                    let informacaoExtra = item.solicitacao_encerramento ? `- Conta encerrada em ${moment(item.solicitacao_encerramento.data_de_encerramento_na_agencia).format('DD/MM/YYYY')}` : ''
                    return <option {...defaultProps} disabled>{item.nome} {informacaoExtra}</option>
                }
            }
            
            const contasFiltradasPelaDataInicialEPeloTipo = filtraContasPelaDataInicial({contasNaoFiltradas: tabelas.contas_associacao.filter(conta => (tipos_conta.includes(conta.nome))), dataDigitadaFormulario: values.data})

            return (
                contasFiltradasPelaDataInicialEPeloTipo.map((item, key) => (
                    getOptionPorStatus(item)
                )))
        }
    };
    
    const validateFormReceitas = async (values) => {
        const errors = {};

        // Verifica se é devolucao e setando erro caso referencia devolucao vazio
        if (verificaSeDevolucao(values.tipo_receita)  && !values.referencia_devolucao){
            errors.referencia_devolucao = "Campo período é obrigatório"
        }

        // Verifica se o detalhamento deve ser exibido e setando erro caso campo esteja vazio
        // Condicional para a select box de id detalhe_tipo_receita
        if(verificaSeExibeDetalhamento(values.tipo_receita) && !values.detalhe_tipo_receita){
            if(temOpcoesDetalhesTipoReceita(values)){
                errors.detalhe_tipo_receita = "Detalhamento do crédito é obrigatório";
            }
        }

        // Verifica se o detalhamento deve ser exibido e setando erro caso campo esteja vazio
        // Condicional para o input de id detalhe_outros
        if(verificaSeExibeDetalhamento(values.tipo_receita) && !values.detalhe_outros){
            if(temOpcoesDetalhesTipoReceita(values) === false){
                errors.detalhe_outros = "Detalhamento do crédito é obrigatório";
            }
        }

        // Verifica período fechado para a receita
        if (values.data) {
            if(!origemAnaliseLancamento()){
                await periodoFechado(values.data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
            }
        }

        let e_repasse_tipo_receita = false;
        let e_repasse_acao = "Escolha uma ação";

        tabelas.tipos_receita.map((item) => {
            if (item.id === Number(values.tipo_receita)) {
                e_repasse_tipo_receita = item.e_repasse
            }
        });

        e_repasse_acao = values.acao_associacao;

        let hoje = moment(new Date());
        let data_digitada = moment(values.data);

        if (data_digitada > hoje){
            errors.data = "Data do crédito não pode ser maior que a data de hoje"
        }

        if (tabelas.tipos_receita !== undefined && tabelas.tipos_receita.length > 0 && values.tipo_receita && e_repasse(values) && Object.keys(repasse).length !== 0) {
            setReadOnlyValor(true);
        } else {
            setReadOnlyValor(false)
        }

        return errors;
    };

    const verificaSeDevolucao = (tipoDeReceitaId) =>{
        let e_devolucao = undefined;
        if (tipoDeReceitaId){
            let e_devolucao = tabelas.tipos_receita.find(element=> element.id === Number(tipoDeReceitaId));
            if (e_devolucao){
                return e_devolucao.e_devolucao
            }else {
                return e_devolucao
            }
        }else {
            return e_devolucao
        }
    };

    const verificaSeExibeDetalhamento = (tipoDeReceitaId) => {
        let possui_detalhamento = undefined;
        if(tipoDeReceitaId){
            let possui_detalhamento = tabelas.tipos_receita.find(element=> element.id === Number(tipoDeReceitaId));
            if(possui_detalhamento){
                return possui_detalhamento.possui_detalhamento;
            }
            else{
                return possui_detalhamento;
            }
        }
        else{
            return possui_detalhamento;
        }
    }

    const trataRepasse = async (repasse_row, setFieldValue, valor, nome_classificacao) => {
        await setaRepasse(repasse_row);
        setFieldValue('acao_associacao', repasse_row.acao_associacao.uuid);
        setFieldValue('conta_associacao', repasse_row.conta_associacao.uuid);
        setFieldValue('valor', valor);
        setFieldValue('categoria_receita', retornaIdClassificacao(nome_classificacao, repasse_row.acao_associacao.uuid))
        setReadOnlyValor(true);
        setShowSelecionaRepasse(false);
    }

    const retornaIdClassificacao = (classificacao_nome, uuid_acao)=>{
        let id_classificacao = ""
        if (classificacao_nome === 'valor_custeio'){
            id_classificacao = "CUSTEIO"
        }else if (classificacao_nome === 'valor_capital'){
            id_classificacao = "CAPITAL"
        }else {
            id_classificacao = "LIVRE"
        }


        let id_categoria_receita_lower = id_classificacao.toLowerCase();
        let aceita  = eval('tabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_' + id_categoria_receita_lower);

        if (classificacoesAceitas.includes(id_categoria_receita_lower) && aceita) {
            return id_classificacao
        }
        else{
            return ""
        }
    }

    const atualizaValorRepasse = (value, setFieldValue) => {
        if (Object.keys(repasse).length !== 0) {
            let valor_formatado = Number(repasse[`valor_${value.toLowerCase()}`]).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            setFieldValue('valor', valor_formatado);
        }
    }


    const origemAnaliseLancamento = () => {
        if(parametros){
            if(!parametros.state){
                return false;
            }

            if(parametros.state && parametros.state.origem_visao === "UE"){
                if(parametros.state.origem === "/consulta-detalhamento-analise-da-dre"){
                    return true;
                }
                else{
                    return false;
                }
            }
            else if(parametros.state && parametros.state.origem_visao === "DRE"){
                if(parametros.state.origem === "/dre-detalhe-prestacao-de-contas-resumo-acertos"){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }

        return false;
    }

    const temPermissaoEdicaoReaberturaSeletiva = () => {
        if(parametros && parametros.state){
            if(parametros.state.tem_permissao_de_edicao){
                return true;
            }
        }

        return false;
    }

    const validacoesPersonalizadasCredito = useCallback(async (values, setFieldValue, origem=null, index=null) => {
        if (values.data){
            let associacao_uuid = localStorage.getItem(ASSOCIACAO_UUID)
            let data_da_receita = moment(values.data).format("YYYY-MM-DD");
            try {
                await getValidarDataDaReceita(associacao_uuid, data_da_receita)
                setReadOnlyBtnAcao(false);
                setFormDateErrors("")
            }catch (e) {
                setReadOnlyBtnAcao(true);
                setFormDateErrors(e.response.data.mensagem)
                return
            }
        }

        if (values.data && origem==="credito_principal"){
            let data = moment(values.data, "YYYY-MM-DD").format("YYYY-MM-DD");
            try {
                let periodo_da_data = await getPeriodoFechado(data);
                let periodo_da_analise = await retornaPeriodo(parametros.state.periodo_uuid);

                if(periodo_da_data && periodo_da_analise && periodo_da_data.periodo_referencia === periodo_da_analise.referencia){
                    setReadOnlyBtnAcao(false);
                    setFormDateErrors("")
                }
                else{
                    setReadOnlyBtnAcao(true);
                    setFormDateErrors("Permitido apenas datas dentro do período referente à prestação de contas em análise.")
                }
            }
            catch (e) {

            }
        }

    },[]);

    const ehOperacaoExclusaoReaberturaSeletiva = () => {
        if(parametros && parametros.state){
            if(parametros.state.operacao === "requer_exclusao_lancamento_credito"){
                return true;
            }
        }

        return false;
    }

    const ehOperacaoAtualizacaoReaberturaSeletiva = () => {
        if(parametros && parametros.state){
            if(parametros.state.operacao === "requer_atualizacao_lancamento_credito"){
                return true;
            }
        }

        return false;
    }

    const bloqueiaCamposReceitaReaberturaSeletiva = () => {
        if(!temPermissaoEdicaoReaberturaSeletiva() || ehOperacaoExclusaoReaberturaSeletiva()){
            setReadOnlyCampos(true);
            setReadOnlyReaberturaSeletiva(true);

            let bloqueia_btn_acao = false;

            if(parametros.state.origem_visao === "DRE"){
                bloqueia_btn_acao = true;
            }
            else if(parametros.state.operacao !== "requer_exclusao_lancamento_credito"){
                bloqueia_btn_acao = true;
            }

            setReadOnlyBtnAcao(bloqueia_btn_acao);
        }
    }

    const defineTituloPagina = (eh_estorno=false) => {
        if(eh_estorno){
            if(visao_selecionada === "DRE"){
                return "Visualização do estorno";
            }
            else{
                if(origemAnaliseLancamento()){
                    let operacao = parametros.state.operacao;
                    let texto = operacao === "requer_exclusao_lancamento_credito" ? "Exclusão do estorno" : "Edição do estorno";
                    return texto;
                }
                else{
                    return "Edição do estorno";
                }
            }
        }
        else{
            if(visao_selecionada === "DRE"){
                return "Visualização do crédito";
            }
            else{
                if(origemAnaliseLancamento()){
                    let operacao = parametros.state.operacao;
                    let texto = operacao === "requer_exclusao_lancamento_credito" ? "Exclusão do crédito" : "Edição do crédito";
                    return texto;
                }
                else{
                    return "Edição do crédito";
                }
            }
        }
    }

    return (
        <>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">{tituloPagina}</h1>
                <div className="page-content-inner ">
                    <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                    <ReferenciaDaDespesaEstorno
                        uuid={uuid}
                        rateioEstorno={rateioEstorno}
                        despesa={despesa}
                    />
                    <ReceitaFormFormik
                        initialValue={initialValue}
                        onSubmit={onSubmit}
                        validateFormReceitas={validateFormReceitas}
                        readOnlyCampos={readOnlyCampos}
                        readOnlyTipoReceita={readOnlyTipoReceita}
                        consultaRepasses={consultaRepasses}
                        getClassificacaoReceita={getClassificacaoReceita}
                        setaDetalhesTipoReceita={setaDetalhesTipoReceita}
                        getAvisoTipoReceita={getAvisoTipoReceita}
                        setShowCadastrarSaida={setShowCadastrarSaida}
                        tabelas={tabelas}
                        periodosValidosAssociacaoencerrada={periodosValidosAssociacaoencerrada}
                        receita={receita}
                        verificaSeExibeDetalhamento={verificaSeExibeDetalhamento}
                        temOpcoesDetalhesTipoReceita={temOpcoesDetalhesTipoReceita}
                        getOpcoesDetalhesTipoReceita={getOpcoesDetalhesTipoReceita}
                        verificaSeDevolucao={verificaSeDevolucao}
                        readOnlyValor={readOnlyValor}
                        readOnlyContaAssociacaoReceita={readOnlyContaAssociacaoReceita}
                        retornaTiposDeContas={retornaTiposDeContas}
                        readOnlyAcaoAssociacaoReceita={readOnlyAcaoAssociacaoReceita}
                        showBotaoCadastrarSaida={showBotaoCadastrarSaida}
                        getClasificacaoAcao={getClasificacaoAcao}
                        retornaAcoes={retornaAcoes}
                        atualizaValorRepasse={atualizaValorRepasse}
                        readOnlyClassificacaoReceita={readOnlyClassificacaoReceita}
                        retornaClassificacaoReceita={retornaClassificacaoReceita}
                        showEditarSaida={showEditarSaida}
                        setExibeModalSalvoComSucesso={setExibeModalSalvoComSucesso}
                        setRedirectTo={setRedirectTo}
                        showCadastrarSaida={showCadastrarSaida}
                        objetoParaComparacao={objetoParaComparacao}
                        onCancelarTrue={onCancelarTrue}
                        onShowModal={onShowModal}
                        uuid={uuid}
                        exibirDeleteDespesa={exibirDeleteDespesa}
                        readOnlyBtnAcao={readOnlyBtnAcao}
                        onShowDeleteModal={onShowDeleteModal}
                        servicoDeVerificacoes={servicoDeVerificacoes}
                        showReceitaRepasse={showReceitaRepasse}
                        setShowReceitaRepasse={setShowReceitaRepasse}
                        showSelecionaRepasse={showSelecionaRepasse}
                        setShowSelecionaRepasse={setShowSelecionaRepasse}
                        setExibirDeleteDespesa={setExibirDeleteDespesa}
                        repasses={repasses}
                        trataRepasse={trataRepasse}
                        readOnlyEstorno={readOnlyEstorno}
                        despesa={despesa}
                        idTipoReceitaEstorno={idTipoReceitaEstorno}
                        showModalMotivoEstorno={showModalMotivoEstorno}
                        setShowModalMotivoEstorno={setShowModalMotivoEstorno}
                        listaMotivosEstorno={listaMotivosEstorno}
                        selectMotivosEstorno={selectMotivosEstorno}
                        setSelectMotivosEstorno={setSelectMotivosEstorno}
                        checkBoxOutrosMotivosEstorno={checkBoxOutrosMotivosEstorno}
                        txtOutrosMotivosEstorno={txtOutrosMotivosEstorno}
                        handleChangeCheckBoxOutrosMotivosEstorno={handleChangeCheckBoxOutrosMotivosEstorno}
                        handleChangeTxtOutrosMotivosEstorno={handleChangeTxtOutrosMotivosEstorno}
                        readOnlyReaberturaSeletiva={readOnlyReaberturaSeletiva}
                        ehOperacaoExclusaoReaberturaSeletiva={ehOperacaoExclusaoReaberturaSeletiva}
                        ehOperacaoAtualizacaoReaberturaSeletiva={ehOperacaoAtualizacaoReaberturaSeletiva}
                        origemAnaliseLancamento={origemAnaliseLancamento}
                        validacoesPersonalizadasCredito={validacoesPersonalizadasCredito}
                        formDateErrors={formDateErrors}
                        escondeBotaoDeletar={escondeBotaoDeletar}
                        mensagemDataInicialConta={mensagemDataInicialConta}
                    />
                    <section>
                        <CancelarModalReceitas
                            show={show}
                            handleClose={onHandleClose}
                            onCancelarTrue={onCancelarTrue}
                            titulo={tituloModalCancelar}
                        />
                    </section>
                    {uuid
                        ?
                        <ModalDeletarReceita
                            show={showDelete}
                            handleClose={onHandleClose}
                            onDeletarTrue={onDeletarTrue}
                            texto={msgDeletarReceita}
                        />
                        : null
                    }
                    <section>
                        <PeriodoFechado show={showPeriodoFechado} handleClose={onHandleClose}/>
                    </section>
                    <section>
                        <ErroGeral show={showErroGeral} handleClose={onHandleClose}/>
                    </section>
                    <section>
                        <AvisoTipoReceita
                            show={showAvisoTipoReceita}
                            handleClose={onHandleClose}
                            texto={msgAvisoTipoReceita}
                        />
                    </section>
                    <section>
                        <AvisoTipoReceitaEstorno
                            show={showAvisoTipoReceitaEstorno}
                            handleClose={onHandleClose}
                            texto={msgAvisoTipoReceitaEstorno}
                        />
                    </section>
                    <section>
                        <SalvarReceita show={showSalvarReceita} handleClose={fecharSalvarCredito}/>
                    </section>
                </div>
            </PaginasContainer>
        </>
    );
};