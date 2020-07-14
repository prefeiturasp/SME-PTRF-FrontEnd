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

    const [btnOnsubmitReadOnly, setBtnOnsubmitReadOnly] = useState(true)

    const onSubmit = (values) =>{
        console.log("on Submit ", values)
    };

    const medidorForcaSenha = (values) => {
        let senha = values.senha;
        let confirmacao_senha = values.confirmacao_senha;

        let contador_forca_senha = 0;
        let letra_minuscula = document.getElementById("letra_minuscula");
        let letra_maiuscula = document.getElementById("letra_maiuscula");
        let senhas_iguais = document.getElementById("senhas_iguais");
        let espaco_em_branco = document.getElementById("espaco_em_branco");
        let caracteres_acentuados = document.getElementById("caracteres_acentuados");
        let numero_ou_caracter_especial = document.getElementById("numero_ou_caracter_especial");
        let entre_oito_ate_doze = document.getElementById("entre_oito_ate_doze");

        if (senha && senha.match( /(?=.*[a-z])/) ){
            letra_minuscula.classList.remove("forca-senha-invalida");
            letra_minuscula.classList.add("forca-senha-valida");
            contador_forca_senha +=1
        }else {
            letra_minuscula.classList.add("forca-senha-invalida");
        }

        if (senha && senha.match( /(?=.*[A-Z])/) ){
            letra_maiuscula.classList.remove("forca-senha-invalida");
            letra_maiuscula.classList.add("forca-senha-valida");
            contador_forca_senha +=1
        }else {
            letra_maiuscula.classList.add("forca-senha-invalida");
        }

        if (senha === confirmacao_senha){
            senhas_iguais.classList.remove("forca-senha-invalida");
            senhas_iguais.classList.add("forca-senha-valida");
            contador_forca_senha +=1
        }else {
            senhas_iguais.classList.add("forca-senha-invalida");
        }

        if (senha && !senha.match( /[ ]/) ){
            espaco_em_branco.classList.remove("forca-senha-invalida");
            espaco_em_branco.classList.add("forca-senha-valida");
            contador_forca_senha +=1
        }else {
            espaco_em_branco.classList.add("forca-senha-invalida");
        }

        if (senha && !senha.match( /[à-úÀ-Ú]/) ){
            caracteres_acentuados.classList.remove("forca-senha-invalida");
            caracteres_acentuados.classList.add("forca-senha-valida");
            contador_forca_senha +=1
        }else {
            caracteres_acentuados.classList.add("forca-senha-invalida");
        }

        if (senha && senha.match(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/) || senha.match(/[0-9]/) ){
            numero_ou_caracter_especial.classList.remove("forca-senha-invalida");
            numero_ou_caracter_especial.classList.add("forca-senha-valida");
            contador_forca_senha +=1
        }else {
            numero_ou_caracter_especial.classList.add("forca-senha-invalida");
        }

        if (senha && (senha.length > 7 && senha.length <= 12 )){
            entre_oito_ate_doze.classList.remove("forca-senha-invalida");
            entre_oito_ate_doze.classList.add("forca-senha-valida");
            contador_forca_senha +=1
        }else {
            entre_oito_ate_doze.classList.add("forca-senha-invalida");
        }

        if (contador_forca_senha >= 7 ){
            setBtnOnsubmitReadOnly(false)
        }else {
            setBtnOnsubmitReadOnly(true)
        }

        console.log("Contador forca senha ", contador_forca_senha)
    };


    const validateFormRedefinirSenha = async (values ) => {

        medidorForcaSenha(values)

    };

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
                                    <p className='requisitos-seguranca-senha'><span id='letra_minuscula' className='pr-4'>Uma letra minúscula</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='letra_maiuscula' className='pr-4'>Uma letra maiúscula</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='senhas_iguais' className='pr-4'>As senhas devem ser iguais</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='espaco_em_branco' className='pr-4'>Não pode conter espaço em branco</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='caracteres_acentuados' className='pr-4'>Não podem conter caracteres acentuados</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='numero_ou_caracter_especial' className='pr-4'>Um número ou símbolo (caracter especial)</span></p>
                                    <p className='requisitos-seguranca-senha'><span id='entre_oito_ate_doze' className='pr-4'>Deve ter no mínimo 8 e no máximo 12 caracteres</span></p>

                                    {btnOnsubmitReadOnly &&
                                        <p className="forca-senha-msg mt-3 p-2 text-center">Sua nova senha deve conter letras maiúsculas, minúsculas, números e símbolos. Por favor, digite outra senha</p>
                                    }

                                </div>

                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={() => window.location.assign("/login")} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Sair</button>
                                    <button disabled={btnOnsubmitReadOnly} type="submit" className="btn btn-success mt-2">Continuar</button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
};