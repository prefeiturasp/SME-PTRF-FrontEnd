import React, {useState} from "react";
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentosDespesas} from "./TabelaDeLancamentosDespesas";
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
            {/*<TabelaValoresPendentesPorAcao/>*/}

            <TabelaDeLancamentosDespesas
                conciliados={false}
            />
            <TabelaDeLancamentosDespesas
                conciliados={true}
            />
            <Justificativa/>
        </div>
    )
}