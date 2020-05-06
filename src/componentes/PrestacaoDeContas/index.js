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
import {getPeriodos, getStatus} from "../../services/PrestacaoDeContas.service";
import moment from "moment";

export const PrestacaoDeContas = () => {

    const [periodoConta, setPeriodoConta] = useState("");
    const [exibeMensagem, setExibeMensagem] = useState(true);
    const [statusPrestacaoConta, setStatusPrestacaoConta] = useState(undefined);
    const [corBarraDeStatusPrestacaoDeContas, setCorBarraDeStatusPrestacaoDeContas] = useState("");
    const [textoBarraDeStatusPrestacaoDeContas, setTextoBarraDeStatusPrestacaoDeContas] = useState("");
    const [dataUltimaConciliacao, setDataUltimaConciliacao] = useState('')
    const [cssBotaoConciliacao, setCssBotaoConciliacao] = useState("");
    const [textoBotaoConciliacao, setTextoBotaoConciliacao] = useState("");
    const [demonstrativoFinanceiro, setDemonstrativoFinanceiro] = useState(false);

    const [contasAssociacao, setContasAssociacao] = useState(false);
    const [periodosAssociacao, setPeriodosAssociacao] = useState(false);

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
        console.log("Carrega Status ", status)
        setConfBarraStatus(status);
        setConfBotaoConciliacao(status);
        setConfDataUltimaConciliacao(status);
    }

    const setConfBarraStatus = (status) => {
        setStatusPrestacaoConta(status.status);
        if (status.status === "FECHADO"){
            setCorBarraDeStatusPrestacaoDeContas('verde')
            setTextoBarraDeStatusPrestacaoDeContas("A geração dos documentos da conciliação desse período foi efetuada, clique no botão “Rever conciliação” para fazer alterações")
        }else if(status.status === "ABERTO"){
            setCorBarraDeStatusPrestacaoDeContas('amarelo')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período está aberta.")
        }else if(status.status === null){
            setCorBarraDeStatusPrestacaoDeContas('vermelho')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período ainda não foi iniciada.")
        }
    }

    const setConfDataUltimaConciliacao = (status) => {

        if (status.conciliado_em && status.conciliado_em !== null){
            setDataUltimaConciliacao(moment(new Date(status.conciliado_em), "YYYY-MM-DD").add(1, 'days').format("DD/MM/YYYY"))
        }else{
            setDataUltimaConciliacao("-")
        }

    }

    const setConfBotaoConciliacao = (status) => {
        if (status.status === "ABERTO" || status.status === "FECHADO"){
            setCssBotaoConciliacao("btn-outline-success")
            setTextoBotaoConciliacao("Rever conciliação")
        }else if(status.status === null){
            setCssBotaoConciliacao("btn-success")
            setTextoBotaoConciliacao("Iniciar a prestação de contas")
        }
    }

    const handleChangePeriodoConta = (name, value) => {
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
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
        </>
    )
}