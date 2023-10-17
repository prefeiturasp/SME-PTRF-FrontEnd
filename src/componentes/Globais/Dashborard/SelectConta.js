import React from "react";
import {formataData} from "../../../utils/FormataData";

export const SelectConta = ({handleChangeConta, selectConta, tiposConta}) =>{
    
    const labelEncerramento = (conta) => {
        if(conta.solicitacao_encerramento && conta.solicitacao_encerramento.status !== "REJEITADA"){
            return ` (encerrada em ${formataData(conta.solicitacao_encerramento.data_de_encerramento_na_agencia)})`
        }

        return ''
    }

    return(
        <>
            <div className="col-auto ml-3 my-1">
                <h2 className="subtitulo-itens-painel-out mb-0">Conta:</h2>
            </div>
            <div className="col-auto my-1">
                <select
                    value={selectConta}
                    onChange={(e) => handleChangeConta(e.target.value)}
                    name="periodo"
                    id="periodo"
                    className="form-control"
                >
                    <option value="">Todas as contas</option>
                    {tiposConta && tiposConta.map((conta) =>
                        <option key={conta.uuid} value={conta.uuid}>
                            {conta.nome}
                            {labelEncerramento(conta)}
                        </option>
                    )}
                </select>
            </div>
        </>
    )
};