import React, {Fragment, useContext} from "react";
import NumberFormat from "react-number-format";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";


export const DadosDoGastoCusteioFormEdicao = (propriedades) => {

    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa, idAssociacao} = propriedades
    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    return (
        <div className="col-12 mt-4">
            <h1>Edicao</h1>
            <div className="form-row">
                {
                    dadosApiContext.updateDespesa.map((item, index) => {
                            return (
                                <Fragment key={`${item}~${index}`}>
                                    {item.rateios.map((dataItem, index) => {
                                        return (
                                            <Fragment key={index}>
                                                {dadosDoGastoContext.inputFields && dadosDoGastoContext.inputFields.map((inputField, index) => {
                                                    return (
                                                        <Fragment key={`${inputField}~${index}`}>
                                                            {gastoEmMaisDeUmaDespesa !== 0 && (
                                                                <div className="col-12">
                                                                    <p className='mb-0'><strong>Despesa {index + 1}</strong>
                                                                    </p>
                                                                    <hr className='mt-0'/>
                                                                </div>
                                                            )}
                                                            <div className="col-12 col-md-6 mt-4">
                                                                <label htmlFor="valor_rateio">Valor do custeio</label>
                                                                <NumberFormat
                                                                    defaultValue={dataItem.valor_rateio}
                                                                    onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                                                                    thousandSeparator={'.'}
                                                                    decimalSeparator={','}
                                                                    decimalScale={2}
                                                                    prefix={'R$ '}
                                                                    name="valor_rateio"
                                                                    id="valor_rateio"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                                <div className="d-flex  justify-content-start mt-3 mb-3">
                                                                    {dadosDoGastoContext.inputFields.length > 1 && (
                                                                        <button
                                                                            className="btn btn btn-outline-success mt-2 mr-2"
                                                                            type="button"
                                                                            onClick={() => dadosDoGastoContext.handleRemoveFields(index)}
                                                                        >
                                                                            - Remover Despesa
                                                                        </button>
                                                                    )}
                                                                </div>
                                                        </Fragment>
                                                    )
                                                })}
                                            </Fragment>
                                        )
                                    })}

                                    <div className="d-flex  justify-content-start mt-3 mb-3">
                                        <button
                                            className="btn btn btn-outline-success mt-2 mr-2"
                                            type="button"
                                            onClick={(e) => dadosDoGastoContext.handleAddFields()}
                                        >
                                            + Adicionar despesa parcial
                                        </button>
                                    </div>

                                </Fragment>

                            ) /*Aqui o map dadosApiContext.updateDespesa */
                        }
                    )}

            </div>
        </div>
    )
}