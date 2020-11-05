import React from "react";
import {Formik} from "formik";

export const RecuperarMinhaSenha = ({initialValuesRecuperarSenha, onSubmitReuperarSenha, YupSignupSchemaRecuperarSenha}) => {
    return (
        <>
        <div className="esqueci-minha-senha-inner-texto">
            <h1 className="titulo-services">Recuperação de Senha</h1>
            <p>Caso você tenha cadastrado um endereço de e-mail, informe seu usuário ou RF e ao continuar você receberá um e-mail com as orientações para redefinição da sua senha.</p>
            <p>Se você não tem um e-mail cadastrado ou não tem mais acesso ao endereço de e-mail cadastrado, procure o responsável pelo SGP na sua unidade</p>
        </div>
        <div className='col-12'>
            <Formik
                initialValues={initialValuesRecuperarSenha}
                validationSchema={YupSignupSchemaRecuperarSenha}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={onSubmitReuperarSenha}
            >
                {props => {
                    const {
                        reset,
                    } = props;
                    return(
                    <form onSubmit={props.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login">Usuário</label>
                            <input
                                type="text"
                                value={props.values.usuario}
                                name="usuario"
                                id="usuario"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.touched.usuario && props.errors.usuario && <span className="span_erro text-danger mt-1"> {props.errors.usuario} </span>}
                        </div>
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={() => window.location.assign("/login")} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Voltar</button>
                            <button onClick={() => props.resetForm()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            <button disabled={!props.values.usuario} type="submit" className="btn btn-success mt-2">Continuar</button>
                        </div>
                    </form>
                    );
                }}
            </Formik>
        </div>
        </>
    );
};