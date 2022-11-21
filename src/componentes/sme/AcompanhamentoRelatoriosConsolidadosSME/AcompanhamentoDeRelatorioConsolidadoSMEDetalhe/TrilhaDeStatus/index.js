import React from "react";
import {TrilhaDeStatusNaoPublicada} from "./TrilhaDeStatusNaoPublicada";
import {TrilhaDeStatusPublicada} from "./TrilhaDeStatusPublicada";
import {TrilhaDeStatusEmAnalise} from "./TrilhaDeStatusEmAnalise";
import {TrilhaDeStatusDevolvido} from "./TrilhaDeStatusDevolvido";
import {TrilhaDeStatusConcluida} from "./TrilhaDeStatusConcluida";

export const TrilhaDeStatus = ({relatorioConsolidado}) => {

    const getTrilhaDeStatusPeloStatus = (status_sme)=>{
        if (status_sme === 'NAO_PUBLICADO'){
            return(
                <TrilhaDeStatusNaoPublicada/>
            )
        }else if(status_sme === 'PUBLICADO'){
            return (
                <TrilhaDeStatusPublicada/>
            )
        }else if(status_sme === 'EM_ANALISE'){
            return (
                <TrilhaDeStatusEmAnalise/>
            )        
        }else if(status_sme === 'DEVOLVIDO'){
            return (
                <TrilhaDeStatusDevolvido/>
            )  
        }
        else if(status_sme === 'ANALISADO'){
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