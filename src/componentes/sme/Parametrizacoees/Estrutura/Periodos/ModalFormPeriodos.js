import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";

const ModalFormPeriodos = (props) => {

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={props.stateFormModal}
                    //validationSchema={YupSignupSchemaRecuperarSenha}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={props.handleSubmitModalFormPeriodos}
                >
                    {props => {
                        const {
                            reset,
                        } = props;
                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="login">Referencia</label>
                                    <input
                                        type="text"
                                        value={props.values.referencia}
                                        name="referencia"
                                        id="referencia"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        disabled={!props.values.editavel}
                                    />
                                    {props.touched.referencia && props.errors.referencia && <span className="span_erro text-danger mt-1"> {props.errors.referencia} </span>}
                                </div>
                                {/*<div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={() => window.location.assign("/login")} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Voltar</button>
                                    <button onClick={() => props.resetForm()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                    <button disabled={!props.values.usuario} type="submit" className="btn btn-success mt-2">Continuar</button>
                                </div>*/}
                            </form>
                        );
                    }}
                </Formik>
            </>
        )
    };

    return (
        <ModalFormBodyText
            show={props.show}
            titulo="Visualizar período"
            //titulo={props.stateFormModal && props.stateFormModal.operacao === 'edit' ? 'Editar ação de associação' : 'Adicionar ação de associação'}
            onHide={props.handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};

export default memo(ModalFormPeriodos)