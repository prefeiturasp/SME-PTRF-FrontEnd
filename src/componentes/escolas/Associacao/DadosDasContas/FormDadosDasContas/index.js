import React from "react";
import {Formik, FieldArray} from "formik";


import { BarraStatusEncerramentoConta } from "./BarraStatusEncerramentoConta";
import { CardSaldoEncerramentoConta } from "./CardSaldoEncerramentoConta";

export const FormDadosDasContas = ({intialValues, setaCampoReadonly, onSubmit, errors, podeEditarDadosMembros, handleOpenModalConfirmEncerramentoConta, handleOpenModalMotivoRejeicaoEncerramento, errosDataEncerramentoConta, inicioPeriodo}) => {
    const valores_inciais = {
        contas: intialValues
    };

    return (
        <>
            <Formik
                initialValues={valores_inciais}
                enableReinitialize={true}
                validateOnBlur={true}
                onSubmit={onSubmit}
            >
                {props => {
                    const {
                        values,
                    } = props;

                    return (
                        <form onSubmit={props.handleSubmit}>
                            <FieldArray
                                name="contas"
                                render={() => (
                                    <>
                                        {values.contas && values.contas.length > 0 && values.contas.map((conta, index) => {
                                            
                                            return (
                                                <div id={`dados-conta-id-${index}`} key={`dados-conta-id-${index}`}>
                                                    {conta.solicitacao_encerramento && conta.solicitacao_encerramento.status !== "APROVADA" &&
                                                        <BarraStatusEncerramentoConta conta={conta}/>
                                                    }
                                                    <div className="row" key={index}>
                                                        <div className={`col-12 mt-${index === 0 ? "2" : 4} mb-md-5 mb-xl-4 ml-0`}>
                                                            <p className="mb-0">
                                                                <strong>Conta {index + 1}</strong>
                                                            </p>
                                                            <hr className="mt-0 mb-1"/>
                                                        </div>
                                                        <div className='col-12 col-md-3'>
                                                            <div className="form-group">
                                                                <label htmlFor="banco_nome">Banco</label>
                                                                <input
                                                                    disabled={!podeEditarDadosMembros()}
                                                                    readOnly={setaCampoReadonly(conta)}
                                                                    name={`contas[${index}].banco_nome`}
                                                                    value={conta.banco_nome}
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    type="text"
                                                                    className="form-control"
                                                                />
                                                                {props.errors.banco_nome && <span className="text-danger mt-1">{props.errors.banco_nome}</span>}
                                                            </div>
                                                        </div>
                                                        <div className='col-12 col-md-3'>
                                                            <div className="form-group">
                                                                <label htmlFor="tipo_conta">Tipo de Conta</label>
                                                                <input
                                                                    disabled={!podeEditarDadosMembros()}
                                                                    readOnly={true}
                                                                    name={`contas[${index}].tipo_conta`}
                                                                    value={conta.tipo_conta && conta.tipo_conta.nome ? conta.tipo_conta.nome : ""}
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    type="text"
                                                                    className="form-control"
                                                                />
                                                                {props.errors.tipo_conta && <span className="text-danger mt-1">{props.errors.tipo_conta}</span>}
                                                            </div>
                                                        </div>
                                                        <div className='col-12 col-md-3'>
                                                            <div className="form-group">
                                                                <label htmlFor="agencia">Agência {setaCampoReadonly(conta) ? 'do Programa' : ""}</label>
                                                                <input
                                                                    disabled={!podeEditarDadosMembros()}
                                                                    readOnly={setaCampoReadonly(conta)}
                                                                    name={`contas[${index}].agencia`}
                                                                    value={conta.agencia}
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    type="text"
                                                                    className="form-control"
                                                                />
                                                                {props.errors.agencia && <span className="text-danger mt-1">{props.errors.agencia}</span>}
                                                            </div>
                                                        </div>
                                                        <div className='col-12 col-md-3'>
                                                            <div className="form-group">
                                                                <label className='mt-md-n5' htmlFor="numero_conta">Nº da conta {setaCampoReadonly(conta) ? 'do Programa' : ""} com o dígito</label>
                                                                <input
                                                                    disabled={!podeEditarDadosMembros()}
                                                                    readOnly={setaCampoReadonly(conta)}
                                                                    name={`contas[${index}].numero_conta`}
                                                                    value={conta.numero_conta}
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                    }
                                                                    type="text"
                                                                    className="form-control"
                                                                />
                                                                {props.errors.numero_conta && <span className="text-danger mt-1">{props.errors.numero_conta}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <CardSaldoEncerramentoConta index={index} conta={conta} handleOpenModalConfirmEncerramentoConta={handleOpenModalConfirmEncerramentoConta}
                                                    handleOpenModalMotivoRejeicaoEncerramento={handleOpenModalMotivoRejeicaoEncerramento} errosDataEncerramentoConta={errosDataEncerramentoConta} inicioPeriodo={inicioPeriodo} />
                                                </div>
                                            )
                                        })}
                                        {errors.campos_obrigatorios &&
                                        <div className="col-12 mt-2">
                                            <span className="text-danger"> {errors.campos_obrigatorios}</span>
                                        </div>
                                        }
                                    </>
                                )}
                            >
                            </FieldArray>
                            {podeEditarDadosMembros() &&
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={props.handleReset} type="button"
                                            className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                                    </button>
                                    <button type="submit"
                                            className="btn btn-success mt-2">Salvar
                                    </button>
                                </div>
                            }
                        </form>
                    )
                }}
            </Formik>
        </>
    )
};