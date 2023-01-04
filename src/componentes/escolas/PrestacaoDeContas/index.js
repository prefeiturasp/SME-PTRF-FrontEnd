import React, {useEffect, useState, Fragment, useCallback, useContext} from "react";
import {useHistory} from "react-router-dom";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao, getDataPreenchimentoPreviaAta} from "../../../services/escolas/Associacao.service"
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

export const PrestacaoDeContas = ({setStatusPC}) => {
    const history = useHistory();
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
    const [showConcluir, setShowConcluir] = useState(false);
    const [showConcluirAcertoComPendencia, setShowConcluirAcertoComPendencia] = useState(false);
    const [corBoxAtaApresentacao, setcorBoxAtaApresentacao] = useState("");
    const [textoBoxAtaApresentacao, settextoBoxAtaApresentacao] = useState("");
    const [dataBoxAtaApresentacao, setdataBoxAtaApresentacao] = useState("");
    const [uuidAtaApresentacao, setUuidAtaApresentacao] = useState("");
    const [showConcluirAcertosSemPendencias, setShowConcluirAcertosSemPendencias] = useState(false);

    const associacaoUuid = localStorage.getItem(ASSOCIACAO_UUID)

    useEffect(() => {
        if (statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === 'EM_PROCESSAMENTO'){
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
        getPrimeiraContaPrestacaoDeConta();
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
        let periodos = await getPeriodosDePrestacaoDeContasDaAssociacao();
        setPeriodosAssociacao(periodos);
    };

    const carregaTabelas = async () => {
        await getTabelasReceita().then(response => {
            setContasAssociacao(response.data.contas_associacao);
        }).catch(error => {
            console.log(error);
        });
    };

    const getPeriodoPrestacaoDeConta = () => {
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

    const getPrimeiraContaPrestacaoDeConta = async ()=>{
        await getTabelasReceita()
        .then(response => {
            if (response.data.contas_associacao && response.data.contas_associacao.length > 0 ){
                setContaPrestacaoDeContas({
                    conta_uuid: response.data.contas_associacao[0].uuid
                })
            }
        }).catch(error => {
            console.log("Erro getPrimeiraContaPrestacaoDeConta ", error);
        });
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

    const concluirPeriodo = async (justificativaPendencia='') =>{
        let status_concluir_periodo = await postConcluirPeriodo(periodoPrestacaoDeConta.periodo_uuid, justificativaPendencia);
        setUuidPrestacaoConta(status_concluir_periodo.uuid);
        let status = await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), periodoPrestacaoDeConta.data_inicial);
        setStatusPrestacaoDeConta(status);
        setStatusPC(status)
        await carregaPeriodos();
        await setConfBoxAtaApresentacao();
    };

    const handleConcluirPeriodo = () =>{
        if(statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status){
            if(statusPrestacaoDeConta.prestacao_contas_status.status_prestacao !== "DEVOLVIDA"){
                setShowConcluir(true)
            }
            else if(statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === "DEVOLVIDA"){
                if(statusPrestacaoDeConta.prestacao_contas_status.tem_acertos_pendentes){
                    setShowConcluirAcertoComPendencia(true);
                }
                else{
                    setShowConcluirAcertosSemPendencias(true);
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

                } catch (e) {
                    data_preenchimento = await getIniciarPreviaAta(associacaoUuid, periodo_prestacao_de_contas.periodo_uuid);
                    localStorage.setItem("uuidAta", data_preenchimento.uuid);
                    setUuidAtaApresentacao(data_preenchimento.uuid)
                    setcorBoxAtaApresentacao("vermelho");
                    settextoBoxAtaApresentacao(data_preenchimento.nome);
                    setdataBoxAtaApresentacao("Ata não preenchida");
                }

            }
            setLoading(false);
        }

    };

    const onClickVisualizarAta = async (uuid_ata) =>{
        setLoading(true);
        window.location.assign(`/visualizacao-da-ata/${uuid_ata}`)
    };

    const onConcluirSemPendencias = () => {
        setShowConcluir(false);
        setShowConcluirAcertosSemPendencias(false);
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
        history.push(`/consulta-detalhamento-analise-da-dre/${uuid_prestacao_de_contas}`)
    }

    const onHandleClose = () => {
        setShowConcluir(false);
    };

    const onHandleCloseSemPendencias = () => {
        setShowConcluirAcertosSemPendencias(false);
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

    return (
        <>
            {loading ? (
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
                    {statusPrestacaoDeConta && statusPrestacaoDeConta.prestacao_contas_status && statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === 'EM_PROCESSAMENTO' ? (
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
                                                            className={`nav-link btn-escolhe-acao mr-3 ${clickBtnEscolheConta[index] ? "btn-escolhe-acao-active" : ""}`}
                                                        >
                                                            Conta {conta.nome}
                                                        </button>
                                                    </li>
                                                </Fragment>
                                            )}
                                        </nav>
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
                                        {/*{localStorage.getItem('uuidPrestacaoConta') &&*/}
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
                                ):
                                <MsgImgCentralizada
                                    texto='Selecione um período acima para visualizar as ações'
                                    img={Img404}
                                />
                            }
                        </>
                    }
                    <section>
                        <ModalConcluirPeriodo
                            show={showConcluir}
                            handleClose={onHandleClose}
                            onConcluir={onConcluirSemPendencias}
                            titulo="Concluir Prestação de Contas"
                            texto="<p>Ao concluir a Prestação de Contas, o sistema <strong>bloqueará</strong> 
                            o cadastro e a edição de qualquer crédito ou despesa nesse período.
                            Para conferir as informações cadastradas, sem bloqueio do sistema nesse período, gere um documento prévio.
                            Você confirma a conclusão dessa Prestação de Contas?</p>"
                        />
                    </section>
                    <section>
                        <ModalConcluirAcertoComPendencias
                            titulo="Concluir acerto da Prestação de Contas"
                            handleClose={onHandleCloseModalConcluirPeriodoComPendencias}
                            onIrParaAnaliseDre={onIrParaAnaliseDre}
                            show={showConcluirAcertoComPendencia}
                        />
                    </section>
                    <section>
                        <ModalConcluirAcertoSemPendencias
                            show={showConcluirAcertosSemPendencias}
                            handleClose={onHandleCloseSemPendencias}
                            onConcluir={onConcluirSemPendencias}
                            titulo="Concluir acerto da Prestação de Contas"
                            texto="<p>Ao concluir a Prestação de Contas, o sistema <strong>bloqueará</strong> 
                            o cadastro e a edição de qualquer crédito ou despesa nesse período.
                            Para conferir as informações cadastradas, sem bloqueio do sistema nesse período, gere um documento prévio.
                            Você confirma a conclusão do acerto da Prestação de Contas?</p>"
                        />
                    </section>
                </>
            }
        </>
    )
};