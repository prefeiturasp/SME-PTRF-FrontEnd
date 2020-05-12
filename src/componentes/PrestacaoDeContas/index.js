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
import {getPeriodos, getStatus, getIniciarPrestacaoDeContas} from "../../services/PrestacaoDeContas.service";
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
        const carregaTabelas = async () => {
            await getTabelasReceita().then(response => {
                setContasAssociacao(response.data.contas_associacao);
            }).catch(error => {
                console.log(error);
            });
        };

        const carregaPeriodos = async () =>{
            let periodos = await getPeriodos();
            console.log("DATAS ", periodos)
            setPeriodosAssociacao(periodos);
        }

        carregaTabelas();
        carregaPeriodos();
    }, [])

    useEffect(()=> {
        if (periodoConta.periodo !== undefined && periodoConta.periodo !== "" && periodoConta.conta !== undefined && periodoConta.conta !== ""){
            setExibeMensagem(false)
            setDemonstrativoFinanceiro(true)
            getStatusPrestacaoDeConta(periodoConta.periodo, periodoConta.conta)
        }else {
            setExibeMensagem(true)
            setStatusPrestacaoConta(undefined)
        }
    }, [periodoConta])

    const getStatusPrestacaoDeConta = async (periodo_uuid, conta_uuid) => {
        let status = await getStatus(periodo_uuid, conta_uuid);
        setStatusPrestacaoConta(status);
        setConfBarraStatus(status);
        setConfBotaoConciliacao(status);
        setConfDataUltimaConciliacao(status);
        setBotaoConciliacaoReadonly(false);

    }


    const setConfBarraStatus = (status) => {

        if (status.status === "FECHADO"){
            setCorBarraDeStatusPrestacaoDeContas('verde');
            setTextoBarraDeStatusPrestacaoDeContas("A geração dos documentos da conciliação desse período foi efetuada, clique no botão “Rever conciliação” para fazer alterações")
        }else if(status.status === "ABERTO"){
            setCorBarraDeStatusPrestacaoDeContas('amarelo')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período está aberta.")
        }else if(status.status === null){
            setCorBarraDeStatusPrestacaoDeContas('vermelho')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período ainda não foi iniciada.")
        }
    }

    const iniciarReverPrestacaoDeContas = async (status) =>{

        let prestacao;

        if (status.status === null){
            prestacao = await getIniciarPrestacaoDeContas(periodoConta.conta, periodoConta.periodo);
            console.log("iniciarPrestacaoDeContas ", prestacao)
        }else{
            console.log("NÃO É NNULL")
        }
    }

    const setConfDataUltimaConciliacao = (status) => {
        if (status.conciliado_em){
            setDataUltimaConciliacao(exibeDateTimePT_BR(status.conciliado_em))
        }else{
            setDataUltimaConciliacao("-")
        }
    }

    const setConfBotaoConciliacao = (status) => {
        if (status.status === "ABERTO" || status.status === "FECHADO"){
            setCssBotaoConciliacao("btn-outline-success");
            setTextoBotaoConciliacao("Rever conciliação");
            setLinkBotaoConciliacao("/detalhe-das-prestacoes");
        }else if(status.status === null){
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

        console.log("handleClickBotaoConciliacao", statusPrestacaoConta)

        iniciarReverPrestacaoDeContas(statusPrestacaoConta)

        if (statusPrestacaoConta.status === "ABERTO"){
            onShowModal();
        }

        let path = linkBotaoConciliacao;
        //history.push(path);
    }

    const handleChangeModalReverConciliacao = (event) => {
        setTextareaModalReverConciliacao(event.target.value)

    }

    const onShowModal = () => {
        setShow(true);
    }

    const onHandleClose = () => {
        setShow(false);
    }

    const onCancelarTrue = () => {
        setShow(false);
    }

    return (
        <>
            {<p>TEXT AREA: {textareaModalReverConciliacao}</p>}
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
                <ReverConciliacao textareaModalReverConciliacao={textareaModalReverConciliacao} handleChangeModalReverConciliacao={handleChangeModalReverConciliacao} show={show} handleClose={onHandleClose} onCancelarTrue={onCancelarTrue}/>
            </section>
        </>
    )
}