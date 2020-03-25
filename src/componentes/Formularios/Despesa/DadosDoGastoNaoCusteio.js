import React from "react";

export const DadosDoGastoNaoCusteio = (propriedades) => {

    const {dadosDoGastoNao, handleChangeAtualizacaoCadastral} = propriedades

    return (
        <>
            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="tipoCusteio">Tipo de custeio</label>
                <select
                    value={dadosDoGastoNao.tipoCusteio}
                    onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                    name='tipoCusteio'
                    id='tipoCusteio'
                    className="form-control"
                >
                    <option value="tipo_custeio_01">Tipo de Custeio 01</option>
                    <option value="tipo_custeio_02">Tipo de Custeio 02</option>
                </select>
            </div>

            <div className="col-12 mt-4">
                <label htmlFor="especificacaoMaterialServico">Especificação do material ou serviço</label>
                <select
                    value={dadosDoGastoNao.especificacaoMaterialServico}
                    onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                    name='especificacaoMaterialServico'
                    id='especificacaoMaterialServico'
                    className="form-control"
                >
                    <option value="servico">Serviço</option>
                    <option value="material">Material</option>
                </select>
            </div>

            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="valorRecursoAcoes">Ação</label>
                <select
                    value={dadosDoGastoNao.tipoAcao}
                    onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                    name='tipoAcao'
                    id='tipoAcao'
                    className="form-control"
                >
                    <option value="0">Selecione uma ação</option>
                    <option value="acao1">Capital</option>
                    <option value="acao2">Custeio</option>
                </select>
            </div>

            <div className="col-12 col-md-6 mt-4">
                <div className='row'>

                    <div className="col-12 col-md-6">
                        <label htmlFor="tipoDeConta">Tipo de conta utilizada</label>
                        <select
                            value={dadosDoGastoNao.tipoDeConta}
                            onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                            name='tipoDeConta'
                            id='tipoDeConta'
                            className="form-control"
                        >
                            <option value="conta1">Conta cheque</option>
                            <option value="conta2o">Conta Banco</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label htmlFor="valorDoCusteio">Valor do custeio</label>
                        <input
                            type='text'
                            value={dadosDoGastoNao.valorDoCusteio || ''}
                            onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}
                            name='valorDoCusteio'
                            id='valorDoCusteio'
                            className="form-control"
                            placeholder="Escreva o valor total"
                        />
                    </div>

                </div>

            </div>

        </>

    );
}