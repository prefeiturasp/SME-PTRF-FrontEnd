import React, {useEffect, useState, Fragment} from "react";
import {TopoSelectPeriodoBotaoConcluir} from "./TopoSelectPeriodoBotaoConcluir";
import {getPeriodosDePrestacaoDeContasDaAssociacao} from "../../../services/escolas/Associacao.service"
import {getStatusPeriodoPorData, getConcluirPeriodo} from "../../../services/escolas/PrestacaoDeContas.service";
import {getTabelasReceita} from "../../../services/escolas/Receitas.service";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";
import {DemonstrativoFinanceiro} from "./DemonstrativoFinanceiro";
import RelacaoDeBens from "./RelacaoDeBens";
import {MsgImgCentralizada} from "../../Globais/Mensagens/MsgImgCentralizada";
import Img404 from "../../../assets/img/img-404.svg";
import Loading from "../../../utils/Loading";

export const PrestacaoDeContas = () => {

    const [periodoPrestacaoDeConta, setPeriodoPrestacaoDeConta] = useState("");
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);
    const [statusPrestacaoDeConta, setStatusPrestacaoDeConta] = useState(false);
    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [contaPrestacaoDeContas, setContaPrestacaoDeContas] = useState(false);
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState({0: true});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getPeriodoPrestacaoDeConta();
        carregaPeriodos();
        carregaTabelas();
        getStatusPrestacaoDeConta();
        getContaPrestacaoDeConta();
        getPrimeiraContaPrestacaoDeConta();
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

    const getStatusPrestacaoDeConta = () => {
        if (localStorage.getItem('statusPrestacaoDeConta')) {
            const files = JSON.parse(localStorage.getItem('statusPrestacaoDeConta'));
            setStatusPrestacaoDeConta(files)
        } else {
            setStatusPrestacaoDeConta({})
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
            let status = await getStatusPeriodoPorData(valor.data_inicial);
            setStatusPrestacaoDeConta(status)
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

    const handleClickBtnConcluirPeriodo = async () =>{
        console.log("Cliquei")

        let concluir = await getConcluirPeriodo(periodoPrestacaoDeConta.periodo_uuid);

        console.log("Concluir ", concluir)

    };

    const retornaObjetoPeriodoPrestacaoDeConta = (periodo_uuid, data_inicial) => {
        return JSON.stringify({
            periodo_uuid: periodo_uuid,
            data_inicial: data_inicial,
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
                        handleClickBtnConcluirPeriodo={handleClickBtnConcluirPeriodo}
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
                            </>
                        ):
                        <MsgImgCentralizada
                            texto='Selecione um período acima para visualizar as ações'
                            img={Img404}
                        />
                    }
                </>
            }

        </>
    )
};