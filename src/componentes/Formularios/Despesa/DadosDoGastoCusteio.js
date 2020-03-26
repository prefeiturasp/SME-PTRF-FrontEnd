import React  from "react";
import NumberFormat from 'react-number-format';
import {GetTiposCusteioApi, GetAcoesAssociacaoApi, GetContasAssociacaoApi, GetEspecificacaoMaterialServicoApi} from "../../../services/GetDadosApiDespesa";
import {DadosDoGastoCusteioDinamico} from "./DadosDoGastoCusteioDinamico";

import {DadosDoGastoCusteioForm} from "./DadosDoGastoCusteioForm";

export const DadosDoGastoCusteio = (propriedades) => {

    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa} = propriedades

    return (
        <>
            <DadosDoGastoCusteioForm
                dadosDoGastoContext={dadosDoGastoContext}
            />

            {gastoEmMaisDeUmaDespesa === 0 ? (
                <p><strong>NÃO Exibe Campos adicionais</strong></p>
            ) :
                <DadosDoGastoCusteioDinamico
                    dadosDoGastoContext={dadosDoGastoContext}
                />
            }

        </>

    );
}