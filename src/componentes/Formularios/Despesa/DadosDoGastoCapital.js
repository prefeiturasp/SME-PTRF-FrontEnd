import React from "react";
import {DadosDoGastoCapitalForm} from "./DadosDoGastoCapitalForm";

export const DadosDoGastoCapital = (propriedades) => {

    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa} = propriedades
    return (
        <>
            <DadosDoGastoCapitalForm
                dadosDoGastoContext={dadosDoGastoContext}
                gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}
            />
        </>

    );
}