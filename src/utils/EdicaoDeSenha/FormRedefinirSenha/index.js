import React, {useState} from "react";
import {useParams} from 'react-router-dom';
import {redefinirMinhaSenha} from "../../../services/auth.service";
import {Formik} from "formik";
import {Redirect} from "react-router-dom";
import "../validacao-de-senha.scss"
import {medidorForcaSenha} from "../../MedidorForcaSenha";
import {TextoValidacaoSenha} from "../TextoValidacaoSenha/textoValidacaoSenha";

export const FormRedefinirSenha = ({textoValidacaoDentroDoForm=null, redirectUrlSucesso, textoSucesso, cssAlertSucesso, textoErro, cssAlertErro}) => {

    let {uuid} = useParams();

    const [msgErro, setMsgErro] = useState(false);
    const [senhaRedefinida, setSenhaRedefinida] = useState(false);

    const initialValues = {
        senha: "",
        confirmacao_senha: "",
    };

    const onSubmit = async (values) =>{
        const payload ={
            "hash_redefinicao":uuid,
            "password": values.senha,
            "password2": values.confirmacao_senha
        };
        try {
            let redefinir_senha = await redefinirMinhaSenha(payload);
            console.log("Senha Redefinida ", redefinir_senha)
            setSenhaRedefinida(true);
            setMsgErro(false)
        }catch (e) {
            console.log("Erro ao redefinir senha ", e);
            setMsgErro(true)
        }
    };

    const validateFormRedefinirSenha = async (values ) => {
        medidorForcaSenha(values)
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={onSubmit}
                validate={validateFormRedefinirSenha}
            >
                {props => (
                    <form onSubmit={props.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="login">Nova Senha</label>
                            <input
                                type="password"
                                value={props.values.senha}
                                name="senha"
                                id="senha"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.touched.senha && props.errors.senha && <span className="span_erro text-danger mt-1"> {props.errors.senha} </span>}

                        </div>
                        <div className="form-group">
                            <label htmlFor="senha">Confirmação da Nova Senha</label>
                            <input
                                type="password"
                                value={props.values.confirmacao_senha}
                                name="confirmacao_senha"
                                id="confirmacao_senha"
                                className="form-control"
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                            />
                            {props.touched.confirmacao_senha && props.errors.confirmacao_senha && <span className="span_erro text-danger mt-1"> {props.errors.confirmacao_senha} </span>}
                        </div>

                        {textoValidacaoDentroDoForm &&
                            <TextoValidacaoSenha/>
                        }

                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={() => window.location.assign("/login")} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Sair</button>
                            <button disabled={localStorage.getItem("medidorSenha") < 7} type="submit" className="btn btn-success mt-2">Continuar</button>
                            {senhaRedefinida &&
                            <Redirect
                                to={{
                                    pathname: redirectUrlSucesso,
                                    redefinicaoDeSenha: {
                                        msg: textoSucesso,
                                        alertCss: cssAlertSucesso
                                    }
                                }}
                                className="btn btn-success btn-block"
                            />
                            }
                        </div>
                    </form>
                )}
            </Formik>

            {msgErro &&
            <div className={`alert ${cssAlertErro} lert-dismissible fade show text-center col-12`} role="alert">
                {textoErro}
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            }
        </>
    )
};