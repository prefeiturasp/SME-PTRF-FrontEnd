import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {SelectPeriodoConta} from "./SelectPeriodoConta";
import {MsgImgCentralizada} from "../Mensagens/MsgImgCentralizada";
import "../../assets/img/img-404.svg"
import Img404 from "../../assets/img/img-404.svg";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";
import {DemonstrativoFinanceiro} from "../PrestacaoDeContas/DemonstrativoFinanceiro";
import {BotaoConciliacao} from "./BotaoConciliacao";
import {DataUltimaConciliacao} from "./DataUltimaConciliacao";
import {getTabelasReceita} from "../../services/Receitas.service";
import {
    getPeriodos,
    getStatus,
    getIniciarPrestacaoDeContas,
    getReabrirPeriodo
} from "../../services/PrestacaoDeContas.service";
import {exibeDateTimePT_BR} from "../../utils/ValidacoesAdicionaisFormularios";
import {ReverConciliacao} from "../../utils/Modais";


export const PrestacaoDeContas = () => {

    let history = useHistory();

    const [periodoConta, setPeriodoConta] = useState("");
    const [exibeMensagem, setExibeMensagem] = useState(true);
    const [statusPrestacaoConta, setStatusPrestacaoConta] = useState(undefined);
    const [corBarraDeStatusPrestacaoDeContas, setCorBarraDeStatusPrestacaoDeContas] = useState("");
    const [textoBarraDeStatusPrestacaoDeContas, setTextoBarraDeStatusPrestacaoDeContas] = useState("");
    const [dataUltimaConciliacao, setDataUltimaConciliacao] = useState('')
    const [cssBotaoConciliacao, setCssBotaoConciliacao] = useState("");
    const [textoBotaoConciliacao, setTextoBotaoConciliacao] = useState("");
    const [botaoConciliacaoReadonly, setBotaoConciliacaoReadonly] = useState(true);
    const [linkBotaoConciliacao, setLinkBotaoConciliacao] = useState('');
    const [demonstrativoFinanceiro, setDemonstrativoFinanceiro] = useState(false);

    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);

    const [show, setShow] = useState(false);
    const [textareaModalReverConciliacao, setTextareaModalReverConciliacao] = useState("");

    useEffect(() => {
        getPeriodoConta();
    }, [])

    useEffect(() => {
        const carregaTabelas = async () => {
            await getTabelasReceita().then(response => {
                setContasAssociacao(response.data.contas_associacao);
            }).catch(error => {
                console.log(error);
            });
        };

        const carregaPeriodos = async () => {
            let periodos = await getPeriodos();
            setPeriodosAssociacao(periodos);
        }

        carregaTabelas();
        carregaPeriodos();
    }, [])

    useEffect(() => {
        localStorage.setItem('periodoConta', JSON.stringify(periodoConta))
        if (periodoConta.periodo !== undefined && periodoConta.periodo !== "" && periodoConta.conta !== undefined && periodoConta.conta !== "") {
            setExibeMensagem(false)
            setDemonstrativoFinanceiro(true)
            getStatusPrestacaoDeConta(periodoConta.periodo, periodoConta.conta)
        } else {
            setExibeMensagem(true)
            setStatusPrestacaoConta(undefined)
            localStorage.setItem("uuidPrestacaoConta", undefined)
        }
    }, [periodoConta])

    const getPeriodoConta = () => {
        if (localStorage.getItem('periodoConta')) {
            const files = JSON.parse(localStorage.getItem('periodoConta'))
            setPeriodoConta(files)
        } else {
            setPeriodoConta({periodo: "", conta: ""})
        }
    }

    const getStatusPrestacaoDeConta = async (periodo_uuid, conta_uuid) => {
        let status = await getStatus(periodo_uuid, conta_uuid);
        setStatusPrestacaoConta(status);
        localStorage.setItem("uuidPrestacaoConta", status.uuid)
        setConfBarraStatus(status);
        setConfBotaoConciliacao(status);
        setConfDataUltimaConciliacao(status);
        setBotaoConciliacaoReadonly(false);

    }


    const setConfBarraStatus = (status) => {

        if (status.status === "FECHADO") {
            setCorBarraDeStatusPrestacaoDeContas('verde');
            setTextoBarraDeStatusPrestacaoDeContas("A geração dos documentos da conciliação desse período foi efetuada, clique no botão “Rever conciliação” para fazer alterações")
        } else if (status.status === "ABERTO") {
            setCorBarraDeStatusPrestacaoDeContas('amarelo')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período está aberta.")
        } else if (status.status === null) {
            setCorBarraDeStatusPrestacaoDeContas('vermelho')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período ainda não foi iniciada.")
        }
    }

    const iniciarPrestacaoDeContas = async () => {
        let prestacao = await getIniciarPrestacaoDeContas(periodoConta.conta, periodoConta.periodo);
        localStorage.setItem("uuidPrestacaoConta", prestacao.uuid)
        let path = linkBotaoConciliacao;
        window.location.assign(path)
        //history.push(path);
    }

    const setConfDataUltimaConciliacao = (status) => {
        if (status.conciliado_em) {
            setDataUltimaConciliacao(exibeDateTimePT_BR(status.conciliado_em))
        } else {
            setDataUltimaConciliacao("-")
        }
    }

    const setConfBotaoConciliacao = (status) => {
        if (status.status === "ABERTO" || status.status === "FECHADO") {
            setCssBotaoConciliacao("btn-outline-success");
            setTextoBotaoConciliacao("Rever conciliação");
            setLinkBotaoConciliacao("/detalhe-das-prestacoes");
        } else if (status.status === null) {
            setCssBotaoConciliacao("btn-success")
            setTextoBotaoConciliacao("Iniciar a prestação de contas");
            setLinkBotaoConciliacao("/detalhe-das-prestacoes");
        }
    }

    const handleChangePeriodoConta = (name, value) => {
        setBotaoConciliacaoReadonly(true);
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
    }

    const handleClickBotaoConciliacao = () => {
        setBotaoConciliacaoReadonly(true);
        if (statusPrestacaoConta.status === "ABERTO" || statusPrestacaoConta.status === "FECHADO") {
            onShowModal();
        } else if (statusPrestacaoConta.status === null) {
            iniciarPrestacaoDeContas()
        }


    }

    const handleChangeModalReverConciliacao = (event) => {
        setTextareaModalReverConciliacao(event.target.value)

    }

    const onShowModal = () => {
        setShow(true);
    }

    const onHandleClose = () => {
        setShow(false);
        setBotaoConciliacaoReadonly(false);
    }

    const reabrirPeriodo = async () => {
        setShow(false);
        let payload = {
            "motivo": textareaModalReverConciliacao
        }
        await getReabrirPeriodo(statusPrestacaoConta.uuid, payload)
        let path = linkBotaoConciliacao;
        window.location.assign(path)
        //history.push(path);
    }

    return (
        <>
            <BarraDeStatusPrestacaoDeContas
                statusPrestacaoConta={statusPrestacaoConta}
                corBarraDeStatusPrestacaoDeContas={corBarraDeStatusPrestacaoDeContas}
                textoBarraDeStatusPrestacaoDeContas={textoBarraDeStatusPrestacaoDeContas}
            />
            <SelectPeriodoConta
                periodoConta={periodoConta}
                handleChangePeriodoConta={handleChangePeriodoConta}
                periodosAssociacao={periodosAssociacao}
                contasAssociacao={contasAssociacao}
            />
            <div className='row mt-5'>
                <DataUltimaConciliacao
                    statusPrestacaoConta={statusPrestacaoConta}
                    dataUltimaConciliacao={dataUltimaConciliacao}
                />
                <BotaoConciliacao
                    statusPrestacaoConta={statusPrestacaoConta}
                    cssBotaoConciliacao={cssBotaoConciliacao}
                    textoBotaoConciliacao={textoBotaoConciliacao}
                    botaoConciliacaoReadonly={botaoConciliacaoReadonly}
                    handleClickBotaoConciliacao={handleClickBotaoConciliacao}
                />
            </div>
            {demonstrativoFinanceiro && statusPrestacaoConta !== undefined && (
                <DemonstrativoFinanceiro/>
            )}
            {exibeMensagem && (
                <MsgImgCentralizada
                    texto='Selecione um período e uma conta acima para visualizar as ações'
                    img={Img404}
                />
            )}

            <section>
                <ReverConciliacao
                    show={show}
                    handleClose={onHandleClose}
                    reabrirPeriodo={reabrirPeriodo}
                    textareaModalReverConciliacao={textareaModalReverConciliacao}
                    handleChangeModalReverConciliacao={handleChangeModalReverConciliacao}
                />
            </section>
        </>
    )
}