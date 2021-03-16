import React from "react";

export const SelectConta = ({handleChangeConta, selectConta, tiposConta}) =>{
    return(
        <>
            <div className="col">
                <label htmlFor='conta'><strong>Selecione o tipo de conta:</strong></label>
                <select
                    value={selectConta}
                    onChange={(e) => handleChangeConta(e.target.value)}
                    name="conta"
                    id="conta"
                    className="form-control"
                >
                    <option value="">Escolha um tipo de conta</option>
                    {tiposConta && tiposConta.map((conta) =>
                        <option key={conta.uuid} value={conta.uuid}>{conta.nome}</option>
                    )}
                </select>
            </div>
        </>
    )
};