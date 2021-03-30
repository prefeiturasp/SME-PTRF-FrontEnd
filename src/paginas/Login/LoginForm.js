import React, {useState} from "react";
import {Formik} from "formik";
import {YupSignupSchemaLogin} from "../../utils/ValidacoesAdicionaisFormularios";
import { authService } from "../../services/auth.service";

export const LoginForm = ({redefinicaoDeSenha}) => {
    const [mensagem, setMensagem] = useState('');

    const initialValues = () => (
        {login: "", senha: ""}
    );

    const onSubmit = async (values) => {
        try {
            const msg = await authService.login(values.login, values.senha);
            setMensagem(msg);
        }catch (e) {
            setMensagem("Senha incorreta")
        }
    };

    return (
        <div className="w-75">

            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaLogin}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login">Registro Funcional</label>

                            <input
                                type="text"
                                value={props.values.login}
                                name="login"
                                id="login"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.touched.login && props.errors.login && <span className="span_erro text-danger mt-1"> {props.errors.login} </span>}

                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Senha</label>
                            <input
                                type="password"
                                value={props.values.senha}
                                name="senha"
                                id="senha"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.touched.login && props.errors.senha && <span className="span_erro text-danger mt-1"> {props.errors.senha} </span>}

                        </div>
                        {mensagem && <span className="span_erro text-danger mt-1">{mensagem}</span>}
                        <button type="submit" className="btn btn-success  btn-block  mt-2">Acessar</button>
                    </form>
                )}
            </Formik>
            <div className='text-center mt-2'>
                <button type="button" onClick={()=>window.location.assign('/esqueci-minha-senha/')} className="btn btn-link">Esqueci minha senha</button>
            </div>

            {redefinicaoDeSenha && redefinicaoDeSenha.msg && redefinicaoDeSenha.alertCss &&
            <div className='text-center mt-2'>
                <div className={`${redefinicaoDeSenha.alertCss} alert-dismissible fade show`} role="alert">
                    {redefinicaoDeSenha.msg}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
            }
        </div>
    )
};