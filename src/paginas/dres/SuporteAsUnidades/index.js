import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {SuporteAsUnidades} from "../../../componentes/Globais/SuporteAsUnidades"
import { visoesService } from "../../../services/visoes.service";
import { SuporteAsUnidadesV2 } from "../../../componentes/Globais/SuporteAsUnidades/SuporteAsUnidadesV2";


export const SuporteAsUnidadesDre = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Suporte às unidades da DRE</h1>
            {
                visoesService.featureFlagAtiva('novo-suporte-unidades') ? (
                    <SuporteAsUnidadesV2 visao={"DRE"}/>
                ) : (
                    <SuporteAsUnidades visao={"DRE"}/>
                )
            }            
        </PaginasContainer>
    )
};