import React, {useState} from "react";
import {PeriodoConta} from "./SelectPeriodoConta";
import {MsgImgCentralizada} from "../Mensagens/MsgImgCentralizada";
import "../../assets/img/img-404.svg"
import Img404 from "../../assets/img/img-404.svg";

export const PrestacaoDeContas = () => {

    const [periodoConta, setPeriodoConta] = useState("");

    const handleChangePeriodoConta = (name, value) => {
        setPeriodoConta({
            ...periodoConta,
            [name]: value
        });
    }

    return (
        <>
            {console.log("Periodo: ", periodoConta.periodo)}
            <PeriodoConta
                periodoConta={periodoConta}
                handleChangePeriodoConta={handleChangePeriodoConta}
            />
            {periodoConta.periodo === undefined || periodoConta.periodo === "" || periodoConta.conta === undefined || periodoConta.conta === "" ? (
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