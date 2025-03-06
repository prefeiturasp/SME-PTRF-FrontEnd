import React, { useContext } from "react";
import { Formik } from "formik";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGetTabelas } from "../hooks/useGetTabelas";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { YupSchema } from "../YupSchema";

export const ModalForm = ({handleSubmitFormModal}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {showModalForm, setShowModalForm, stateFormModal, bloquearBtnSalvarForm, setShowModalConfirmacaoExclusao, setStateFormModal} = useContext(MateriaisServicosContext)
    const { data: tabelas } = useGetTabelas();

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSchema}
                    enableReinitialize={true}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={handleSubmitFormModal}>

                    {props => {
                        const { values, setFieldValue } = props;
                        // Tipo do custeio exibe habilitado para seleção única se Aplicação de recurso for selecionado a opção de Custeio 
                        // Tipo de custeio exibe desabilitado para seleção se for selecionada a opção de Capital no campo Tipo de aplicação do recurso
                        const bloqueiaTipoCusteio = values.aplicacao_recurso === 'CAPITAL' ? true : false;

                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className="form-row">
                                    <div className='form-group col-md-12'>
                                        <p className='text-right mb-0'>* Preenchimento obrigatório</p>
                                        <label htmlFor="descricao">Descrição *</label>
                                        <input
                                            maxLength={150}
                                            value={values.descricao}
                                            onChange={props.handleChange}
                                            name='descricao'
                                            id="descricao"
                                            type="text"
                                            className="form-control"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        />
                                        {props.touched.descricao && props.errors.descricao && <span className="span_erro text-danger mt-1"> {props.errors.descricao}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="aplicacao_recurso">Tipo de aplicação do recurso *</label>
                                        <select
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            value={values.aplicacao_recurso}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                                setFieldValue(e.target.name, e.target.value);
                                                e.target.value === 'CAPITAL' && setFieldValue("tipo_custeio", '')
                                            }}
                                            name="aplicacao_recurso"
                                            id="aplicacao_recurso"
                                            className="form-control">

                                            <option value="">Selecione</option>
                                            {tabelas && tabelas.aplicacao_recursos && tabelas.aplicacao_recursos.map((aplicacao_recurso)=>
                                                <option key={aplicacao_recurso.id} value={aplicacao_recurso.id}>{aplicacao_recurso.nome}</option>
                                            )}

                                        </select>
                                        {props.touched.aplicacao_recurso && props.errors.aplicacao_recurso && <span className="span_erro text-danger mt-1"> {props.errors.aplicacao_recurso}</span>}
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="tipo_custeio">Tipo de despesa de custeio {!bloqueiaTipoCusteio && '*'}</label>
                                        <select
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES || bloqueiaTipoCusteio}
                                            value={values.tipo_custeio}
                                            onChange={props.handleChange}
                                            name="tipo_custeio"
                                            id="tipo_custeio"
                                            className="form-control">

                                            <option value="">Selecione</option>
                                            {tabelas && tabelas.tipos_custeio && tabelas.tipos_custeio.map((tipo_custeio)=>
                                                <option key={tipo_custeio.id} value={tipo_custeio.id}>{tipo_custeio.nome}</option>
                                            )}
                                        </select>
                                        {   !bloqueiaTipoCusteio &&
                                            props.touched.tipo_custeio &&
                                            props.errors.tipo_custeio &&
                                            <span className="span_erro text-danger mt-1">
                                                { props.errors.tipo_custeio }
                                            </span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <p className="mb-0">Está ativa?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                name="ativa_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="ativa_true"
                                                value="True"
                                                checked={values.ativa === true}
                                                onChange={() => setFieldValue("ativa", true)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label className="form-check-label" htmlFor="ativa_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                name="ativa_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="ativa_false"
                                                value="False"
                                                checked={values.ativa === false}
                                                onChange={() => setFieldValue("ativa", false)}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            <label className="form-check-label" htmlFor="ativa_false">Não</label>
                                        </div>
                                    </div>
                                </div>

                                {stateFormModal.id &&
                                    <div className="form-row">
                                        <div className="form-group col-md-12">
                                            <p className="mb-0">ID: <span>{values.id}</span></p>
                                        </div>
                                    </div>
                                }

                                <div className="form-row">
                                    <div className="from-group col-md-12">
                                        <div className="d-flex bd-highlight justify-content-end">
                                            <div className="p-Y flex-grow-1 bd-highlight">
                                                {stateFormModal.uuid &&
                                                    <button
                                                        onClick={()=>setShowModalConfirmacaoExclusao(true)}
                                                        type="button"
                                                        className="btn btn btn-danger mt-2 mr-2"
                                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                        Excluir
                                                    </button>
                                                }
                                            </div>

                                            <button 
                                                onClick={()=>setShowModalForm(false)}
                                                type="button" 
                                                className="btn btn-outline-success mt-2 mr-2">
                                                Cancelar
                                            </button>

                                            <button 
                                                type="submit"
                                                className="btn btn-success mt-2"
                                                disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                {stateFormModal.uuid ? "Salvar" : "Adicionar" }
                                            </button>
                                        </div>
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
            titulo={`${stateFormModal.uuid ? `Editar` : `Adicionar` } especificação de materiais e serviços`}
            onHide={setShowModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
}
