import React from "react";
import {Formik, FieldArray} from "formik";


import { BarraStatusEncerramentoConta } from "./BarraStatusEncerramentoConta";
import { CardSaldoEncerramentoConta } from "./CardSaldoEncerramentoConta";

export const FormDadosDasContas = ({
    intialValues, 
    setaCampoReadonly, 
    onSubmit, 
    errors, 
    podeEditarDadosMembros, 
    handleOpenModalConfirmEncerramentoConta, 
    handleOpenModalMotivoRejeicaoEncerramento, 
    errosDataEncerramentoConta, 
    inicioPeriodo,
    handleCancelarEncerramento
}) => {
    const valores_inciais = {
        contas: intialValues
    };

    const verificaSeContaEstaAtiva = (statusConta) => {
        if(statusConta === "ATIVA") {
            return true;
        }
        return false;
    }

    const agrupaContasPorRecurso = (contas) => {
        return contas.reduce((grupos, conta, index) => {
            const recurso = conta.nome_recurso;
            if (!grupos[recurso]) {
                grupos[recurso] = [];
            }
            grupos[recurso].push({ ...conta, indexOriginal: index });
            return grupos;
        }, {});
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
                                render={() => {
                                    const contasAgrupadasPorRecurso = agrupaContasPorRecurso(values.contas)

                                    return (
                                        <>
                                            {Object.entries(contasAgrupadasPorRecurso).map(([nomeRecurso, contasDoRecurso], indexRecurso) => (
                                                <div key={`recurso-${nomeRecurso}`} data-testid={`recurso-${nomeRecurso}`} className={indexRecurso > 0 ? "mt-5" : ""}>
                                                    <div className="row mt-3">
                                                        <div className="col-12">
                                                            <h5 className="mb-3"><strong>{nomeRecurso}</strong></h5>
                                                        </div>
                                                    </div>
                                                    {contasDoRecurso.map((conta, index) => (
                                                        <div id={`dados-conta-id-${conta.indexOriginal}`} key={`dados-conta-id-${conta.indexOriginal}`}>
                                                            {conta.solicitacao_encerramento && conta.solicitacao_encerramento.status !== "APROVADA" && conta.tipo_conta.permite_inativacao &&
                                                                <BarraStatusEncerramentoConta conta={conta}/>
                                                            }
                                                            <div className="row">
                                                                <div className={`col-12 mt-${conta.indexOriginal === 0 ? "2" : 4} mb-md-5 mb-xl-4 ml-0`}>
                                                                    <p className="mb-0"><strong>Conta {index + 1}</strong></p>
                                                                    <hr className="mt-0 mb-1"/>
                                                                </div>
                                                                <div className='col-12 col-md-3'>
                                                                    <div className="form-group">
                                                                        <label htmlFor="banco_nome">Banco</label>
                                                                        <input
                                                                            disabled={!podeEditarDadosMembros() || !verificaSeContaEstaAtiva(conta.status)}
                                                                            readOnly={setaCampoReadonly(conta)}
                                                                            name={`contas[${conta.indexOriginal}].banco_nome`}
                                                                            value={conta.banco_nome}
                                                                            onChange={props.handleChange}
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
                                                                            name={`contas[${conta.indexOriginal}].tipo_conta`}
                                                                            value={conta.tipo_conta?.nome || ""}
                                                                            onChange={props.handleChange}
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
                                                                            disabled={!podeEditarDadosMembros() || !verificaSeContaEstaAtiva(conta.status)}
                                                                            readOnly={setaCampoReadonly(conta)}
                                                                            name={`contas[${conta.indexOriginal}].agencia`}
                                                                            value={conta.agencia}
                                                                            onChange={props.handleChange}
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
                                                                            disabled={!podeEditarDadosMembros() || !verificaSeContaEstaAtiva(conta.status)}
                                                                            readOnly={setaCampoReadonly(conta)}
                                                                            name={`contas[${conta.indexOriginal}].numero_conta`}
                                                                            value={conta.numero_conta}
                                                                            onChange={props.handleChange}
                                                                            type="text"
                                                                            className="form-control"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <CardSaldoEncerramentoConta 
                                                                index={conta.indexOriginal} 
                                                                conta={conta} 
                                                                handleOpenModalConfirmEncerramentoConta={handleOpenModalConfirmEncerramentoConta}
                                                                handleOpenModalMotivoRejeicaoEncerramento={handleOpenModalMotivoRejeicaoEncerramento} 
                                                                errosDataEncerramentoConta={errosDataEncerramentoConta} 
                                                                inicioPeriodo={inicioPeriodo}
                                                                handleCancelarEncerramento={handleCancelarEncerramento} 
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                            {errors.campos_obrigatorios &&
                                            <div className="col-12 mt-2">
                                                <span className="text-danger"> {errors.campos_obrigatorios}</span>
                                            </div>
                                            }
                                        </>
                                    )
                                }}
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