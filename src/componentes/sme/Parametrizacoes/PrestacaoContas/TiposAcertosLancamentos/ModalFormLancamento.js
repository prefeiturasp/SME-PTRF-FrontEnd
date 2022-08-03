import React from "react";
import { Select } from 'antd';
import {ModalFormParametrizacoesAcertos} from "../../../../Globais/ModalBootstrap";
import '../parametrizacoes-prestacao-contas.scss'

export const ModalFormLancamentos = (props) => {
    const { Option } = Select;

    const bodyTextarea = (operacao) => {

        return (
            <>
                <form onSubmit={props.handleSubmitModalFormLancamentos}>
                    <div className='row'>

                    <div className='form-group col-md-10'>
                            <label htmlFor="nome">Nome do tipo</label>
                            <input
                                value={props.stateFormModal.nome}
                                name='nome'
                                id="nome"
                                type="text"
                                className="form-control"
                                required={true}
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                            />
                        </div>
                        <div className="form-group col-md-10">
                            <label htmlFor="categoria">Categoria</label>
                                <select value={props.stateFormModal.categoria}
                                        onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                        placeholder="Selecione a categoria"
                                        name="categoria"
                                        id="categoria"
                                        className="form-control"
                                        required={true}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {props.categoriaTabela && props.categoriaTabela.length > 0 && props.categoriaTabela.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                                
                        </div>

                        <div className='col-8'>
                            <div className="form-check form-check-inline">
                                <p className='mt-3 mb-0 mr-4 pr-4 font-weight-normal'>Ativo?</p>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="ativo"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="reabertura-lancamentos"
                                    value="True"
                                    checked={props.stateFormModal.ativo}
                                    onChange={() => props.handleChangeFormModal('ativo', true)}
                                />
                                <label className="form-check-label font-weight-bold" htmlFor="reabertura-lancamentos">Sim</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="ativo"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="reabertura-lancamentos"
                                    value="False"
                                    checked={!props.stateFormModal.ativo}
                                    onChange={() => props.handleChangeFormModal('ativo', false)}
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
                                disabled={props.readOnly || !props.stateFormModal.nome || !props.stateFormModal.categoria}
                                onClick={() => {props.handleSubmitModalFormLancamentos(props.stateFormModal)}}
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
            titulo={props.stateFormModal && props.stateFormModal.operacao === 'edit' ? 'Editar tipo de acerto em lançamento' : 'Adicionar tipo de acerto em lançamento'}
            onHide={props.handleClose}
            bodyText={bodyTextarea(props.stateFormModal.operacao)}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};