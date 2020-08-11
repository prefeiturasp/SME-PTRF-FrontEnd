import {Formik} from "formik";

import {ModalBootstrapFormMembros} from "../../../../Globais/ModalBootstrap";
import React from "react";
import * as yup from "yup";

export const YupSignupSchemaProcesso = yup.object().shape({
  numero_processo: yup.string().required("Campo Número do processo é obrigatório"),
  ano: yup.string().required("Campo ano é obrigatório"),
});



export const ProcessoSeiPrestacaoDeContaForm = ({show, handleClose, onSubmit, handleChange, validateForm, initialValues}) => {

    const bodyTextarea = () => {
        return (
            <>
                {
                <Formik
                    initialValues={initialValues}
                    validationSchema={YupSignupSchemaProcesso}
                    validate={validateForm}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    onSubmit={onSubmit}
                >
                    {props => {
                        const {
                            errors,
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cargo_associacao">Número do processo SEI</label>
                                            <input
                                                type="text"
                                                value={props.values.numero_processo ? props.values.numero_processo : ""}
                                                onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                }
                                                name="numero_processo"
                                                className="form-control"
                                            />
                                            {props.errors.numero_processo && <span className="span_erro text-danger mt-1"> {props.errors.numero_processo}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cargo_associacao">Ano</label>
                                            <input
                                                type="text"
                                                value={props.values.ano ? props.values.ano : ""}
                                                onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                }
                                                name="ano"
                                                className="form-control"
                                            />
                                            {props.errors.ano && <span className="span_erro text-danger mt-1"> {props.errors.ano}</span>}
                                        </div>
                                    </div>


                                </div>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={()=>handleClose()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                    <button type="submit" className="btn btn-success mt-2">Salvar</button>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
                }
            </>
        )
    };
    return (
        <ModalBootstrapFormMembros
            show={show}
            onHide={handleClose}
            titulo="Editar processo"
            bodyText={bodyTextarea()}
        />
    )
};
