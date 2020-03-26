import React from "react";
import NumberFormat from 'react-number-format';
import {GetTiposCusteioApi, GetAcoesAssociacaoApi, GetContasAssociacaoApi, GetEspecificacaoMaterialServicoApi} from "../../../services/GetDadosApiDespesa";

export const DadosDoGastoCusteio = (propriedades) => {

    const {dadosDoGastoNaoContext, gastoEmMaisDeUmaDespesa} = propriedades

    return (
        <>
            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="tipo_custeio">Tipo de custeio</label>
                <select
                    value={dadosDoGastoNaoContext.dadosDoGastoNao.tipo_custeio}
                    onChange={(e) => dadosDoGastoNaoContext.handleChangeDadosDoGastoNao(e.target.name, e.target.value)}
                    name='tipo_custeio'
                    id='tipo_custeio'
                    className="form-control"
                >
                    {GetTiposCusteioApi() && GetTiposCusteioApi().map(item => (
                        <option key={item.id} value={item.id}>{item.nome}</option>
                    ))}
                </select>
            </div>

            <div className="col-12 mt-4">
                <label htmlFor="especificacao_material_servico">Especificação do material ou serviço</label>
                <select
                    value={dadosDoGastoNaoContext.dadosDoGastoNao.especificacao_material_servico}
                    onChange={(e) => dadosDoGastoNaoContext.handleChangeDadosDoGastoNao(e.target.name, e.target.value)}
                    name='especificacao_material_servico'
                    id='especificacao_material_servico'
                    className="form-control"
                >
                    <option value="0">Selecione uma ação</option>
                    {GetEspecificacaoMaterialServicoApi() && GetEspecificacaoMaterialServicoApi().map(item => (
                        <option key={item.id} value={item.id} >{item.descricao}</option>
                    ))}
                </select>
            </div>

            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="acao_associacao">Ação</label>
                <select
                    value={dadosDoGastoNaoContext.dadosDoGastoNao.acao}
                    onChange={(e) => dadosDoGastoNaoContext.handleChangeDadosDoGastoNao(e.target.name, e.target.value)}
                    name='acao_associacao'
                    id='acao_associacao'
                    className="form-control"
                >
                    <option value="0">Selecione uma ação</option>
                    {GetAcoesAssociacaoApi() && GetAcoesAssociacaoApi().map(item => (
                        <option key={item.uuid} value={item.uuid} >{item.nome}</option>
                    ))}
                </select>
            </div>

            <div className="col-12 col-md-6">
                <div className='row'>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="conta_associacao">Tipo de conta utilizada</label>
                        <select
                            value={dadosDoGastoNaoContext.dadosDoGastoNao.conta_associacao}
                            onChange={(e) => dadosDoGastoNaoContext.handleChangeDadosDoGastoNao(e.target.name, e.target.value)}
                            name='conta_associacao'
                            id='conta_associacao'
                            className="form-control"
                        >
                            <option value="0">Selecione uma conta</option>
                            {GetContasAssociacaoApi() && GetContasAssociacaoApi().map(item => (
                                <option key={item.uuid} value={item.uuid} >{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="valor_rateio">Valor do custeio</label>
                        <NumberFormat
                            value={dadosDoGastoNaoContext.dadosDoGastoNao.valor_rateio}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            decimalScale={2}
                            prefix={'R$ '}
                            name="valor_rateio"
                            id="valor_rateio"
                            className="form-control"
                            onChange={(e) => dadosDoGastoNaoContext.handleChangeDadosDoGastoNao(e.target.name, e.target.value)}
                        />
                    </div>

                </div>

            </div>

            {gastoEmMaisDeUmaDespesa === 0 ? (
                <p><strong>NÃO Exibe Campos adicionais</strong></p>
            ) :
                <p><strong>SIM Exibe Campos adicionais</strong></p>
            }

        </>

    );
}