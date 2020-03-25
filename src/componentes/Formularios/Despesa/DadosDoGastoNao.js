import React, {useEffect} from "react";
import {DadosDoGastoNaoCusteio} from "./DadosDoGastoNaoCusteio";

export const DadosDoGastoNao = (propriedades) => {

    const {dadosDoGastoNaoContext} = propriedades

    return (
        <>
            <div className="form-row">
                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="tipoDespesa">Tipo de aplicação do recurso</label>
                    <select
                        value={dadosDoGastoNaoContext.dadosDoGastoNao.tipoDespesa}
                        onChange={(e) => dadosDoGastoNaoContext.handleChangeDadosDoGastoNao(e.target.name, e.target.value)}
                        name='tipoDespesa'
                        id='tipoDespesa'
                        className="form-control"
                    >
                        <option value="custeio">Custeio</option>
                        <option value="capital">Capital</option>
                    </select>
                </div>

                {dadosDoGastoNaoContext.dadosDoGastoNao.tipoDespesa === "custeio" ? (
                    <DadosDoGastoNaoCusteio
                        dadosDoGastoNaoContext = {dadosDoGastoNaoContext}
                    />
                ): null }

            </div>





        </>
    );
}