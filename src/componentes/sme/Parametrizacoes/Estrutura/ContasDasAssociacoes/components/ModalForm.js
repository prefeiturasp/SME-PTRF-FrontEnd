import React, {memo} from "react";
import {Formik, Field, Form} from "formik";
import {ModalFormBodyText} from "../../../../../Globais/ModalBootstrap";
import {DatePickerField} from "../../../../../Globais/DatePickerField";
import AutoCompleteAssociacoes from "../AutoCompleteAssociacoes";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";

import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

import Spinner from "../../../../../../assets/img/spinner.gif";
import { YupSchemaContasAssociacoes } from "../FormValidacao";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    const { recursos } = useRecursoSelecionadoContext();
    const {
        stateFormModal,
        bloquearBtnSalvarForm,
        handleOpenModalConfirmacaoExclusao,
        handleCloseModalForm,
        listaTiposDeConta,
        todasAsAssociacoesAutoComplete,
        loadingAssociacoes,
        recebeAutoComplete,
    } = useContasDasAssociacoesContext();

    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={YupSchemaContasAssociacoes}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={handleSubmitFormModal}
            >
                {props => {
                    const {values, setFieldValue} = props;
                    const editReadonly = !!values.uuid;
                    const handleRecebeAutoComplete = (selectAssociacao) => {
                        recebeAutoComplete(selectAssociacao);
                        setFieldValue("associacao", selectAssociacao?.uuid || "");
                        setFieldValue("associacao_nome", selectAssociacao?.unidade?.nome_com_tipo || "");
                    };

                    return (
                        <Form>
                            <div className="row">
                                <div className='col-12'>
                                    <p className='text-right mb-2'><strong>* Preenchimento obrigatório</strong></p>
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label htmlFor="recurso_uuid">Recurso *</label>
                                <select
                                    data-qa="input-recurso"
                                    value={values.recurso_uuid ? values.recurso_uuid : ""}
                                    disabled
                                    name="recurso_uuid"
                                    id="recurso_uuid"
                                    className="form-control"
                                    required
                                >
                                    <option data-qa="option-recurso-vazio" value=''>Selecione um recurso</option>
                                    {recursos?.map((recurso) =>
                                        <option
                                            data-qa={`option-recurso-${recurso.uuid}`}
                                            key={recurso.uuid}
                                            value={recurso.uuid}
                                        >
                                            {recurso.nome}
                                        </option>
                                    )}
                                </select>
                            </div>

                            {editReadonly ? (
                                <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="associacao_nome">Unidade Educacional *</label>
                                        <Field
                                            name='associacao_nome'
                                            id="associacao_nome"
                                            type="text"
                                            className="form-control"
                                            readOnly={editReadonly}
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                    </div>
                                </div>
                            ) :
                                <>
                                    <label htmlFor="associacao_nome">
                                        Unidade Educacional *{loadingAssociacoes && <img alt="" src={Spinner} style={{height: "22px"}}/>}
                                    </label>
                                    <AutoCompleteAssociacoes
                                        todasAsAssociacoesAutoComplete={todasAsAssociacoesAutoComplete}
                                        recebeAutoComplete={handleRecebeAutoComplete}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        loadingAssociacoes={loadingAssociacoes}
                                    />
                                    {props.touched.associacao_nome && props.errors.associacao_nome && <span className="span_erro text-danger mt-1"> {props.errors.associacao_nome} </span>}
                                </>
                            }

                            <div className='row mt-3'>
                                <div className='col'>
                                    <label htmlFor="tipo_conta">Tipos de conta *</label>
                                    <Field
                                        as="select"
                                        name='tipo_conta'
                                        id="tipo_conta"
                                        className="form-control"
                                        disabled={editReadonly || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    >
                                        <option value=''>Selecione tipo de conta</option>
                                        {listaTiposDeConta && listaTiposDeConta.length > 0 && listaTiposDeConta.map(item => (
                                            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                        ))}
                                    </Field>
                                    {props.touched.tipo_conta && props.errors.tipo_conta && <span className="span_erro text-danger mt-1"> {props.errors.tipo_conta} </span>}
                                </div>

                                <div className='col'>
                                    <label htmlFor="status">Status *</label>
                                    <Field
                                        as="select"
                                        name='status'
                                        id="status"
                                        className="form-control"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    >
                                        <option value=''>Selecione o status</option>
                                        <option value='ATIVA'>Ativa</option>
                                        <option value='INATIVA'>Inativa</option>
                                    </Field>
                                    {props.touched.status && props.errors.status && <span className="span_erro text-danger mt-1"> {props.errors.status} </span>}
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className='col'>
                                    <label htmlFor="banco_nome">Banco</label>
                                    <Field
                                        name='banco_nome'
                                        id="banco_nome"
                                        type="text"
                                        className="form-control"
                                        maxLength="50"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                </div>

                                <div className='col'>
                                    <label htmlFor="agencia">Agência</label>
                                    <Field
                                        name='agencia'
                                        id="agencia"
                                        type="text"
                                        className="form-control"
                                        maxLength="15"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className='col'>
                                    <label htmlFor="numero_conta">Conta</label>
                                    <Field
                                        name='numero_conta'
                                        id="numero_conta"
                                        type="text"
                                        className="form-control"
                                        maxLength="30"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                </div>

                                <div className='col'>
                                    <label htmlFor="numero_cartao">Cartão</label>
                                    <Field
                                        name='numero_cartao'
                                        id="numero_cartao"
                                        type="text"
                                        className="form-control"
                                        maxLength="80"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className="col-6">
                                    <label htmlFor="data_inicio">Data de início *</label>
                                    <DatePickerField
                                        name="data_inicio"
                                        id="data_inicio"
                                        value={values.data_inicio !== null ? values.data_inicio : ""}
                                        onChange={(name, val) => {
                                            setFieldValue(name, val ? val.toISOString().substr(0, 10) : "");
                                        }}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        className="form-control"
                                    />
                                    {props.touched.data_inicio && props.errors.data_inicio && <span className="span_erro text-danger mt-1"> {props.errors.data_inicio} </span>}
                                </div>
                            </div>

                            {values.id &&
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>ID: {values.id}</p>
                                    </div>
                                </div>
                            }

                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.uuid &&
                                        <button
                                            onClick={() => {
                                                handleOpenModalConfirmacaoExclusao(values.uuid);
                                                handleCloseModalForm();
                                            }}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            <FontAwesomeIcon icon={faXmark} style={{ marginRight: "8px", color: "white", fontWeight: "bold" }} />
                                            Excluir
                                        </button>
                                    }
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        onClick={handleCloseModalForm}
                                        type="button"
                                        className="btn btn btn-outline-success mt-2 mr-2"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        type="submit"
                                        className="btn btn btn-success mt-2"
                                    >
                                        {values.uuid ? "Salvar" : "Adicionar"}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        );
    };

    return (
        <ModalFormBodyText
            show={stateFormModal.isOpen}
            titulo={`${stateFormModal.uuid ? "Editar conta de associação" : "Adicionar conta de associação"}`}
            onHide={handleCloseModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    );
};

export default memo(ModalForm);
