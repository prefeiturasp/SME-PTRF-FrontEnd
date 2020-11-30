import {Formik} from "formik";
import {cpfMaskContitional, YupSignupSchemaMembros} from "../../../utils/ValidacoesAdicionaisFormularios";
import {ModalBootstrapFormMembros} from "../../Globais/ModalBootstrap";
import React from "react";
import {visoesService} from "../../../services/visoes.service";
import MaskedInput from "react-text-mask";

export const EditarMembro = ({visoesService, show, handleClose, onSubmitEditarMembro, handleChangeEditarMembro, validateFormMembros, stateFormEditarMembro, infosMembroSelecionado, btnSalvarReadOnly, usuarios}) => {
    const bodyTextarea = () => {
        return (

            <>
                {infosMembroSelecionado &&
                <Formik
                    initialValues={stateFormEditarMembro}
                    validationSchema={YupSignupSchemaMembros}
                    validate={validateFormMembros}
                    enableReinitialize={true}
                    validateOnBlur={true}
                    onSubmit={onSubmitEditarMembro}
                >
                    {props => {
                        const {
                            errors,
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form method="POST" id="membrosForm" onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="cargo_associacao">Cargo na Associação</label>
                                            <input
                                                readOnly={true}
                                                type="text"
                                                value={props.values.cargo_associacao ? props.values.cargo_associacao : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="cargo_associacao"
                                                className="form-control"
                                            />
                                            {props.errors.cargo_associacao && <span className="span_erro text-danger mt-1"> {props.errors.cargo_associacao}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="representacao">Representação na associação</label>
                                            <select
                                                disabled={!visoesService.getPermissoes(['change_associacao']) }
                                                value={props.values.representacao ? props.values.representacao : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="representacao"
                                                className="form-control"
                                            >
                                                <option value="">Escolha a Representação</option>
                                                <option value="ESTUDANTE">Estudante</option>
                                                <option value='PAI_RESPONSAVEL'>Pai ou responsável</option>
                                                <option value='SERVIDOR'>Servidor</option>
                                            </select>
                                            {props.errors.representacao && <span className="span_erro text-danger mt-1"> {props.errors.representacao}</span>}
                                        </div>
                                    </div>

                                    <div className={`col-12 col-md-6 ${props.values.representacao !== 'SERVIDOR' && props.values.representacao !== 'ESTUDANTE' && 'escondeItem'}`}>
                                        <div className="form-group">
                                            <label htmlFor="codigo_identificacao">{props.values.representacao === 'SERVIDOR' ? "Registro Funcional" : "Código EOL"}</label>
                                            <input
                                                disabled={!visoesService.getPermissoes(['change_associacao']) }
                                                type="text"
                                                value={props.values.codigo_identificacao ? props.values.codigo_identificacao : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="codigo_identificacao"
                                                className="form-control"
                                            />
                                            {props.errors.codigo_identificacao && <span className="span_erro text-danger mt-1"> {props.errors.codigo_identificacao}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cargo_associacao">Nome Completo</label>
                                            <input
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                                disabled={!visoesService.getPermissoes(['change_associacao']) }
                                                type="text"
                                                value={props.values.nome ? props.values.nome : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="nome"
                                                className="form-control"
                                            />
                                            {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                        </div>
                                    </div>

                                    {props.values.representacao === 'PAI_RESPONSAVEL' &&
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cpf">CPF Responsável</label>

                                            <MaskedInput
                                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                                disabled={!visoesService.getPermissoes(['change_associacao']) }
                                                type="text"
                                                value={props.values.cpf ? props.values.cpf : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="cpf"
                                                className="form-control"
                                            />

                                            {props.errors.cpf && <span className="span_erro text-danger mt-1"> {props.errors.cpf}</span>}
                                        </div>
                                    </div>
                                    }

                                    <div className={`col-12 col-md-6 ${props.values.representacao !== 'SERVIDOR' && 'escondeItem'}`}>
                                        <div className="form-group">
                                            <label htmlFor="cargo_educacao">Cargo na educação</label>
                                            <input
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                type="text"
                                                value={props.values.cargo_educacao ? props.values.cargo_educacao : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="cargo_educacao"
                                                className="form-control"
                                            />
                                            {(props.values.cargo_educacao === undefined || props.values.cargo_educacao === "") && props.errors.cargo_educacao && <span className="span_erro text-danger mt-1"> {props.errors.cargo_educacao}</span>}
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                type="text"
                                                value={props.values.email ? props.values.email : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="email"
                                                className="form-control"
                                                placeholder="Insira seu email se desejar"
                                            />
                                            {props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email}</span>}
                                        </div>
                                    </div>

                                    <div className='col-12'>
                                        <div className='form-group'>
                                            <label htmlFor="usuario">Usuário</label>
                                            <select
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                value={props.values.usuario.id}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="usuario"
                                                className="form-control"
                                            >
                                                <option value="">Escolha seu usuário</option>
                                                {usuarios && usuarios.length > 0 && usuarios.map(usuario=>
                                                    <option key={usuario.id} value={usuario.id}>{usuario.name}</option>
                                                )}

                                            </select>
                                            {props.errors.representacao && <span className="span_erro text-danger mt-1"> {props.errors.representacao}</span>}
                                        </div>
                                    </div>

                                </div>
                                <div className="d-flex  justify-content-end pb-3 mt-3">
                                    <button onClick={()=>handleClose()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                    <button disabled={btnSalvarReadOnly || !visoesService.getPermissoes(['change_associacao'])} type="submit" className="btn btn-success mt-2">Salvar</button>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
                }
            </>
        )
    };
    return (
        <ModalBootstrapFormMembros
            show={show}
            onHide={handleClose}
            titulo="Editar membro"
            bodyText={bodyTextarea()}
        />
    )
};