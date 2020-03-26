import React, {Fragment} from "react";
import {
    GetAcoesAssociacaoApi, GetContasAssociacaoApi,
    GetEspecificacaoMaterialServicoApi,
    GetTiposCusteioApi
} from "../../../services/GetDadosApiDespesa";
import NumberFormat from "react-number-format";
import {DadosDoGastoCusteioForm} from "./DadosDoGastoCusteioForm";


export const DadosDoGastoCusteioDinamico = (propriedades) => {
    const {dadosDoGastoContext} = propriedades
    return (
        <div className="form-row">
            {dadosDoGastoContext.inputFields.map((inputField, index) => (
                <Fragment key={`${inputField}~${index}`}>
                    <DadosDoGastoCusteioForm
                        dadosDoGastoContext={dadosDoGastoContext}
                    />
                    <div className="form-group col-sm-2">
                        <button
                            className="btn btn-link"
                            type="button"
                            onClick={() => dadosDoGastoContext.handleRemoveFields(index)}
                        >
                            -
                        </button>
                        <button
                            className="btn btn-link"
                            type="button"
                            onClick={() => dadosDoGastoContext.handleAddFields()}
                        >
                            +
                        </button>
                    </div>
                </Fragment>
            ))}
        </div>
    )
}