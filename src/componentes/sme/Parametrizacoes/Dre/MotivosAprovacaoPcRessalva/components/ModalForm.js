import React, { useContext } from "react";
import { Formik } from "formik";
import { YupSchemaMotivosAprovacaoPcRessalva } from "../YupSchemaMotivosAprovacaoPcRessalva";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {showModalForm, setShowModalForm, stateFormModal, bloquearBtnSalvarForm, setShowModalConfirmacaoExclusao} = useContext(MotivosAprovacaoPcRessalvaContext)
    const { recursos } = useRecursoSelecionadoContext();

    const bodyTextarea = () => {
        return (
            <>
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
                                        <p className='text-right mb-0'><small> * Preenchimento obrigatório</small></p>

                                        <div className='form-group'>
                                            <label htmlFor="recurso">Recurso *</label>
                                            <select
                                                data-qa="input-recurso"
                                                value={values.recurso || ""}
                                                disabled
                                                name="recurso"
                                                id="recurso"
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
                                            {props.touched.recurso && props.errors.recurso && <span className="span_erro text-danger mt-1"> {props.errors.recurso} </span>}
                                        </div>

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
                                <div className='row mt-3'>
                                    { values.id && (
                                        <div className='col-6'>
                                            <p className='mb-2'>ID: {values.id}</p>
                                        </div>
                                    ) }
                                </div>

                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.uuid &&
                                            <button
                                                onClick={()=>setShowModalConfirmacaoExclusao({open: true, uuid: values.uuid})}
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
                                            onClick={()=>setShowModalForm(false)}
                                            type="button"
                                            className={`btn btn-outline-success mt-2 mr-2`}
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
            </>
        )
    }

    return (
        <ModalFormBodyText
            show={showModalForm}
            titulo={`${stateFormModal.uuid ? "Editar motivo" : "Adicionar motivo" }`}
            onHide={setShowModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}