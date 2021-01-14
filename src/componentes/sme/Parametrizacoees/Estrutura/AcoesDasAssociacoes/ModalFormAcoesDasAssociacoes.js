import React from "react";
import {ModalFormParametrizacoesAcoesDaAssociacao} from "../../../../Globais/ModalBootstrap";
import AutoCompleteAssociacoes from "./AutoCompleteAssociacoes";
export const ModalFormAcoesDaAssociacao = (props) => {

    const bodyTextarea = () => {
        return (
            <>
                <form onSubmit={props.handleSubmitModalFormAcoesDasAssociacoes}>
                    {props.stateFormModal && props.stateFormModal.operacao === 'edit' ? (
                        <div className='row'>
                            <div className='col'>
                                <label htmlFor="cod_eol">Unidade Educacional</label>
                                <input
                                    value={props.stateFormModal.nome_unidade}
                                    name='nome_unidade'
                                    id="nome_unidade"
                                    type="text"
                                    className="form-control"
                                    readOnly={true}
                                />
                            </div>
                        </div>
                    ) :
                        <>
                            <label htmlFor="selectedAcao">Unidade Educacional</label>
                            <AutoCompleteAssociacoes
                                todasAsAcoesAutoComplete={props.todasAsAcoesAutoComplete}
                                recebeAcaoAutoComplete={props.recebeAcaoAutoComplete}
                            />
                        </>
                    }

                    <div className='row mt-3'>
                        <div className='col'>
                            <label htmlFor="cod_eol">Código EOL</label>
                            <input
                                value={props.stateFormModal.codigo_eol}
                                name='cod_eol'
                                id="cod_eol"
                                type="text"
                                className="form-control"
                                readOnly={true}
                            />
                        </div>

                        <div className='col'>
                            <label htmlFor="acao">Ação</label>
                            <select
                                value={props.stateFormModal.acao}
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                name='acao'
                                id="acao"
                                className="form-control"
                                disabled={props.readOnly}
                            >
                                <option value=''>Selecione ação</option>
                                {props.listaTiposDeAcao && props.listaTiposDeAcao.length > 0 && props.listaTiposDeAcao.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>

                        <div className='col'>
                            <label htmlFor="status">Status</label>
                            <select
                                value={props.stateFormModal.status}
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                name='status'
                                id="status"
                                className="form-control"
                                disabled={props.readOnly}
                            >
                                <option value=''>Selecione o status</option>
                                <option value='ATIVA'>Ativa</option>
                                <option value='INATIVA'>Inativa</option>
                            </select>
                        </div>
                    </div>

                    <div className='row mt-3'>
                        <div className='col'>
                            <p>Uuid</p>
                            <p>{props.stateFormModal.uuid}</p>
                        </div>
                        <div className='col'>
                            <p>ID</p>
                            <p>{props.stateFormModal.id}</p>
                        </div>
                    </div>

                    <div className="p-Y bd-highlight">
                        <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                        <button
                            disabled={props.readOnly || !props.stateFormModal.acao || !props.stateFormModal.status}
                            onClick={()=>props.handleSubmitModalFormAcoesDasAssociacoes(props.stateFormModal)}
                            type="button"
                            className="btn btn btn-success mt-2"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </>
        )
    };

    return (
        <ModalFormParametrizacoesAcoesDaAssociacao
            show={props.show}
            titulo='Adicionar ação de associação'
            onHide={props.handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};