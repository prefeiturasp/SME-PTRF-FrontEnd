import React, {useCallback, useEffect, useState} from "react";
import HTTP_STATUS from "http-status-codes";
import {
    criarReceita,
    atualizaReceita,
    deletarReceita,
    getReceita,
    getTabelasReceitaReceita,
    getRepasses,
    getListaMotivosEstorno
} from '../../../../services/escolas/Receitas.service';
import {getRateioPorUuid} from "../../../../services/escolas/RateiosDespesas.service";
import {deleteDespesa, getDespesa} from "../../../../services/escolas/Despesas.service";
import {round, trataNumericos, periodoFechado} from "../../../../utils/ValidacoesAdicionaisFormularios";
import moment from "moment";
import {useLocation, useParams} from 'react-router-dom';
import {ASSOCIACAO_UUID} from '../../../../services/auth.service';
import {PeriodoFechado, ErroGeral, SalvarReceita, AvisoTipoReceita} from "../../../../utils/Modais";
import {ModalDeletarReceita} from "../ModalDeletarReceita";
import {CancelarModalReceitas} from "../CancelarModalReceitas";
import "../receitas.scss"
import {ReceitaFormFormik} from "./ReceitaFormFormik";
import ReferenciaDaDespesaEstorno from "../ReferenciaDaDespesaEstorno";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import {toastCustom} from "../../../Globais/ToastCustom";


export const ReceitaForm = () => {

    let {origem} = useParams();
    let {uuid} = useParams();
    const parametros = useLocation();

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
    const [repasse, setRepasse] = useState({});
    const [idxTipoDespesa, setIdxTipoDespesa] = useState(0);
    const [showReceitaRepasse, setShowReceitaRepasse] = useState(false);
    const [repasses, setRepasses] = useState([]);
    const [showSelecionaRepasse, setShowSelecionaRepasse] = useState(false);
    const [msgDeletarReceita, setmsgDeletarReceita] = useState('<p>Tem certeza que deseja excluir este crédito? A ação não poderá ser refeita.</p>')
    const [msgAvisoTipoReceita, setMsgAvisoTipoReceita] = useState('');
    const [exibeModalSalvoComSucesso, setExibeModalSalvoComSucesso] = useState(true)
    const [uuid_despesa, setUuidDespesa] = useState('')
    const [exibirDeleteDespesa, setExibirDeleteDespesa] = useState(true);
    const [classificacoesAceitas, setClassificacoesAceitas] = useState([])

    // ************* Modo Estorno
    const [readOnlyEstorno, setReadOnlyEstorno] = useState(false);
    const [rateioEstorno, setRateioEstorno] = useState({});
    const [tituloPagina, setTituloPagina] = useState('')
    const [despesa, setDespesa] = useState({})
    const [idTipoReceitaEstorno, setIdTipoReceitaEstorno] = useState("")

    const carregaTabelas = useCallback(async ()=>{
        let tabelas_receitas = await getTabelasReceitaReceita()
        setTabelas(tabelas_receitas)
    }, [])

    useEffect(()=>{
        carregaTabelas()
    }, [carregaTabelas]);


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
            await periodoFechado(rateio.data_transacao, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
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

            getReceita(uuid).then(async response => {
                const resp = response.data;

                if (resp && resp.saida_do_recurso && resp.saida_do_recurso.uuid){
                    setShowEditarSaida(true)
                    setShowCadastrarSaida(false)
                    setUuidDespesa(resp.saida_do_recurso.uuid)
                }

                // Verificar se existe um rateio atrelado a receita
                if (resp && resp.rateio_estornado && resp.rateio_estornado.uuid){
                    setTituloPagina('Edição do Estorno')
                    setRateioEstorno(resp.rateio_estornado)
                    setreadOnlyTipoReceita(true)
                }else {
                    setTituloPagina('Edição do Crédito')
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
                if (resp && resp.acao_associacao && resp.acao_associacao.uuid){
                    setUuidReceita(uuid)
                    showBotaoCadastrarSaida(resp.acao_associacao.uuid, init)
                }
                periodoFechado(resp.data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
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

        if (values.tipo_receita === idTipoReceitaEstorno && Object.keys(errors).length === 0){
            //e.preventDefault()
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

        if (Object.keys(errors).length === 0){

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
                await atualizar(uuid, payload).then(response => {
                    if (exibeModalSalvoComSucesso){
                        exibeMsgSalvoComSucesso(payload)
                    }else {
                        getPath()
                    }
                });
            } else {
                cadastrar(payload).then(response => {
                    if (exibeModalSalvoComSucesso){
                        //setShowSalvarReceita(true);
                        setUuidReceita(response);
                        exibeMsgSalvoComSucesso(payload)
                    }else {
                        setUuidReceita(response);
                        getPath(response)
                    }
                });
            }
            setLoading(false);
        }


    };

    const cadastrar = async (payload) => {
        try {
            const response = await criarReceita(payload);
            if (response.status === HTTP_STATUS.CREATED) {
                console.log("Operação realizada com sucesso!");
                return response.data.uuid;
            } else {
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const atualizar = async (uuid, payload) => {
        try {
            const response = await atualizaReceita(uuid, payload);
            if (response.status === HTTP_STATUS.CREATED) {
                console.log("Operação realizada com sucesso!");
            } else {
                console.log('UPDATE ==========>>>>>>', response)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const onCancelarTrue = () => {
        setShow(false);
        setRedirectTo('');
        getPath();
    };

    const onHandleClose = () => {
        setShow(false);
        setShowDelete(false);
        setShowPeriodoFechado(false);
        setShowErroGeral(false);
        setShowAvisoTipoReceita(false);
        
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
        }else if (initialValue.tipo_receita === idTipoReceitaEstorno){
            setmsgDeletarReceita('<p>Tem certeza que deseja excluir esse estorno? Essa ação irá desfazer o estorno da despesa relacionada.</p>')
        }
        setShowDelete(true);
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

            // Filtra as contas pelos tipos aceitos
            return (
                tabelas.contas_associacao.filter(conta => (tipos_conta.includes(conta.nome))).map((item, key) => (
                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>)
            ))
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
            await periodoFechado(values.data, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral)
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
                    />
                    <section>
                        <CancelarModalReceitas
                            show={show}
                            handleClose={onHandleClose}
                            onCancelarTrue={onCancelarTrue}
                            uuid={uuid}
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
                        <SalvarReceita show={showSalvarReceita} handleClose={fecharSalvarCredito}/>
                    </section>
                </div>
            </PaginasContainer>
        </>
    );
};