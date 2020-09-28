import React from "react";
import {Formik, FieldArray} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import CurrencyInput from "react-currency-input";

export const CobrancaPrestacaoDeContasEditavel = ({initialListaCobranca, listaDeCobrancas}) =>{

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4>Cobrança da prestação de contas</h4>
            <Formik
                initialValues={initialListaCobranca}
                //validationSchema={YupSignupSchemaValoresReprogramados}
                enableReinitialize={true}
                validateOnBlur={true}
                //validate={validateFormValoresReprogramados}
                //onSubmit={onSubmit}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                        errors,
                    } = props;
                    return (
                        <form>
                            <div className="col mt-4">
                                <label htmlFor="saldo">Valor reprogramado</label>
                                <CurrencyInput
                                    allowNegative={false}
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    value={props.values.valor_total}
                                    name="valor_total"
                                    id="valor_total"
                                    className="form-control"
                                    onChangeEvent={(e) => {
                                        props.handleChange(e);
                                    }
                                    }
                                    readOnly={true}
                                />
                                {props.touched.saldo && props.errors.saldo && <span
                                    className="text-danger mt-1"> {props.errors.saldo}</span>}
                            </div>
                            <FieldArray
                                name="saldos"
                                render={({insert, remove, push}) => (
                                    <>
                                        {values.saldos && values.saldos.length > 0 && values.saldos.map((saldo, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className="form-row container-campos-dinamicos">
                                                        <div className="col mt-4">
                                                            <label htmlFor="saldo">Valor reprogramado</label>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={saldo.saldo}
                                                                name={`saldos[${index}].saldo`}
                                                                id="saldo"
                                                                className="form-control"
                                                                //onChangeEvent={props.handleChange}
                                                                onChangeEvent={(e) => {
                                                                    props.handleChange(e);
                                                                }
                                                                }
                                                            />
                                                            {props.touched.saldo && props.errors.saldo && <span
                                                                className="text-danger mt-1"> {props.errors.saldo}</span>}
                                                        </div>

                                                        {index >= 0 && values.saldos.length > 0 && (
                                                            <div
                                                                className="col-1 mt-4 d-flex justify-content-center">
                                                                <button
                                                                    className="btn-excluir-valores-reprogramados mt-4 pt-2"
                                                                    onClick={() => remove(index)}>
                                                                    <FontAwesomeIcon
                                                                        style={{fontSize: '20px', marginRight: "0"}}
                                                                        icon={faTrashAlt}
                                                                    />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div> /*div key*/
                                            )
                                        })}

                                        <div className="d-flex  justify-content-start mt-3 mb-3">
                                            <button
                                                type="button"

                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                onClick={() => push(
                                                    {
                                                        acao_associacao: "",
                                                        conta_associacao: "",
                                                        aplicacao: "",
                                                        saldo: "",
                                                    }
                                                )
                                                }
                                            >
                                                + Adicionar valor reprogramado
                                            </button>
                                        </div>
                                    </>
                                )}
                            />

                        </form>
                    )
                }}
            </Formik>
        </>
    )
};