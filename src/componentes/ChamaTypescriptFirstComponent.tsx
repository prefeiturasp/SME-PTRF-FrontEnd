import React from "react";
import {TypescriptFirstComponent} from "./TypescriptFirstComponent";
import {PaginasContainer} from "../paginas/PaginasContainer";

export const ChamaTypescriptFirstComponent: React.FC = () => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Componente Typescript</h1>
            <div className="page-content-inner">
                <TypescriptFirstComponent name={'Ollyver'}/>
            </div>
        </PaginasContainer>
    )
}