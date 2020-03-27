import React  from "react";
import {DadosDoGastoCusteioForm} from "./DadosDoGastoCusteioForm";
import {DadosDoGastoCusteioFormDinamico} from "./DadosDoGastoCusteioFormDinamico";

export const DadosDoGastoCusteio = (propriedades) => {

    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa} = propriedades

    return (
        <>

            {gastoEmMaisDeUmaDespesa === 0 ? (
                    <DadosDoGastoCusteioForm
                        dadosDoGastoContext={dadosDoGastoContext}
                    />
                ) :
                <DadosDoGastoCusteioFormDinamico
                    dadosDoGastoContext={dadosDoGastoContext}
                />
            }

        </>

    );
}