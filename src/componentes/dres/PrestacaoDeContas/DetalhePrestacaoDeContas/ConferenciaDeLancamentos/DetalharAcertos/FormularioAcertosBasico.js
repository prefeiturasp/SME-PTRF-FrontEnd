import React from "react";

export const FormularioAcertosBasico = ({formikProps, acerto, index, label, placeholder, required}) => {
    return (
        <>
            <div className="col-12 mt-3">
                <label htmlFor={`form-control[${index}]`}>{label}</label>
                <textarea
                    value={acerto.detalhamento}
                    name={`solicitacoes_acerto[${index}].detalhamento`}
                    id={`detalhamento[${index}]`}
                    className="form-control"
                    onChange={(e) => {
                        formikProps.handleChange(e);
                    }}
                    placeholder={placeholder}
                />
            </div>
        </>
    )
}