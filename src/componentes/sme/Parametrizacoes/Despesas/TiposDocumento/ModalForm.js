import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {YupSignupSchemaTags} from "./YupSignupSchemaTags";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

const ModalForm = ({show, stateFormModal, handleClose, handleSubmitModalForm, setShowModalConfirmDelete}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    data-qa="formik-tipo-documento"	
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaTags}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalForm}
                >
                    {props => {
                        const { values, setFieldValue } = props;
                        return(
                            <form data-qa="form-tipo-documento" onSubmit={props.handleSubmit}>

                                <div className='row'>
                                    <div className='col-12' data-qa="legenda-campos-obrigatorios">
                                        <p>* Preenchimento obrigatório</p>
                                    </div>
                                    <div className='col col-12'>
                                        <div className="form-group">
                                            <label data-qa="label-nome-tipo-documento" htmlFor="nome">Nome *</label>
                                            <input
                                                data-qa="campo-nome-tipo-documento"
                                                maxLength={160}
                                                type="text"
                                                value={props.values.nome}
                                                placeholder="Nome do tipo de documento"
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <p data-qa="legenda-numero-documento-digitado" className="mb-0">Solicitar a digitação do número do documento?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                data-qa="campo-numero-documento-digitado-true"
                                                name="numero_documento_digitado_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="numero_documento_digitado_true"
                                                value="True"
                                                checked={values.numero_documento_digitado === true}
                                                onChange={() => setFieldValue("numero_documento_digitado", true)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-numero-documento-digitado-true" className="form-check-label" htmlFor="numero_documento_digitado_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                data-qa="campo-numero-documento-digitado-false"
                                                name="numero_documento_digitado_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="numero_documento_digitado_false"
                                                value="False"
                                                checked={values.numero_documento_digitado === false}
                                                onChange={() => {
                                                    setFieldValue("numero_documento_digitado", false);
                                                    setFieldValue("apenas_digitos", false);
                                                }}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-numero-documento-digitado-false" className="form-check-label" htmlFor="numero_documento_digitado_false">Não</label>
                                        </div>
                                    </div>
                                
                                    <div className="form-group col-md-6">
                                        <>
                                            <p data-qa="legenda-apenas-digitos" className="mb-0">No número do documento deve constar apenas dígitos?
                                                <span data-qa="tooltip-apenas-digitos"
                                                    data-tooltip-content="(ex: 0,1,2,3,4)" data-tooltip-id={`tooltip-id-apenas-digitos`}>
                                                    <ReactTooltip id={`tooltip-id-apenas-digitos`}/>
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '16px', marginLeft: "10px", color: "#00585E"}}
                                                        icon={faInfoCircle}
                                                    />
                                                </span>
                                            </p>
                                        </>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                data-qa="campo-apenas-digitos-true"
                                                name="apenas_digitos_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="apenas_digitos_true"
                                                value="True"
                                                checked={values.apenas_digitos === true}
                                                onChange={() => setFieldValue("apenas_digitos", true)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || values.numero_documento_digitado === false}
                                                />
                                            <label data-qa="label-apenas-digitos-true" className="form-check-label" htmlFor="apenas_digitos_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                data-qa="campo-apenas-digitos-false"
                                                name="apenas_digitos_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="apenas_digitos_false"
                                                value="False"
                                                checked={values.apenas_digitos === false}
                                                onChange={() => setFieldValue("apenas_digitos", false)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || values.numero_documento_digitado === false}
                                            />
                                            <label data-qa="label-apenas-digitos-false" className="form-check-label" htmlFor="apenas_digitos_false">Não</label>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <p data-qa="legenda-documento-comprobatorio-de-despesa" className="mb-0">Documento comprobatório de despesa?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                data-qa="campo-documento-comprobatorio-de-despesa-true"
                                                name="documento_comprobatorio_de_despesa_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="documento_comprobatorio_de_despesa_true"
                                                value="True"
                                                checked={values.documento_comprobatorio_de_despesa === true}
                                                onChange={() => setFieldValue("documento_comprobatorio_de_despesa", true)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-documento-comprobatorio-de-despesa-true" className="form-check-label" htmlFor="documento_comprobatorio_de_despesa_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                data-qa="campo-documento-comprobatorio-de-despesa-false"
                                                name="documento_comprobatorio_de_despesa_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="documento_comprobatorio_de_despesa_false"
                                                value="False"
                                                checked={values.documento_comprobatorio_de_despesa === false}
                                                onChange={() => {
                                                    setFieldValue("documento_comprobatorio_de_despesa",false);
                                                    setFieldValue("pode_reter_imposto", false);
                                                }}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-documento-comprobatorio-de-despesa-false" className="form-check-label" htmlFor="documento_comprobatorio_de_despesa_false">Não</label>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <p data-qa="legenda-pode-reter-imposto" className="mb-0">Habilita preenchimento do imposto?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                data-qa="campo-pode-reter-imposto-true"
                                                name="pode_reter_imposto_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="pode_reter_imposto_true"
                                                value="True"
                                                checked={values.pode_reter_imposto === true}
                                                onChange={() => setFieldValue("pode_reter_imposto", true)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || values.documento_comprobatorio_de_despesa === false}
                                            />
                                            <label data-qa="label-pode-reter-imposto-true" className="form-check-label" htmlFor="pode_reter_imposto_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                data-qa="campo-pode-reter-imposto-false"
                                                name="pode_reter_imposto_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="pode_reter_imposto_false"
                                                value="False"
                                                checked={values.pode_reter_imposto === false}
                                                onChange={() => setFieldValue("pode_reter_imposto", false)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || values.documento_comprobatorio_de_despesa === false}
                                            />
                                            <label data-qa="label-pode-reter-imposto-false" className="form-check-label" htmlFor="pode_reter_imposto_false">Não</label>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-6">
                                        <p data-qa="legenda-documento-de-retencao-de-imposto" className="mb-0">Documento relativo ao imposto recolhido?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                data-qa="campo-documento-de-retencao-de-imposto-true"
                                                name="eh_documento_de_retencao_de_imposto_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="eh_documento_de_retencao_de_imposto_true"
                                                value="True"
                                                checked={values.eh_documento_de_retencao_de_imposto === true}
                                                onChange={() => setFieldValue("eh_documento_de_retencao_de_imposto", true)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-documento-de-retencao-de-imposto-true" className="form-check-label" htmlFor="eh_documento_de_retencao_de_imposto_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                data-qa="campo-documento-de-retencao-de-imposto-false"
                                                name="eh_documento_de_retencao_de_imposto_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="eh_documento_de_retencao_de_imposto_false"
                                                value="False"
                                                checked={values.eh_documento_de_retencao_de_imposto === false}
                                                onChange={() => setFieldValue("eh_documento_de_retencao_de_imposto", false)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label data-qa="label-documento-de-retencao-de-imposto-false" className="form-check-label" htmlFor="eh_documento_de_retencao_de_imposto_false">Não</label>
                                        </div>
                                    </div>
                                </div>
                                    
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>ID</p>
                                        <p className='mb-2' data-qa="label-id-tipo-documento">{values.id}</p>
                                    </div>
                                </div>
                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.operacao === 'edit' ? (
                                            <button data-qa="botao-confirmar-apagar-tipo-documento" onClick={()=>setShowModalConfirmDelete(true)} type="button" className="btn btn btn-danger mt-2 mr-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                Excluir
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button data-qa="botao-cancelar-modal-tipo-documento" onClick={()=>handleClose()} type="button" className={`btn btn-outline-success mt-2 mr-2`}>Cancelar</button>
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button data-qa="botao-submit-modal-tipo-documento" type="submit" className="btn btn btn-success mt-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>Salvar</button>
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
        <ModalFormBodyText
            show={show}
            titulo={stateFormModal && stateFormModal.uuid ? 'Editar tipo de documento' : 'Adicionar tipo de documento'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalForm)
