import React, {useState} from "react";
import {useParams} from 'react-router-dom';
import {Formik} from "formik";
import {YupSignupSchemaLogin} from "../../../utils/ValidacoesAdicionaisFormularios";

export const RedefinirSenha = () => {
    let {uuid} = useParams();
    console.log("Redefinir Senha uuid ", uuid);

    const initialValues = {
        senha: "",
        confirmacao_senha: "",
    };

    const [iconeMedidorSenha, setIconeMedidorSenha] = useState("");

    const onSubmit = (values) =>{
        console.log("on Submit ", values)
    };

    const medidorForcaSenha = (values) => {
        let usuario = values.senha;
        let contador_forca_senha = 0;
        let letra_minuscula = document.getElementById("letra_minuscula");
        let letra_maiuscula = document.getElementById("letra_maiuscula");

        if (usuario && usuario.match( /(?=.*[a-z])/) ){
            letra_minuscula.classList.add("forca-senha-validada");
            contador_forca_senha +=1
        }else {
            letra_minuscula.classList.remove('forca-senha-validada')
        }

        if (usuario && usuario.match( /(?=.*[A-Z])/) ){
            letra_maiuscula.classList.add("forca-senha-validada");
            contador_forca_senha +=1
        }else {
            letra_maiuscula.classList.remove('forca-senha-validada')
        }

        console.log("Contador forca senha ", contador_forca_senha)
    };


    const validateFormRedefinirSenha = async (values ) => {

        medidorForcaSenha(values)

    }

    return (
        <>
            <div className='container-esqueci-minha-senha'>
                <div className="esqueci-minha-senha-inner-texto">
                    <h1 className="titulo-services mb-3">Nova Senha</h1>
                    <p className='mt-3'>Identificamos que você ainda não definiu uma senha pessoal para acesso ao PTRF. Este passo é obrigatório para que você tenha acesso ao sistema</p>
                </div>

                <div className='col-12'>
                    <Formik
                        initialValues={initialValues}
                        //validationSchema={YupSignupSchemaLogin}
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
                                        type="text"
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
                                <div className='form-group'>
                                    <p className='requisitos-seguranca-senha requisitos-seguranca-senha-validado'><strong>Requisitos de seguranca da senha:</strong></p>
                                    <p className='requisitos-seguranca-senha'><span id='letra_minuscula' className='pr-4'>Uma letra maiúscula</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='letra_maiuscula' className='pr-4'>Uma letra minúsculaminúsculaminúsculaminúscula</span></p>
                                    <p className='requisitos-seguranca-senha'>As senhas devem ser iguais</p>
                                    <p className='requisitos-seguranca-senha'>Não pode conter espaço em branco</p>
                                    <p className='requisitos-seguranca-senha'>Não podem conter caracteres acentuados</p>
                                    <p className='requisitos-seguranca-senha'>Um número ou símbolo (caracter especial)</p>
                                    <p className='requisitos-seguranca-senha'>Deve ter no mínimo 8 e no máximo 12 caracteres</p>
                                </div>

                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={() => window.location.assign("/login")} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Sair</button>
                                    <button type="submit" className="btn btn-success mt-2">Continuar</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};