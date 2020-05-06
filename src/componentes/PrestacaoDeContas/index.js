import React, {useEffect, useState} from "react";
import {SelectPeriodoConta} from "./SelectPeriodoConta";
import {MsgImgCentralizada} from "../Mensagens/MsgImgCentralizada";
import "../../assets/img/img-404.svg"
import Img404 from "../../assets/img/img-404.svg";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";
import {DemonstrativoFinanceiro} from "../PrestacaoDeContas/DemonstrativoFinanceiro";
import {getTabelasReceita} from "../../services/Receitas.service";

export const PrestacaoDeContas = () => {

    const [periodoConta, setPeriodoConta] = useState("");
    const [exibeMensagem, setExibeMensagem] = useState(true);
    const [statusPrestacaoConta, setStatusPrestacaoConta] = useState(false);
    const [corBarraDeStatusPrestacaoDeContas, setCorBarraDeStatusPrestacaoDeContas] = useState("");
    const [textoBarraDeStatusPrestacaoDeContas, setTextoBarraDeStatusPrestacaoDeContas] = useState("");
    const [demonstrativoFinanceiro, setDemonstrativoFinanceiro] = useState(false);
    const [contasAssociacao, setContasAssociacao] = useState(false);

    useEffect(() => {
        const carregaTabelas = async () => {
            await getTabelasReceita().then(response => {
                console.log("Prestacao de conta index ", response)
                setContasAssociacao(response.data.contas_associacao);
            }).catch(error => {
                console.log(error);
            });
        };
        carregaTabelas();
    }, [])

    useEffect(()=> {

        console.log("useEfect ", periodoConta)

        if (periodoConta.periodo !== undefined && periodoConta.periodo !== "" && periodoConta.conta !== undefined && periodoConta.conta !== ""){
            setExibeMensagem(false)
            setStatusPrestacaoConta(true);
            setDemonstrativoFinanceiro(true)
            setConfBarraStatus(periodoConta)

        }else {
            setExibeMensagem(true)
            setStatusPrestacaoConta(false)
        }
    }, [periodoConta])

    const handleChangePeriodoConta = (name, value) => {
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
    }

    const setConfBarraStatus = (status) => {
        if (periodoConta.periodo === "laranja" &&  periodoConta.conta === "manga"){
            setCorBarraDeStatusPrestacaoDeContas('verde')
            setTextoBarraDeStatusPrestacaoDeContas("A geração dos documentos da conciliação desse período foi efetuada, clique no botão “Rever conciliação” para fazer alterações")
        }else{
            setCorBarraDeStatusPrestacaoDeContas('amarelo')
            setTextoBarraDeStatusPrestacaoDeContas("A prestação de contas deste período está aberta.")
        }
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
                statusPrestacaoConta={statusPrestacaoConta}
                contasAssociacao={contasAssociacao}
            />
            {demonstrativoFinanceiro && statusPrestacaoConta && (
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