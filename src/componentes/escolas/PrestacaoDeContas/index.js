import React, {useEffect, useState, Fragment, useCallback} from "react";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao, getDataPreenchimentoPreviaAta} from "../../../services/escolas/Associacao.service"
import {getStatusPeriodoPorData, getConcluirPeriodo, getDataPreenchimentoAta, getIniciarAta, getIniciarPreviaAta} from "../../../services/escolas/PrestacaoDeContas.service";
import {getTabelasReceita} from "../../../services/escolas/Receitas.service";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";
import DemonstrativoFinanceiroPorConta from "./DemonstrativoFinanceiroPorConta";
import RelacaoDeBens from "./RelacaoDeBens";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";
import Loading from "../../../utils/Loading";
import {ModalConcluirPeriodo} from "./ModalConcluirPeriodo";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {GeracaoAtaApresentacao} from "../GeracaoDaAta/GeracaoAtaApresentacao";
import {GeracaoAtaRetificadora} from "../GeracaoAtaRetificadora";
import {exibeDateTimePT_BR_Ata} from "../../../utils/ValidacoesAdicionaisFormularios";
import {visoesService} from "../../../services/visoes.service";

export const PrestacaoDeContas = ({setStatusPC}) => {

    const [periodoPrestacaoDeConta, setPeriodoPrestacaoDeConta] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [statusPrestacaoDeConta, setStatusPrestacaoDeConta] = useState(false);
    const [uuidPrestacaoConta, setUuidPrestacaoConta] = useState('');
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [contaPrestacaoDeContas, setContaPrestacaoDeContas] = useState(false);
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [corBoxAtaApresentacao, setcorBoxAtaApresentacao] = useState("");
    const [textoBoxAtaApresentacao, settextoBoxAtaApresentacao] = useState("");
    const [dataBoxAtaApresentacao, setdataBoxAtaApresentacao] = useState("");
    const [uuidAtaApresentacao, setUuidAtaApresentacao] = useState("");
    const [gerarAta, setGerarAta] = useState(false);

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

    const concluirPeriodo = async () =>{
        let status_concluir_periodo = await getConcluirPeriodo(periodoPrestacaoDeConta.periodo_uuid);
        setUuidPrestacaoConta(status_concluir_periodo.uuid);
        let status = await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), periodoPrestacaoDeConta.data_inicial);
        setStatusPrestacaoDeConta(status);
        setStatusPC(status)
        await carregaPeriodos();
        await setConfBoxAtaApresentacao();
    };

    const setConfBoxAtaApresentacao = async ()=>{
        console.log('============> setConfBoxAtaApresentacao')
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
                    setGerarAta(false)
                }
                else {
                    setcorBoxAtaApresentacao("verde");
                    setdataBoxAtaApresentacao("Último preenchimento em "+exibeDateTimePT_BR_Ata(data_preenchimento.alterado_em));
                    setGerarAta(true)
                }

            }catch (e) {
                data_preenchimento = await getIniciarAta(uuid_prestacao_de_contas);
                localStorage.setItem("uuidAta", data_preenchimento.uuid);
                setUuidAtaApresentacao(data_preenchimento.uuid)
                setcorBoxAtaApresentacao("vermelho");
                settextoBoxAtaApresentacao(data_preenchimento.nome);
                setdataBoxAtaApresentacao("Ata não preenchida");
                setGerarAta(false)
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
                        setGerarAta(false)
                    } else {
                        setcorBoxAtaApresentacao("verde");
                        setdataBoxAtaApresentacao("Último preenchimento em " + exibeDateTimePT_BR_Ata(data_preenchimento.alterado_em));
                        setGerarAta(true)
                    }

                } catch (e) {
                    data_preenchimento = await getIniciarPreviaAta(associacaoUuid, periodo_prestacao_de_contas.periodo_uuid);
                    localStorage.setItem("uuidAta", data_preenchimento.uuid);
                    setUuidAtaApresentacao(data_preenchimento.uuid)
                    setcorBoxAtaApresentacao("vermelho");
                    settextoBoxAtaApresentacao(data_preenchimento.nome);
                    setdataBoxAtaApresentacao("Ata não preenchida");
                    setGerarAta(false)
                }


            }
            setLoading(false);
        }

    };

    const onClickVisualizarAta = async (uuid_ata) =>{
        setLoading(true);
        window.location.assign(`/visualizacao-da-ata/${uuid_ata}`)
    };

    const onSalvarTrue = () =>{
        setShow(false);
        concluirPeriodo();
    };

    const onHandleClose = () => {
        setShow(false);
    };

    const podeConcluir = [['concluir_periodo_prestacao_contas']].some(visoesService.getPermissoes)
    const podeGerarPrevias = [['gerar_previas_prestacao_contas']].some(visoesService.getPermissoes)
    const podeBaixarDocumentos = [['baixar_documentos_prestacao_contas']].some(visoesService.getPermissoes)

    const exibeBoxAtaRetificadora = useCallback(() => {
        console.log('statusPrestacaoDeConta', statusPrestacaoDeConta)
        return statusPrestacaoDeConta &&
            statusPrestacaoDeConta.prestacao_contas_status &&
            (statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === 'DEVOLVIDA' || statusPrestacaoDeConta.prestacao_contas_status.status_prestacao === 'DEVOLVIDA_RETORNADA' )
    }, [statusPrestacaoDeConta])

    useEffect(()=>{
        exibeBoxAtaRetificadora()
    }, [exibeBoxAtaRetificadora])

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
                                concluirPeriodo={concluirPeriodo}
                                setShow={setShow}
                                podeConcluir={podeConcluir}
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
                                            gerarAta={gerarAta}
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
                            show={show}
                            handleClose={onHandleClose}
                            onSalvarTrue={onSalvarTrue}
                            titulo="Concluir Prestação de Contas"
                            texto="<p>Ao concluir a Prestação de Contas, o sistema <strong>bloqueará</strong> 
                            o cadastro e a edição de qualquer crédito ou despesa nesse período.
                            Para conferir as informações cadastradas, sem bloqueio do sistema nesse período, gere um documento prévio.
                            Você confirma a conclusão dessa Prestação de Contas?</p>"
                        />
                    </section>
                </>
            }
        </>
    )
};