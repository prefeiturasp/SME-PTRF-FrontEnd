import React from "react";
import {DadosDoGastoCusteioForm} from "./DadosDoGastoCusteioForm";

export const DadosDoGastoCusteio = (propriedades) => {
    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa} = propriedades
    return (
        <>
            <DadosDoGastoCusteioForm
                dadosDoGastoContext={dadosDoGastoContext}
                gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}
            />
        </>

    );
}