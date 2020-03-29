import React, {useContext} from "react";
import {DadosDoGastoCusteio} from "./DadosDoGastoCusteio";
import {DadosDoGastoCapital} from "./DadosDoGastoCapital";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";

export const DadosDoGastoEscolha = (propriedades) => {

    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa, idAssociacao, formikProps} = propriedades
    const dadosApiContext = useContext(GetDadosApiDespesaContext);


    return (
        <>
            <div className="form-row">
                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="tipo_aplicacao_recurso">Tipo de aplicação do recurso</label>
                    <select
                        value={dadosDoGastoContext.dadosDoGasto.tipo_aplicacao_recurso}
                        onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, Number(e.target.value))}
                        name='tipo_aplicacao_recurso'
                        id='tipo_aplicacao_recurso'
                        className="form-control"
                    >
                        {dadosApiContext.tipoAplicacaoRecurso.length > 0  && dadosApiContext.tipoAplicacaoRecurso.map(item => (
                            <option key={item.id} value={Number(item.id)}>{item.nome}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row">
                {dadosDoGastoContext.dadosDoGasto.tipo_aplicacao_recurso === 1 ? (
                    <DadosDoGastoCusteio
                        dadosDoGastoContext = {dadosDoGastoContext}
                        gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}
                        idAssociacao={idAssociacao}
                        formikProps={formikProps}
                    />
                ): dadosDoGastoContext.dadosDoGasto.tipo_aplicacao_recurso === 2 ? (
                    <DadosDoGastoCapital
                        dadosDoGastoContext = {dadosDoGastoContext}
                        gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}
                        idAssociacao={idAssociacao}
                    />
                ) : null}

            </div>





        </>
    );
}