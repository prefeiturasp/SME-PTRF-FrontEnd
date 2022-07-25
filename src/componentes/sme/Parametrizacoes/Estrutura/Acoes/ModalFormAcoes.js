import React from "react";
import {ModalFormParametrizacoesAcoes} from "../../../../Globais/ModalBootstrap";

export const ModalFormAcoes = (props) => {

    const bodyTextarea = () => {

        return (
            <>
                <form onSubmit={props.handleSubmitModalFormAcoes}>


                    <div className='row mt-3'>

                        <div className='col'>
                            <label htmlFor="nome">Nome da ação</label>
                            <input
                                value={props.stateFormModal.nome}
                                name='nome'
                                id="nome"
                                type="text"
                                className="form-control"
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                            />
                        </div>

                        <div className='col'>
                            <label htmlFor="posicao_nas_pesquisas">Posição nas pesquisas</label>
                            <input
                                value={props.stateFormModal.posicao_nas_pesquisas}
                                name='posicao_nas_pesquisas'
                                id="posicao_nas_pesquisas"
                                type="text"
                                className="form-control"
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                maxLength={10}
                            />
                        </div>


                        <div className='col' style={{top: 40, left: 20}}>
                            <input
                                checked={props.stateFormModal.e_recursos_proprios}
                                type="checkbox"
                                name="e_recursos_proprios"
                                id="e_recursos_proprios"
                                className="form-check-input"
                                defaultChecked={false}
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.checked)}
                            />
                            <label className="form-check-label marcar-como-lida" htmlFor="e_recursos_proprios">recursos externos</label>
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


                    <div className="d-flex bd-highlight mt-2">
                        <div className="p-Y flex-grow-1 bd-highlight">
                            {props.stateFormModal && props.stateFormModal.operacao === 'edit' &&
                            <button onClick={props.serviceCrudAcoes} type="button" className="btn btn btn-danger mt-2 mr-2">
                                Apagar
                            </button>
                            }
                        </div>
                        <div className="p-Y bd-highlight">
                            <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                        </div>
                        <div className="p-Y bd-highlight">
                            <button
                                disabled={props.readOnly || !props.stateFormModal.nome}
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
        <ModalFormParametrizacoesAcoes
            show={props.show}
            titulo={props.stateFormModal && props.stateFormModal.operacao === 'edit' ? 'Editar ação' : 'Adicionar ação'}
            onHide={props.handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};