import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import {YupSignupSchemaAssociacoes, exibeDataPT_BR} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import MaskedInput from "react-text-mask";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'

const ModalFormAssociacoes = ({show, stateFormModal, handleClose, handleSubmitModalFormAssociacoes, listaDePeriodos, tabelaAssociacoes, carregaUnidadePeloCodigoEol, errosCodigoEol, onDeleteAssocicacaoTratamento}) => {

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaAssociacoes}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalFormAssociacoes}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome</label>
                                            <input
                                                type="text"
                                                value={props.values.nome}
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="codigo_eol_unidade">Código EOL</label>
                                            <input
                                                type="text"
                                                value={props.values.codigo_eol_unidade}
                                                name="codigo_eol_unidade"
                                                id="codigo_eol_unidade"
                                                className="form-control"
                                                onChange={(e)=>{
                                                    props.handleChange(e);
                                                    carregaUnidadePeloCodigoEol(e.target.value, setFieldValue)
                                                }}
                                                disabled={props.values.operacao === 'edit'}
                                            />
                                            {errosCodigoEol &&
                                            <div className='row mt-2'>
                                                <div className='col'>
                                                    <p><span className="span_erro text-danger mt-1">{errosCodigoEol}</span></p>
                                                </div>
                                            </div>
                                            }
                                            {props.touched.codigo_eol_unidade && props.errors.codigo_eol_unidade && <span className="span_erro text-danger mt-1"> {props.errors.codigo_eol_unidade} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="tipo_nome_unidade">Unidade educacional</label>
                                            <input
                                                type="text"
                                                value={props.values.tipo_unidade + " " + props.values.nome_unidade}
                                                name="tipo_nome_unidade"
                                                id="tipo_nome_unidade"
                                                className="form-control"
                                                disabled={true}
                                            />
                                            {props.touched.tipo_nome_unidade && props.errors.tipo_nome_unidade && <span className="span_erro text-danger mt-1"> {props.errors.tipo_nome_unidade} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="cnpj">CNPJ</label>
                                            <MaskedInput
                                                mask={[/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/,/\d/]}
                                                value={props.values.cnpj}
                                                name="cnpj"
                                                id="cnpj"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.cnpj && props.errors.cnpj && <span className="span_erro text-danger mt-1"> {props.errors.cnpj} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <label htmlFor="periodo_inicial">Período inicial</label>
                                        <select
                                            value={props.values.periodo_inicial && props.values.periodo_inicial ? props.values.periodo_inicial : ""}
                                            onChange={props.handleChange}
                                            name="periodo_inicial"
                                            id="periodo_inicial"
                                            className="form-control"
                                        >
                                            <option value=''>Selecione um período</option>
                                            {listaDePeriodos && listaDePeriodos.map((periodo) =>
                                                <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="ccm">CCM</label>
                                            <MaskedInput
                                                mask={[/\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/]}
                                                type="text"
                                                value={props.values.ccm}
                                                name="ccm"
                                                id="ccm"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.ccm && props.errors.ccm && <span className="span_erro text-danger mt-1"> {props.errors.ccm} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="text"
                                                value={props.values.email}
                                                name="email"
                                                id="email"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.email && props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className="form-group">
                                            <label htmlFor="processo_regularidade">Nº processo regularidade</label>
                                            <MaskedInput
                                                mask={[/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]}
                                                type="text"
                                                value={props.values.processo_regularidade}
                                                name="processo_regularidade"
                                                id="processo_regularidade"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                            {props.touched.processo_regularidade && props.errors.processo_regularidade && <span className="span_erro text-danger mt-1"> {props.errors.processo_regularidade} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row mb-0'>
                                    <div className='col-12'>
                                        <div className="form-group">
                                            <label htmlFor="observacao">Observação</label>
                                            <input
                                                type="text"
                                                value={props.values.observacao}
                                                name="observacao"
                                                id="observacao"
                                                className="form-control"
                                                onChange={props.handleChange}
                                            />
                                                <small className="form-text text-muted">
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '12px', marginRight:'4px'}}
                                                        icon={faExclamationCircle}
                                                    /> 
                                                    <span>Preencha este campo, se necessário, com informações relacionadas a unidade educacional.</span>
                                                </small>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                                                            </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>Uuid</p>
                                        <p className='mb-2'>{values.uuid}</p>
                                    </div>
                                    <div className='col'>
                                        <p className='mb-2'>ID</p>
                                        <p className='mb-2'>{values.id}</p>
                                    </div>
                                </div>

                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.operacao === 'edit' &&
                                            <button onClick={()=>onDeleteAssocicacaoTratamento(stateFormModal)} type="button" className="btn btn btn-danger mt-2 mr-2">
                                                Apagar
                                            </button>
                                        }
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={()=>handleClose()} type="button" className='btn btn-outline-success mt-2 mr-2'>Cancelar</button>
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button type="submit" className="btn btn-success mt-2">Salvar</button>
                                    </div>
                                </div>
                            </form>
                        );
                    }}
                </Formik>
            </>
        )
    };
    return (
        <ModalFormBodyText
            show={show}
            titulo={stateFormModal && stateFormModal && stateFormModal.operacao === 'edit' ? 'Editar associação' : 'Adicionar associação'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalFormAssociacoes)