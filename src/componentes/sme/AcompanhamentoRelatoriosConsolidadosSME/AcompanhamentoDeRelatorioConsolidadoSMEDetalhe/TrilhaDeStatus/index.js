import React from "react";
import {TrilhaDeStatusNaoPublicada} from "./TrilhaDeStatusNaoPublicada";
import {TrilhaDeStatusPublicada} from "./TrilhaDeStatusPublicada";
import {TrilhaDeStatusEmAnalise} from "./TrilhaDeStatusEmAnalise";
import {TrilhaDeStatusDevolvido} from "./TrilhaDeStatusDevolvido";
import {TrilhaDeStatusConcluida} from "./TrilhaDeStatusConcluida";

export const TrilhaDeStatus = ({relatorioConsolidado, textDocumentConsolidadoPC}) => {
    const text_for_status_track_first_step = textDocumentConsolidadoPC.text_for_status_track_first_step()
    const text_for_status_track_second_step = textDocumentConsolidadoPC.text_for_status_track_second_step()

    const getTrilhaDeStatusPeloStatus = (status_sme)=>{
        if (status_sme === 'NAO_PUBLICADO'){
            return(
                <TrilhaDeStatusNaoPublicada text_for_status_track_first_step={text_for_status_track_first_step} text_for_status_track_second_step={text_for_status_track_second_step}/>
            )
        }else if(status_sme === 'PUBLICADO'){
            return (
                <TrilhaDeStatusPublicada text_for_status_track_first_step={text_for_status_track_first_step} text_for_status_track_second_step={text_for_status_track_second_step}/>
            )
        }else if(status_sme === 'EM_ANALISE'){
            return (
                <TrilhaDeStatusEmAnalise text_for_status_track_first_step={text_for_status_track_first_step} text_for_status_track_second_step={text_for_status_track_second_step}/>
            )
        }else if(status_sme === 'DEVOLVIDO'){
            return (
                <TrilhaDeStatusDevolvido text_for_status_track_first_step={text_for_status_track_first_step} text_for_status_track_second_step={text_for_status_track_second_step}/>
            )
        }
        else if(status_sme === 'ANALISADO'){
            return (
                <TrilhaDeStatusConcluida text_for_status_track_first_step={text_for_status_track_first_step} text_for_status_track_second_step={text_for_status_track_second_step}/>
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
