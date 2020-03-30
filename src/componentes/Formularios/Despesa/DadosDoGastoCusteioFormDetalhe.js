import React from "react";
import NumberFormat from "react-number-format";

export const DadosDoGastoCusteioFormDetalhe = () => {

    return (
        <>
            <div className="col-12">
                <label htmlFor="tipo_custeio">Tipo de custeio</label>
                <select

                    defaultValue={rateio.tipo_custeio.id}
                    onChange={formikProps.handleChange}
                    name={`rateios[${index}].tipo_custeio`}
                    //name='tipo_custeio'
                    id='tipo_custeio'
                    className="form-control"
                >
                    {dadosApiContext.tiposCusteio.length > 0 && dadosApiContext.tiposCusteio.map(item => (
                        <option key={item.id} value={item.id}>{item.nome}</option>
                    ))}
                </select>
            </div>

            <div className="col-12 mt-4">
                <label htmlFor="especificacao_material_servico">Especificação do
                    material ou serviço</label>
                <select
                    defaultValue={rateio.especificacao_material_servico.id}
                    onChange={formikProps.handleChange}
                    name={`rateios[${index}].especificacao_material_servico`}
                    //name='especificacao_material_servico'
                    id='especificacao_material_servico'
                    className="form-control"
                >
                    <option value="0">Selecione uma ação</option>
                    {dadosApiContext.especificacaoMaterialServico.length > 0 && dadosApiContext.especificacaoMaterialServico.map(item => (
                        <option key={item.id} value={item.id}>{item.descricao}</option>
                    ))}
                </select>
            </div>

            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="acao_associacao">Ação</label>
                <select
                    defaultValue={rateio.acao_associacao.uuid}
                    onChange={formikProps.handleChange}
                    name={`rateios[${index}].acao_associacao`}
                    //name='acao_associacao'
                    id='acao_associacao'
                    className="form-control"
                >
                    <option value="0">Selecione uma ação</option>
                    {dadosApiContext.acoesAssociacao.length > 0 && dadosApiContext.acoesAssociacao.map(item => (
                        <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                    ))}
                </select>
            </div>

            <div className="col-12 col-md-6">
                <div className='row'>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="conta_associacao">Tipo de conta
                            utilizada</label>
                        <select
                            defaultValue={rateio.conta_associacao.uuid}
                            onChange={formikProps.handleChange}
                            //name='conta_associacao'
                            name={`rateios[${index}].conta_associacao`}
                            id='conta_associacao'
                            className="form-control"
                        >
                            <option value="0">Selecione uma conta</option>
                            {dadosApiContext.contaAssociacao.length > 0 && dadosApiContext.contaAssociacao.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-6 mt-4">
                        <label htmlFor="valor_rateio">Valor do custeio</label>
                        <NumberFormat

                            defaultValue={rateio.valor_rateio}
                            onChange={formikProps.handleChange}
                            thousandSeparator={'.'}
                            decimalSeparator={','}
                            decimalScale={2}
                            prefix={'R$ '}
                            name={`rateios[${index}].valor_rateio`}
                            //name="rateios[index].valor_rateio"
                            id="valor_rateio"
                            className="form-control"
                        />
                    </div>

                </div>


            </div>
        </>
    );

}