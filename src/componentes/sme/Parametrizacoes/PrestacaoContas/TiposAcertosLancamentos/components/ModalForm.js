import React, { useState, useEffect, useContext } from "react";
import { ModalFormParametrizacoesAcertos } from "../../../../../Globais/ModalBootstrap";
import '../../parametrizacoes-prestacao-contas.scss'
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export const ModalForm = ({ show, handleClose, handleSubmit, categoriaTabela, onDelete }) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const { stateFormModal, setStateFormModal, bloquearBtnSalvarForm } = useContext(AcertosLancamentosContext);
    
    const [isEnabled, setIsEnabled] = useState(true);

    const { recursos } = useRecursoSelecionadoContext();

    useEffect(() => {
        if (stateFormModal.nome.length === 0 || stateFormModal.categoria.length === 0) {
            setIsEnabled(true);
        }
        else {
            setIsEnabled(false);
        }
    }, [stateFormModal])

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
                    handleSubmit(stateFormModal);
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
                                value={stateFormModal.nome}
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
                            <label htmlFor="categoria">Categoria *</label>
                            <select value={stateFormModal.categoria}
                                    onChange={(e) => handleChangeFormModal('categoria', e.target.value)}
                                    name="categoria"
                                    id="categoria"
                                    className="form-control"
                                    required={true}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categoriaTabela && categoriaTabela.length > 0 && categoriaTabela.map(item => (
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
                                    checked={stateFormModal.pode_alterar_saldo_conciliacao}
                                    onChange={() => handleChangeFormModal('pode_alterar_saldo_conciliacao', true)}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                />
                                <label className="form-check-label font-weight-bold"
                                       htmlFor="pode_alterar_saldo_conciliacao_sim">Sim</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="pode_alterar_saldo_conciliacao"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="pode_alterar_saldo_conciliacao_nao"
                                    value="False"
                                    checked={!stateFormModal.pode_alterar_saldo_conciliacao}
                                    onChange={() => handleChangeFormModal('pode_alterar_saldo_conciliacao', false)}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                />
                                <label className="form-check-label font-weight-bold"
                                       htmlFor="pode_alterar_saldo_conciliacao_nao">Não</label>
                            </div>
                        </div>

                        <div className='mb-3'>
                            <div className="form-check form-check-inline">
                                <p className='mt-3 mb-0 mr-4 pr-4 font-weight-normal'>Ativo?</p>
                            </div>
                            <div>

                                <div className="form-check form-check-inline">
                                    <input
                                        name="ativo"
                                        className={`form-check-input`}
                                        type="radio"
                                        id="ativo-sim"
                                        value="True"
                                        checked={stateFormModal.ativo}
                                        onChange={() => handleChangeFormModal('ativo', true)}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                    <label className="form-check-label font-weight-bold"
                                           htmlFor="ativo-sim">Sim</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        name="ativo"
                                        className={`form-check-input`}
                                        type="radio"
                                        id="ativo-nao"
                                        value="False"
                                        checked={!stateFormModal.ativo}
                                        onChange={() => handleChangeFormModal('ativo', false)}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                    <label className="form-check-label font-weight-bold"
                                           htmlFor="ativo-nao">Não</label>
                                </div>
                            </div>

                        </div>

                        <div className="d-flex bd-highlight mt-2">
                            <div className="p-Y flex-grow-1 bd-highlight">
                                {stateFormModal && stateFormModal.operacao === 'edit' &&
                                <button 
                                  onClick={onDelete} 
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
                                <button onClick={handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            </div>
                            <div className="p-Y bd-highlight">
                                <button
                                    id="btn-lancamento-submit"
                                    onClick={() => {handleSubmit(stateFormModal)}}
                                    type="button"
                                    disabled={isEnabled || bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    className="btn btn btn-success mt-2">
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </>
        );
    };

    return (
        <ModalFormParametrizacoesAcertos
            show={show}
            titulo={stateFormModal.operacao === 'create' ? 'Adicionar tipo de acerto em lançamento' : 'Editar tipo de acerto em lançamento'}
            onHide={handleClose}
            bodyText={bodyTextarea(stateFormModal.operacao)}
        />
    )
}
