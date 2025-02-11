import React, { useState } from "react";
import {Formik} from "formik";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

export const MotivoRetificacao = ({relatorioConsolidado, handleEditarMotivoRetificacao, estadoBotaoSalvarMotivo, mudarEstadoBotaoSalvarMotivo, ehEdicaoRetificacao, formRef}) => {
    const [mostrarCheckSalvo, setMostrarCheckSalvo] = useState(false)

    const handleChangeTextareaMotivoRetificacao = (props, motivo, event) => {
        if(motivo) {
            mudarEstadoBotaoSalvarMotivo(true);
        }
        
        props.handleChange(event);
        setMostrarCheckSalvo(false);
    }

    return (
        <div className="row pt-2">
            <Formik
                initialValues={relatorioConsolidado}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                innerRef={formRef}
            >
                {props => {
                    const {
                        values,
                    } = props;
                    return(
                        <>
                            <div className="col-12">
                                <label className="referencia-e-periodo-relatorio" htmlFor="motivo_retificacao">Motivo da retificação:</label>
                                <textarea
                                    name='motivo_retificacao'
                                    value={values.motivo_retificacao ? values.motivo_retificacao : ''}
                                    onChange={(event) => handleChangeTextareaMotivoRetificacao(props, values.motivo_retificacao, event)}
                                    className={`form-control`}
                                    rows="4"

                                />
                            </div>
                            <div className="col-12 align-items-end mt-2">
                                <div className="bd-highlight d-flex justify-content-end align-items-center" id="pointer-event-all">
                                {
                                    mostrarCheckSalvo &&
                                    <div className="">
                                        <p className="mr-2 mt-3">
                                            <span className="mr-1">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '16px', color: '#297805'}}
                                                    icon={faCheck}
                                                />
                                            </span>
                                            Salvo
                                        </p>
                                    </div>
                                }
                                {
                                    ehEdicaoRetificacao && <button
                                            disabled={estadoBotaoSalvarMotivo ? false : true}
                                            type="button"
                                            className={`btn btn-${estadoBotaoSalvarMotivo ? 'success' : 'secondary'}`}
                                            onClick={() => {
                                                handleEditarMotivoRetificacao()
                                                setMostrarCheckSalvo(true)
                                                mudarEstadoBotaoSalvarMotivo(false)
                                            }}
                                        >
                                            <strong>Salvar</strong>
                                        </button>
                                    }
                                </div>
                            </div>
                        </>  
                    )
                }}
            </Formik>
        </div>
    )
}