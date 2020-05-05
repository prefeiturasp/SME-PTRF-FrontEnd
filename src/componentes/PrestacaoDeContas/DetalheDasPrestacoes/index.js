import React, {useState} from "react";
import {useHistory} from 'react-router-dom';
import {TopoComBotoes} from "./TopoComBotoes";
import {SelectAcaoLancamento} from "./SelectAcaoLancamento";
import {TabelaDeLancamentosDespesas} from "./TabelaDeLancamentosDespesas";
import {Justificativa} from "./Justivicativa";
import {TabelaValoresPendentesPorAcao} from "./TabelaValoresPendentesPorAcao";

export const DetalheDasPrestacoes = () => {

    let history = useHistory();

    const [acaoLancamento, setAcaoLancamento]= useState("")

    const handleChangeSelectAcoes = (name, value) => {
        setAcaoLancamento({
            ...acaoLancamento,
            [name]: value
        });
    }

    const handleClickCadastrarDespesa = () => {
        let path = `/cadastro-de-despesa/tabela-de-lancamentos-despesas`;
        history.push(path);
    }

    return(
        <div className="col-12 detalhe-das-prestacoes-container mb-5" >
            <TopoComBotoes
                handleClickCadastrarDespesa={handleClickCadastrarDespesa}
            />
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