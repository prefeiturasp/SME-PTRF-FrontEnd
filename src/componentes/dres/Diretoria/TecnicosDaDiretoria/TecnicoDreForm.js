import {Formik} from "formik";

import {ModalBootstrapFormMembros} from "../../../Globais/ModalBootstrap";
import React from "react";
import * as yup from "yup";
import MaskedInput from "react-text-mask";

export const YupSignupSchemaTecnico = yup.object().shape({
    rf: yup.string().required("Campo RF do técnico é obrigatório"),
    email: yup.string().email("Digite um email válido"),
});

export const telefoneMaskContitional = (value) => {
    let telefone = value.replace(/[^\d]+/g, "");
    let mask = [];
    if (telefone.length <= 10 ) {
        mask = ['(', /\d/, /\d/,')' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }else{
        mask = ['(', /\d/, /\d/,')' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }
    return mask
}


export const TecnicoDreForm = ({show, handleClose, onSubmit, handleChange, validateForm, initialValues, btnSalvarReadOnly}) => {

    const bodyTextarea = () => {
        return (
            <>
                {
                    <Formik
                        initialValues={initialValues}
                        validationSchema={YupSignupSchemaTecnico}
                        validate={!initialValues.uuid ? validateForm : ''}
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
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="rf">Registro funcional</label>
                                                <input
                                                    type="text"
                                                    value={props.values.rf ? props.values.rf : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="rf"
                                                    className="form-control"
                                                    disabled={initialValues.uuid}
                                                />
                                                {props.errors.rf && <span className="span_erro text-danger mt-1"> {props.errors.rf}</span>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="nome">Nome completo</label>
                                                <input
                                                    type="text"
                                                    value={props.values.nome ? props.values.nome : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="nome"
                                                    className="form-control"
                                                    readOnly={true}
                                                />
                                                {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="telefone">Telefone</label>

                                                <MaskedInput
                                                    mask={(valor) => telefoneMaskContitional(valor)}
                                                    value={props.values.telefone}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="telefone"
                                                    className="form-control"
                                                    placeholder='Insira seu telefone se desejar'
                                                />

                                                {/*<input
                                                    type="text"
                                                    value={props.values.telefone}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChange(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="telefone"
                                                    className="form-control"
                                                    placeholder='Insira seu telefone se desejar'
                                                />*/}
                                                {props.errors.telefone && <span className="span_erro text-danger mt-1"> {props.errors.telefone}</span>}
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


                                    </div>
                                    <div className="d-flex  justify-content-end pb-3 mt-3">
                                        <button onClick={() => handleClose()} type="button"
                                                className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                                        </button>
                                        <button disabled={btnSalvarReadOnly} type="submit" className="btn btn-success mt-2">{!initialValues.uuid ? 'Adicionar' : 'Salvar'}</button>
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
            titulo={!initialValues.uuid ? 'Adicionar novo técnico' : 'Editar um técnico'}
            bodyText={bodyTextarea()}
        />
    )
};
