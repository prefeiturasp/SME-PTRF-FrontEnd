import React, {useState} from "react";
import {Formik} from "formik";


import {alterarMinhaSenha, USUARIO_LOGIN} from "../../services/auth.service";
import {YupSignupSchemaAlterarEmail} from "../ValidacoesAdicionaisFormularios";

export const FormAlterarEmail = ({textoValidacaoDentroDoForm=null, handleClose=null})=>{

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
            //await alterarMinhaSenha(localStorage.getItem(USUARIO_LOGIN), payload);
            setEmailRedefinido(true);
            setMsgErro(false)
        }catch (e) {
            console.log("Erro ao redefinir senha ", e.response);
            if (e.response.data.detail === "{'detail': ErrorDetail(string='Senha atual incorreta', code='invalid')}"){
                setMsgErro("Senha atual incorreta")
            }else {
                setMsgErro(e.response.data.detail)
            }
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
                                type="password"
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
                                type="password"
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
                            <button onClick={() => handleClose()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Sair</button>
                            <button type="submit" className="btn btn-success mt-2">Continuar</button>
                        </div>
                    </form>
                )}
            </Formik>

            <div className="container-mensagens">
                {emailRedefinido &&
                <div className={`alert alert-success alert-dismissible fade show text-center col-12`} role="alert">
                    Email alterado com sucesso
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                }
                {msgErro &&
                <div className="d-flex">
                    <div className={`alert alert-danger alert-dismissible fade show text-center col-12`} role="alert">
                        {msgErro}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
                }
            </div>
        </>
    )
};