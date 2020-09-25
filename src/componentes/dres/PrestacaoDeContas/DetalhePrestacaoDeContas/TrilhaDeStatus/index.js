import React from "react";
import {TrilhaDeStatusBotoes} from "./TrilhaDeStatusBotoes";
import {TrilhaDeStatusNaoRecebida} from "./TrilhaDeStatusNaoRecebida";
import {TrilhaDeStatusRecebida} from "./TrilhaDeStatusRecebida";
import {TrilhaDeStatusEmAnalise} from "./TrilhaDeStatusEmAnalise";

export const TrilhaDeStatus = ({prestacaoDeContas}) => {
    console.log('TrilhaDeStatus XXXXX ', prestacaoDeContas);

    const getTrilhaDeStatusPeloStatus = (status)=>{
        console.log("getTrilhaDeStatusPeloStatus ", status)
        if (status === 'NAO_RECEBIDA'){
            return(
                <TrilhaDeStatusNaoRecebida/>
            )
        }else if(status === 'RECEBIDA'){
            return (
                <TrilhaDeStatusRecebida/>
            )
        }else if(status === 'EM_ANALISE'){
            return (
                <TrilhaDeStatusEmAnalise/>
            )
        }
    };

    return (
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                <TrilhaDeStatusBotoes
                    prestacaoDeContas={prestacaoDeContas}
                />

                {getTrilhaDeStatusPeloStatus(prestacaoDeContas.status)}

            </>
            }
        </>
    )
};