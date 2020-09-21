import React, {useEffect, useState, Fragment} from "react";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../services/escolas/Associacao.service"
import {getStatusPeriodoPorData, getConcluirPeriodo, getDataPreenchimentoAta, getIniciarAta} from "../../../services/escolas/PrestacaoDeContas.service";
import {getTabelasReceita} from "../../../services/escolas/Receitas.service";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";
import {DemonstrativoFinanceiro} from "./DemonstrativoFinanceiro";
import RelacaoDeBens from "./RelacaoDeBens";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";
import Loading from "../../../utils/Loading";
import {ModalConcluirPeriodo} from "./ModalConcluirPeriodo";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import {BoxPrestacaoDeContasPorPeriodo} from "../GeracaoDaAta/BoxPrestacaoDeContasPorPeriodo";
import {exibeDateTimePT_BR_Ata} from "../../../utils/ValidacoesAdicionaisFormularios";

export const PrestacaoDeContas = () => {

    const [periodoPrestacaoDeConta, setPeriodoPrestacaoDeConta] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [statusPrestacaoDeConta, setStatusPrestacaoDeConta] = useState(false);
    const [uuidPrestacaoConta, setUuidPrestacaoConta] = useState('');
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [contaPrestacaoDeContas, setContaPrestacaoDeContas] = useState(false);
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);


    const [corBoxPrestacaoDeContasPorPeriodo, setCorBoxPrestacaoDeContasPorPeriodo] = useState("");
    const [textoBoxPrestacaoDeContasPorPeriodo, setTextoBoxPrestacaoDeContasPorPeriodo] = useState("");
    const [dataBoxPrestacaoDeContasPorPeriodo, setDataBoxPrestacaoDeContasPorPeriodo] = useState("");

    useEffect(() => {
        getPeriodoPrestacaoDeConta();
        carregaPeriodos();
        carregaTabelas();
        getStatusPrestacaoDeConta();
        getUuidPrestacaoDeConta();
        getContaPrestacaoDeConta();
        getPrimeiraContaPrestacaoDeConta();
        setConfBoxPrestacaoDeContasPorPeriodo()
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
        setConfBoxPrestacaoDeContasPorPeriodo();
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
            const files = JSON.parse(localStorage.getItem('periodoPrestacaoDeConta'));
            setPeriodoPrestacaoDeConta(files)
        } else {
            setPeriodoPrestacaoDeConta({})
        }
    };

    const getStatusPrestacaoDeConta = async () => {
        let periodo_prestacao_de_contas = JSON.parse(localStorage.getItem("periodoPrestacaoDeConta"));

        if (periodo_prestacao_de_contas && periodo_prestacao_de_contas.periodo_uuid){
            let data_inicial = periodo_prestacao_de_contas.data_inicial;
            let status = await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), data_inicial);
            console.log("getStatusPrestacaoDeConta ", status);
            setUuidPrestacaoConta(status.prestacao_conta);
            setStatusPrestacaoDeConta(status)
        }else {
            if (localStorage.getItem('statusPrestacaoDeConta')) {
                const files = JSON.parse(localStorage.getItem('statusPrestacaoDeConta'));
                setStatusPrestacaoDeConta(files)
            } else {
                setStatusPrestacaoDeConta({})
            }
        }
    };

    const getUuidPrestacaoDeConta = () => {
        if (localStorage.getItem('uuidPrestacaoConta')) {
            const files = localStorage.getItem('uuidPrestacaoConta');
            setUuidPrestacaoConta(files)
        } else {
            setUuidPrestacaoConta('')
        }
    };

    const getContaPrestacaoDeConta = () => {
        if (localStorage.getItem('contaPrestacaoDeConta')) {
            const files = JSON.parse(localStorage.getItem('contaPrestacaoDeConta'));
            setContaPrestacaoDeContas(files)
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
        setLoading(true);
        let status_concluir_periodo = await getConcluirPeriodo(periodoPrestacaoDeConta.periodo_uuid);
        setUuidPrestacaoConta(status_concluir_periodo.uuid);
        let status = await getStatusPeriodoPorData(localStorage.getItem(ASSOCIACAO_UUID), periodoPrestacaoDeConta.data_inicial);
        setStatusPrestacaoDeConta(status);
        await carregaPeriodos();
        await setConfBoxPrestacaoDeContasPorPeriodo();
        setLoading(false);
    };

    const setConfBoxPrestacaoDeContasPorPeriodo = async ()=>{
        let uuid_prestacao_de_contas = localStorage.getItem('uuidPrestacaoConta');
        let data_preenchimento;

        if (uuid_prestacao_de_contas){
            try {
                data_preenchimento = await getDataPreenchimentoAta(uuid_prestacao_de_contas);
                localStorage.setItem("uuidAta", data_preenchimento.uuid);
                setTextoBoxPrestacaoDeContasPorPeriodo(data_preenchimento.nome);
                if (data_preenchimento.alterado_em === null){
                    setCorBoxPrestacaoDeContasPorPeriodo("vermelho");
                    setDataBoxPrestacaoDeContasPorPeriodo("Ata não preenchida");
                }
                else {
                    setCorBoxPrestacaoDeContasPorPeriodo("verde");
                    setDataBoxPrestacaoDeContasPorPeriodo("Último preenchimento em "+exibeDateTimePT_BR_Ata(data_preenchimento.alterado_em));
                }

            }catch (e) {
                data_preenchimento = await getIniciarAta(uuid_prestacao_de_contas);
                localStorage.setItem("uuidAta", data_preenchimento.uuid);
                setCorBoxPrestacaoDeContasPorPeriodo("vermelho");
                setTextoBoxPrestacaoDeContasPorPeriodo(data_preenchimento.nome);
                setDataBoxPrestacaoDeContasPorPeriodo("Ata não preenchida");
            }
        }
        setLoading(false);
    };


    const onClickVisualizarAta = async () =>{
        setLoading(true);
        window.location.assign('/visualizacao-da-ata')
    };

    const onSalvarTrue = () =>{
        setShow(false);
        concluirPeriodo();
    };

    const onHandleClose = () => {
        setShow(false);
    };

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
                    <TopoSelectPeriodoBotaoConcluir
                        periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                        handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
                        periodosAssociacao={periodosAssociacao}
                        retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
                        statusPrestacaoDeConta={statusPrestacaoDeConta}
                        checkCondicaoExibicao={checkCondicaoExibicao}
                        concluirPeriodo={concluirPeriodo}
                        setShow={setShow}
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
                                <DemonstrativoFinanceiro
                                    periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                                    statusPrestacaoDeConta={statusPrestacaoDeConta}
                                    contaPrestacaoDeContas={contaPrestacaoDeContas}
                                    setLoading={setLoading}
                                />
                                <RelacaoDeBens
                                    periodoPrestacaoDeConta={periodoPrestacaoDeConta}
                                    statusPrestacaoDeConta={statusPrestacaoDeConta}
                                    contaPrestacaoDeContas={contaPrestacaoDeContas}
                                    setLoading={setLoading}
                                />
                                {localStorage.getItem('uuidPrestacaoConta') &&
                                    <BoxPrestacaoDeContasPorPeriodo
                                        onClickVisualizarAta={onClickVisualizarAta}
                                        setLoading={setLoading}
                                        corBoxPrestacaoDeContasPorPeriodo={corBoxPrestacaoDeContasPorPeriodo}
                                        textoBoxPrestacaoDeContasPorPeriodo={textoBoxPrestacaoDeContasPorPeriodo}
                                        dataBoxPrestacaoDeContasPorPeriodo={dataBoxPrestacaoDeContasPorPeriodo}
                                    />
                                }

                            </>
                        ):
                        <MsgImgCentralizada
                            texto='Selecione um período acima para visualizar as ações'
                            img={Img404}
                        />
                    }
                    <section>
                        <ModalConcluirPeriodo
                            show={show}
                            handleClose={onHandleClose}
                            onSalvarTrue={onSalvarTrue}
                            titulo="Concluir Prestação de Contas"
                            texto="<p>Ao concluir a Prestação de Contas, o período será <strong>bloqueado</strong>
                            para cadastro ou edição de qualquer lançamento de crédito ou despesa.
                            Se quiser conferir as informações cadastradas, sem bloqueio do sistema neste período, por favor, gere um documento prévio.
                            <strong>Você confirma a conclusão dessa Prestação de Contas?</strong></p>"
                        />
                    </section>
                </>
            }
        </>
    )
};