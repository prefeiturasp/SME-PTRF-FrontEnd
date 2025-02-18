import React, {memo} from "react";
import {Formik, Field, Form} from "formik";
import {ModalFormParametrizacoesAcoesDaAssociacao} from "../../../../Globais/ModalBootstrap";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AutoCompleteAssociacoes from "./AutoCompleteAssociacoes";
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import Spinner from "../../../../../assets/img/spinner.gif"
import { YupSchemaContasAssociacoes } from "./FormValidacao";

const ModalForm = ({show, handleClose, handleSubmitModalForm, recebeAutoComplete, stateFormModal, readOnly, listaTiposDeConta, setShowModalDelete, todasAsAssociacoesAutoComplete, loadingAssociacoes}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const bodyTextarea = () => {
        const editReadonly = stateFormModal && stateFormModal.operacao === 'edit'
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSchemaContasAssociacoes}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalForm}
                >

                    {props => {
                        const {
                            setFieldValue,
                        } = props;

                    return (

                    <Form>
                        <div className="row">
                            <div className='col-12'>
                                <p>* Preenchimento obrigatório</p>
                            </div>
                        </div>
                        {stateFormModal && stateFormModal.operacao === 'edit' ? (
                            <div className='row'>
                                <div className='col'>
                                    <label htmlFor="associacao_nome">Associação *</label>
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
                                <label htmlFor="associacao_nome">Associação *{loadingAssociacoes && <img alt="" src={Spinner} style={{height: "22px"}}/>}</label>
                                <AutoCompleteAssociacoes
                                    todasAsAssociacoesAutoComplete={todasAsAssociacoesAutoComplete}
                                    recebeAutoComplete={recebeAutoComplete}
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
                                />
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className="col-6">
                                <label htmlFor="data_inicio">
                                    Data de início *
                                </label>
                                <DatePickerField
                                    name="data_inicio"
                                    id="data_inicio"
                                    value={props.values.data_inicio !== null ? props.values.data_inicio : ""}
                                    onChange={(name, val) => {
                                        setFieldValue(name, val ? val.toISOString().substr(0, 10) : "")
                                        }}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    className="form-control"
                                />
                                {props.touched.data_inicio && props.errors.data_inicio && <span className="span_erro text-danger mt-1"> {props.errors.data_inicio} </span>}
                            </div>
                        </div>

                        <div className='row mt-3'>
                            <div className='col'>
                                <p>ID</p>
                                <p>{stateFormModal.id}</p>
                            </div>
                        </div>

                        <div className="d-flex bd-highlight mt-2">
                            <div className="p-Y flex-grow-1 bd-highlight">
                                {stateFormModal && stateFormModal.operacao === 'edit' ? (
                                <button onClick={()=>setShowModalDelete(true)} type="button" className="btn btn btn-danger mt-2 mr-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                    Excluir
                                </button>
                                ): null}
                            </div>
                            <div className="p-Y bd-highlight">
                                <button onClick={handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            </div>
                            <div className="p-Y bd-highlight">
                                <button
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    type="submit"
                                    className="btn btn btn-success mt-2"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </Form>
                     );}}
                </Formik>
            </>
        )
    };

    return (
        <ModalFormParametrizacoesAcoesDaAssociacao
            show={show}
            titulo={stateFormModal && stateFormModal.operacao === 'edit' ? 'Editar conta de associação' : 'Adicionar conta de associação'}
            onHide={handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={handleClose}
        />
    )
};

export default memo(ModalForm)