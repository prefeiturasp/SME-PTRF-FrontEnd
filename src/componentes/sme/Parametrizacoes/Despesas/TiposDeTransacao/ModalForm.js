import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik, Field, Form} from "formik";
import {YupSignupSchemaTags} from "./YupSignupSchemaTags";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"


const ModalForm = ({show, stateFormModal, handleClose, handleSubmitModalForm, setShowModalConfirmDelete}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaTags}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalForm}
                >
                    {props => {
                        const { values, setFieldValue } = props;
                        return(
                            <Form>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p>* Preenchimento obrigatório</p>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome *</label>
                                            <Field
                                                type="text"
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                maxLength="160"
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <p data-qa="legenda-numero-documento-digitado" className="mb-0">Tem documento? *</p>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <div className="form-check form-check-inline mt-2">
                                            <Field
                                                data-qa="campo-tem-documento-true"
                                                name="tem_documento"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="tem_documento_true"
                                                value="true"
                                                checked={values.tem_documento === true}
                                                onChange={() => setFieldValue("tem_documento", true)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-campo-tem-documento-true" className="form-check-label" htmlFor="tem_documento_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                data-qa="campo-tem-documento-false"
                                                name="tem_documento"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="tem_documento_false"
                                                value="false"
                                                checked={values.tem_documento === false}
                                                onChange={() => setFieldValue("tem_documento", false)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-tem_documento-false" className="form-check-label" htmlFor="tem_documento_false">Não</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>ID</p>
                                        <p className='mb-2'>{stateFormModal.id}</p>
                                    </div>
                                </div>
                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {stateFormModal.operacao === 'edit' ? (
                                            <button onClick={()=>setShowModalConfirmDelete(true)} type="button" className="btn btn btn-danger mt-2 mr-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                Apagar
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={()=>handleClose()} type="button" className={`btn btn-outline-success mt-2 mr-2`}>Cancelar</button>
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button type="submit" className="btn btn btn-success mt-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>Salvar</button>
                                    </div>
                                </div>
                            </Form>
                        )}}
                </Formik>
            </>
        )
    };

    return (
        <ModalFormBodyText
            show={show}
            titulo={stateFormModal && stateFormModal.id ? 'Editar tipo de transação' : 'Adicionar tipo de transação'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalForm)