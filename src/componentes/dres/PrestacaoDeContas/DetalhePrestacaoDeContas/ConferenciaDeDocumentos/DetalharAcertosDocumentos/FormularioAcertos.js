import React, {memo} from "react";
import {FieldArray, Formik} from "formik";
import {YupSignupSchemaDetalharAcertosDocumentos} from './YupSignupSchemaDetalharAcertosDocumentos'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";

const FormularioAcertos = ({solicitacoes_acerto, tiposDeAcertoDocumentos, onSubmitFormAcertos, formRef}) =>{
    return(
        <div className='mt-3'>
            <Formik
                initialValues={solicitacoes_acerto}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={YupSignupSchemaDetalharAcertosDocumentos}
                onSubmit={onSubmitFormAcertos}
                innerRef={formRef}
            >
                {props => {
                    const {
                        values,
                        errors
                    } = props;
                    return (
                        <>
                            <form onSubmit={props.handleSubmit}>
                                <FieldArray
                                    name="solicitacoes_acerto"
                                    render={({remove, push}) => (
                                        <>
                                            {values.solicitacoes_acerto && values.solicitacoes_acerto.length > 0 && values.solicitacoes_acerto.map((acerto, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div
                                                            className='d-flex justify-content-between titulo-row-expanded-conferencia-de-lancamentos mt-4'>
                                                            <p className='mb-0 font-weight-bold'>
                                                                <strong>Item {index + 1}</strong></p>
                                                            <button
                                                                type="button"
                                                                className="btn btn-link btn-remover-despesa mr-2 p-0 d-flex align-items-center"
                                                                onClick={() => {
                                                                    remove(index)
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    style={{
                                                                        fontSize: '17px',
                                                                        marginRight: "4px",
                                                                        color: "#B40C02"
                                                                    }}
                                                                    icon={faTimesCircle}
                                                                />
                                                                Remover item
                                                            </button>
                                                        </div>

                                                        <div className="form-row container-campos-dinamicos">
                                                            <div className="col-12 mt-4">
                                                                <label htmlFor={`tipo_acerto_[${index}]`}>Tipo de acerto</label>
                                                                <select
                                                                    value={acerto.tipo_acerto}
                                                                    name={`solicitacoes_acerto[${index}].tipo_acerto`}
                                                                    id={`tipo_acerto_[${index}]`}
                                                                    className="form-control"
                                                                    onChange={(e) => {
                                                                        props.handleChange(e);
                                                                    }}
                                                                >
                                                                    <option key='' value="">Selecione a especificação do acerto</option>
                                                                    {tiposDeAcertoDocumentos && tiposDeAcertoDocumentos.length > 0 && tiposDeAcertoDocumentos.map(item => (
                                                                        <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                                                    ))}
                                                                </select>
                                                                <p className='mt-1 mb-0'><span className="text-danger">{errors && errors.solicitacoes_acerto && errors.solicitacoes_acerto[index] && errors.solicitacoes_acerto[index].tipo_acerto ? errors.solicitacoes_acerto[index].tipo_acerto : ''}</span></p>
                                                            </div>

                                                        </div>
                                                    </div> /*div key*/
                                                )
                                            })}

                                            <div className="d-flex  justify-content-start mt-3 mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn btn-outline-success mt-2 mr-2"
                                                    onClick={() => {
                                                        push({
                                                            tipo_acerto: '',
                                                        });
                                                    }}
                                                >
                                                    + Adicionar novo item
                                                </button>
                                            </div>
                                        </>
                                    )}
                                />
                            </form>
                        </>
                    )
                }}
            </Formik>
        </div>
    )
}
export default memo(FormularioAcertos)