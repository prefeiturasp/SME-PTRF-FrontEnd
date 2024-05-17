import React, { useContext } from "react";
import { Formik } from "formik";

import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { RepassesContext } from "../context/Repasse";
import { useGetTabelasRepasse } from "../hooks/useGetTabelasRepasse";
import { useGetTabelasPorAssociacao } from "../hooks/useGetTabelasPorAssociacao";

import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { ReactNumberFormatInput as CurrencyInput } from "../../../../../Globais/ReactNumberFormatInput";
import { trataNumericos } from "../../../../../../utils/ValidacoesAdicionaisFormularios";
import Spinner from "../../../../../../assets/img/spinner.gif"
import AutoCompleteAssociacoes from "./AutoCompleteAssociacoes";
import { YupSchemaRepasse } from "../YupSchemaRepasse";

export const ModalForm = ({handleSubmitFormModal, todasAsAssociacoesAutoComplete, loadingAssociacoes}) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {showModalForm, setShowModalForm, stateFormModal, bloquearBtnSalvarForm, setShowModalConfirmacaoExclusao, setStateFormModal} = useContext(RepassesContext)
    
    const { data: tabelas } = useGetTabelasRepasse();
    const { data: tabelas_por_associacao } = useGetTabelasPorAssociacao();
    

    const campo_editavel = (campo) => {
        if(!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES){
            return false;
        }

        if(stateFormModal['campos_editaveis'][campo] === false){
            return false;
        }

        return true;
    }

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSchemaRepasse}
                    enableReinitialize={true}
                    validateOnChange={false}
                    validateOnBlur={false}
                    onSubmit={handleSubmitFormModal}
                >
                    {props => {
                        const {
                            values,
                            setFieldValue,
                        } = props;
                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className="form-row">
                                    {stateFormModal.uuid 
                                    ? 
                                        <div className='form-group col-md-12'>
                                            <p className='text-right mb-0'>* Preenchimento obrigatório</p>
                                            <label htmlFor="unidade_educacional">Unidade Educacional *</label>
                                            <input
                                                value={values.nome_unidade}
                                                name='unidade_educacional'
                                                id="unidade_educacional"
                                                type="text"
                                                className="form-control"
                                                readOnly={true}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                        </div>
                                    :
                                        <div className="form-group col-md-12">
                                            <p className='text-right mb-0'>* Preenchimento obrigatório</p>
                                            <label htmlFor="unidade_educacional">Unidade Educacional *{loadingAssociacoes && <img alt="" src={Spinner} style={{height: "22px"}}/>}</label>
                                            <AutoCompleteAssociacoes
                                                todasAsAssociacoesAutoComplete={todasAsAssociacoesAutoComplete}
                                                setFieldValue={setFieldValue}
                                                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                loadingAssociacoes={loadingAssociacoes}
                                                
                                            />
                                            {props.touched.associacao && props.errors.associacao && <span className="span_erro text-danger mt-1"> {props.errors.associacao}</span>}
                                        </div>
                                    }  
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <label htmlFor="valor_capital">Valor capital *</label>
                                        <CurrencyInput
                                            disabled={!campo_editavel("valor_capital")}
                                            allowNegative={false}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={values.valor_capital}
                                            id="valor_capital"
                                            name="valor_capital"
                                            className="form-control"
                                            onChangeEvent={(e) => {
                                                props.handleChange(e);
                                                setFieldValue("valor_capital", trataNumericos(e.target.value))
                                            }}
                                            selectAllOnFocus={true}
                                        />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="valor_custeio">Valor custeio *</label>
                                        <CurrencyInput
                                            disabled={!campo_editavel("valor_custeio")}
                                            allowNegative={false}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={values.valor_custeio}
                                            id="valor_custeio"
                                            name="valor_custeio"
                                            className="form-control"
                                            onChangeEvent={(e) => {
                                                props.handleChange(e);
                                                setFieldValue("valor_custeio", trataNumericos(e.target.value))
                                            }}
                                            selectAllOnFocus={true}
                                        />
                                    </div>

                                    <div className="form-group col-md-4">
                                        <label htmlFor="valor_livre">Valor livre aplicação *</label>
                                        <CurrencyInput
                                            disabled={!campo_editavel("valor_livre")}
                                            allowNegative={false}
                                            prefix='R$'
                                            decimalSeparator=","
                                            thousandSeparator="."
                                            value={values.valor_livre}
                                            id="valor_livre"
                                            name="valor_livre"
                                            className="form-control"
                                            onChangeEvent={(e) => {
                                                props.handleChange(e);
                                                setFieldValue("valor_livre", trataNumericos(e.target.value))
                                            }}
                                            selectAllOnFocus={true}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="conta_associacao">Conta *</label>
                                        <select
                                            disabled={!campo_editavel("campos_identificacao") || !stateFormModal.associacao}
                                            value={values.conta_associacao}
                                            onChange={props.handleChange}
                                            name="conta_associacao"
                                            id="conta_associacao"
                                            className="form-control"
                                        >
                                            <option value="">Selecione</option>
                                            {tabelas_por_associacao && tabelas_por_associacao.contas_associacao && tabelas_por_associacao.contas_associacao.map((conta_associacao)=>
                                                <option key={conta_associacao.uuid} value={conta_associacao.uuid}>{conta_associacao.nome}</option>
                                            )}
                                        </select>
                                        {props.touched.conta_associacao && props.errors.conta_associacao && <span className="span_erro text-danger mt-1"> {props.errors.conta_associacao}</span>}
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="acao_associacao">Ação *</label>
                                        <select
                                            disabled={!campo_editavel("campos_identificacao") || !stateFormModal.associacao}
                                            value={values.acao_associacao}
                                            onChange={props.handleChange}
                                            name="acao_associacao"
                                            id="acao_associacao"
                                            className="form-control"
                                        >
                                            <option value="">Selecione</option>
                                            {tabelas_por_associacao && tabelas_por_associacao.acoes_associacao && tabelas_por_associacao.acoes_associacao.map((acao_associacao)=>
                                                <option key={acao_associacao.uuid} value={acao_associacao.uuid}>{acao_associacao.nome}</option>
                                            )}
                                        </select>
                                        {props.touched.acao_associacao && props.errors.acao_associacao && <span className="span_erro text-danger mt-1"> {props.errors.acao_associacao}</span>}
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="periodo">Período *</label>
                                        <select
                                            disabled={!campo_editavel("campos_identificacao")}
                                            value={values.periodo}
                                            onChange={props.handleChange}
                                            name="periodo"
                                            id="periodo"
                                            className="form-control"
                                        >
                                            <option value="">Selecione</option>
                                            {tabelas && tabelas.periodos && tabelas.periodos.map((periodo)=>
                                                <option key={periodo.uuid} value={periodo.uuid}>{periodo.referencia}</option>
                                            )}
                                        </select>
                                        {props.touched.periodo && props.errors.periodo && <span className="span_erro text-danger mt-1"> {props.errors.periodo}</span>}
                                    </div>

                                    <div className="form-group col-md-6">
                                        <label htmlFor="status">Status *</label>
                                        <select
                                            disabled={!campo_editavel("campos_identificacao")}
                                            value={values.status}
                                            onChange={props.handleChange}
                                            name="status"
                                            id="status"
                                            className="form-control"
                                        >
                                            {tabelas && tabelas.status && tabelas.status.map((status)=>
                                                <option key={status.id} value={status.id}>{status.nome}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group col-md-4">
                                        <p className="mb-0">Realizado capital?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                name="realizado_capital_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="realizado_capital_true"
                                                value="True"
                                                checked={values.realizado_capital === true}
                                                onChange={() => setFieldValue("realizado_capital", true)}
                                                disabled={!campo_editavel("campos_de_realizacao")}
                                            />
                                            <label className="form-check-label" htmlFor="realizado_capital_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                name="realizado_capital_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="realizado_capital_false"
                                                value="False"
                                                checked={values.realizado_capital === false}
                                                onChange={() => setFieldValue("realizado_capital", false)}
                                                disabled={!campo_editavel("campos_de_realizacao")}
                                            />
                                            <label className="form-check-label" htmlFor="realizado_capital_false">Não</label>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <p className="mb-0">Realizado custeio?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                name="realizado_custeio_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="realizado_custeio_true"
                                                value="True"
                                                checked={values.realizado_custeio === true}
                                                onChange={() => setFieldValue("realizado_custeio", true)}
                                                disabled={!campo_editavel("campos_de_realizacao")}
                                            />
                                            <label className="form-check-label" htmlFor="realizado_custeio_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                name="realizado_custeio_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="realizado_custeio_false"
                                                value="False"
                                                checked={values.realizado_custeio === false}
                                                onChange={() => setFieldValue("realizado_custeio", false)}
                                                disabled={!campo_editavel("campos_de_realizacao")}
                                            />
                                            <label className="form-check-label" htmlFor="realizado_custeio_false">Não</label>
                                        </div>
                                    </div>

                                    <div className="form-group col-md-4">
                                        <p className="mb-0">Realizado livre aplicação?</p>
                                        <div className="form-check form-check-inline mt-2">
                                            <input
                                                name="realizado_livre_true"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="realizado_livre_true"
                                                value="True"
                                                checked={values.realizado_livre === true}
                                                onChange={() => setFieldValue("realizado_livre", true)}
                                                disabled={!campo_editavel("campos_de_realizacao")}
                                            />
                                            <label className="form-check-label" htmlFor="realizado_livre_true">Sim</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                name="realizado_livre_false"
                                                className={`form-check-input`}
                                                type="radio"
                                                id="realizado_livre_false"
                                                value="False"
                                                checked={values.realizado_livre === false}
                                                onChange={() => setFieldValue("realizado_livre", false)}
                                                disabled={!campo_editavel("campos_de_realizacao")}
                                            />
                                            <label className="form-check-label" htmlFor="realizado_livre_false">Não</label>
                                        </div>
                                    </div>
                                </div>

                                {stateFormModal.uuid &&
                                    <>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <p className="mb-0">Carga origem: <span>{values.carga_origem}</span></p>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <p className="mb-0">ID da linha de carga: <span>{values.id_linha_carga}</span></p>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <p className="mb-0">Uuid: <span>{values.uuid}</span></p>
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <p className="mb-0">ID: <span>{values.id}</span></p>
                                            </div>
                                        </div>
                                    </>
                                }

                                <div className="form-row">
                                    <div className="from-group col-md-12">
                                        <div className="d-flex bd-highlight justify-content-end">
                                            <div className="p-Y flex-grow-1 bd-highlight">
                                                {stateFormModal.uuid &&
                                                    <button
                                                        onClick={()=>setShowModalConfirmacaoExclusao(true)}
                                                        type="button"
                                                        className="btn btn btn-danger mt-2 mr-2"
                                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                    >
                                                        Apagar
                                                    </button>
                                                }
                                            </div>

                                            <button 
                                                onClick={()=>setShowModalForm(false)}
                                                type="button" 
                                                className="btn btn-outline-success mt-2 mr-2"
                                            >
                                                Cancelar
                                            </button>

                                            <button 
                                                type="submit"
                                                className="btn btn-success mt-2"
                                                disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            >
                                                {stateFormModal.uuid ? "Salvar" : "Adicionar" }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                            </form>
                        );
                    }}
                </Formik>
            </>
        )
    }

    return (
        <ModalFormBodyText
            show={showModalForm}
            titulo={`${stateFormModal.uuid ? "Editar repasse" : "Adicionar repasse" }`}
            onHide={setShowModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}