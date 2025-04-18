import React, {useState, useEffect} from "react";
import {ModalFormParametrizacoesAcertos} from "../../../../Globais/ModalBootstrap";
import { Select } from 'antd';
import '../parametrizacoes-prestacao-contas.scss'
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const ModalFormDocumentos = (props) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    
    const [isEnabled, setIsEnabled] = useState(true);
    const { Option } = Select;

    useEffect(() => {
        if(props.stateFormModal.nome.length === 0 || props.stateFormModal.categoria.length === 0 || props.stateFormModal.tipos_documento_prestacao.length === 0){
            setIsEnabled(true);
        }
        else {
            setIsEnabled(false);
        }
    }, [props.stateFormModal])


    const bodyTextarea = (operacao) => {

        return (
            <>
                <form onSubmit={props.handleSubmitModalFormDocumentos}>
                    <div className='row'>

                    <div className='col-12'>
                        <p className='text-right mb-0'>* Preenchimento obrigatório</p>
                    </div>

                    <div className='form-group col-md-10'>
                            <label htmlFor="nome">Nome do tipo *</label>
                            <input
                                value={props.stateFormModal.nome}
                                name='nome'
                                id="nome"
                                type="text"
                                className="form-control"
                                required={true}
                                onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            />
                        </div>
                        <div className="col-md-10">
                        <label htmlFor="documentos_prestacao">Documentos Prestações *</label>
                        <Select
                            mode="multiple"
                            allowClear
                            name="tipos_documento_prestacao"
                            id="documentos_prestacao"
                            placeholder="Selecione as documentos de prestação"
                            value={props.stateFormModal.tipos_documento_prestacao}
                            onChange={(value) => props.handleChangeFormModal('tipos_documento_prestacao', value)}
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
                        <div className="form-group col-md-10">
                            <label htmlFor="categoria">Categoria *</label>
                                <select value={props.stateFormModal.categoria}
                                        onChange={(e) => props.handleChangeFormModal(e.target.name, e.target.value)}
                                        placeholder="Selecione a categoria"
                                        name="categoria"
                                        id="categoria"
                                        className="categorias-multiple-search form-control"
                                        required={true}
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {props.categoriaTabela && props.categoriaTabela.length > 0 && props.categoriaTabela.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                        </div>

                        <div className='col-8'>
                            <div className="form-check form-check-inline">
                                <p className='mt-3 mb-0 mr-4 pr-4 font-weight-normal'>Ativo? *</p>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="ativo"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="reabertura-Documentos"
                                    value="True"
                                    checked={props.stateFormModal.ativo}
                                    onChange={() => props.handleChangeFormModal('ativo', true)}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                />
                                <label className="form-check-label font-weight-bold" htmlFor="reabertura-documentos">Sim</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    name="ativo"
                                    className={`form-check-input`}
                                    type="radio"
                                    id="reabertura-documentos"
                                    value="False"
                                    checked={!props.stateFormModal.ativo}
                                    onChange={() => props.handleChangeFormModal('ativo', false)}
                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                />
                                <label className="form-check-label font-weight-bold" htmlFor="reabertura-documentos">Não</label>
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
                            <button onClick={props.serviceCrudDocumentos} type="button" className="btn btn btn-danger mt-2 mr-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                Apagar
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
            titulo={props.stateFormModal && props.stateFormModal.operacao === 'edit' ? 'Editar tipo de acerto em documento' : 'Adicionar tipo de acerto em documento'}
            onHide={props.handleClose}
            bodyText={bodyTextarea(props.stateFormModal.operacao)}
            primeiroBotaoOnclick={props.handleClose}
        />
    )
};