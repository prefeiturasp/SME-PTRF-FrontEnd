import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import ReactTooltip from "react-tooltip";
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
                    data-qa="formik-motivo-pagamento-antecipado"	
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaTags}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalForm}>
                    {props => {
                        const { values } = props;
                        return(
                            <form data-qa="form-motivo-pagamento-antecipado"
                            onSubmit={props.handleSubmit}>

                                <div className='row'>
                                    <div className='col-12' data-qa="legenda-campos-obrigatorios">
                                        <p>* Preenchimento obrigatório</p>
                                    </div>
                                    <div className='col col-12'>
                                        <div className="form-group">
                                            <label data-qa="label-motivo-motivo-pagamento-antecipado" htmlFor="motivo">Nome *</label>
                                            <input
                                                data-qa="campo-motivo-motivo-pagamento-antecipado"
                                                type="text"
                                                value={props.values.motivo}
                                                placeholder="Nome do motivo de pagamento antecipado"
                                                name="motivo"
                                                id="motivo"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.motivo && props.errors.motivo && <span className="span_erro text-danger mt-1"> {props.errors.motivo} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>ID</p>
                                        <p className='mb-2' data-qa="label-id-motivo-pagamento-antecipado">{values.id}</p>
                                    </div>
                                </div>
                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.operacao === 'edit' ? (
                                            <button data-qa="botao-confirmar-apagar-motivo-pagamento-antecipado" onClick={()=>setShowModalConfirmDelete(true)} type="button" className="btn btn btn-danger mt-2 mr-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                Apagar
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button data-qa="botao-cancelar-modal-motivo-pagamento-antecipado" onClick={()=>handleClose()} type="button" className={`btn btn-outline-success mt-2 mr-2`}>Cancelar</button>
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button data-qa="botao-submit-modal-motivo-pagamento-antecipado" type="submit" className="btn btn btn-success mt-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>Salvar</button>
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
            titulo={stateFormModal && stateFormModal.uuid ? 'Editar motivo de pagamento antecipado' : 'Adicionar motivo de pagamento antecipado'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalForm)
