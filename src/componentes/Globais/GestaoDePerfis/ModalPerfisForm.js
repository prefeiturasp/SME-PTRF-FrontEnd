import React from "react";
import {ModalBootstrapFormPerfis} from "../../Globais/ModalBootstrap";
import {Formik, Field} from "formik";
import * as yup from "yup";
import {getConsultarUsuario} from "../../../services/GestaoDePerfis.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

export const ModalPerfisForm = ({show, handleClose, statePerfisForm, setStatePerfisForm, handleChange, setShowModalDeletePerfil, grupos, onSubmit}) => {

    const YupSignupSchemaPerfis = yup.object().shape({
        tipo_usuario: yup.string().required("Tipo de usuário é obrigatório"),
        nome_usuario: yup.string().required("Nome de usuário é obrigatório"),
        grupo_acesso: yup.string().required("Grupo de acesso é obrigatório"),
    });

    const validateFormPerfis = async (values) => {
        const errors = {};

        if (values.nome_usuario.trim()){
            try {
                let username = await getConsultarUsuario(values.nome_usuario.trim());
                if (username.status === 200 || username.status === 201) {
                    const init = {
                        ...statePerfisForm,
                        nome_usuario: values.nome_usuario,
                        nome_completo: username.data.nome,
                        email: username.data.email,
                    };
                    setStatePerfisForm(init);
                }
            }catch (e) {
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    errors.nome_usuario = data.detail
                } else {
                    errors.nome_usuario = "Nome de usuário inválido"
                }
            }
        }
        return errors
    };

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={statePerfisForm}
                    validationSchema={YupSignupSchemaPerfis}
                    validate={validateFormPerfis}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    onSubmit={onSubmit}
                >
                    {props => {
                        const {
                            errors,
                            values,
                            setFieldValue,
                        } = props;
                        return (
                            <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="tipo_usuario">Tipo de usuário</label>
                                            <select
                                                defaultValue={props.values.tipo_usuario ? props.values.tipo_usuario : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="tipo_usuario"
                                                className="form-control"
                                            >
                                                <option value="">Escolha o tipo de usuário</option>
                                                <option value="ESTUDANTE">Estudante</option>
                                                <option value='PAI_RESPONSAVEL'>Pai ou responsável</option>
                                                <option value='Servidor'>Servidor</option>
                                            </select>
                                            {props.errors.tipo_usuario && <span className="span_erro text-danger mt-1"> {props.errors.tipo_usuario}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="nome_usuario">Nome do usuário</label>
                                            <input
                                                type="text"
                                                value={props.values.nome_usuario ? props.values.nome_usuario : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="nome_usuario"
                                                className="form-control"
                                                placeholder='Insira o nome de usuário'
                                            />
                                            {props.errors.nome_usuario && <span className="span_erro text-danger mt-1"> {props.errors.nome_usuario}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="nome_completo">Nome Completo</label>
                                            <input
                                                type="text"
                                                value={props.values.nome_completo ? props.values.nome_completo : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="nome_completo"
                                                className="form-control"
                                                readOnly={true}
                                            />
                                            {props.errors.nome_completo && <span className="span_erro text-danger mt-1"> {props.errors.nome_completo}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="text"
                                                value={props.values.email ? props.values.email : ''}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChange(e.target.name, e.target.value);
                                                }
                                                }
                                                name="email"
                                                className="form-control"
                                                placeholder='Insira seu email se desejar'
                                                readOnly={true}
                                            />
                                            {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="grupo_acesso">Grupo de acesso</label>
                                            <Field
                                                component="select"
                                                name="grupo_acesso"
                                                className="form-control"
                                                multiple={true}
                                                value={props.values.grupo_acesso ? props.values.grupo_acesso : []}
                                                // You need to set the new field value
                                                onChange={evt =>
                                                    setFieldValue(
                                                        "grupo_acesso",
                                                        [].slice
                                                        .call(evt.target.selectedOptions)
                                                        .map(option => option.value)
                                                    )
                                                }
                                            >
                                                {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                                                    <option key={index} value={grupo.id}>{grupo.nome}</option>
                                                ))}
                                            </Field>
                                            {props.errors.grupo_acesso && <span className="span_erro text-danger mt-1"> {props.errors.grupo_acesso}</span>}
                                        </div>
                                    </div>


                                </div>

                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {statePerfisForm.uuid &&
                                            <button onClick={() => setShowModalDeletePerfil(true)} type="button" className="btn btn btn-danger mt-2 mr-2">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '15px', marginRight: "5px", color:'#fff'}}
                                                    icon={faTrash}
                                                />
                                                Excluir perfil
                                            </button>
                                        }
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={() => handleClose()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button type="submit" className="btn btn-success mt-2">{!statePerfisForm.uuid ? 'Adicionar' : 'Salvar'}</button>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            </>
        )
    };

    return (
        <ModalBootstrapFormPerfis
            show={show}
            onHide={handleClose}
            titulo={!statePerfisForm.uuid ? 'Adicionar perfil' : 'Editar perfil'}
            bodyText={bodyTextarea()}
        />
    )
};
