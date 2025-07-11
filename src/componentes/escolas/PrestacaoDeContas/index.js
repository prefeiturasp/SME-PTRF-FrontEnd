import React, {useEffect, useState, Fragment, useCallback, useContext} from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao, getDataPreenchimentoPreviaAta, getContasAtivasDaAssociacaoNoPeriodo} from "../../../services/escolas/Associacao.service"
import {getStatusPeriodoPorData, postConcluirPeriodo, getDataPreenchimentoAta, getIniciarAta, getIniciarPreviaAta} from "../../../services/escolas/PrestacaoDeContas.service";
import {getTabelasReceita} from "../../../services/escolas/Receitas.service";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";
import DemonstrativoFinanceiroPorConta from "./DemonstrativoFinanceiroPorConta";
import RelacaoDeBens from "./RelacaoDeBens";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";
import Loading from "../../../utils/Loading";
import {ModalConcluirPeriodo} from "./ModalConcluirPeriodo";
import { ModalConcluirAcertoSemPendencias } from "./ModalConcluirAcertoSemPendencias";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {GeracaoAtaApresentacao} from "../GeracaoDaAta/GeracaoAtaApresentacao";
import {GeracaoAtaRetificadora} from "../GeracaoAtaRetificadora";
import {exibeDateTimePT_BR_Ata} from "../../../utils/ValidacoesAdicionaisFormularios";
import {visoesService} from "../../../services/visoes.service";
import {ModalConcluirAcertoComPendencias} from "./ModalConcluirAcertoComPendencias";
import { SidebarLeftService } from "../../../services/SideBarLeft.service";
import { SidebarContext } from "../../../context/Sidebar";
import {NotificacaoContext} from "../../../context/Notificacoes";
import {getRegistrosFalhaGeracaoPc} from "../../../services/Notificacoes.service";
import {ModalNotificaErroConcluirPC} from "../../Globais/ModalAntDesign/ModalNotificaErroConcluirPC";
import { ModalPendenciasCadastrais } from "./ModalPendenciasCadastrais";
import { ModalAvisoAssinatura } from "./ModalAvisoAssinatura";
import { setPersistenteUrlVoltar } from "../../../store/reducers/componentes/escolas/PrestacaoDeContas/PendenciaCadastro/actions";
import { CustomModalConfirm } from "../../Globais/Modal/CustomModalConfirm";

export const PrestacaoDeContas = ({setStatusPC, registroFalhaGeracaoPc, setRegistroFalhaGeracaoPc, setApresentaBarraAvisoErroProcessamentoPc}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let {monitoramento} = useParams();

    const contextSideBar = useContext(SidebarContext);

    const notificacaoContext = useContext(NotificacaoContext);

    const [periodoPrestacaoDeConta, setPeriodoPrestacaoDeConta] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [statusPrestacaoDeConta, setStatusPrestacaoDeConta] = useState(false);
    const [uuidPrestacaoConta, setUuidPrestacaoConta] = useState('');
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [contaPrestacaoDeContas, setContaPrestacaoDeContas] = useState(false);
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [loading, setLoading] = useState(true);
    const [loadingMonitoramentoPc, setLoadingMonitoramentoPc] = useState(false);
    const [showConcluir, setShowConcluir] = useState(false);
    const [showConcluirAcertoComPendencia, setShowConcluirAcertoComPendencia] = useState(false);
    const [corBoxAtaApresentacao, setcorBoxAtaApresentacao] = useState("");
    const [textoBoxAtaApresentacao, settextoBoxAtaApresentacao] = useState("");
    const [dataBoxAtaApresentacao, setdataBoxAtaApresentacao] = useState("");
    const [uuidAtaApresentacao, setUuidAtaApresentacao] = useState("");
    const [showConcluirAcertosSemPendencias, setShowConcluirAcertosSemPendencias] = useState(false);
    const [showModalConcluirAcertosSemPendencias, setShowModalConcluirAcertosSemPendencias] = useState(false);
    const [stringMonitoramento, setStringMonitoramento] = useState(monitoramento)
    const [modalPendenciasCadastrais, setModalPendenciasCadastrais] = useState({show: false, title: '', message: '', actions: []});

    const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID)

    // Falha Geracao PC
    // Força o fechamento do Modal de Falha ao Gerar PC, que é exibido em todas as outras páginas
    const [showExibeModalErroConcluirPc, setShowExibeModalErroConcluirPc] = useState(false);

    useEffect(()=>{
        notificacaoContext.setShow(false)
    }, [notificacaoContext])

    const status_a_considerar = () => {
        let status = []

        if(visoesService.featureFlagAtiva('novo-processo-pc')){
            status = ['A_PROCESSAR', 'EM_PROCESSAMENTO', 'CALCULADA', 'DEVOLVIDA_CALCULADA']
        }
        else{
            status = ['A_PROCESSAR', 'EM_PROCESSAMENTO']
        }

        return status
    };

    useEffect(() => {
        if (statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && status_a_considerar().includes(statusPrestacaoDeConta.prestacao_contas_status.status_prestacao)){
            const timer = setInterval(() => {
                getStatusPrestacaoDeConta();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }
    });

    useEffect(() => {
        getPeriodoPrestacaoDeConta();
        carregaPeriodos();
        carregaTabelas();
        getStatusPrestacaoDeConta();
        getUuidPrestacaoDeConta();
        getContaPrestacaoDeConta();
        setConfBoxAtaApresentacao()
    }, []);

    useEffect(() => {
    setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('periodoPrestacaoDeConta', JSON.stringify(periodoPrestacaoDeConta));
    }, [periodoPrestacaoDeConta]);

    useEffect(() => {
        localStorage.setItem('statusPrestacaoDeConta', JSON.stringify(statusPrestacaoDeConta));
    }, [statusPrestacaoDeConta]);

    useEffect(() => {
        localStorage.setItem('uuidPrestacaoConta', uuidPrestacaoConta);
        setConfBoxAtaApresentacao();
    }, [uuidPrestacaoConta]);

    useEffect(() => {
        localStorage.setItem('contaPrestacaoDeConta', JSON.stringify(contaPrestacaoDeContas));
    }, [contaPrestacaoDeContas]);

    const carregaPeriodos = async () => {
        let ignorar_devolvidas = true
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao(ignorar_devolvidas);
        setPeriodosAssociacao(periodos);
    };

    useEffect(() => {
        carregaTabelas()
    }, [periodoPrestacaoDeConta])

    const carregaTabelas = async () => {
        if(periodoPrestacaoDeConta && periodoPrestacaoDeConta.periodo_uuid) {
            await getContasAtivasDaAssociacaoNoPeriodo(periodoPrestacaoDeConta.periodo_uuid).then(response => {
                if (response.length > 0){
                    setContasAssociacao(response);
                    setContaPrestacaoDeContas({
                        conta_uuid: response[0].uuid
                    })
                }
                else{
                    setContasAssociacao(false);
                    setContaPrestacaoDeContas(false);
                }
            }).catch(error => {
                console.log(error);
            });
        }
    };


    const toggleBtnEscolheContaAoTrocarPeriodo = useCallback(() => {
        if(localStorage.getItem('contaPrestacaoDeConta') && contasAssociacao){
            let conta_local_storage = JSON.parse(localStorage.getItem('contaPrestacaoDeConta'));
            let index_da_conta = null;

            for(let i=0; i<=contasAssociacao.length-1; i++){
                if(contasAssociacao[i].uuid === conta_local_storage.conta_uuid){
                    index_da_conta = i;
                    break;
                }
            }

            // Caso não encontre a conta, é setado a primeira conta da lista
            if(index_da_conta === null){
                index_da_conta = 0;
            }

            setClickBtnEscolheConta({
                [index_da_conta]: true
            });
        }
    }, [contasAssociacao]);

    useEffect(() => {
        toggleBtnEscolheContaAoTrocarPeriodo()
    }, [toggleBtnEscolheContaAoTrocarPeriodo])

    const getPeriodoPrestacaoDeConta = async () => {
        if (localStorage.getItem('periodoPrestacaoDeConta')) {
            const periodo_prestacao_de_contas = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta'));
            setPeriodoPrestacaoDeConta(periodo_prestacao_de_contas)
        } else {
            setPeriodoPrestacaoDeConta({})
        }
    };

    const getStatusPrestacaoDeConta = async () => {
        let periodo_prestacao_de_contas = JSON.parse(localStorage.getItem("periodoPrestacaoDeConta"));

        if (periodo_prestacao_de_contas && periodo_prestacao_de_contas.periodo_uuid){
            let data_inicial = periodo_prestacao_de_contas.data_inicial;
            let status = await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), data_inicial);
            setUuidPrestacaoConta(status.prestacao_conta);
            setStatusPrestacaoDeConta(status)
            setStatusPC(status)
        }else {
            if (localStorage.getItem('statusPrestacaoDeConta')) {
                const status_prestacao_de_contas = JSON.parse(localStorage.getItem('statusPrestacaoDeConta'));
                setStatusPrestacaoDeConta(status_prestacao_de_contas)
                setStatusPC(status_prestacao_de_contas)
            } else {
                setStatusPrestacaoDeConta({})
                setStatusPC({})
            }
        }
    };

    const getUuidPrestacaoDeConta = () => {
        if (localStorage.getItem('uuidPrestacaoConta')) {
            const uuid_prestacao_de_contas = localStorage.getItem('uuidPrestacaoConta');
            setUuidPrestacaoConta(uuid_prestacao_de_contas)
        } else {
            setUuidPrestacaoConta('')
        }
    };

    const getContaPrestacaoDeConta = () => {
        if (localStorage.getItem('contaPrestacaoDeConta')) {
            const conta_prestacao_de_contas = JSON.parse(localStorage.getItem('contaPrestacaoDeConta'));
            setContaPrestacaoDeContas(conta_prestacao_de_contas)
        } else {
            setContaPrestacaoDeContas({})
        }
    };

    const handleChangePeriodoPrestacaoDeConta = async (name, value) => {
        setLoading(true);
        if (value){
            let valor = JSON.parse(value);
            setPeriodoPrestacaoDeConta(valor);
            let status = await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), valor.data_inicial);
            setUuidPrestacaoConta(status.prestacao_conta);
            setStatusPrestacaoDeConta(status);
            setStatusPC(status)
            await setConfBoxAtaApresentacao()
        }
        setLoading(false);
    };

    const handleClickContaPrestacaoDeContas = (uuid_conta) =>{
        setLoading(true);
        setContaPrestacaoDeContas({
            conta_uuid: uuid_conta
        });
        setLoading(false);
    };

    const retornaObjetoPeriodoPrestacaoDeConta = (periodo_uuid, data_inicial, data_final) => {
        return JSON.stringify({
            periodo_uuid: periodo_uuid,
            data_inicial: data_inicial,
            data_final: data_final
        });
    };

    const toggleBtnEscolheConta = (id) => {
        setLoading(true);
        setClickBtnEscolheConta({
            [id]: !clickBtnEscolheConta[id]
        });
        setLoading(false);
    };

    const checkCondicaoExibicao = (obj) =>{
        return obj && Object.entries(obj).length > 0
    };

    const concluirPeriodo = useCallback( async (justificativaPendencia='') =>{
        if (periodoPrestacaoDeConta && periodoPrestacaoDeConta.periodo_uuid){

            let status_concluir_periodo = await postConcluirPeriodo(periodoPrestacaoDeConta.periodo_uuid, justificativaPendencia);
            setUuidPrestacaoConta(status_concluir_periodo.uuid);
            let status = await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), periodoPrestacaoDeConta.data_inicial);
            setStatusPrestacaoDeConta(status);
            setStatusPC(status)
            setLoadingMonitoramentoPc(false)
            await carregaPeriodos();
            await setConfBoxAtaApresentacao();
        }
    }, [periodoPrestacaoDeConta]);

    const handleCloseModalPendenciasCadastrais = () => {
        setModalPendenciasCadastrais({show: false, title: '', message: '', actions: []});
    };

    function goToMembrosAssociacao() {
        navigate('/membros-da-associacao')
    }

    function goToAssociacoes() {
        dispatch(setPersistenteUrlVoltar('/prestacao-de-contas/'));
        navigate('/dados-da-associacao/')
    };

    function goToConciliacaoBancaria(pendencias) {
        if (pendencias.contas_pendentes.length > 1){
            navigate(`/detalhe-das-prestacoes/${periodoPrestacaoDeConta.periodo_uuid}/?origem=concluir-periodo`)
        } else {
            navigate(`/detalhe-das-prestacoes/${periodoPrestacaoDeConta.periodo_uuid}/${pendencias.contas_pendentes[0]}/?origem=concluir-periodo`)
        }
    };
    
    function checkPendenciasCadastrais() {     
        if(statusPrestacaoDeConta && statusPrestacaoDeConta.pendencias_cadastrais){
              let pendencias = statusPrestacaoDeConta.pendencias_cadastrais;
              if (pendencias.dados_associacao && pendencias.conciliacao_bancaria){
                  setModalPendenciasCadastrais({
                    show: true,
                    title: 'Há campos não preenchidos na(s) funcionalidade(s)',
                    message: "<ul><li>Dados da Associação</li><li>Conciliação Bancária</li></ul>",
                    actions:[
                        {title: 'Ir para dados da Associação', callback: () => goToAssociacoes()},
                        {title: 'Ir para Conciliação Bancária', callback: () => goToConciliacaoBancaria(pendencias.conciliacao_bancaria)},
                    ]  
                  })
              } else if(pendencias.dados_associacao) {
                  setModalPendenciasCadastrais({
                      show: true,
                      title: 'Há campos não preenchidos na(s) funcionalidade(s)',
                      message:"<ul><li>Dados da Associação</li></ul>",
                      actions:[
                        {title: 'Ir para dados da Associação', callback: () => goToAssociacoes()},
                    ]  
                  })
              } else if(pendencias.conciliacao_bancaria){
                  setModalPendenciasCadastrais({
                      show: true,
                      title: 'Há campos não preenchidos na(s) funcionalidade(s)',
                      message: "<ul><li>Conciliação Bancária</li></ul>",
                      actions:[
                        {title: 'Ir para Conciliação Bancária', callback: () => goToConciliacaoBancaria(pendencias.conciliacao_bancaria)},
                    ]  
                  })                
              }
          }
    };

    const handleConcluirPeriodo = () =>{
        if(statusPrestacaoDeConta && statusPrestacaoDeConta.pendencias_cadastrais){
            checkPendenciasCadastrais();
        } else {
            if(statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status){
                if(statusPrestacaoDeConta.prestacao_contas_status.status_prestacao !== "DEVOLVIDA"){
                    setShowConcluir(true)
                }
                else if(statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === "DEVOLVIDA"){
                    if(statusPrestacaoDeConta.prestacao_contas_status.tem_acertos_pendentes){
                        setShowConcluirAcertoComPendencia(true);
                    }
                    else{
                        if(statusPrestacaoDeConta.tem_conta_encerrada_com_saldo){
                            CustomModalConfirm({
                                dispatch,
                                title: 'Devido as alterações realizadas houve uma mudança no saldo da conta.',
                                message: 'A análise da PC não poderá ser concluída pela DRE até a finalização dos acertos que tornem a conta zerada.',
                                cancelText: 'Voltar',
                                confirmText: 'Concluir acerto',
                                dataQa: 'modal-acerto-alterou-saldo-conta-encerrada',
                                onConfirm: () => setShowConcluirAcertosSemPendencias(true)
                            });
                        } else {
                            setShowConcluirAcertosSemPendencias(true);
                        }
                    }
                }
            }
        }
    }

    const setConfBoxAtaApresentacao = async ()=>{
        let uuid_prestacao_de_contas = localStorage.getItem('uuidPrestacaoConta');
        let data_preenchimento;

        if (uuid_prestacao_de_contas){
            try {
                data_preenchimento = await getDataPreenchimentoAta(uuid_prestacao_de_contas);
                localStorage.setItem("uuidAta", data_preenchimento.uuid);
                setUuidAtaApresentacao(data_preenchimento.uuid)
                settextoBoxAtaApresentacao(data_preenchimento.nome);
                if (data_preenchimento.alterado_em === null){
                    setcorBoxAtaApresentacao("vermelho");
                    setdataBoxAtaApresentacao("Ata não preenchida");
                }
                else if (!data_preenchimento.completa) {
                    setcorBoxAtaApresentacao("vermelho");
                    setdataBoxAtaApresentacao("Ata incompleta");
                }
                else {
                    setcorBoxAtaApresentacao("verde");
                    setdataBoxAtaApresentacao("Último preenchimento em "+exibeDateTimePT_BR_Ata(data_preenchimento.alterado_em));   
                }

            }catch (e) {
                data_preenchimento = await getIniciarAta(uuid_prestacao_de_contas);
                localStorage.setItem("uuidAta", data_preenchimento.uuid);
                setUuidAtaApresentacao(data_preenchimento.uuid)
                setcorBoxAtaApresentacao("vermelho");
                settextoBoxAtaApresentacao(data_preenchimento.nome);
                setdataBoxAtaApresentacao("Ata não preenchida");

            }
        }

        if (!uuid_prestacao_de_contas && localStorage.getItem('periodoPrestacaoDeConta')) {
            const periodo_prestacao_de_contas = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta'));
            if (periodo_prestacao_de_contas.periodo_uuid) {
                try {
                    data_preenchimento = await getDataPreenchimentoPreviaAta(periodo_prestacao_de_contas.periodo_uuid);
                    localStorage.setItem("uuidAta", data_preenchimento.uuid);
                    setUuidAtaApresentacao(data_preenchimento.uuid)
                    settextoBoxAtaApresentacao(data_preenchimento.nome);
                    if (data_preenchimento.alterado_em === null) {
                        setcorBoxAtaApresentacao("vermelho");
                        setdataBoxAtaApresentacao("Ata não preenchida");
                    } else {
                        setcorBoxAtaApresentacao("verde");
                        setdataBoxAtaApresentacao("Último preenchimento em " + exibeDateTimePT_BR_Ata(data_preenchimento.alterado_em));
                    }
                    return setLoading(false);
                } catch (e) {
                    console.log(e)
                }

                try {
                    data_preenchimento = await getIniciarPreviaAta(associacaoUuid, periodo_prestacao_de_contas.periodo_uuid);
                    localStorage.setItem("uuidAta", data_preenchimento.uuid);
                    setUuidAtaApresentacao(data_preenchimento.uuid)
                    setcorBoxAtaApresentacao("vermelho");
                    settextoBoxAtaApresentacao(data_preenchimento.nome);
                    setdataBoxAtaApresentacao("Ata não preenchida");
                } catch (e) {
                    console.log(e)
                }

            }
        }
        setLoading(false);

    };

    const onClickVisualizarAta = async (uuid_ata) =>{
        setLoading(true);
        window.location.assign(`/visualizacao-da-ata/${uuid_ata}`)
    };

    const onConcluirSemPendencias = () => {
        setShowConcluir(false);
        setShowConcluirAcertosSemPendencias(false);
        
        setShowModalConcluirAcertosSemPendencias(false);
        concluirPeriodo();
        if (statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === "DEVOLVIDA") {
            localStorage.removeItem("NOTIFICAR_DEVOLUCAO_REFERENCIA")
            notificacaoContext.setExibeModalTemDevolucao(false)
            notificacaoContext.setExibeMensagemFixaTemDevolucao(false)
        }
    };

    const onIrParaAnaliseDre = async() => {
        setShowConcluirAcertoComPendencia(false);
        irParaAnaliseDre();
    }

    const irParaAnaliseDre = async() => {
        // Ao setar para false, quando a função a seguir setar o click do item do menu
        // a pagina não ira automaticamente para a url do item

        await contextSideBar.setIrParaUrl(false)
        SidebarLeftService.setItemActive("analise_dre")

        // Necessário voltar o estado para true, para clicks nos itens do menu continuarem funcionando corretamente
        contextSideBar.setIrParaUrl(true)
        
        let uuid_prestacao_de_contas = localStorage.getItem('uuidPrestacaoConta');
        navigate(`/consulta-detalhamento-analise-da-dre/${uuid_prestacao_de_contas}`)
    }

    const onHandleClose = () => {
        setShowModalConcluirAcertosSemPendencias(false);
        setShowConcluirAcertosSemPendencias(false);
        setShowConcluir(false);
    };


    const onHandleCloseModalConcluirPeriodoComPendencias = () => {
        setShowConcluirAcertoComPendencia(false);
    };

    const podeConcluir = [['concluir_periodo_prestacao_contas']].some(visoesService.getPermissoes)
    const podeGerarPrevias = [['gerar_previas_prestacao_contas']].some(visoesService.getPermissoes)
    const podeBaixarDocumentos = [['baixar_documentos_prestacao_contas']].some(visoesService.getPermissoes)

    const exibeBoxAtaRetificadora = useCallback(() => {
           return statusPrestacaoDeConta &&
            statusPrestacaoDeConta.prestacao_contas_status && statusPrestacaoDeConta.prestacao_contas_status.requer_retificacao
    }, [statusPrestacaoDeConta])

    useEffect(()=>{
        exibeBoxAtaRetificadora()
    }, [exibeBoxAtaRetificadora])

    const textoBotaoConcluir = (status_prestacao) => {
        if(status_prestacao && status_prestacao.prestacao_contas_status){
            if(status_prestacao.prestacao_contas_status.status_prestacao === "DEVOLVIDA"){
                return "Concluir acerto"
            }
            else{
                return "Concluir período"
            }
        }

        return ""
    }

    // Falha Geraçao PC
    // Trata a exibição quando vem de fora da Prestação de Contas
    useEffect(() => {
        const onPageLoad = async () => {

            if (monitoramento && periodoPrestacaoDeConta && periodoPrestacaoDeConta.periodo_uuid ){

                setLoadingMonitoramentoPc(true)

                // Removendo o parâmetro /monitoramento-de-pc, que veio na url para evitar disparar novamente o concluirPeriodo() no caso de um Refresh.
                // Não foi possível utilizar useHistory.push() dentro do NotificacaoContext.
                // Por isso, ao clicar no modal de Monitoramento de PC (Concluir geração) o redirecionamento foi feito com  window.location.assign('/prestacao-de-contas/monitoramento-de-pc')
                navigate('/prestacao-de-contas/', { replace: true })
                setStringMonitoramento(undefined)

                await concluirPeriodo()

                setLoadingMonitoramentoPc(false)
            }
        };

        onPageLoad();

    }, [monitoramento, periodoPrestacaoDeConta, concluirPeriodo]);


    // Trata a exibição quando vem da Prestação de Contas, a chave é a stringMonitoramento que identifica que veio da NotificacaoContext
    const buscarRegistrosFalhaGeracaoPc = useCallback( async () => {
        if (!stringMonitoramento && !loading && !loadingMonitoramentoPc && statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && statusPrestacaoDeConta.prestacao_contas_status.status_prestacao !== 'EM_PROCESSAMENTO' && statusPrestacaoDeConta.prestacao_contas_status.status_prestacao !== 'A_PROCESSAR') {
            let associacao_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
            let registros_de_falha = await getRegistrosFalhaGeracaoPc(associacao_uuid)
            if (registros_de_falha && registros_de_falha.length > 0) {
                setRegistroFalhaGeracaoPc(registros_de_falha[0])
                setShowExibeModalErroConcluirPc(true)
            }else {
                setShowExibeModalErroConcluirPc(false)
            }
        }
    }, [stringMonitoramento, loading, statusPrestacaoDeConta, loadingMonitoramentoPc])

    useEffect(() => {
        buscarRegistrosFalhaGeracaoPc()
    }, [buscarRegistrosFalhaGeracaoPc]);

    const verificaBarraAvisoErroProcessamentoPc = () => {
        if (!registroFalhaGeracaoPc) {
            return setApresentaBarraAvisoErroProcessamentoPc(false);
        } else if (registroFalhaGeracaoPc && periodoPrestacaoDeConta.periodo_uuid === registroFalhaGeracaoPc.periodo_uuid) {
            if(statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && status_a_considerar().includes(statusPrestacaoDeConta.prestacao_contas_status.status_prestacao )) {
                return setApresentaBarraAvisoErroProcessamentoPc(false);
            }

            if(statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && statusPrestacaoDeConta.prestacao_contas_status.status_prestacao  === "NAO_RECEBIDA") {
                return setApresentaBarraAvisoErroProcessamentoPc(false);
            }
            return setApresentaBarraAvisoErroProcessamentoPc(true);
        }
        return setApresentaBarraAvisoErroProcessamentoPc(false);
    };

    useEffect(() => {
        verificaBarraAvisoErroProcessamentoPc()
    }, [registroFalhaGeracaoPc, statusPrestacaoDeConta, periodoPrestacaoDeConta.periodo_uuid, statusPrestacaoDeConta.prestacao_contas_status])

    return (
        <>
            {loading || loadingMonitoramentoPc ? (
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="50"
                    marginBottom="0"
                />
            ):
                <>
                    {checkCondicaoExibicao(statusPrestacaoDeConta) &&
                        <BarraDeStatusPrestacaoDeContas
                            statusPrestacaoDeConta={statusPrestacaoDeConta}
                        />
                    }
                    {statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && status_a_considerar().includes(statusPrestacaoDeConta.prestacao_contas_status.status_prestacao ) ? (
                        <>
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="50"
                                marginBottom="0"
                            />
                            <div className='text-center'>
                                <p>Os documentos estão sendo gerados. Enquanto isso, você pode realizar outras atividades no sistema.</p>
                            </div>
                        </>
                    ) :
                        <>
                            <TopoSelectPeriodoBotaoConcluir
                                periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                                handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
                                periodosAssociacao={periodosAssociacao}
                                retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
                                statusPrestacaoDeConta={statusPrestacaoDeConta}
                                checkCondicaoExibicao={checkCondicaoExibicao}
                                contasAssociacao={contasAssociacao}
                                concluirPeriodo={handleConcluirPeriodo}
                                podeConcluir={podeConcluir}
                                textoBotaoConcluir={textoBotaoConcluir}
                            />
                            {checkCondicaoExibicao(periodoPrestacaoDeConta)  ? (
                                    <>
                                        <nav className="nav mb-4 mt-2 menu-interno">
                                            {contasAssociacao && contasAssociacao.length > 0 && contasAssociacao.map((conta, index) =>
                                                <Fragment key={index}>
                                                    <li className="nav-item">
                                                        <button
                                                            onClick={() => {
                                                                toggleBtnEscolheConta(index);
                                                                handleClickContaPrestacaoDeContas(conta.uuid);
                                                            }}
                                                            data-qa={`btn-${index}-tabs-contas`}
                                                            className={`nav-link btn-escolhe-acao mr-3 ${clickBtnEscolheConta[index] ? "btn-escolhe-acao-active" : ""}`}
                                                        >
                                                            Conta {conta.nome}
                                                        </button>
                                                    </li>
                                                </Fragment>
                                            )}
                                        </nav>

                                        {contasAssociacao && contasAssociacao.length > 0 
                                        ?
                                            <>
                                                <DemonstrativoFinanceiroPorConta
                                                    periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                                                    statusPrestacaoDeConta={statusPrestacaoDeConta}
                                                    contaPrestacaoDeContas={contaPrestacaoDeContas}
                                                    setLoading={setLoading}
                                                    podeGerarPrevias={podeGerarPrevias}
                                                    podeBaixarDocumentos={podeBaixarDocumentos}
                                                />
                                                <RelacaoDeBens
                                                    periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                                                    statusPrestacaoDeConta={statusPrestacaoDeConta}
                                                    contaPrestacaoDeContas={contaPrestacaoDeContas}
                                                    setLoading={setLoading}
                                                    podeGerarPrevias={podeGerarPrevias}
                                                    podeBaixarDocumentos={podeBaixarDocumentos}
                                                />
                                                <GeracaoAtaApresentacao
                                                    onClickVisualizarAta={()=>onClickVisualizarAta(uuidAtaApresentacao)}
                                                    setLoading={setLoading}
                                                    corBoxAtaApresentacao={corBoxAtaApresentacao}
                                                    textoBoxAtaApresentacao={textoBoxAtaApresentacao}
                                                    dataBoxAtaApresentacao={dataBoxAtaApresentacao}
                                                    uuidAtaApresentacao={uuidAtaApresentacao}
                                                    uuidPrestacaoConta={uuidPrestacaoConta}
                                                />

                                                {localStorage.getItem('uuidPrestacaoConta') && exibeBoxAtaRetificadora() &&
                                                    <GeracaoAtaRetificadora
                                                        uuidPrestacaoConta={localStorage.getItem('uuidPrestacaoConta')}
                                                        statusPrestacaoDeConta={statusPrestacaoDeConta}
                                                    />
                                                }
                                            </>
                                        :
                                            <MsgImgCentralizada
                                                texto='Não há contas cadastradas para a Associação para o período selecionado. '
                                                img={Img404}
                                                dataQa='nao-ha-contas-cadastradas-para-associacao-periodo-selecionado'
                                            />

                                        }
                                    </>
                                ):
                                <MsgImgCentralizada
                                    texto='Selecione um período acima para visualizar as ações'
                                    img={Img404}
                                    dataQa='selecione-um-periodo'
                                />
                            }
                        </>
                    }
                    <section>
                        <ModalNotificaErroConcluirPC
                            show={showExibeModalErroConcluirPc}
                            titulo={`${registroFalhaGeracaoPc.excede_tentativas ? "Já foram feitas diversas tentativas para realizar a conclusão do período" : "Não foi possível concluir o período"}`}
                            texto={`${registroFalhaGeracaoPc.excede_tentativas ? `Favor entrar em contato com a DRE para que a geração da Prestação de Contas ${registroFalhaGeracaoPc.periodo_referencia} possa ser concluída.` : `Houve um erro na geração da Prestação de Contas do período ${registroFalhaGeracaoPc.periodo_referencia}, deseja reprocessar?`}`}
                            
                            primeiroBotaoTexto={`${registroFalhaGeracaoPc.excede_tentativas ? "OK" : "Cancelar"}`}
                            primeiroBotaoCss={`${registroFalhaGeracaoPc.excede_tentativas ? "btn-base-verde" : "btn-base-verde-outline"}`}
                            handleClose={()=>setShowExibeModalErroConcluirPc(false)}
                            
                            segundoBotaoTexto={registroFalhaGeracaoPc && !registroFalhaGeracaoPc.excede_tentativas ? "Reprocessar" : null}
                            segundoBotaoCss={`${registroFalhaGeracaoPc.excede_tentativas ? null : "success"}`}
                            segundoBotaoOnclick={
                            registroFalhaGeracaoPc && !registroFalhaGeracaoPc.excede_tentativas ? ()=> {
                                setShowExibeModalErroConcluirPc(false)
                                concluirPeriodo()
                            } : null }
                            hideSegundoBotao={registroFalhaGeracaoPc.excede_tentativas}
                            wrapClassName={"modal-notifica-erro-concluir-pc"}
                            
                            dataQa="modal-notifica-erro-concluir-PC"
                        />
                    </section>
                    <section>
                        <ModalConcluirPeriodo
                            show={visoesService.featureFlagAtiva('historico-de-membros') ? showModalConcluirAcertosSemPendencias : showConcluir}
                            handleClose={onHandleClose}
                            onConcluir={onConcluirSemPendencias}
                            titulo="Concluir Prestação de Contas"
                            texto="<p>Ao concluir a Prestação de Contas, o sistema <strong>bloqueará</strong> 
                            o cadastro e a edição de qualquer crédito ou despesa nesse período.
                            Para conferir as informações cadastradas, sem bloqueio do sistema nesse período, gere um documento prévio.
                            Você confirma a conclusão dessa Prestação de Contas?</p>"
                            dataQa="modal-conluir-periodo"
                        />
                    </section>
                    <section>
                        <ModalConcluirAcertoComPendencias
                            titulo="Concluir acerto da Prestação de Contas"
                            handleClose={onHandleCloseModalConcluirPeriodoComPendencias}
                            onIrParaAnaliseDre={onIrParaAnaliseDre}
                            show={showConcluirAcertoComPendencia}
                            dataQa="modal-concluir-acertos-com-pendencias"
                        />
                    </section>
                    <section>
                        <ModalAvisoAssinatura 
                            show={(showConcluirAcertosSemPendencias || showConcluir) && visoesService.featureFlagAtiva('historico-de-membros') && !showModalConcluirAcertosSemPendencias}
                            primeiroBotaoOnclick={goToMembrosAssociacao}
                            segundoBotaoOnclick={() => setShowModalConcluirAcertosSemPendencias(true)}
                            titulo="Assinaturas do Demonstrativo e da Relação de bens"
                            texto="<p>Os campos de assinatura do Demonstrativo e da Relação de Bens, se houver, serão exibidos conforme os membros ativos da Associação na presente data. Caso precise realizar alguma atualização nos membros, faço-o primeiro e depois conclua o período /acertos.</p>"
                            dataQa="modal-aviso-assinatura-demonstrativo-relacao-bens"
                            segundoBotaoTexto={textoBotaoConcluir(statusPrestacaoDeConta)}
                        />
                    </section>
                    <section>
                        <ModalConcluirAcertoSemPendencias
                            show={visoesService.featureFlagAtiva('historico-de-membros') ? showModalConcluirAcertosSemPendencias : showConcluirAcertosSemPendencias}
                            handleClose={onHandleClose}
                            onConcluir={onConcluirSemPendencias}
                            titulo="Concluir acerto da Prestação de Contas"
                            texto="<p>Ao concluir a Prestação de Contas, o sistema <strong>bloqueará</strong> 
                            o cadastro e a edição de qualquer crédito ou despesa nesse período.
                            Para conferir as informações cadastradas, sem bloqueio do sistema nesse período, gere um documento prévio.
                            Você confirma a conclusão do acerto da Prestação de Contas?</p>"
                            dataQa="modal-concluir-acertos-sem-pendencias"
                        />
                    </section>
                    <section>
                        <ModalPendenciasCadastrais
                            show={modalPendenciasCadastrais.show}
                            titulo={modalPendenciasCadastrais.title}
                            texto={modalPendenciasCadastrais.message}  
                            bodyActions={modalPendenciasCadastrais.actions}                            
                            size='md'                          
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="outline-success"         
                            handleClose={handleCloseModalPendenciasCadastrais}   
                            dataQa="modal-pendencias-cadastrais"                
                        />
                    </section>
                </>
            }
        </>
    )
};