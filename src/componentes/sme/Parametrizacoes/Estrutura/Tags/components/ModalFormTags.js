import React, { memo } from "react";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Formik } from "formik";
import { YupSignupSchemaTags } from "../YupSignupSchemaTags";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado/";
import { useTagsContext } from "../hooks/useTagsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalFormTags = () => {
    const {
        modalForm,
        handleClose,
        handleSubmitFormModal,
        setShowModalConfirmDeleteTag,
    } = useTagsContext();
    
    const { recursos } = useRecursoSelecionadoContext();
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const bodyTextarea = (props) => {
        return (
            <>
                <Formik
                    initialValues={modalForm}
                    validationSchema={YupSignupSchemaTags}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitFormModal}
                >
                    {props => {
                        const {
                            values,
                        } = props;
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p>* Preenchimento obrigatório</p>
                                    </div>

                                    <div className='col-12 mb-2'>
                                        <label htmlFor="recurso">Recurso *</label>
                                        <select
                                            data-qa="input-recurso"
                                            value={values.recurso ? values.recurso.uuid : ""}
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

                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome *</label>
                                            <input
                                                type="text"
                                                value={props.values.nome}
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <label htmlFor="status">Status *</label>
                                        <select
                                            value={props.values.status}
                                            onChange={(e) => {
                                                props.handleChange(e);
                                            }}
                                            name="status"
                                            id="status"
                                            className="form-control"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            <option value='INATIVO'>Inativo</option>
                                            <option value='ATIVO'>Ativo</option>
                                        </select>
                                    </div>
                                </div>
                                { values.id && (
                                    <div className='row mt-3'>
                                        <div className='col'>
                                            <p className='mb-2'>ID: {values.id}</p>
                                        </div>
                                    </div>
                                ) }
                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.operacao === 'edit' ? (
                                            <button 
                                                onClick={() => setShowModalConfirmDeleteTag({ open: true, tag_uuid: values.uuid })} 
                                                type="button" 
                                                className="btn btn btn-danger mt-2 mr-2" 
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            >
                                                <FontAwesomeIcon icon={faXmark} style={{ marginRight: "8px", color: "white", fontWeight: "bold" }} />
                                                Excluir
                                            </button>
                                        ) : null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={() => handleClose()} type="button" className={`btn btn-outline-success mt-2 mr-2`}>Cancelar</button>
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button type="submit" className="btn btn btn-success mt-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>Salvar</button>
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
            show={modalForm.open}
            titulo={modalForm && modalForm.uuid ? 'Editar etiqueta/tag' : 'Adicionar etiqueta/tag'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalFormTags)