import React from "react";
import {Field, Formik} from "formik";
import {YupSignupSchemaPerfis} from "./YupSignupSchemaPerfis";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import MaskedInput from "react-text-mask";
import {ModalUsuarioNaoCadastrado} from "./ModalUsuarioNaoCadastrado";
import {ModalUsuarioCadastradoVinculado} from "./ModalUsuarioCadastradoVinculado";
import {ModalConfirmDeletePerfil} from "./ModalConfirmDeletePerfil";
import {ModalInfo} from "./ModalInfo";

export const GestaoDePerfisFormFormik = (
        {
            initPerfisForm,
            setStatePerfisForm,
            statePerfisForm,
            handleSubmitPerfisForm,
            setShowModalDeletePerfil,
            validacoesPersonalizadas,
            setFormErrors,
            formErrors,
            idUsuarioCondicionalMask,
            setBloquearCampoName,
            bloquearCampoName,
            bloquearCampoEmail,
            setBloquearCampoEmail,
            grupos,
            showModalUsuarioNaoCadastrado,
            handleCloseUsuarioNaoCadastrado,
            showModalUsuarioCadastradoVinculado,
            setShowModalUsuarioNaoCadastrado,
            setShowModalUsuarioCadastradoVinculado,
            showModalDeletePerfil,
            handleCloseDeletePerfil,
            onDeletePerfilTrue,
            showModalInfo,
            setShowModalInfo,
            tituloModalInfo,
            textoModalInfo,
        }) =>{
    return(
        <Formik
            initialValues={statePerfisForm}
            validationSchema={YupSignupSchemaPerfis}
            enableReinitialize={true}
            validateOnBlur={true}
            onSubmit={handleSubmitPerfisForm}
        >
            {props => {
                const {
                    setFieldValue,
                    resetForm,
                    values,
                } = props;
                return (
                    <form onSubmit={props.handleSubmit}>

                        <div className="d-flex bd-highlight mt-2">
                            <div className="p-Y flex-grow-1 bd-highlight">
                                <p className='titulo-gestao-de-perfis-form'>{!statePerfisForm.id ? 'Adicionar' : 'Editar'} usuário</p>
                            </div>
                            <div className="p-Y bd-highlight">
                                {statePerfisForm.id &&
                                <button onClick={() => setShowModalDeletePerfil(true)} type="button"
                                        className="btn btn btn-danger mt-2">
                                    <FontAwesomeIcon
                                        style={{
                                            fontSize: '15px',
                                            marginRight: "5px",
                                            color: '#fff'
                                        }}
                                        icon={faTrash}
                                    />
                                    Deletar usuário
                                </button>
                                }
                            </div>
                            <div className="p-Y bd-highlight">
                                <button type="submit"
                                        className="btn btn-success mt-2 ml-2">{!statePerfisForm.id ? 'Adicionar' : 'Salvar'}</button>
                            </div>
                            <div className="p-Y bd-highlight">
                                <button onClick={() => window.location.assign('/gestao-de-perfis/')}
                                        type="button"
                                        className="btn btn btn-outline-success mt-2 ml-2">voltar
                                </button>
                            </div>
                        </div>

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
                                        disabled={statePerfisForm.id}
                                        onBlur={() => {
                                            validacoesPersonalizadas(values, {
                                                setFieldValue,
                                                resetForm
                                            });
                                        }}
                                        onClick={() => {
                                            setFormErrors({username: ""})
                                        }}
                                    >
                                        <option value="">Escolha o tipo de usuário</option>
                                        <option value="True">Servidor</option>
                                        <option value="False">Não Servidor</option>
                                    </select>
                                    {props.errors.e_servidor && <span
                                        className="span_erro text-danger mt-1"> {props.errors.e_servidor}</span>}
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
                                        onBlur={() => {
                                            validacoesPersonalizadas(values, {
                                                setFieldValue,
                                                resetForm
                                            });
                                        }}
                                        onClick={() => {
                                            setFormErrors({username: ""})
                                        }}
                                        name="username"
                                        className="form-control"
                                        placeholder='Insira o nome de usuário'
                                        disabled={!props.values.e_servidor || statePerfisForm.id}
                                    />
                                    {/*Validações personalizadas*/}
                                    {formErrors.username && <p className='mb-0'><span
                                        className="span_erro text-danger mt-1">{formErrors.username}</span>
                                    </p>}
                                </div>
                            </div>

                            <div className="col-12">
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
                                    {props.errors.name && <span
                                        className="span_erro text-danger mt-1"> {props.errors.name}</span>}
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
                                        }}
                                        name="email"
                                        className="form-control"
                                        placeholder='Insira seu email se desejar'
                                        readOnly={bloquearCampoEmail}
                                        maxLength='254'
                                    />
                                    {props.errors.email && <span
                                        className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="groups">Grupo de acesso</label>
                                    <Field
                                        component="select"
                                        name="groups"
                                        className="form-control"
                                        multiple={true}
                                        value={props.values.groups ? props.values.groups : []}
                                        onChange={evt =>
                                            setFieldValue("groups", [].slice.call(evt.target.selectedOptions).map(option => option.value))
                                        }
                                    >
                                        {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                                            <option key={index}
                                                    value={grupo.id}>{grupo.nome}</option>
                                        ))}
                                    </Field>
                                    {props.errors.groups && <span
                                        className="span_erro text-danger mt-1"> {props.errors.groups}</span>}
                                </div>
                            </div>
                        </div>
                        <section>
                            <ModalUsuarioNaoCadastrado
                                show={showModalUsuarioNaoCadastrado}
                                handleClose={() => handleCloseUsuarioNaoCadastrado({resetForm})}
                                onCadastrarTrue={() => {
                                    setBloquearCampoName(false)
                                    setBloquearCampoEmail(false)
                                    setShowModalUsuarioNaoCadastrado(false)
                                }}
                                titulo="Usuário não cadastrado"
                                texto="<p>O usuário não existe no CoreSSO deseja criá-lo?</p>"
                                primeiroBotaoTexto="Cancelar"
                                primeiroBotaoCss="outline-success"
                                segundoBotaoCss="success"
                                segundoBotaoTexto="Cadastrar"
                            />
                        </section>
                        <section>
                            <ModalUsuarioCadastradoVinculado
                                show={showModalUsuarioCadastradoVinculado}
                                handleClose={() => {
                                    setShowModalUsuarioCadastradoVinculado(false);
                                    setStatePerfisForm(initPerfisForm)
                                }}
                                titulo="Usuário já vinculado"
                                texto="<p>Este usuário já está vinculado</p>"
                                primeiroBotaoTexto="Fechar"
                                primeiroBotaoCss="success"
                            />
                        </section>
                        <section>
                            <ModalConfirmDeletePerfil
                                show={showModalDeletePerfil}
                                handleClose={handleCloseDeletePerfil}
                                onDeletePerfilTrue={onDeletePerfilTrue}
                                titulo="Excluir usuário"
                                texto="<p>Deseja realmente excluir este usuário?</p>"
                                primeiroBotaoTexto="Cancelar"
                                primeiroBotaoCss="outline-success"
                                segundoBotaoCss="danger"
                                segundoBotaoTexto="Excluir"
                            />
                        </section>
                        <section>
                            <ModalInfo
                                show={showModalInfo}
                                handleClose={() => setShowModalInfo(false)}
                                titulo={tituloModalInfo}
                                texto={textoModalInfo}
                                primeiroBotaoTexto="Fechar"
                                primeiroBotaoCss="success"
                            />
                        </section>
                    </form>
                );
            }}
        </Formik>
    )
}