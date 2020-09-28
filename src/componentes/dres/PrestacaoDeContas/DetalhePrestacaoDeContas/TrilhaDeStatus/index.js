import React from "react";
import {TrilhaDeStatusNaoRecebida} from "./TrilhaDeStatusNaoRecebida";
import {TrilhaDeStatusRecebida} from "./TrilhaDeStatusRecebida";
import {TrilhaDeStatusEmAnalise} from "./TrilhaDeStatusEmAnalise";
import {TrilhaDeStatusDevolvidaParaAcertos} from "./TrilhaDeStatusDevolvidaParaAcertos";
import {TrilhaDeStatusAprovada} from "./TrilhaDeStatusAprovada";

export const TrilhaDeStatus = ({prestacaoDeContas}) => {

    const getTrilhaDeStatusPeloStatus = (status)=>{
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
        }else if(status === 'DEVOLVIDA'){
            return (
                <TrilhaDeStatusDevolvidaParaAcertos/>
            )
        }else if(status === 'APROVADA' || status === 'APROVADA_RESSALVA' || status === 'REPROVADA'){
            return (
                <TrilhaDeStatusAprovada/>
            )
        }
    };

    return (
        <>
            {Object.entries(prestacaoDeContas).length > 0 &&
            <>
                {getTrilhaDeStatusPeloStatus(prestacaoDeContas.status)}
            </>
            }
        </>
    )
};