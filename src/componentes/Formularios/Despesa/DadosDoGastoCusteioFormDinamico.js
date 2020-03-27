import React, {Fragment, useContext} from "react";
import {
/*    GetAcoesAssociacaoApi, GetContasAssociacaoApi,
    GetEspecificacaoMaterialServicoApi,*/
    GetTiposCusteioApi
} from "../../../services/GetDadosApiDespesa";
import NumberFormat from "react-number-format";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";


export const DadosDoGastoCusteioFormDinamico = (propriedades) => {

    const {dadosDoGastoContext} = propriedades
    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    console.log("Ollyver DadosDoGastoCusteioFormDinamico ", dadosApiContext.tiposCusteio)

    return (
        <div className="col-12 mt-4">
            <div className="form-row">
                {dadosDoGastoContext.inputFields.map((inputField, index) => (
                    <Fragment key={`${inputField}~${index}`}>
                        {/*<div className="form-group col-sm-6">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstName"
                                name="firstName"
                                value={dadosDoGastoContext.inputFields.firstName}
                                onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                            />
                        </div>
                        <div className="form-group col-sm-4">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastName"
                                name="lastName"
                                value={dadosDoGastoContext.inputFields.lastName}
                                onChange={event => dadosDoGastoContext.handleInputChange(index, event)}
                            />
                        </div>*/}
                        <div className="col-12 col-md-6 mt-4">
                            <label htmlFor="tipo_custeio">Tipo de custeio</label>
                            <select
                                value={dadosDoGastoContext.dadosDoGasto.tipo_custeio}
                                onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
                                name='tipo_custeio'
                                id='tipo_custeio'
                                className="form-control"
                            >
                                {dadosApiContext.tiposCusteio.length > 0  && dadosApiContext.tiposCusteio.map(item => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        {/*<div className="col-12 mt-4">
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
                                    <option key={item.id} value={item.id}>{item.descricao}</option>
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
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
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
                                            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="valor_rateio">Valor do custeio</label>
                                    <NumberFormat
                                        value={dadosDoGastoContext.dadosDoGasto.valor_rateio}
                                        thousandSeparator={'.'}
                                        decimalSeparator={','}
                                        decimalScale={2}
                                        prefix={'R$ '}
                                        name="valor_rateio"
                                        id="valor_rateio"
                                        className="form-control"
                                        onChange={(e) => dadosDoGastoContext.handleChangeDadosDoGasto(e.target.name, e.target.value)}
                                    />
                                </div>

                            </div>

                        </div>*/}
                        <div className="form-group col-sm-2">
                            <button
                                className="btn btn-link"
                                type="button"
                                onClick={() => dadosDoGastoContext.handleRemoveFields(index)}
                            >
                                -
                            </button>
                            <button
                                className="btn btn-link"
                                type="button"
                                onClick={() => dadosDoGastoContext.handleAddFields()}
                            >
                                +
                            </button>
                        </div>
                    </Fragment>
                ))}
            </div>
        </div>
    )
}