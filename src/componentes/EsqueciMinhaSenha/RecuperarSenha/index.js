import React, {useState} from "react";
import {YupSignupSchemaLogin} from "../../../utils/ValidacoesAdicionaisFormularios";
import {Formik} from "formik";

export const RecuperarMinhaSenha = ({initialValuesRecuperarSenha, onSubmitReuperarSenha}) => {
    return (
        <>
        <div className="esqueci-minha-senha-inner-texto">
            <h1 className="titulo-services">Recuperação de Senha</h1>
            <p>Caso você tenha cadastrado um endereço de e-mail, informe seu usuário ou RF e ao continuar você receberá um e-mail com as orientações para redefinição da sua senha.</p>
            <p>Se você não tem um e-mail cadastrado ou não tem mais acessoa ao endereço de e-mail cadastrado, procure o responsável pelo SGP na sua unidade</p>
        </div>
        <div className='col-12'>
            <Formik
                initialValues={initialValuesRecuperarSenha}
                //validationSchema={YupSignupSchemaLogin}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={onSubmitReuperarSenha}
            >
                {props => (
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
                            <button type="reset" className="btn btn btn-outline-success mt-2 mr-2">Voltar</button>
                            <button disabled={!props.values.usuario} type="submit" className="btn btn-success mt-2">Continuar</button>
                        </div>
                    </form>
                )}
            </Formik>
            {/*<button type="button" onClick={() => window.location.assign('/esqueci-minha-senha/recuperacao-de-email/')} className="btn btn-link">Esqueci minha senha</button>*/}
        </div>
        </>
    );
};