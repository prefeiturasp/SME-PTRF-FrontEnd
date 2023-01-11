import React from "react";
import {Formik} from "formik";

export const MotivoRetificacao = ({relatorioConsolidado, validateFormRetificacao, formErrors, onChangeMotivoRetificacao, formRef}) => {
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
                                value={relatorioConsolidado.motivo_retificacao && !relatorioConsolidado.consolidado_retificado ? relatorioConsolidado.motivo_retificacao : undefined}
                                onChange={(e) => {
                                    props.handleChange(e);
                                    onChangeMotivoRetificacao(e.target.value);
                                }}
                                className="form-control"
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