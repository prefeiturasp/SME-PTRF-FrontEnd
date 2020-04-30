import React, {useEffect, useState} from "react";
import {PeriodoConta} from "./SelectPeriodoConta";
import {MsgImgCentralizada} from "../Mensagens/MsgImgCentralizada";
import "../../assets/img/img-404.svg"
import Img404 from "../../assets/img/img-404.svg";
import {BarraDeStatusPrestacaoDeContas} from "./BarraDeStatusPrestacaoDeContas";

export const PrestacaoDeContas = () => {

    const [periodoConta, setPeriodoConta] = useState("");
    const [exibeMensagem, setExibeMensagem] = useState(true);
    const [statusPrestacaoConta, setStatusPrestacaoConta] = useState(false);
    const [corBarraDeStatusPrestacaoDeContas, setCorBarraDeStatusPrestacaoDeContas] = useState("");

    useEffect(()=> {
        if (periodoConta.periodo !== undefined && periodoConta.periodo !== "" && periodoConta.conta !== undefined && periodoConta.conta !== ""){
            setExibeMensagem(false)
            setStatusPrestacaoConta(true);

            if (periodoConta.periodo === "laranja" &&  periodoConta.acao === "manga"){
                setCorBarraDeStatusPrestacaoDeContas('verde')
            }
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

    return (
        <>
            <BarraDeStatusPrestacaoDeContas
                statusPrestacaoConta={statusPrestacaoConta}
                corBarraDeStatusPrestacaoDeContas={corBarraDeStatusPrestacaoDeContas}
            />

            <PeriodoConta
                periodoConta={periodoConta}
                handleChangePeriodoConta={handleChangePeriodoConta}
            />
            {exibeMensagem ? (
                    <MsgImgCentralizada
                        texto='Selecione um período e uma conta acima para visualizar as ações'
                        img={Img404}
                    />
            ) :
                <p>Preenchido os dois</p>
            }
        </>
    )
}