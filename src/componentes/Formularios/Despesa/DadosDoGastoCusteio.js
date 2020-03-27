import React  from "react";
import NumberFormat from 'react-number-format';
import {GetTiposCusteioApi, GetAcoesAssociacaoApi, GetContasAssociacaoApi, GetEspecificacaoMaterialServicoApi} from "../../../services/GetDadosApiDespesa";
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