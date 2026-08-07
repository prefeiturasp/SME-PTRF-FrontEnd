import React from "react";
import { Formik } from "formik";
import { YupSchemaFiqueDeOlho } from "../YupSchemaFiqueDeOlho";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { useFiqueDeOlhoContext } from "../hooks/useFiqueDeOlhoContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import EditorWysiwyg from "../../../../../Globais/EditorWysiwyg";

export const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const { stateFormModal, bloquearBtnSalvarForm, handleCloseModalForm, dataTabelaFiqueDeOlho } = useFiqueDeOlhoContext();
    const { recursos } = useRecursoSelecionadoContext()

    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={YupSchemaFiqueDeOlho}
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

                                <div className='col-12 mb-2'>
                                    <label htmlFor="tipo_texto">Tipo de Texto *</label>
                                    <select
                                        data-qa="input-form-tipo-texto"
                                        value={values.tipo_texto ? values.tipo_texto : ""}
                                        onChange={(e) => setFieldValue(e.target.name, e.target.value)}
                                        className="form-control"
                                        name="tipo_texto"
                                        id="tipo_texto"
                                        required
                                    >
                                        <option data-qa="option-recurso-vazio" value=''>Selecione um tipo de texto</option>
                                        {
                                            dataTabelaFiqueDeOlho?.tipos_de_texto?.map((tipo) =>
                                                <option
                                                    data-qa={`option-form-tipo-texto-${tipo[0]}`}
                                                    key={tipo[0]}
                                                    value={tipo[0]}
                                                >
                                                    {tipo[1]}
                                                </option>
                                            )
                                        }
                                    </select>
                                    {props.touched.recurso_uuid && props.errors.recurso_uuid && <span className="span_erro text-danger mt-1"> {props.errors.recurso_uuid} </span>}
                                </div>

                                <div className='col-12'>
                                    <div className="form-group">
                                        <label htmlFor="motivo">Texto *</label>

                                        <EditorWysiwyg
                                            textoInicialEditor={values.texto}
                                            handleChange={(e) => setFieldValue("texto", e)}
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            name="texto"
                                            id="texto"
                                            showButtonsCancelAndSave={false}
                                            height={300}
                                        />
                                        {props.errors.texto && <span className="span_erro text-danger mt-1"> {props.errors.texto}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center justify-content-between">
                                <p className='mb-0'>
                                    {
                                        values.id && `ID: ${values.id}`
                                    }
                                </p>

                                <div className="d-flex bd-highlight">
                                    <div className="bd-highlight">
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
                                            data-testid="btn-salvar-formulario-fique-de-olho"
                                        >
                                            Salvar
                                        </button>
                                    </div>
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
            titulo={`${stateFormModal.uuid ? "Editar texto do fique de olho" : "Adicionar texto do fique de olho" }`}
            onHide={handleCloseModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}
