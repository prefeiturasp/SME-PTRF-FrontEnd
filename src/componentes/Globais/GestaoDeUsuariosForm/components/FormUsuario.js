import React, {useCallback, useContext, useEffect, useState} from "react";
import {GestaoDeUsuariosFormContext} from "../context/GestaoDeUsuariosFormProvider";
import MaskedInput from "react-text-mask";
import {Formik} from "formik";
import * as yup from "yup";

export const FormUsuario = ({usuario}) => {
    const { modo, Modos, visaoBase} = useContext(GestaoDeUsuariosFormContext)
    const [formErrors, setFormErrors] = useState({});
    const [bloquearCampoName, setBloquearCampoName] = useState(true)

    const emptyValues = {
      e_servidor: '',
      username: '',
      name: '',
      email: '',
    };
    const [formValues, setFormValues] = useState(emptyValues);

    useEffect(()=>{
        const usuarioToFormValues = (usuario) => {
            if (!usuario) return;

            const usuarioValues = {
                id: usuario.id,
                e_servidor: usuario.e_servidor ? "True" : "False",
                username: usuario.username,
                name: usuario.name,
                email: usuario.email,
            };
            setFormValues(usuarioValues)
        };
        usuarioToFormValues(usuario)
    }, [usuario])

    const handleSubmitUsuarioForm = async (values, {setSubmitting}) => {
        console.log('handleSubmitPerfisForm: ', values)
        setSubmitting(false)
    }

    const idUsuarioCondicionalMask = useCallback((e_servidor) => {
        let mask;
        if (e_servidor === "True"){
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }else {
            mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
        }
        return mask
    }, [])

    return (
        <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            enableReinitialize={true}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmitUsuarioForm}
        >
            {props => {
                return (
                    <form onSubmit={props.handleSubmit}>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="e_servidor">Tipo de usuário</label>
                                    <select
                                        value={props.values.e_servidor}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="e_servidor"
                                        className="form-control"
                                        disabled={modo !== Modos.INSERT}
                                    >
                                        <option value="">Escolha o tipo de usuário</option>
                                        <option value="True">Servidor</option>
                                        <option value="False">Não Servidor</option>
                                    </select>
                                    {props.errors.e_servidor && <span className="span_erro text-danger mt-1"> {props.errors.e_servidor}</span>}
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="username">ID do usuário</label>
                                    <MaskedInput
                                        mask={idUsuarioCondicionalMask(props.values.e_servidor)}
                                        showMask={false}
                                        guide={false}
                                        value={props.values.username ? props.values.username : ""}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="username"
                                        className="form-control"
                                        placeholder={props.values.e_servidor === "False" ? "Insira o CPF do usuário, sem ponto nem traço" : "Insira o RF do servidor, sem ponto nem traço"}
                                        disabled={!props.values.e_servidor || modo !== Modos.INSERT}
                                    />
                                    {/*Validações personalizadas*/}
                                    {formErrors.username && <p className='mb-0'><span className="span_erro text-danger mt-1">{formErrors.username}</span></p>}
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="name">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={props.values.name ? props.values.name : ""}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="name"
                                        className="form-control"
                                        readOnly={bloquearCampoName}
                                        maxLength='255'
                                    />
                                    {props.errors.name && <span className="span_erro text-danger mt-1"> {props.errors.name}</span>}
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        value={props.values.email ? props.values.email : ''}
                                        onChange={(e) => {
                                            props.handleChange(e);
                                        }}
                                        name="email"
                                        className="form-control"
                                        placeholder='Insira seu email se desejar'
                                        maxLength='254'
                                    />
                                    {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                </div>
                            </div>
                        </div>
                        <div className={"barra-botoes-form-user d-flex justify-content-end mt-n2"}>
                            <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                        </div>
                    </form>
                );
            }}
        </Formik>
    )
}

const validationSchema = yup.object().shape(
    {
        e_servidor: yup.string().required("Tipo de usuário é obrigatório"),
        name: yup.string().required("Nome de usuário é obrigatório"),
        email: yup.string().email("Digite um email válido").nullable(),
    }
);
