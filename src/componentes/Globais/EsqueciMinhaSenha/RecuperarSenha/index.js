import React, {useRef, useState} from "react";
import {Formik} from "formik";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

export const RecuperarMinhaSenha = ({initialValuesRecuperarSenha, onSubmitReuperarSenha, YupSignupSchemaRecuperarSenha}) => {
    const [captchaToken, setCaptchaToken] = useState(null);
    const captchaRef = useRef(null);

    const handleSubmit = async (values) => {
        await onSubmitReuperarSenha(values);
        captchaRef.current?.reset();
        setCaptchaToken(null);
    };

    return (
        <>
        <div className="esqueci-minha-senha-inner-texto">
            <h1 className="titulo-services">Recuperação de Senha</h1>
            <p>Insira seu usuário (RF para servidor ou CPF para demais membros de Associação) e ao continuar você receberá um e-mail com as orientações para redefinição da sua senha.</p>
            <p>Caso você não tenha um e-mail cadastrado ou não tenha mais acesso ao endereço de e-mail cadastrado, procure o responsável pelo SIG-Escola na sua unidade.</p>
        </div>
        <div className='col-12'>
            <Formik
                initialValues={initialValuesRecuperarSenha}
                validationSchema={YupSignupSchemaRecuperarSenha}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="usuario">Usuário</label>
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
                        {RECAPTCHA_SITE_KEY && (
                            <div className="d-flex justify-content-center mt-3">
                                <ReCAPTCHA
                                    ref={captchaRef}
                                    sitekey={RECAPTCHA_SITE_KEY}
                                    onChange={setCaptchaToken}
                                    onExpired={() => setCaptchaToken(null)}
                                />
                            </div>
                        )}
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={() => window.location.assign("/login")} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Voltar</button>
                            <button onClick={() => props.resetForm()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            <button disabled={!props.values.usuario || (RECAPTCHA_SITE_KEY && !captchaToken)} type="submit" className="btn btn-success mt-2">Continuar</button>
                        </div>
                    </form>
                )}
            </Formik>
        </div>
        </>
    );
};