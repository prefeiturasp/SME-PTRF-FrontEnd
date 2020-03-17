import React from "react";
import {Formik} from "formik";
import MaskedInput from 'react-text-mask'
import {YupSignupSchemaLogin} from "../../utils/ValidacoesAdicionaisFormularios";


export const LoginForm = () => {

    const onSubmit = (values) => {
        console.log("Ollyver ", values)
    }

    return (
        <div className="w-75">

            <Formik
                initialValues={{loginRf: "", loginSenha: ""}}
                validationSchema={YupSignupSchemaLogin}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="loginRf">Registro Funcional</label>

                            <input
                                type="text"
                                value={props.values.loginRf}
                                name="loginRf"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.errors.loginRf && <div id="feedback">{props.errors.loginRf}</div>}

                        </div>
                        <div className="form-group">
                            <label htmlFor="loginSenha">Senha</label>
                            <MaskedInput
                                mask={[/\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/]}
                                value={props.values.loginSenha}
                                name="loginSenha"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.errors.loginSenha && <div id="feedback">{props.errors.loginSenha}</div>}

                        </div>

                        <button type="submit" className="btn btn-success  btn-block  mt-2">Acessar</button>
                    </form>
                )}
            </Formik>
        </div>


    )

};