import React, {Fragment} from "react";


export const DadosDoGastoCusteioDinamico = (propriedades) => {
    const {dadosDoGastoContext} = propriedades
    return (
        <div className="form-row">
            {dadosDoGastoContext.inputFields.map((inputField, index) => (
                <Fragment key={`${inputField}~${index}`}>
                    <div className="form-group col-sm-6">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={dadosDoGastoContext.inputFields.firstName}
                            onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                        />
                    </div>
                    <div className="form-group col-sm-4">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={dadosDoGastoContext.inputFields.lastName}
                            onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                        />
                    </div>
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