import React from "react";
import { Formik } from "formik";
import { YupSchemaMotivosAprovacaoPcRessalva } from "../YupSchemaMotivosAprovacaoPcRessalva";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { useMotivosReprovacaoPcContext } from "../hooks/useMotivoReprovacaoContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const { stateFormModal, bloquearBtnSalvarForm, handleOpenModalConfirmacaoExclusao, handleCloseModalForm} = useMotivosReprovacaoPcContext();
    const { recursos } = useRecursoSelecionadoContext()

    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={YupSchemaMotivosAprovacaoPcRessalva}
                enableReinitialize={true}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleSubmitFormModal}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                    } = props;
                    return(
                        <form onSubmit={props.handleSubmit}>
                            <div className='row'>
                                <div className='col-12'>
                                    <p className='text-right mb-2'><strong>* Preenchimento obrigatório</strong></p>
                                </div>

                                <div className='col-12 mb-2'>
                                    <label htmlFor="recurso_uuid">Recurso *</label>
                                    <select
                                        data-qa="input-recurso"
                                        value={values.recurso_uuid ? values.recurso_uuid : ""}
                                        disabled
                                        // name="recurso_uuid"
                                        // id="recurso_uuid"
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
                                    {props.touched.recurso_uuid && props.errors.recurso_uuid && <span className="span_erro text-danger mt-1"> {props.errors.recurso_uuid} </span>}
                                </div>

                                <div className='col-12'>
                                    <div className="form-group">
                                        <span
                                            data-tooltip-id="tooltip-id-motivo"
                                            data-tooltip-content="Preencher com um motivo de aprovação de pc com ressalva">
                                            <label htmlFor="motivo">Motivo *</label>
                                            <ReactTooltip id="tooltip-id-motivo"/>
                                        </span>

                                        <input
                                            type="text"
                                            maxLength={160}
                                            value={values.motivo}
                                            name="motivo"
                                            id="motivo"
                                            className="form-control"
                                            onChange={props.handleChange}
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                        {props.errors.motivo && <span className="span_erro text-danger mt-1"> {props.errors.motivo}</span>}
                                    </div>
                                </div>
                            </div>

                            {
                                values.id &&
                                <div className='row mt-3'>
                                    <div className='col-6'>
                                        <p className='mb-2'>ID: {values.id}</p>
                                    </div>
                                </div>
                            }

                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.uuid &&
                                        <button
                                            onClick={()=> {
                                                handleOpenModalConfirmacaoExclusao(values.uuid)
                                                handleCloseModalForm()
                                            }}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            data-testid="btn-excluir-motivo"
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
                                        className={`btn btn-outline-success mt-2 mr-2`}
                                        data-testid="btn-cancelar-formulario"
                                    >
                                        Cancelar
                                    </button>
                                </div>

                                <div className="p-Y bd-highlight">
                                    <button
                                        type="submit"
                                        className="btn btn btn-success mt-2"
                                        disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    >
                                        {stateFormModal.uuid ? "Salvar" : "Adicionar" }
                                    </button>
                                </div>
                            </div>
                        </form>
                    );
                }}
            </Formik>
        )
    }

    return (
        <ModalFormBodyText
            show={stateFormModal.isOpen}
            titulo={`${stateFormModal.uuid ? "Editar motivo" : "Adicionar motivo" }`}
            onHide={handleCloseModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}