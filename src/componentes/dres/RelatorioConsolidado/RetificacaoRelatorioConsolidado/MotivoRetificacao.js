import React from "react";
import {Formik} from "formik";

export const MotivoRetificacao = ({relatorioConsolidado, validateFormRetificacao, formErrors, formRef}) => {
    return (
        <div className="row pt-2">
            <Formik
                initialValues={relatorioConsolidado}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                validate={validateFormRetificacao}
                innerRef={formRef}
            >
                {props => {
                    const {
                        values,
                        errors
                    } = props;
                    return(
                        
                        <div className="col-12">
                            <label className="referencia-e-periodo-relatorio" htmlFor="motivo_retificacao">Motivo da retificação:</label>
                            <textarea
                                name='motivo_retificacao'
                                value={values.motivo_retificacao ? values.motivo_retificacao : undefined}
                                onChange={(e) => {
                                    props.handleChange(e);
                                }}
                                className={`form-control ${formErrors && formErrors.motivo_retificacao && 'is-invalid'}`}
                                rows="4"
                            
                            />
                            {formErrors && formErrors.motivo_retificacao &&
                                <span className="span_erro text-danger mt-1"> {formErrors.motivo_retificacao}</span>
                            }
                        </div>
                    )
                }}
            </Formik>
        </div>
    )
}