import React, {useEffect, useState} from "react";
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
    getReabrirPeriodo,
    getDataPreenchimentoAta,
    getIniciarAta,
} from "../../services/PrestacaoDeContas.service";
import {exibeDateTimePT_BR, exibeDateTimePT_BR_Ata} from "../../utils/ValidacoesAdicionaisFormularios";
import {ReverConciliacao} from "../../utils/Modais";
import {BoxPrestacaoDeContasPorPeriodo} from "../GeracaoDaAta/BoxPrestacaoDeContasPorPeriodo";

export const PrestacaoDeContas = () => {

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
    const [boxPrestacaoDeContasPorPeriodo, setBoxPrestacaoDeContasPorPeriodo] = useState(false);

    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);

    const [show, setShow] = useState(false);
    const [textareaModalReverConciliacao, setTextareaModalReverConciliacao] = useState("");

    const [corBoxPrestacaoDeContasPorPeriodo, setCorBoxPrestacaoDeContasPorPeriodo] = useState("");
    const [textoBoxPrestacaoDeContasPorPeriodo, setTextoBoxPrestacaoDeContasPorPeriodo] = useState("");
    const [dataBoxPrestacaoDeContasPorPeriodo, setDataBoxPrestacaoDeContasPorPeriodo] = useState("");

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
            getStatusPrestacaoDeConta(periodoConta.periodo, periodoConta.conta)
        } else {
            setExibeMensagem(true)
            setDemonstrativoFinanceiro(false);
            setBoxPrestacaoDeContasPorPeriodo(false);
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

        if (localStorage.getItem('uuidPrestacaoConta') !== 'undefined' && localStorage.getItem('uuidPrestacaoConta') !== undefined && (status !== undefined ? (status.status === null || status.conciliado) : false)) {
            setDemonstrativoFinanceiro(true);
            setBoxPrestacaoDeContasPorPeriodo(true);
        } else {
            setDemonstrativoFinanceiro(false);
            setBoxPrestacaoDeContasPorPeriodo(false);
        }
    }

    const setConfBoxPrestacaoDeContasPorPeriodo = async (status)=>{
        let data_preenchimento;
        try {
            data_preenchimento = await getDataPreenchimentoAta(status.uuid)
            console.log("data_preenchimento ", data_preenchimento)

            setCorBoxPrestacaoDeContasPorPeriodo("verde")
            setTextoBoxPrestacaoDeContasPorPeriodo(data_preenchimento.nome)
            setDataBoxPrestacaoDeContasPorPeriodo("Último preenchimento em "+exibeDateTimePT_BR_Ata(data_preenchimento.alterado_em))

        }catch (e) {
            console.log("Erro Data ", e)
            let iniciar_ata = await getIniciarAta(status.uuid)

            debugger;
            console.log("iniciar_ata ", iniciar_ata)
            setCorBoxPrestacaoDeContasPorPeriodo("vermelho")
            setTextoBoxPrestacaoDeContasPorPeriodo("Ata não preenchida")
            setDataBoxPrestacaoDeContasPorPeriodo("")
        }
        

        return data_preenchimento
    }

    const setConfBarraStatus = (status) => {
        if (status.status === "FECHADO") {
            setCorBarraDeStatusPrestacaoDeContas('verde');
            setTextoBarraDeStatusPrestacaoDeContas("A geração dos documentos da conciliação desse período foi efetuada, clique no botão “Rever conciliação” para fazer alterações")

        } else if (status.status === "ABERTO" && status.conciliado) {
            setCorBarraDeStatusPrestacaoDeContas('amarelo')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período está aberta.")
            console.log("setConfBoxPrestacaoDeContasPorPeriodo ", setConfBoxPrestacaoDeContasPorPeriodo(status))

        } else if (status.status === null || !status.conciliado) {
            setCorBarraDeStatusPrestacaoDeContas('vermelho')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período ainda não foi iniciada.")
        }
    }

    const iniciarPrestacaoDeContas = async () => {
        if (!statusPrestacaoConta.uuid){
            let prestacao = await getIniciarPrestacaoDeContas(periodoConta.conta, periodoConta.periodo);
            localStorage.setItem("uuidPrestacaoConta", prestacao.uuid)
        }
        window.location.assign(linkBotaoConciliacao)
    }

    const setConfDataUltimaConciliacao = (status) => {
        if (status.conciliado_em) {
            setDataUltimaConciliacao(exibeDateTimePT_BR(status.conciliado_em))
        } else {
            setDataUltimaConciliacao("-")
        }
    }

    const setConfBotaoConciliacao = (status) => {
        if ( (status.status === "ABERTO" && status.conciliado) || status.status === "FECHADO") {
            setCssBotaoConciliacao("btn-outline-success");
            setTextoBotaoConciliacao("Rever conciliação");
            setLinkBotaoConciliacao("/detalhe-das-prestacoes");
        } else if (status.status === null || !status.conciliado ) {
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
        if ( (statusPrestacaoConta.status === "ABERTO" && statusPrestacaoConta.conciliado)  || statusPrestacaoConta.status === "FECHADO") {
            onShowModal();
        } else if (statusPrestacaoConta.status === null || !statusPrestacaoConta.conciliado ) {
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
        window.location.assign(linkBotaoConciliacao)
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
            {demonstrativoFinanceiro === true && statusPrestacaoConta !== undefined && (
                <DemonstrativoFinanceiro/>
            )}

            {boxPrestacaoDeContasPorPeriodo === true && statusPrestacaoConta !== undefined && (
                <BoxPrestacaoDeContasPorPeriodo
                    corBoxPrestacaoDeContasPorPeriodo={corBoxPrestacaoDeContasPorPeriodo}
                    textoBoxPrestacaoDeContasPorPeriodo={textoBoxPrestacaoDeContasPorPeriodo}
                    dataBoxPrestacaoDeContasPorPeriodo={dataBoxPrestacaoDeContasPorPeriodo}
                />
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