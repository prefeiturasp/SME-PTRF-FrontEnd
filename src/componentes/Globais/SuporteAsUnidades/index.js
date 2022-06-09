import React, {useState} from "react";
import {TextoExplicativo} from "./TextoExplicativoDaPagina"
import {EscolheUnidade} from "../EscolheUnidade";
import {visoesService} from "../../../services/visoes.service";

export const SuporteAsUnidades = (props) =>{

    const {visao} = props

    let dreUuid = ''
    if (visao === "DRE") {
        dreUuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')
    }

    return(
        <div>
            <TextoExplicativo visao={visao}/>
            <EscolheUnidade dre_uuid={dreUuid}/>
        </div>

    )
}
