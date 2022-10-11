import React from "react";
import {TrilhaDeStatusNaoPublicada} from "./TrilhaDeStatusNaoPublicada";
import {TrilhaDeStatusPublicada} from "./TrilhaDeStatusPublicada";
import {TrilhaDeStatusEmAnalise} from "./TrilhaDeStatusEmAnalise";
import {TrilhaDeStatusConcluida} from "./TrilhaDeStatusConcluida";

export const TrilhaDeStatus = ({relatorioConsolidado}) => {

    const getTrilhaDeStatusPeloStatus = (status_sme)=>{
        if (status_sme === 'NAO PUBLICADA NO D.O'){
            return(
                <TrilhaDeStatusNaoPublicada/>
            )
        }else if(status_sme === 'PUBLICADA NO D.O'){
            return (
                <TrilhaDeStatusPublicada/>
            )
        }else if(status_sme === 'EM_ANALISE'){
            return (
                <TrilhaDeStatusEmAnalise/>
            )
        }else if(status_sme === 'CONCLUIDA'){
            return (
                <TrilhaDeStatusConcluida/>
            )
        }
    };

    return (
        <>
            {Object.entries(relatorioConsolidado).length > 0 &&
            <>
                {getTrilhaDeStatusPeloStatus(relatorioConsolidado.status_sme)}
            </>
            }
        </>
    )
};