import React from "react";
import {DadosDoGastoCusteioForm} from "./DadosDoGastoCusteioForm";
import {DadosDoGastoCusteioFormEdicao} from "./DadosDoGastoCusteioFormEdicao";

export const DadosDoGastoCusteio = (propriedades) => {
    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa, idAssociacao, formikProps} = propriedades

    return (
        <>

            {idAssociacao === undefined ? (
                    <DadosDoGastoCusteioForm
                        dadosDoGastoContext={dadosDoGastoContext}
                        gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}

                    />
                ):
                <DadosDoGastoCusteioFormEdicao
                    dadosDoGastoContext={dadosDoGastoContext}
                    gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}
                    idAssociacao={idAssociacao}
                    formikProps={formikProps}
                />
            }


        </>

    );
}