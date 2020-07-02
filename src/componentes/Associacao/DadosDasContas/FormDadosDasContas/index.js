import React from "react";
import {Formik, FieldArray} from "formik";

export const FormDadosDasContas = ({intialValues, setaCampoReadonly, onSubmit}) => {
    console.log("Form ", intialValues);
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
                                                <div className="row" key={index}>
                                                    <div className="col-12 mt-4 mb-4 ml-0">
                                                        <p className="mb-0">
                                                            <strong>Conta {index + 1}</strong>
                                                        </p>
                                                        <hr className="mt-0 mb-1"/>
                                                    </div>
                                                    <div className='col-12 col-md-3'>
                                                        <div className="form-group">
                                                            <label htmlFor="banco_nome">Banco</label>
                                                            <input
                                                                readOnly={setaCampoReadonly(conta.tipo_conta.nome)}
                                                                name={`contas[${index}].banco_nome`}
                                                                value={conta.banco_nome}
                                                                onChange={(e) => {
                                                                    props.handleChange(e);
                                                                }
                                                                }
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='col-12 col-md-3'>
                                                        <div className="form-group">
                                                            <label htmlFor="tipo_conta">Tipo de Conta</label>
                                                            <input
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
                                                        </div>
                                                    </div>

                                                    <div className='col-12 col-md-3'>
                                                        <div className="form-group">
                                                            <label htmlFor="agencia">Agência</label>
                                                            <input
                                                                readOnly={setaCampoReadonly(conta.tipo_conta.nome)}
                                                                name={`contas[${index}].agencia`}
                                                                value={conta.agencia}
                                                                onChange={(e) => {
                                                                    props.handleChange(e);
                                                                }
                                                                }
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='col-12 col-md-3'>
                                                        <div className="form-group">
                                                            <label htmlFor="numero_conta">Nº da conta com o
                                                                dígito</label>
                                                            <input
                                                                readOnly={setaCampoReadonly(conta.tipo_conta.nome)}
                                                                name={`contas[${index}].numero_conta`}
                                                                value={conta.numero_conta}
                                                                onChange={(e) => {
                                                                    props.handleChange(e);
                                                                }
                                                                }
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}
                            >
                            </FieldArray>

                            <div className="d-flex  justify-content-end pb-3 mt-3">
                                <button type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                <button type="submit" className="btn btn-success mt-2">Salvar</button>
                            </div>

                        </form>
                    )
                }}
            </Formik>
        </>
    )
};