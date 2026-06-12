import React from "react";
import {ModalFormParametrizacoesAcoesDaAssociacao} from "../../../../Globais/ModalBootstrap";
import AutoCompleteAssociacoes from "./AutoCompleteAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import Spinner from "../../../../../assets/img/spinner.gif"
import { useAcoesDasAssociacoesContext } from "./hooks/useAcoesDasAssociacoesContext";
import { useRecursoSelecionadoContext } from "../../../../../context/RecursoSelecionado";

export const ModalFormAcoesDaAssociacao = (props) => {
    const { recursos } = useRecursoSelecionadoContext()
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const {
        stateFormModal,
        isLoadingAssociacoes,
        todasAsAcoesAutoComplete,
        isOpenModalForm,
        listaTiposDeAcao,
        formReadOnly,

        handleCloseModalForm,
        handleChangeFormModal,
        handleSubmitModalFormAcoesDasAssociacoes,
        handleOpenConfirmDelete,

        recebeAcaoAutoComplete,
    } = useAcoesDasAssociacoesContext();

    const bodyTextarea = () => {
        return (
                <form onSubmit={handleSubmitModalFormAcoesDasAssociacoes} id="form-modal-acao-associacao">
                    <div className="row">
                        <div className='col-12'>
                            <p>* Preenchimento obrigatório</p>
                        </div>
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

                    {stateFormModal?.operacao === 'edit' ? (
                        <div>
                            <label htmlFor="cod_eol">Unidade Educacional *</label>
                            <input
                                data-qa="campo-unidade-educacional"
                                value={stateFormModal.nome_unidade}
                                name='nome_unidade'
                                id="nome_unidade"
                                type="text"
                                className="form-control"
                                readOnly={true}
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            />
                        </div>
                    ) :
                        <div>
                            <label htmlFor="selectedAcao">Unidade Educacional *{isLoadingAssociacoes && <img alt="" src={Spinner} style={{height: "22px"}}/>}</label>
                            
                            <div className="ml-3">
                                <AutoCompleteAssociacoes
                                    todasAsAcoesAutoComplete={todasAsAcoesAutoComplete}
                                    recebeAcaoAutoComplete={recebeAcaoAutoComplete}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    loadingAssociacoes={isLoadingAssociacoes}
                                />
                            </div>
                        </div>
                    }

                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="cod_eol">Código EOL *</label>
                            <input
                                data-qa="campo-codigo-eol"
                                value={stateFormModal.codigo_eol}
                                name='cod_eol'
                                id="cod_eol"
                                type="text"
                                className="form-control"
                                readOnly={true}
                            />
                        </div>

                        <div className='col'>
                            <label htmlFor="acao">Ação *</label>
                            <select
                                data-qa="campo-acao"
                                value={stateFormModal.acao}
                                onChange={(e) => handleChangeFormModal(e.target.name, e.target.value)}
                                name='acao'
                                id="acao"
                                className="form-control"
                                disabled={formReadOnly || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            >
                                <option value=''>Selecione ação</option>
                                {listaTiposDeAcao && listaTiposDeAcao?.length > 0 && listaTiposDeAcao?.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className='col'>
                            <label htmlFor="status">Status *</label>
                            <select
                                data-qa="campo-status"
                                value={stateFormModal.status}
                                onChange={(e) => handleChangeFormModal(e.target.name, e.target.value)}
                                name='status'
                                id="status"
                                className="form-control"
                                disabled={formReadOnly || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            >
                                <option value=''>Selecione o status</option>
                                <option value='ATIVA'>Ativa</option>
                                <option value='INATIVA'>Inativa</option>
                            </select>
                        </div>
                    </div>

                    {
                        stateFormModal?.id && (
                            <div className='row mt-3'>
                                <div className='col'>
                                    <p>ID: {stateFormModal.id}</p>
                                </div>
                            </div>
                        )
                    }

                    <div className="d-flex bd-highlight mt-2">
                        <div className="p-Y flex-grow-1 bd-highlight">
                            {stateFormModal?.operacao === 'edit' &&
                            <button
                                data-qa="botao-apagar-acao-edicao"
                                onClick={handleOpenConfirmDelete}
                                type="button"
                                className="btn btn btn-danger mt-2 mr-2 botao-excluir-acao"
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                Excluir
                            </button>
                            }
                        </div>

                        <div className="p-Y bd-highlight">
                            <button
                                data-qa="botao-cancelar-acao-edicao"
                                onClick={handleCloseModalForm}
                                type="reset"
                                className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                        </div>

                        <div className="p-Y bd-highlight">
                            <button
                                data-qa="botao-salvar-acao-edicao"
                                disabled={formReadOnly || !stateFormModal.acao || !stateFormModal.status || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                type="submit"
                                form="form-modal-acao-associacao"
                                className="btn btn btn-success mt-2"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </form>
        )
    };

    return (
        <ModalFormParametrizacoesAcoesDaAssociacao
            show={isOpenModalForm}
            titulo={stateFormModal?.operacao === 'edit' ? 'Editar ação de associação' : 'Adicionar ação de associação'}
            onHide={handleCloseModalForm}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={handleCloseModalForm}
        />
    )
};