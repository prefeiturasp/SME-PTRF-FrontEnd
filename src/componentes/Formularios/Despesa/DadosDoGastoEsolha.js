import React from "react";
import {DadosDoGastoCusteio} from "./DadosDoGastoCusteio";
import {DadosDoGastoCapital} from "./DadosDoGastoCapital";
import {GetTiposAplicacaoRecursoApi} from "../../../services/GetDadosApiDespesa";

export const DadosDoGastoEscolha = (propriedades) => {

    const {dadosDoGastoNaoContext, gastoEmMaisDeUmaDespesa} = propriedades

    return (
        <>
            <div className="form-row">
                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="tipo_aplicacao_recurso">Tipo de aplicação do recurso</label>
                    <select
                        value={dadosDoGastoNaoContext.dadosDoGastoNao.tipo_aplicacao_recurso}
                        onChange={(e) => dadosDoGastoNaoContext.handleChangeDadosDoGastoNao(e.target.name, Number(e.target.value))}
                        name='tipo_aplicacao_recurso'
                        id='tipo_aplicacao_recurso'
                        className="form-control"
                    >
                        {GetTiposAplicacaoRecursoApi() && GetTiposAplicacaoRecursoApi().map(item => (
                            <option key={item.id} value={Number(item.id)}>{item.nome}</option>
                        ))}
                    </select>
                </div>
                {dadosDoGastoNaoContext.dadosDoGastoNao.tipo_aplicacao_recurso === 1 ? (
                    <DadosDoGastoCusteio
                        dadosDoGastoNaoContext = {dadosDoGastoNaoContext}
                        gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}
                    />
                ): dadosDoGastoNaoContext.dadosDoGastoNao.tipo_aplicacao_recurso === 2 ? (
                    <DadosDoGastoCapital
                        dadosDoGastoNaoContext = {dadosDoGastoNaoContext}
                        gastoEmMaisDeUmaDespesa={gastoEmMaisDeUmaDespesa}
                    />
                ) : null}

            </div>





        </>
    );
}