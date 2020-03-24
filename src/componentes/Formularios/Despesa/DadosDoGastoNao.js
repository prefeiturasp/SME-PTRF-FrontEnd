import React, {useEffect} from "react";
import {DadosDoGastoNaoCusteio} from "./DadosDoGastoNaoCusteio";

export const DadosDoGastoNao = (propriedades) => {

    const {dadosDoGastoNao, setDadosDoGastoNao, handleChangeAtualizacaoCadastral} = propriedades

    useEffect(()=>{
        setDadosDoGastoNao({tipoDespesa:"custeio"})
    }, [])

    return (
        <>
            <div className="form-row">
                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="tipoDespesa">Tipo de aplicação do recurso</label>
                    <select
                        value={dadosDoGastoNao.tipoDespesa}
                        //onChange={(e)=>handleChangeAtualizacaoCadastral({tipoDespesa: e.target.value})}
                        onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                        //onBlur={props.handleBlur}
                        name='tipoDespesa'
                        id='tipoDespesa'
                        className="form-control"
                    >
                        <option value="custeio">Custeio</option>
                        <option value="capital">Capital</option>
                    </select>
                </div>

                {dadosDoGastoNao.tipoDespesa === "custeio" ? (
                    <DadosDoGastoNaoCusteio
                        dadosDoGastoNao = {dadosDoGastoNao}
                        setDadosDoGastoNao={setDadosDoGastoNao}
                        handleChangeAtualizacaoCadastral={handleChangeAtualizacaoCadastral}

                    />
                ): null }

            </div>





        </>
    );
}