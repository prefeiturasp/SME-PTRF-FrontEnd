import React from "react";
import {TrilhaDeStatusBotoes} from "./TrilhaDeStatusBotoes";
import {TrilhaDeStatusNaoRecebida} from "./TrilhaDeStatusNaoRecebida";

export const TrilhaDeStatus = ({prestacaoDeContas}) => {
    console.log('TrilhaDeStatus XXXXX ', prestacaoDeContas);

    const getTrilhaDeStatusPeloStatus = (status)=>{
        console.log("getTrilhaDeStatusPeloStatus ", status)
        if (status === 'NAO_RECEBIDA'){
            return(
                <TrilhaDeStatusNaoRecebida/>
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