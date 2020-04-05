import React from "react";
import NumberFormat from "react-number-format";
import {currencyFormatter} from "../../../utils/ValidacoesAdicionaisFormularios";

export const CadastroFormCusteio = (propriedades) => {
    const {formikProps, rateio, index, handleOnBlur, despesasTabelas, especificaoes_disable, especificaoes, set_aplicacao_recurso, set_tipo_custeio } = propriedades

    return (

        <>
            <div className="form-row">
                <div className="col-12 col-md-6 mt-4">

                    <label htmlFor="tipo_custeio">Tipo de custeio</label>
                    <select
                        //defaultValue={rateio.tipo_custeio.id}
                        value={
                            rateio.tipo_custeio !== null ? (
                                typeof rateio.tipo_custeio === "object" ? rateio.tipo_custeio.id : rateio.tipo_custeio
                            ) : 0
                        }
                        //onChange={formikProps.handleChange}
                        onChange={(e) => {
                            formikProps.handleChange(e);
                            set_tipo_custeio(e.target.value);
                        }}
                        //onBlur={(e)=>handleOnBlur("tipo_custeio", e.target.value)}
                        name={`rateios[${index}].tipo_custeio`}
                        id='tipo_custeio'
                        className="form-control"
                    >
                        <option value="0">Selecione um tipo</option>
                        {despesasTabelas.tipos_custeio && despesasTabelas.tipos_custeio.map(item => (
                            <option key={item.id} value={item.id}>{item.nome}</option>
                        ))}
                    </select>
                </div>

            </div>

            <div className="form-row">
                <div className="col-12 mt-4">
                    <label htmlFor="especificacao_material_servico">Especificação do material ou serviço</label>
                    <select
                        //value={rateio.especificacao_material_servico !== null ? rateio.especificacao_material_servico.id : 0}

                        //value={19}

                        value={
                            rateio.especificacao_material_servico !== null ? (
                                typeof rateio.especificacao_material_servico === "object" ? rateio.especificacao_material_servico.id : rateio.especificacao_material_servico
                            ) : 0
                        }
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].especificacao_material_servico`}
                        id='especificacao_material_servico'
                        className="form-control"
                        //disabled={especificaoes_disable}
                    >
                        <option key={0} value={0}>Selecione uma ação</option>
                        {especificaoes && especificaoes.map((item)=> (
                            <option key={item.id} value={item.id}>{item.descricao}</option>
                        ) )}
                    </select>
                </div>
                <div className="col-12 col-md-6 mt-4">
                    <label htmlFor="acao_associacao">Ação</label>
                    <select
                        value={rateio.acao_associacao !== null ? rateio.acao_associacao.uuid : 0}
                        onChange={formikProps.handleChange}
                        name={`rateios[${index}].acao_associacao`}
                        id='acao_associacao'
                        className="form-control"
                    >
                        <option key={0} value={0}>Selecione uma ação</option>
                        {despesasTabelas.acoes_associacao && despesasTabelas.acoes_associacao.map(item => (
                            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-6">
                    <div className='row'>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="conta_associacao">Tipo de conta utilizada</label>
                            <select
                                value={rateio.conta_associacao !== null ? rateio.conta_associacao.uuid : 0}
                                onChange={formikProps.handleChange}
                                name={`rateios[${index}].conta_associacao`}
                                id='conta_associacao'
                                className="form-control"
                            >
                                <option key={0} value={0}>Selecione uma conta</option>
                                {despesasTabelas.contas_associacao && despesasTabelas.contas_associacao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="valor_rateio">Valor do custeio</label>
                            <NumberFormat
                                format={currencyFormatter}
                                value={rateio.valor_rateio}
                                onChange={formikProps.handleChange}
                                thousandSeparator={'.'}
                                decimalSeparator={','}
                                decimalScale={2}
                                prefix={'R$ '}
                                name={`rateios[${index}].valor_rateio`}
                                id="valor_rateio"
                                className="form-control"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}