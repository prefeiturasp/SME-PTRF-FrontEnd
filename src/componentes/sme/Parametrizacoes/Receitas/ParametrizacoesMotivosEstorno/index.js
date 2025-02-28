import React from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import { MotivosEstornoProvider } from "./context/MotivosEstorno";
import { Lista } from "./Lista";

export const ParametrizacoesMotivosDeEstorno = ()=>{
    return(
        <MotivosEstornoProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Motivos de estorno</h1>
                <div className="page-content-inner">
                    <Lista/>
                </div>
            </PaginasContainer>
        </MotivosEstornoProvider>
    )
}