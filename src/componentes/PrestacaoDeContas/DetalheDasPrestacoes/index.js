import React, {useState} from "react";
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";

export const DetalheDasPrestacoes = () => {
    const [acaoLancamento, setAcaoLancamento]= useState("")

    const handleChangeSelectAcoes = (name, value) => {

        console.log("Ollyver Nome ", name)
        console.log("Ollyver Valor ", value)

        setAcaoLancamento({
            ...acaoLancamento,
            [name]: value
        });

    }

    return(
        <div className="col-12 detalhe-das-prestacoes-container" >
            <TopoComBotoes/>
            <SelectAcaoLancamento
                acaoLancamento={acaoLancamento}
                handleChangeSelectAcoes={handleChangeSelectAcoes}
            />
        </div>
    )
}