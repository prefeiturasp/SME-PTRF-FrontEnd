import React, { useState, useEffect, useContext } from "react";
import { ModalFormParametrizacoesAcertos } from "../../../../../Globais/ModalBootstrap";
import { Select } from 'antd';
import '../../parametrizacoes-prestacao-contas.scss'
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { AcertosDocumentosContext } from "../context/AcertosDocumentos";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const ModalForm = (props) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const { bloquearBtnSalvarForm, stateFormModal, setStateFormModal } = useContext(AcertosDocumentosContext);
    
    const [isEnabled, setIsEnabled] = useState(true);
    const { Option } = Select;

    const { recursos } = useRecursoSelecionadoContext();

    useEffect(() => {
        if (props.stateFormModal.nome.length === 0 || props.stateFormModal.categoria.length === 0 || props.stateFormModal.tipos_documento_prestacao.length === 0) {
            setIsEnabled(true);
        }
        else {
            setIsEnabled(false);
        }
    }, [props.stateFormModal])

    const handleChangeFormModal = (name, value) => {
        setStateFormModal({
            ...stateFormModal,
            [name]: value
        });
    };

    const bodyTextarea = (operacao) => {
        return (
            <>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    props.handleSubmitModalFormDocumentos(props.stateFormModal);
                }}>
                    <div className='form-group col-md-18'>
                        <div className='col-12'>
                            <p className='text-right mb-0'>* Preenchimento obrigatório</p>
                        </div>

                        <div className='mb-3'>
                            <label htmlFor="recurso">Recurso *</label>
                            <select
                                data-qa="input-recurso"
                                value={stateFormModal.recurso ? stateFormModal.recurso : ""}
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
                        </div>

                        <div className='mb-3'>
                            <label htmlFor="nome">Nome do tipo *</label>
                            <input
                                value={props.stateFormModal.nome}
                                name='nome'
                                id="nome"
                                type="text"
                                className="form-control"
                                required={true}
                                onChange={(e) => handleChangeFormModal('nome', e.target.value)}
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="documentos_prestacao">Documentos Prestações *</label>
                            <Select
                                mode="multiple"
                                allowClear
                                name="tipos_documento_prestacao"
                                id="documentos_prestacao"
                                placeholder="Selecione as documentos de prestação"
                                value={props.stateFormModal.tipos_documento_prestacao.map(item => String(item))}
                                onChange={(value) => handleChangeFormModal('tipos_documento_prestacao', value)}
                                className="documentos-table-multiple-search mb-2"
                                required={true}
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            >
                                {props.documentoTabela && props.documentoTabela.length > 0 && props.documentoTabela.map(item => (
                                    <Option key={item.id} value={item.id}>{item.nome}</Option>
                                ))}
                                <Option key={'all'} value='all'>Todos</Option>
                            </Select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="categoria">Categoria *</label>
                            <select
                                value={props.stateFormModal.categoria}
                                onChange={(e) => handleChangeFormModal('categoria', e.target.value)}
                                placeholder="Selecione a categoria"
                                name="categoria"
                                id="categoria"
                                className="categorias-multiple-search form-control"
                                required={true}
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                <option value="">Selecione uma categoria</option>
                                {props.categoriaTabela && props.categoriaTabela.length > 0 && props.categoriaTabela.map(item => (
                                    <option key={item.id} value={item.id}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-3'>
                            <div className="form-check form-check-inline">
                                <p className='mt-3 mb-0 mr-4 pr-4 font-weight-normal'>
                                    Tipo de acerto pode alterar o saldo em conciliação bancária?
                                </p>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="pode_alterar_saldo_conciliacao"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="pode_alterar_saldo_conciliacao_sim"
                                    value="True"
                                    checked={props.stateFormModal.pode_alterar_saldo_conciliacao}
                                    onChange={() => handleChangeFormModal('pode_alterar_saldo_conciliacao', true)}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                />
                                <label className="form-check-label font-weight-bold" htmlFor="pode_alterar_saldo_conciliacao_sim">Sim</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="pode_alterar_saldo_conciliacao"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="pode_alterar_saldo_conciliacao_nao"
                                    value="False"
                                    checked={!props.stateFormModal.pode_alterar_saldo_conciliacao}
                                    onChange={() => handleChangeFormModal('pode_alterar_saldo_conciliacao', false)}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                />
                                <label className="form-check-label font-weight-bold" htmlFor="pode_alterar_saldo_conciliacao_nao">Não</label>
                            </div>
                        </div>

                        <div className='mb-3'>
                            <p className='mt-3 mb-2 font-weight-normal'>Ativo? *</p>
                            <div>
                                <div className="form-check form-check-inline">
                                    <input
                                        name="ativo"
                                        className={`form-check-input`}
                                        type="radio"
                                        id="ativo-sim"
                                        value="True"
                                        checked={props.stateFormModal.ativo}
                                        onChange={() => handleChangeFormModal('ativo', true)}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                    <label className="form-check-label font-weight-bold" htmlFor="ativo-sim">Sim</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        name="ativo"
                                        className={`form-check-input`}
                                        type="radio"
                                        id="ativo-nao"
                                        value="False"
                                        checked={!props.stateFormModal.ativo}
                                        onChange={() => handleChangeFormModal('ativo', false)}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                    <label className="form-check-label font-weight-bold" htmlFor="ativo-nao">Não</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {props.stateFormModal.operacao === 'edit' && (
                        <>
                            <div className='row mt-3'>
                                <div className='col'>
                                    <p>ID</p>
                                    <p>{props.stateFormModal?.id}</p>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="d-flex bd-highlight mt-2">
                        <div className="p-Y flex-grow-1 bd-highlight">
                            {props.stateFormModal && props.stateFormModal.operacao === 'edit' &&
                            <button 
                              onClick={props.handleShowModalExcluir} 
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
                            <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                        </div>
                        <div className="p-Y bd-highlight">
                            <button
                                id="btn-documento-submit"
                                onClick={() => {props.handleSubmitModalFormDocumentos(props.stateFormModal)}}
                                type="button"
                                disabled={isEnabled || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                className="btn btn btn-success mt-2">
                                Salvar
                            </button>
                        </div>
                    </div>
                </form>
            </>
        );
    };

    return (
        <ModalFormParametrizacoesAcertos
            show={props.show}
            titulo={props.stateFormModal.operacao === 'create' ? 'Adicionar tipo de acerto em documento' : 'Editar tipo de acerto em documento'}
            onHide={props.handleClose}
            bodyText={bodyTextarea(props.stateFormModal.operacao)}
            primeiroBotaoOnclick={props.handleClose}
        />
    );
};
