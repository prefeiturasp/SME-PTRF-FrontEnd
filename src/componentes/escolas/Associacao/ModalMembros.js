import {Formik} from "formik";
import {YupSignupSchemaMembros} from "../../../utils/ValidacoesAdicionaisFormularios";
import {ModalBootstrapFormMembros} from "../../Globais/ModalBootstrap";
import React from "react";
import MaskedInput from "react-text-mask";

export const telefoneMaskContitional = (value) => {
    let telefone = value.replace(/[^\d]+/g, "");
    let mask = [];
    if (telefone.length <= 10 ) {
        mask = ['(', /\d/, /\d/,')' , /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }else{
        mask = ['(', /\d/, /\d/,')' , /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
    }
    return mask
}

export const EditarMembro = ({visoesService, show, handleClose, onSubmitEditarMembro, handleChangeEditarMembro, validateFormMembros, stateFormEditarMembro, infosMembroSelecionado, btnSalvarReadOnly, usuarios}) => {
    const bodyTextarea = () => {

        const ePresidente = (infoMembro) => {
            return (infoMembro && infoMembro.id === "PRESIDENTE_DIRETORIA_EXECUTIVA")
        };

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

                                {/*Cargo na Associação ===>*/}
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
                                </div>
                                {/*Cargo na Associação <===*/}

                                {/*Representação e RF ===>*/}
                                <div className='row'>
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
                                {/*Representação e RF <===*/}

                                {/*Nome ===>*/}
                                <div className="row">
                                    <div className="col-12">
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
                                </div>
                                {/*Nome <===*/}

                                {/*Cargo na Educação e Telefone ===>*/}
                                <div className="row">

                                    {/*Cargo*/}
                                    {props.values.representacao === 'PAI_RESPONSAVEL' &&
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cpf">CPF do pai ou responsável</label>
                                            <MaskedInput
                                                mask={[/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]}
                                                readOnly={props.values.representacao !== 'PAI_RESPONSAVEL'}
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
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
                                            {props.errors.cpf &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.cpf}</span>}
                                        </div>
                                    </div>
                                    }

                                    <div
                                        // className={`col-12 col-md-6 ${props.values.representacao !== 'SERVIDOR' && 'escondeItem'}`}>
                                        className={(ePresidente(infosMembroSelecionado) ? "col-12 col-md-6" : "col-12") + (props.values.representacao !== 'SERVIDOR' ? " escondeItem" : "")}>
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
                                            {(props.values.cargo_educacao === undefined || props.values.cargo_educacao === "") && props.errors.cargo_educacao &&
                                            <span
                                                className="span_erro text-danger mt-1"> {props.errors.cargo_educacao}</span>}
                                        </div>
                                    </div>

                                    {/*Telefone*/}
                                    {ePresidente(infosMembroSelecionado) &&
                                        <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="telefone">Telefone</label>
                                            <MaskedInput
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                mask={(valor) => telefoneMaskContitional(valor)}
                                                value={props.values.telefone ? props.values.telefone : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="telefone"
                                                className="form-control"
                                            />
                                            {props.errors.telefone &&
                                            <span
                                                className="span_erro text-danger mt-1"> {props.errors.telefone}</span>}
                                        </div>
                                    </div>
                                    }


                                </div>
                                {/*Cargo na Educação e Telefone<===*/}

                                {/*CEP e Bairro ===>*/}
                                {ePresidente(infosMembroSelecionado) &&
                                    <div className="row">

                                    {/*CEP*/}
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="cep">CEP</label>
                                            <MaskedInput
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                                                value={props.values.cep ? props.values.cep : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="cep"
                                                className="form-control"
                                            />
                                            {props.errors.cep &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.cep}</span>}
                                        </div>
                                    </div>

                                    {/*Bairro*/}
                                    <div className="col-12 col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="bairro">Bairro</label>
                                            <input
                                                readOnly={false}
                                                disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                type="text"
                                                value={props.values.bairro ? props.values.bairro : ""}
                                                onChange={(e) => {
                                                    props.handleChange(e);
                                                    handleChangeEditarMembro(e.target.name, e.target.value);
                                                }
                                                }
                                                name="bairro"
                                                className="form-control"
                                            />
                                            {props.errors.bairro &&
                                            <span className="span_erro text-danger mt-1"> {props.errors.bairro}</span>}
                                        </div>
                                    </div>

                                </div>
                                }
                                {/*CEP e Bairro<===*/}

                                {/*Endereço ===>*/}
                                {ePresidente(infosMembroSelecionado) &&
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="endereco">Endereço</label>
                                                <input
                                                    disabled={!visoesService.getPermissoes(['change_associacao'])}
                                                    type="text"
                                                    value={props.values.endereco ? props.values.endereco : ""}
                                                    onChange={(e) => {
                                                        props.handleChange(e);
                                                        handleChangeEditarMembro(e.target.name, e.target.value);
                                                    }
                                                    }
                                                    name="endereco"
                                                    className="form-control"
                                                    placeholder=""
                                                />
                                                {props.errors.endereco && <span className="span_erro text-danger mt-1"> {props.errors.endereco}</span>}
                                            </div>
                                        </div>
                                    </div>
                                }
                                {/*Endereço <===*/}

                                {/*Email ===>*/}
                                <div className="row">
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
                                </div>
                                {/*Email <===*/}

                                {/*Usuário===>*/}
                                <div className="row">
                                    <div className="col-12">
                                        <div className="form-group">
                                            <label htmlFor="usuario">Usuário do SIG - Escola</label>
                                            <input
                                                type="text"
                                                value={props.values.usuario}
                                                name="usuario"
                                                className="form-control"
                                                //placeholder="Insira seu email se desejar"
                                                readOnly={true}
                                            />
                                            {props.errors.usuario && <span className="span_erro text-danger mt-1"> {props.errors.usuario}</span>}
                                        </div>
                                    </div>
                                </div>
                                {/*Usuário <===*/}

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