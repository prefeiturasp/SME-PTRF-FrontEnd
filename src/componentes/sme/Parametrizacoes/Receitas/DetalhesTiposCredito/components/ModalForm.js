import React from "react";
import { Formik } from "formik";
import { YupSchemaDetalheTipoCredito } from "../YupSchemaDetalheTipoCredito";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { useDetalhesTiposCreditoContext } from "../hooks/useDetalhesTiposCreditoContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { useGetTiposCreditoQuePossuemDetalhamento } from "../../TiposDeCredito/hooks/useGetTiposCredito";

export const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const { stateFormModal, bloquearBtnSalvarForm, handleOpenModalConfirmacaoExclusao, handleCloseModalForm} = useDetalhesTiposCreditoContext();
    const { recursos } = useRecursoSelecionadoContext()
    const { results: tiposDeCredito } = useGetTiposCreditoQuePossuemDetalhamento({ recurso_uuid: stateFormModal.recurso_uuid })

    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={YupSchemaDetalheTipoCredito}
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
                                            data-tooltip-id="tooltip-id-nome"
                                            data-tooltip-content="Preencher com um detalhe de tipo de crédito">
                                            <label htmlFor="nome">Nome *</label>
                                            <ReactTooltip id="tooltip-id-nome"/>
                                        </span>

                                        <input
                                            type="text"
                                            maxLength={160}
                                            value={values.nome}
                                            name="nome"
                                            id="nome"
                                            className="form-control"
                                            onChange={props.handleChange}
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                        {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                    </div>
                                </div>

                                <div className='col-12'>
                                    <div className="form-group">
                                        <span
                                            data-tooltip-id="tooltip-id-tipo-credito"
                                            data-tooltip-content="Selecione o tipo de crédito disponível para o recurso">
                                            <label htmlFor="tipo_receita">Tipo de crédito *</label>
                                            <ReactTooltip id="tooltip-id-tipo-credito"/>
                                        </span>

                                        <select
                                            name="tipo_receita"
                                            id="tipo_receita"
                                            value={values.tipo_receita ? values.tipo_receita : ""}
                                            className="form-control"
                                            onChange={props.handleChange}
                                            disabled={ values.uuid && !values.can_edit_tipo_receita }
                                        >
                                            <option value="">Selecione um tipo de crédito</option>
                                            {tiposDeCredito?.map((tipo) =>
                                                <option key={tipo.uuid} value={tipo.uuid}>
                                                    {tipo.nome}
                                                </option>
                                            )}
                                        </select>
                                        {props.errors.tipo_receita && <span className="span_erro text-danger mt-1"> {props.errors.tipo_receita}</span>}
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
                                            data-testid="btn-excluir-detalhe-tipo-credito"
                                        >
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
            titulo={`${stateFormModal.uuid ? "Editar detalhe" : "Adicionar detalhe" }`}
            onHide={handleCloseModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}