import React, {useState} from "react";
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentos} from "./TabelaDeLancamentos";
import {Justificativa} from "./Justivicativa";
import {TabelaValoresPendentesPorAcao} from "./TabelaValoresPendentesPorAcao";

export const DetalheDasPrestacoes = () => {
    const [acaoLancamento, setAcaoLancamento]= useState("")

    const handleChangeSelectAcoes = (name, value) => {
        setAcaoLancamento({
            ...acaoLancamento,
            [name]: value
        });
    }

    return(
        <div className="col-12 detalhe-das-prestacoes-container mb-5" >
            <TopoComBotoes/>
            <SelectAcaoLancamento
                acaoLancamento={acaoLancamento}
                handleChangeSelectAcoes={handleChangeSelectAcoes}
            />
            <TabelaValoresPendentesPorAcao/>
            <TabelaDeLancamentos
                conciliados={false}
            />
            <TabelaDeLancamentos
                conciliados={true}
            />
            <Justificativa/>
        </div>
    )
}