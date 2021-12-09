import React, {Fragment} from "react";
import {Modal} from "react-bootstrap";
import './multiselect.scss'
import { Select } from 'antd';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { visoesService } from "../../../../../services/visoes.service";

export const ModalAdicionarMembroComissao= (propriedades) => {
    const { Option } = Select;
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="registro_funcional_modal">Registro funcional</label>
                            <input 
                                onChange={(e) => propriedades.handleOnChangeRegistroFuncional(e)}
                                onBlur={propriedades.handleOnBlurRegistroFuncional}
                                name="registro_funcional_modal" 
                                id="registro_funcional_modal" 
                                type="text" 
                                className="form-control"
                                placeholder="Escreva o número"
                                value={propriedades.estadoModal.registro_funcional_modal}
                            />
                            {propriedades.errosModal.servidor_nao_encontrado && <span className="span_erro text-danger mt-1">{propriedades.errosModal.servidor_nao_encontrado}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="nome_modal">Nome completo</label>
                            <input 
                                onChange={(e) => propriedades.handleOnChangeModal(e.target.name, e.target.value)}
                                name="nome_modal" 
                                id="nome_modal" 
                                type="text" 
                                className="form-control"
                                placeholder="-"
                                disabled={true}
                                value={propriedades.estadoModal.nome_modal}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="email_modal">Email</label>
                            <input 
                                onChange={(e) => propriedades.handleOnChangeModal(e.target.name, e.target.value)}
                                name="email_modal" 
                                id="email_modal" 
                                type="text" 
                                className="form-control"
                                placeholder="Insira o email se desejar"
                                value={propriedades.estadoModal.email_modal}
                            />
                            {propriedades.errosModal.email_invalido && <span className="span_erro text-danger mt-1">{propriedades.errosModal.email_invalido}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="comissoes_modal">Comissões</label>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Selecione a(s) pertencente(s)"
                                value={propriedades.estadoModal.comissoes_modal}
                                onChange={propriedades.handleOnChangeMultipleSelectModal}
                                className='multiselect-lista-comissoes'
                            >
                                {propriedades.listaComissoes && propriedades.listaComissoes.length > 0 && propriedades.listaComissoes.map(item => (
                                    <Option key={item.id} value={item.id}>{item.nome}</Option>
                                ))}
                            </Select>
                            {propriedades.errosModal.comissao_vazia && <span className="span_erro text-danger mt-1">{propriedades.errosModal.comissao_vazia}</span>}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        onClick={(e) => propriedades.onHide()}
                        className="btn btn-outline-success mt-2"
                        type="button"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={(e) => propriedades.handleOnSubmitModal()}
                        type="submit"
                        className="btn btn-success mt-2"
                    >
                        Adicionar
                    </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export const ModalEditarMembroComissao= (propriedades) => {
    const { Option } = Select;
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="registro_funcional_modal">Registro funcional</label>
                            <input 
                                onChange={(e) => propriedades.handleOnChangeRegistroFuncional(e, true)}
                                onBlur={propriedades.handleOnBlurRegistroFuncional}
                                name="registro_funcional_modal" 
                                id="registro_funcional_modal" 
                                type="text" 
                                className="form-control"
                                placeholder="Escreva o número"
                                value={propriedades.estadoModal.registro_funcional_modal}
                            />
                            {propriedades.errosModal.servidor_nao_encontrado && <span className="span_erro text-danger mt-1">{propriedades.errosModal.servidor_nao_encontrado}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="nome_modal">Nome completo</label>
                            <input 
                                onChange={(e) => propriedades.handleOnChangeModal(e.target.name, e.target.value, true)}
                                name="nome_modal" 
                                id="nome_modal" 
                                type="text" 
                                className="form-control"
                                placeholder="-"
                                disabled={true}
                                value={propriedades.estadoModal.nome_modal}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="email_modal">Email</label>
                            <input 
                                onChange={(e) => propriedades.handleOnChangeModal(e.target.name, e.target.value)}
                                name="email_modal" 
                                id="email_modal" 
                                type="text" 
                                className="form-control"
                                placeholder="Insira o email se desejar"
                                value={propriedades.estadoModal.email_modal}
                            />
                            {propriedades.errosModal.email_invalido && <span className="span_erro text-danger mt-1">{propriedades.errosModal.email_invalido}</span>}
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-12">  
                            <label htmlFor="comissoes_modal">Comissões</label>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="Selecione a(s) pertencente(s)"
                                value={propriedades.estadoModal.comissoes_modal}
                                onChange={propriedades.handleOnChangeMultipleSelectModal}
                                className='multiselect-lista-comissoes'
                            >
                                {propriedades.listaComissoes && propriedades.listaComissoes.length > 0 && propriedades.listaComissoes.map(item => (
                                    <Option key={item.id} value={item.id}>{item.nome}</Option>
                                ))}
                            </Select>
                            {propriedades.errosModal.comissao_vazia && <span className="span_erro text-danger mt-1">{propriedades.errosModal.comissao_vazia}</span>}
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        disabled={!visoesService.getPermissoes(['change_comissoes_dre'])}
                        onClick={(e) => propriedades.handleOnShowModalExclusao()}
                        className="btn btn-danger btn-remover mt-2"
                        type="button"
                    >
                        <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "5px", color: '#FFFFFF'}}
                        icon={faTimesCircle}
                        />
                        <strong>Remover</strong>
                    </button>


                    <button
                        onClick={(e) => propriedades.onHide()}
                        className="btn btn-outline-success mt-2 ml-auto"
                        type="button"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={(e) => propriedades.handleOnSubmitModal()}
                        type="submit"
                        className="btn btn-success mt-2"
                    >
                        Salvar
                    </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export const ModalConfirmaExclusaoMembroComissao= (propriedades) => {
    return (
        <Fragment>
            <Modal centered show={propriedades.show} onHide={propriedades.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>{propriedades.titulo}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="row">
                        <div className="col-12">
                            <p>Deseja realmente excluir ?</p>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        onClick={(e) => propriedades.onHide()}
                        className="btn btn-outline-success mt-2"
                        type="button"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={(e) => propriedades.handleConfirmaExclusao()}
                        type="submit"
                        className="btn btn-success mt-2"
                    >
                        Sim
                    </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}