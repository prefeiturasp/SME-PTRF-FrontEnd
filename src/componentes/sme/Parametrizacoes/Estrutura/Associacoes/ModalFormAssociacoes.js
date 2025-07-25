import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import {YupSignupSchemaAssociacoes, exibeDataPT_BR} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import MaskedInput from "react-text-mask";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import { visoesService } from "../../../../../services/visoes.service";
import ReactTooltip from "react-tooltip";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { getCCMMask } from "../../../../../utils/Mascaras";

const ModalFormAssociacoes = ({show, stateFormModal, handleClose, handleSubmitModalFormAssociacoes, listaDePeriodos, tabelaAssociacoes, carregaUnidadePeloCodigoEol, errosCodigoEol, onDeleteAssocicacaoTratamento}) => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const podeEncerrarAssociacao = visoesService.getPermissoes(['change_encerrar_associacoes']);
    const converteDataLocalParaUTC = (dateString) => {
        const dataObj = new Date(dateString);
        const offsetMs = dataObj.getTimezoneOffset() * 60 * 1000;
        const utcDataObj = new Date(dataObj.getTime() + offsetMs);
        return utcDataObj;
    }
    const podeEditarDadosAssociacao = (values, field = '') => {
        const isEditing = values.operacao === 'edit';

        if(isEditing) {
            const podeEditarAssociacaoEncerrada = values.pode_editar_dados_associacao_encerrada;
            const podeEditarPeriodoInicial = values.pode_editar_periodo_inicial;

            if(field === 'codigo_eol_unidade'){
                return false;
            } else if(field === 'periodo_inicial'){
                return podeEditarAssociacaoEncerrada && podeEditarPeriodoInicial;
            } else if(field === 'data_de_encerramento'){
                return podeEditarAssociacaoEncerrada && podeEncerrarAssociacao;
            }

            return podeEditarAssociacaoEncerrada;
        }

        return true;
    }

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

                        let data_fim_periodo = null
                        if(values.periodo_inicial) {
                            let periodo = listaDePeriodos.find(periodo => periodo.uuid === values.periodo_inicial)
                            data_fim_periodo = periodo ? periodo.data_fim_realizacao_despesas : null;
                        }

                        return(
                            <>
                                <div style={{textAlign: "right"}}>
                                    <span>* Preenchimento obrigatório</span>
                                </div>
                                <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="nome">Nome*</label>
                                            <input
                                                type="text"
                                                value={props.values.nome}
                                                name="nome"
                                                id="nome"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!podeEditarDadosAssociacao(props.values) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="codigo_eol_unidade">Código EOL*</label>
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
                                                disabled={!podeEditarDadosAssociacao(props.values, 'codigo_eol_unidade') || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
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
                                                disabled={!podeEditarDadosAssociacao(props.values) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.cnpj && props.errors.cnpj && <span className="span_erro text-danger mt-1"> {props.errors.cnpj} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
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
                                                disabled={!podeEditarDadosAssociacao(props.values) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.processo_regularidade && props.errors.processo_regularidade && <span className="span_erro text-danger mt-1"> {props.errors.processo_regularidade} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="ccm">CCM</label>
                                            <MaskedInput
                                                mask={(valor) => getCCMMask(valor)}
                                                type="text"
                                                value={props.values.ccm}
                                                name="ccm"
                                                id="ccm"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!podeEditarDadosAssociacao(props.values) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
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
                                                disabled={!podeEditarDadosAssociacao(props.values) || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.email && props.errors.email && <span className="span_erro text-danger mt-1"> {props.errors.email} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-6'>
                                    <label htmlFor="periodo_inicial">
                                        Período inicial*
                                    </label>
                                       <div
                                           data-tip={
                                            values.pode_editar_periodo_inicial && !values.pode_editar_periodo_inicial?.pode_editar_periodo_inicial
                                                ? values.pode_editar_periodo_inicial?.mensagem_pode_editar_periodo_inicial?.reduce((hint, text) => (hint + `${text}<br/>`), '<p>') + '</p>'
                                                : ''
                                           } data-html={true} style={{display:'inline'}} data-for={`tooltip-id-${values.uuid}`}
                                       >
                                       <select
                                            value={values.periodo_inicial && values.periodo_inicial ? values.periodo_inicial : ""}
                                            onChange={props.handleChange}
                                            name="periodo_inicial"
                                            id="periodo_inicial"
                                            className="form-control"
                                            disabled={!podeEditarDadosAssociacao(props.values, 'periodo_inicial') || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            <option value=''>Selecione um período</option>
                                            {listaDePeriodos && listaDePeriodos.map((periodo) =>
                                                <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                                            )}
                                        </select>
                                        <ReactTooltip id={`tooltip-id-${values.uuid}`} html={true}/>
                                       </div>
                                        <small className="form-text text-muted">
                                            <FontAwesomeIcon
                                                style={{fontSize: '12px', marginRight:'4px'}}
                                                icon={faExclamationCircle}
                                            /> 
                                            <span>O período inicial informado é uma referência e indica que o período a ser habilitado para a associação será o período posterior ao período informado.</span>
                                        </small>
                                        {props.touched.periodo_inicial && props.errors.periodo_inicial && <span className="span_erro text-danger mt-1"> {props.errors.periodo_inicial} </span>}
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group">
                                            <label htmlFor="data_de_encerramento">
                                                Data de encerramento
                                            </label>
                                            <DatePickerField
                                                name="data_de_encerramento"
                                                id="data_de_encerramento"
                                                value={values.data_de_encerramento !== null ? values.data_de_encerramento : ""}
                                                onChange={podeEncerrarAssociacao ? (name, val) => {
                                                    setFieldValue(name, val ? val.toISOString().substr(0, 10) : null)
                                                    }: null}
                                                disabled={!podeEditarDadosAssociacao(props.values, 'data_de_encerramento') || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                className="form-control"
                                                minDate={converteDataLocalParaUTC(data_fim_periodo)}
                                                maxDate={new Date()}
                                            />
                                            {props.errors.data_de_encerramento && <small
                                                className="span_erro text-danger mt-1"> *{props.errors.data_de_encerramento}
                                            </small>}
                                            <small className="form-text text-muted">
                                                <FontAwesomeIcon
                                                    style={{fontSize: '12px', marginRight:'4px'}}
                                                    icon={faExclamationCircle}
                                                /> 
                                                <span>A associação deixará de ser exibida nos períodos posteriores à data de encerramento informada.</span>
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mb-0 pt-2'>
                                    <div className='col-12'>
                                        <div className="form-group">
                                            <label htmlFor="observacao">Observação</label>
                                                <textarea
                                                    value={props.values.observacao}
                                                    onChange={props.handleChange}
                                                    className="form-control"
                                                    rows="3"
                                                    id="observacao"
                                                    name="observacao"
                                                    placeholder="Escreva o comentário"
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                >
                                                </textarea>
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
                                            <button onClick={()=>onDeleteAssocicacaoTratamento(stateFormModal)} type="button" className="btn btn btn-danger mt-2 mr-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                Apagar
                                            </button>
                                        }
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={()=>handleClose()} type="button" className='btn btn-outline-success mt-2 mr-2'>Cancelar</button>
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button type="submit" className="btn btn-success mt-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>Salvar</button>
                                    </div>
                                </div>
                            </form>
                            </>
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