import React from "react";
import {DadosDoGastoNaoCusteio} from "./DadosDoGastoNaoCusteio";
import {DadosDoGastoNaoCapital} from "./DadosDoGastoNaoCapital";
import {GetTiposAplicacaoRecursoApi} from "../../../services/GetDadosApiDespesa";

export const DadosDoGastoNao = (propriedades) => {

    const {dadosDoGastoNaoContext} = propriedades

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
                    <DadosDoGastoNaoCusteio
                        dadosDoGastoNaoContext = {dadosDoGastoNaoContext}
                    />
                ): dadosDoGastoNaoContext.dadosDoGastoNao.tipo_aplicacao_recurso === 2 ? (
                    <DadosDoGastoNaoCapital
                        dadosDoGastoNaoContext = {dadosDoGastoNaoContext}
                    />
                ) : null}

            </div>





        </>
    );
}