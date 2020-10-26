import React from "react";
import {ModalBootstrapFormPerfis} from "../../Globais/ModalBootstrap";
import {Formik, Field} from "formik";
import * as yup from "yup";
import {consultarCodEol, consultarNomeResponsavel, consultarRF} from "../../../services/escolas/Associacao.service";

export const ModalPerfisForm = ({show, handleClose, initialValues, setStatePerfisForm, handleChange, onSubmit}) => {

    const YupSignupSchemaPerfis = yup.object().shape({
        tipo_usuario: yup.string().required("Tipo de usuário é obrigatório"),
        nome_usuario: yup.string().required("Nome de usuário é obrigatório"),
        grupo_acesso: yup.string().required("Grupo de acesso é obrigatório"),
    });

    const validateFormMPerfis = async (values) => {
        const errors = {};
        if (values.tipo_usuario === "SERVIDOR"){
            try {
                let rf = await consultarRF(values.nome_usuario.trim());
                if (rf.status === 200 || rf.status === 201) {
                    const init = {
                        ...initialValues,
                        nome_completo: rf.data[0].nm_pessoa,
                        email: values.email,
                    };
                    setStatePerfisForm(init);
                }
            }catch (e) {
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    errors.nome_usuario = data.detail
                } else {
                    errors.nome_usuario = "RF inválido"
                }
            }
        } else if(values.representacao === "ESTUDANTE"){
            try {
                let cod_eol = await consultarCodEol(values.codigo_identificacao);
                if (cod_eol.status === 200 || cod_eol.status === 201){
                    const init = {
                        ...initialValues,
                        nome: cod_eol.data.nm_aluno,
                        codigo_identificacao: values.codigo_identificacao,
                        cargo_associacao: values.cargo_associacao,
                        cargo_educacao: "",
                        representacao: values.representacao,
                        email: values.email,
                    };
                    setStatePerfisForm(init);
                }
            } catch (e) {
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    errors.codigo_identificacao = data.detail
                } else {
                    errors.codigo_identificacao = "Código Eol inválido"
                }
            }
        } else if (values.representacao === "PAI_RESPONSAVEL") {
            try {
                let result = await consultarNomeResponsavel(values.nome);
                if (result.status === 200 || result.status === 201) {
                    //setBtnSalvarReadOnly(false);
                }
            } catch (e) {
                let data = e.response.data;
                if (data !== undefined && data.detail !== undefined) {
                    errors.nome = data.detail
                }
            }
        } else {
        }
        return errors
    };

    const availableSelection = [
        {uuid: 'uuid_grupo_acesso_01', nome:'Grupo de Acesso 01'},
        {uuid: 'uuid_grupo_acesso_02', nome:'Grupo de Acesso 02'},
        {uuid: 'uuid_grupo_acesso_03', nome:'Grupo de Acesso 03'},
    ];

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={initialValues}
                    validationSchema={YupSignupSchemaPerfis}
                    //validate={validateFormMPerfis}
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
                                                value={props.values.tipo_usuario ? props.values.tipo_usuario : ""}
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
                                                <option value='SERVIDOR'>Servidor</option>
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
                                                value={props.values.email}
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
                                                {availableSelection.map(s => (
                                                    <option key={s.uuid} value={s.uuid}>{s.nome}</option>
                                                ))}
                                            </Field>
                                            {props.errors.grupo_acesso && <span className="span_erro text-danger mt-1"> {props.errors.grupo_acesso}</span>}
                                        </div>
                                    </div>


                                </div>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={() => handleClose()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-success mt-2">{!initialValues.uuid ? 'Adicionar' : 'Salvar'}</button>
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
            titulo={!initialValues.uuid ? 'Adicionar perfil' : 'Editar perfil'}
            bodyText={bodyTextarea()}
        />
    )
};
