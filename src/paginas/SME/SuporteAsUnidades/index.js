import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {SuporteAsUnidades} from "../../../componentes/Globais/SuporteAsUnidades"
import { visoesService } from "../../../services/visoes.service";
import { SuporteAsUnidadesV2 } from "../../../componentes/Globais/SuporteAsUnidades/SuporteAsUnidadesV2";

export const SuporteAsUnidadesSme = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5 mb-4">Suporte às unidades</h1>
            {
                visoesService.featureFlagAtiva('novo-suporte-unidades') ? (
                    <SuporteAsUnidadesV2 visao={"SME"}/>
                ) : (
                    <SuporteAsUnidades visao={"SME"}/>
                )
            }
        </PaginasContainer>
    )
};
