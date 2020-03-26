import React, {useEffect} from "react";
import {GetAcoesAssociacaoApi, GetContasAssociacaoApi, GetEspecificacaoMaterialServicoApi} from "../../../services/GetDadosApiDespesa";
import {calculaValorRateio} from "../../../utils/ValidacoesAdicionaisFormularios";
import NumberFormat from "react-number-format";

export const DadosDoGastoCapital = (propriedades) => {

    const {dadosDoGastoContext, gastoEmMaisDeUmaDespesa} = propriedades

    useEffect(()=>{
        dadosDoGastoContext.handleChangeDadosDoGasto("tipo_custeio", 2 )
    }, [])

    return (
        <>

            <div className="col-12 mt-4">
                <label htmlFor="especificacao_material_servico">Especificação do material ou serviço</label>
                <select
                    value={dadosDoGastoContext.dadosDoGasto.especificacao_material_servico}
                    onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
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
                    value={dadosDoGastoContext.dadosDoGasto.acao}
                    onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
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
                        <label htmlFor="quantidade_itens_capital">Quantidade de itens</label>

                        <NumberFormat
                            value={dadosDoGastoContext.dadosDoGasto.quantidade_itens_capital}
                            decimalScale={0}
                            name="quantidade_itens_capital"
                            id="quantidade_itens_capital"
                            className="form-control"
                            onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
                        />
                    </div>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="valor_item_capital">Valor unitário </label>
                        <NumberFormat
                            value={dadosDoGastoContext.dadosDoGasto.valor_item_capital}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            decimalScale={2}
                            prefix={'R$ '}
                            name="valor_item_capital"
                            id="valor_item_capital"
                            className="form-control"
                            onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
                        />
                    </div>

                </div>

            </div>

            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="numero_processo_incorporacao_capital">Número do processo de incorporação</label>
                <input
                    type='text'
                    value={dadosDoGastoContext.dadosDoGasto.numero_processo_incorporacao_capital || ''}
                    onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
                    name='numero_processo_incorporacao_capital'
                    id='numero_processo_incorporacao_capital'
                    className="form-control"
                    placeholder="Escreva o número do processo"
                />
            </div>

            <div className="col-12 col-md-6">
                <div className='row'>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="conta_associacao">Tipo de conta utilizada</label>
                        <select
                            value={dadosDoGastoContext.dadosDoGasto.conta_associacao}
                            onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
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
                        <label htmlFor="valor_rateio">Valor total do capital </label>
                        <NumberFormat
                            value={calculaValorRateio(dadosDoGastoContext.dadosDoGasto.valor_item_capital, dadosDoGastoContext.dadosDoGasto.quantidade_itens_capital) }
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            decimalScale={2}
                            prefix={'R$ '}
                            name="valor_rateio"
                            id="valor_rateio"
                            className="form-control"
                            onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
                            readOnly={true}
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