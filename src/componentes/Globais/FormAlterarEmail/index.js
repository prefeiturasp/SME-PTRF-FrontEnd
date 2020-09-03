import React, {useState} from "react";
import {Formik} from "formik";
import {YupSignupSchemaAlterarEmail} from "../../../utils/ValidacoesAdicionaisFormularios";
import {alterarMeuEmail, USUARIO_EMAIL, USUARIO_LOGIN} from "../../../services/auth.service";

export const FormAlterarEmail = ({handleClose})=>{

    const [msgErro, setMsgErro] = useState("");
    const [emailRedefinido, setEmailRedefinido] = useState(false);

    const initialValues = {
        email: "",
        confirmacao_email: "",
    };

    const onSubmit = async (values) =>{
        const payload ={
            "email":values.email,
            "email2": values.confirmacao_email,
        };

        try {
            let alterar_email = await alterarMeuEmail(localStorage.getItem(USUARIO_LOGIN), payload);
            localStorage.setItem(USUARIO_EMAIL, alterar_email.data.email);
            setEmailRedefinido(true);
            setMsgErro(false)
        }catch (e) {
            console.log("Erro ao alterar email ", e.response);
            setMsgErro(e.response.data.detail)
        }
    };
    return(
        <>
            <Formik
                initialValues={initialValues}
                validateOnBlur={true}
                validationSchema={YupSignupSchemaAlterarEmail}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login">Email</label>
                            <input
                                type="email"
                                value={props.values.email}
                                name="email"
                                id="email"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.touched.email && props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email} </span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmacao_senha">Confirmação do Email</label>
                            <input
                                type="email"
                                value={props.values.confirmacao_email}
                                name="confirmacao_email"
                                id="confirmacao_email"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.touched.confirmacao_email && props.errors.confirmacao_email && <span className="span_erro text-danger mt-1"> {props.errors.confirmacao_email} </span>}
                        </div>
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={()=>{handleClose()}} type="reset" className="btn btn btn-outline-success mt-2 mr-2">
                                Sair
                            </button>
                            <button disabled={emailRedefinido || msgErro || !props.values.email || !props.values.confirmacao_email || props.errors.email || props.errors.confirmacao_email} type="submit" className="btn btn-success mt-2">Continuar</button>
                        </div>
                    </form>
                )}
            </Formik>
                {emailRedefinido &&
                    <div className={`alert alert-success alert-dismissible fade show text-center col-12`} role="alert">
                        Email alterado com sucesso.
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                }
                {msgErro &&
                    <div className="d-flex">
                        <div className={`alert alert-danger alert-dismissible fade show text-center col-12`} role="alert">
                            <p>{msgErro}</p>
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                }
        </>
    )
};