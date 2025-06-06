import React from "react";
import {ModalFormParametrizacoesAcoesDaAssociacao} from "../../../../Globais/ModalBootstrap";
import AutoCompleteAssociacoes from "./AutoCompleteAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import Spinner from "../../../../../assets/img/spinner.gif"

export const ModalFormAcoesDaAssociacao = (props) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const bodyTextarea = () => {
        return (
            <>
                <form onSubmit={props.handleSubmitModalFormAcoes}>
                    <div className="row">
                        <div className='col-12'>
                            <p>* Preenchimento obrigatório</p>
                        </div>
                    </div>
                    {props.stateFormModal && props.stateFormModal.operacao === 'edit' ? (
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="cod_eol">Unidade Educacional *</label>
                                <input
                                    data-qa="campo-unidade-educacional"
                                    value={props.stateFormModal.nome_unidade}
                                    name='nome_unidade'
                                    id="nome_unidade"
                                    type="text"
                                    className="form-control"
                                    readOnly={true}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                />
                            </div>
                        </div>
                    ) :
                        <>
                            <label htmlFor="selectedAcao">Unidade Educacional *{props.loadingAssociacoes && <img alt="" src={Spinner} style={{height: "22px"}}/>}</label>
                            <AutoCompleteAssociacoes
                                todasAsAcoesAutoComplete={props.todasAsAcoesAutoComplete}
                                recebeAcaoAutoComplete={props.recebeAcaoAutoComplete}
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                loadingAssociacoes={props.loadingAssociacoes}
                            />
                        </>
                    }

                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="cod_eol">Código EOL *</label>
                            <input
                                data-qa="campo-codigo-eol"
                                value={props.stateFormModal.codigo_eol}
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
                                value={props.stateFormModal.acao}
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                name='acao'
                                id="acao"
                                className="form-control"
                                disabled={props.readOnly || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            >
                                <option value=''>Selecione ação</option>
                                {props.listaTiposDeAcao && props.listaTiposDeAcao.length > 0 && props.listaTiposDeAcao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className='col'>
                            <label htmlFor="status">Status *</label>
                            <select
                                data-qa="campo-status"
                                value={props.stateFormModal.status}
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                name='status'
                                id="status"
                                className="form-control"
                                disabled={props.readOnly || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            >
                                <option value=''>Selecione o status</option>
                                <option value='ATIVA'>Ativa</option>
                                <option value='INATIVA'>Inativa</option>
                            </select>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col'>
                            <p>ID</p>
                            <p>{props.stateFormModal.id}</p>
                        </div>
                    </div>

                    <div className="d-flex bd-highlight mt-2">
                        <div className="p-Y flex-grow-1 bd-highlight">
                            {props.stateFormModal && props.stateFormModal.operacao === 'edit' &&
                            <button
                                data-qa="botao-apagar-acao-edicao"
                                onClick={()=>props.setShowModalDeleteAcao(true)}
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
                                onClick={props.handleClose}
                                type="reset"
                                className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                        </div>
                        <div className="p-Y bd-highlight">
                            <button
                                data-qa="botao-salvar-acao-edicao"
                                disabled={props.readOnly || !props.stateFormModal.acao || !props.stateFormModal.status || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                onClick={()=>props.handleSubmitModalFormAcoes(props.stateFormModal)}
                                type="button"
                                className="btn btn btn-success mt-2"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </form>
            </>
        )
    };

    return (
        <ModalFormParametrizacoesAcoesDaAssociacao
            show={props.show}
            titulo={props.stateFormModal && props.stateFormModal.operacao === 'edit' ? 'Editar ação de associação' : 'Adicionar ação de associação'}
            onHide={props.handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};