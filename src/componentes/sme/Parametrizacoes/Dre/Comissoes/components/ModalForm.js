import React from "react";
import { Formik } from "formik";
import { Select } from "antd";
import "../../../../../../componentes/dres/Diretoria/Comissoes/Modais/multiselect.scss";
import { YupSchemaComissoes } from "../YupSchemaComissoes"; 
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Tooltip as ReactTooltip } from "react-tooltip";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { useComissoesContext } from "../hooks/useComissoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "antd";

export const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const { stateFormModal, bloquearBtnSalvarForm, handleOpenModalConfirmacaoExclusao, handleCloseModalForm} = useComissoesContext();
    const { recursos } = useRecursoSelecionadoContext()

    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={YupSchemaComissoes}
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
                            <p>{ console.log('values modal', values) }</p>
                            <div className='row'>
                                <div className='col-12'>
                                    <p className='text-right mb-2'><strong>* Preenchimento obrigatório</strong></p>
                                </div>

                                <div className='col-12'>
                                    <p>Preencha os dados da nova comissão.</p>
                                </div>     

                                <div className='col-12'>
                                    <div className="form-group">
                                        <span
                                            data-tooltip-id="tooltip-id-nome"
                                            data-tooltip-content="Preencher com o nome da comissão">
                                            <label htmlFor="comissao_nome">Comissão *</label>
                                            <ReactTooltip id="tooltip-id-nome"/>
                                        </span>

                                        <input
                                            type="text"
                                            maxLength={160}
                                            value={values.nome || ''}
                                            name="nome"
                                            id="nome"
                                            className="form-control"
                                            onChange={(e) => setFieldValue('nome', e.target.value)}
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                        {props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome}</span>}
                                    </div>
                                </div>

                                <div className='col-12 mb-2'>
                                    <label htmlFor="recursos_vinculados">Recursos *</label>
                                    <Select
                                        value={values.recursos || []}
                                        onChange={(value) => setFieldValue('recursos', value)}
                                        options={recursos?.map(r => ({ label: r.nome_exibicao, value: r.uuid }))}
                                        mode="multiple"
                                        id="recursos"
                                        placeholder="Selecione um ou mais recursos"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        style={{ width: '100%' }}
                                        data-qa="input-recursos"
                                    />
                                    <small className="text-muted d-block mt-2">
                                        Se necessário, selecione mais de uma opção.
                                    </small>
                                    {props.touched.recursos && props.errors.recursos && <span className="span_erro text-danger mt-1"> {props.errors.recursos} </span>}
                                </div>

                                <div className='col-12 mt-4 mb-2'>
                                    <div className="form-group d-flex align-items-start justify-content-between">
                                        <div className="flex-grow-1">
                                            <strong className="mb-2">Responsável pela análise de prestação de contas?</strong>
                                            <p className="text-muted mb-0" style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
                                                Apenas uma comissão pode ser responsável pela análise de prestação de contas de 
                                                cada recurso.
                                            </p>
                                        </div>
                                        <div className="ml-3 mt-1">
                                            <Switch 
                                                checked={ props.values.responsavel_analise_pc }
                                                onChange={(checked) => props.setFieldValue('responsavel_analise_pc', checked)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                style={{ marginTop: '1.5rem' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                values?.id &&
                                <div className='row mt-3'>
                                    <div className='col-6'>
                                        <p className='mb-2'>ID: {values?.id}</p>
                                    </div>
                                </div>
                            }

                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values?.uuid &&
                                        <button
                                            onClick={()=> {
                                                handleOpenModalConfirmacaoExclusao(values?.uuid)
                                                // handleCloseModalForm()
                                            }}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            data-testid="btn-excluir-detalhe-tipo-credito"
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
            titulo={`${stateFormModal.uuid ? "Editar comissão" : "Adicionar comissão" }`}
            onHide={handleCloseModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}