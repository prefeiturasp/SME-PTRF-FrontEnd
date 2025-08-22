import React, {useState} from "react";
import {Formik} from "formik";
import {YupSignupSchemaLogin} from "../../utils/ValidacoesAdicionaisFormularios";
import { authService } from "../../services/auth.service";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faQuestionCircle, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import Loading from "../../utils/Loading";

export const LoginForm = ({redefinicaoDeSenha}) => {
    const [msgUsuario, setMsgUsuario] = useState('');
    const [msgSenha, setMsgSenha] = useState('');
    const [showPassword, setShowPassword] = useState("password");
    const [iconShowPassword, setIconShowPassword] = useState(faEyeSlash);
    const [loading, setLoading] = useState(false);

    const initialValues = () => (
        {login: "", senha: ""}
    );

    const onSubmit = async (values) => {
        setLoading(true);
        let msg = await authService.login(values.login, values.senha);
        console.log('MSG: ', msg)
        setLoading(false)
        if(msg && msg.detail){
            if (msg.detail === 'Senha inválida!'){
                setMsgSenha('Senha incorreta')
            }else {
                setMsgUsuario(msg.detail)
                // setMsgUsuario('Número de usuário inválido')
            }
        }
    };

    const showHidePassword = () => {
        if (showPassword === "password"){
            setShowPassword("text");
            setIconShowPassword(faEye);
        }
        else if(showPassword === "text"){
            setShowPassword("password");
            setIconShowPassword(faEyeSlash);
        }
    };

    return (
        <div className="w-75">
            {loading 
                ? 
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                :
                <>
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
                                    <label htmlFor="login">Usuário</label>
                                    <span data-html={true} data-tooltip-content='Digite, sem ponto nem traço, </br>os 7 dígitos do RF para servidor,<br/> ou o CPF para usuário não servidor'>
                                        <FontAwesomeIcon
                                            style={{fontSize: '18px', marginLeft: "3px", color:'#42474A'}}
                                            icon={faQuestionCircle}
                                        />
                                    </span>
                                    <ReactTooltip html={true}/>
                                    <input
                                        type="text"
                                        value={props.values.login}
                                        name="login"
                                        id="login"
                                        className={`form-control ${msgUsuario ? 'falha-login' : ''}`}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        maxLength='60'
                                        onClick={()=>setMsgUsuario('')}
                                    />
                                    {props.touched.login && props.errors.login && <span className="span_erro text-danger mt-1"> {props.errors.login} </span>}
                                    {msgUsuario && !props.errors.login && <span className="span_erro text-danger mt-1">{msgUsuario}</span>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="senha">Senha</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword}
                                            value={props.values.senha}
                                            name="senha"
                                            id="senha"
                                            className={`form-control ${msgSenha ? 'falha-login-senha' : ''}`}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            maxLength='16'
                                            onClick={()=>setMsgSenha('')}
                                            aria-describedby="show_hide_password"
                                        />
                                        <div className="input-group-append">
                                            <span className={`input-group-text ${msgSenha ? 'falha-login-icone-mostrar-senha' : ''}`} id="show_hide_password">
                                                <i className="glyphicon" onClick={() => showHidePassword()} data-testid="mostrar-senha">
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '18px', color:'#42474A'}}
                                                        icon={iconShowPassword}
                                                    />
                                                </i>
                                            </span>
                                        </div>      
                                    </div>
                                    
                                    {props.touched.login && props.errors.senha && <span className="span_erro text-danger mt-1"> {props.errors.senha} </span>}
                                    {msgSenha && !props.errors.login && <span className="span_erro text-danger mt-1">{msgSenha}</span>}
                                </div>
                                <button type="submit" className="btn btn-success  btn-block  mt-2">Acessar</button>
                            </form>
                        )}
                    </Formik>
            
                    <div className='text-center mt-2'>
                        <button type="button" onClick={()=>window.location.assign('/esqueci-minha-senha/')} className="btn btn-link">Esqueci minha senha</button>
                    </div>
                </>
            }

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