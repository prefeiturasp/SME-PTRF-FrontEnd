import {Formik} from "formik";
import {YupSignupSchemaAssociacoes} from "../../../../../../utils/ValidacoesAdicionaisFormularios";
import {DatePickerField} from "../../../../../Globais/DatePickerField";
import MaskedInput from "react-text-mask";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'
import { getCCMMask, getCnpjMask } from "../../../../../../utils/Mascaras";
import { useAssociacoesFormularioContext } from "../hooks/useAssociacoesFormularioContext";
import Loading from "../../../../../../utils/Loading";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { visoesService } from "../../../../../../services/visoes.service";
import { useNavigate } from "react-router-dom";
import { InputsPeriodosIniciais } from "./InputsPeriodosIniciais";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ModalConfirmarExclusao } from "../../../../../Globais/ModalAntDesign/ModalConfirmarExclusao";
import { ModalConfirmUpdateObservacao } from "../components/ModalConfirmUpdateObservacao";
import { useState } from "react";

export function Form() {
    const navigate = useNavigate();

    const {
        stateForm,
        errosCodigoEol,
        carregaUnidadePeloCodigoEol,
        isLoadingAssociacaoByUUID,
        handleSubmitModalFormAssociacoes,
        handleConfirmDelete,
        showModalConfirmUpdateObservacao,
        setShowModalConfirmUpdateObservacao,
        handleUpdateObservacao,
        setStateForm,
    } = useAssociacoesFormularioContext();

    const [showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao] = useState(false)

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const podeEncerrarAssociacao = visoesService.getPermissoes(['change_encerrar_associacoes']);

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

    if (isLoadingAssociacaoByUUID) {
        return (
            <div className="mt-5">
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            </div>
        )
    }

    return (
        <>
            <Formik
                initialValues={stateForm}
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

                    let nome_dre_tratado = props.values?.nome_dre?.replace(/DIRETORIA REGIONAL DE EDUCACAO\s*/i, '').trim() || '';

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
                                        <label htmlFor="nome_dre">DRE</label>
                                        <input
                                            type="text"
                                            value={nome_dre_tratado}
                                            name="nome_dre"
                                            id="nome_dre"
                                            className="form-control"
                                            disabled={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col'>
                                    <div className="form-group">
                                        <label htmlFor="cnpj">CNPJ</label>
                                        <MaskedInput
                                            mask={getCnpjMask()}
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

                            <InputsPeriodosIniciais
                                props={props}
                                setFieldValue={setFieldValue}
                                podeEditarDadosAssociacao={podeEditarDadosAssociacao}
                                TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES={TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                            />

                            <div className='row mb-0 pt-2'>
                                <div className='col-12'>
                                    <div className="form-group">
                                        <label htmlFor="observacao">Observação</label>
                                            <textarea
                                                value={props.values.observacao}
                                                onChange={(e) => {
                                                    setFieldValue('observacao', e.target.value);
                                                    setStateForm(prevState => ({
                                                        ...prevState,
                                                        observacao: e.target.value
                                                    }))
                                                }}
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

                            {
                                values.id && (
                                    <div className='row mt-3'>
                                        <div className='col'>
                                            <p className='mb-2'>ID: {values.id}</p>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.operacao === 'edit' &&
                                        <button
                                            onClick={()=> setShowModalConfirmacaoExclusao(true)}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            <FontAwesomeIcon icon={faXmark} style={{ marginRight: "8px", color: "white", fontWeight: "bold" }} />
                                            Excluir
                                        </button>
                                    }
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        onClick={()=> navigate('/parametro-associacoes')}
                                        type="button"
                                        className='btn btn-outline-success mt-2 mr-2'
                                    >
                                        Cancelar
                                    </button>
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

            <ModalConfirmarExclusao
                open={showModalConfirmacaoExclusao}
                onOk={handleConfirmDelete}
                okText="Excluir"
                onCancel={() => setShowModalConfirmacaoExclusao(false)}
                cancelText="Cancelar"
                titulo="Excluir Associação"
                bodyText="Deseja realmente excluir esta associação?"
            />

            <ModalConfirmUpdateObservacao
                show={showModalConfirmUpdateObservacao}
                handleClose={() => setShowModalConfirmUpdateObservacao(false)}
                onUpdateObservacaoTrue={handleUpdateObservacao}
                titulo="Atualizar observação"
                texto={"Esta associação está encerrada. Deseja realmente alterar o campo Observação?"}
                primeiroBotaoTexto="Confirmar"
                primeiroBotaoCss="success"
                segundoBotaoCss="outline-success"
                segundoBotaoTexto="Cancelar"
            />
        </>
    )
}
