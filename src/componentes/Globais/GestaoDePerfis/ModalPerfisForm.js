import React from "react";
import {ModalBootstrapFormPerfis} from "../../Globais/ModalBootstrap";
import {Formik} from "formik";

export const ModalPerfisForm = ({show, handleClose, initialValues, handleChange, onSubmit}) => {
    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={initialValues}
                    //validationSchema={YupSignupSchemaTecnico}
                    //validate={!initialValues.uuid ? validateForm : ''}
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
                        return (
                            <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="tipo_usuario">Tipo de usuário</label>
                                            <input
                                                type="text"
                                                value={props.values.tipo_usuario ? props.values.tipo_usuario : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="tipo_usuario"
                                                className="form-control"
                                            />
                                            {props.errors.tipo_usuario && <span className="span_erro text-danger mt-1"> {props.errors.tipo_usuario}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="nome_usuario">Nome do usuário</label>
                                            <input
                                                type="text"
                                                value={props.values.nome_usuario ? props.values.nome_usuario : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="nome_usuario"
                                                className="form-control"
                                                //readOnly={true}
                                            />
                                            {props.errors.nome_usuario && <span className="span_erro text-danger mt-1"> {props.errors.nome_usuario}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="nome_completo">Nome do usuário</label>
                                            <input
                                                type="text"
                                                value={props.values.nome_completo ? props.values.nome_completo : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="nome_completo"
                                                className="form-control"
                                                //readOnly={true}
                                            />
                                            {props.errors.nome_completo && <span className="span_erro text-danger mt-1"> {props.errors.nome_completo}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="text"
                                                value={props.values.email}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="email"
                                                className="form-control"
                                                placeholder='Insira seu email se desejar'
                                            />
                                            {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="grupo_acesso">Email</label>
                                            <input
                                                type="text"
                                                value={props.values.grupo_acesso}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="grupo_acesso"
                                                className="form-control"
                                                placeholder='Insira seu email se desejar'
                                            />
                                            {props.errors.grupo_acesso && <span className="span_erro text-danger mt-1"> {props.errors.grupo_acesso}</span>}
                                        </div>
                                    </div>


                                </div>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={() => handleClose()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success mt-2">{!initialValues.uuid ? 'Adicionar' : 'Salvar'}</button>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            </>
        )
    };

    return (
        <ModalBootstrapFormPerfis
            show={show}
            onHide={handleClose}
            titulo={!initialValues.uuid ? 'Adicionar novo técnico' : 'Editar um técnico'}
            bodyText={bodyTextarea()}
        />
    )
};
