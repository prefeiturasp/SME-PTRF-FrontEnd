import React from "react";
import {ModalFormParametrizacoesAcertos} from "../../../../Globais/ModalBootstrap";

export const ModalFormLancamentos = (props) => {

    const bodyTextarea = (operacao) => {

        return (
            <>
                <form onSubmit={props.handleSubmitModalFormLancamentos}>


                    <div className='row'>

                    <div className='col-12'>
                            <label htmlFor="nome">Nome do tipo</label>
                            <input
                                value={props.stateFormModal.nome}
                                name='nome'
                                id="nome"
                                type="text"
                                className="form-control"
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                            />
                        </div>
                    <div className='col-12'>
                            <label htmlFor="categoria">Categoria</label>
                            <input
                                value={props.stateFormModal.categoria}
                                name='categoria'
                                id="categoria"
                                type="text"
                                className="form-control"
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                            />
                        </div>

                        <div className='col-8'>
                            <div className="form-check form-check-inline">
                                <p className='mt-3 mb-0 mr-4 pr-4 font-weight-normal'>Reabre lançamentos para edição?</p>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="reabertura-lancamentos"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="reabertura-lancamentos"
                                    value={true}
                                />
                                <label className="form-check-label font-weight-bold" htmlFor="reabertura-lancamentos">Sim</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="reabertura-lancamentos"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="reabertura-lancamentos"
                                    value={false}
                                />
                                <label className="form-check-label font-weight-bold" htmlFor="reabertura-lancamentos">Não</label>
                            </div>
                        </div>
                    </div>
                    {operacao === 'edit' ? (
                        <><div className='row mt-3'>   
                        <div className='col'>
                            <p>Uuid</p>
                            <p>{props.stateFormModal.uuid}</p>
                        </div>
                        <div className='col'>
                            <p>ID</p>
                            <p>{props.stateFormModal.id}</p>
                        </div>
                    </div>
</>): null}


                    <div className="d-flex bd-highlight mt-2">
                        <div className="p-Y flex-grow-1 bd-highlight">
                            {props.stateFormModal && props.stateFormModal.operacao === 'edit' &&
                            <button onClick={props.serviceCrudLancamentos} type="button" className="btn btn btn-danger mt-2 mr-2">
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
                                onClick={()=>props.handleSubmitModalFormLancamentos(props.stateFormModal)}
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
        <ModalFormParametrizacoesAcertos
            show={props.show}
            titulo={props.stateFormModal && props.stateFormModal.operacao === 'edit' ? 'Editar tipo de acerto - lançamentos ' : 'Adicionar tipo de acerto - lançamentos '}
            onHide={props.handleClose}
            bodyText={bodyTextarea(props.stateFormModal.operacao)}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};