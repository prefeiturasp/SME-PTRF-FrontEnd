import React from "react";
import {Formik} from "formik";
import {YupSubmitDocumentosAcertos} from './YupSubmitDocumentosAcertos'
import {ModalBootstrapFormAdicionarDocumentos} from "../../../../Globais/ModalBootstrap";

export const ModalAdicionarAcertosDocumentos = (props) => {

    const bodyTextarea = (modalProps) => {
        return (
            <Formik 
                validationSchema={YupSubmitDocumentosAcertos}
                initialValues={modalProps.initialValues}
                enableReinitialize={true}
                validateOnBlur={true}
                validateOnChange={true}
                onSubmit={modalProps.handleSubmitModal}
            >
                {
                ({errors, ...props}) => (
                    <form onSubmit={props.handleSubmit}>
                        <div className='row'>
                            <div className="col-12">
                                <p>
                                    <span className="span_erro text-danger">
                                        <strong>{errors.detalhamento}</strong>
                                    </span>
                                </p>
                                <textarea 
                                    name='detalhamento'
                                    id='detalhamento'
                                    value={props.values.detalhamento}
                                    onChange={props.handleChange}
                                    className="form-control"
                                    placeholder="Adicione o acerto"
                                    rows="3"/>
                            </div>
                            <div className='col-12'>
                                <div className="d-flex justify-content-end pb-3 mt-3">
                                    <button onClick={
                                        modalProps.handleClose
                                    }
                                    type="button"
                                    className="btn btn-outline-success mt-2 mr-2">
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit"
                                        className="btn btn btn-success mt-2 mr-2">
                                        Adicionar acerto
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }
            </Formik>
        )
    };
    return (
        <ModalBootstrapFormAdicionarDocumentos show={
                props.show
            }
            titulo={
                props.titulo
            }
            bodyText={
                bodyTextarea(props)
            }/>
    );
};
