import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import { Formik, Field, Form } from "formik";
import {FormAcoesPDDEValidacao} from "./FormValidacao";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

const RadioSimNao = ({nome, label, values, setFieldValue, disabled}) => (
    <div className='col'>
        <div className="form-group">
            <p className="mb-0">{label} *</p>
            <div className="form-check form-check-inline mt-2">
                <input
                    name={`${nome}_true`}
                    className="form-check-input"
                    type="radio"
                    id={`${nome}_true`}
                    value="True"
                    checked={values[nome] === true}
                    onChange={() => setFieldValue(nome, true)}
                    disabled={disabled}
                />
                <label className="form-check-label" htmlFor={`${nome}_true`}>Sim</label>
            </div>
            <div className="form-check form-check-inline">
                <input
                    name={`${nome}_false`}
                    className="form-check-input"
                    type="radio"
                    id={`${nome}_false`}
                    value="False"
                    checked={values[nome] === false}
                    onChange={() => setFieldValue(nome, false)}
                    disabled={disabled}
                />
                <label className="form-check-label" htmlFor={`${nome}_false`}>Não</label>
            </div>
        </div>
    </div>
);

const ModalForm = ({
    show,
    stateFormModal,
    programas,
    onSubmit,
    onHandleClose,
    setShowModalConfirmDelete,
}) => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const listaProgramas = (programas && programas.results) || [];

    const bodyTextarea = () => {
        return (
            <Formik
                initialValues={stateFormModal}
                validationSchema={FormAcoesPDDEValidacao}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {props => {
                    const {values, setFieldValue} = props;
                    const campoDesabilitado = !values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES;
                    return(
                        <Form>
                            <div className='row'>
                                <div className='col-12'>
                                    <p className='text-right mb-2'><strong>* Preenchimento obrigatório</strong></p>
                                </div>
                                <div className='col-6'>
                                    <div className="form-group">
                                        <label htmlFor="nome">Nome *</label>
                                        <Field
                                            data-qa="input-nome"
                                            type="text"
                                            name="nome"
                                            id="nome"
                                            className="form-control"
                                            onChange={props.handleChange}
                                            disabled={campoDesabilitado}
                                        />
                                        {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                    </div>
                                </div>

                                <div className='col-6'>
                                    <div className="form-group">
                                        <label htmlFor="programa">Programa *</label>
                                        <Field
                                            as="select"
                                            data-qa="input-programa"
                                            data-testid="select-programa"
                                            onChange={props.handleChange}
                                            disabled={campoDesabilitado}
                                            name="programa"
                                            id="programa"
                                            className="form-control"
                                        >
                                            <option data-qa="option-programa-vazio" value=''>Selecione um programa</option>
                                            {listaProgramas.map(item => (
                                                <option data-qa={`option-programa-${item.uuid}`} key={item.uuid} value={item.uuid}>{item.nome}</option>
                                            ))}
                                        </Field>
                                        {listaProgramas.length === 0 &&
                                            <small className="form-text text-muted" data-testid="ajuda-sem-programas">
                                                Nenhum programa cadastrado. Cadastre na aba Programas.
                                            </small>
                                        }
                                        {props.touched.programa && props.errors.programa && <span className="span_erro text-danger mt-1"> {props.errors.programa} </span>}
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <RadioSimNao nome="aceita_capital" label="Aceita capital?" values={values} setFieldValue={setFieldValue} disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}/>
                                <RadioSimNao nome="aceita_custeio" label="Aceita custeio?" values={values} setFieldValue={setFieldValue} disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}/>
                                <RadioSimNao nome="aceita_livre_aplicacao" label="Aceita livre aplicação?" values={values} setFieldValue={setFieldValue} disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}/>
                            </div>

                            <div className='row mt-3'>
                                <div className='col'>
                                    <p className='mb-2'>ID</p>
                                    <p className='mb-2'>{values.id}</p>
                                </div>
                            </div>

                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.operacao === 'edit' && values.editavel ? (
                                        <button
                                            data-qa="btn-apagar-acao-pdde"
                                            onClick={()=>setShowModalConfirmDelete(true)}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            Excluir
                                        </button>
                                    ): null}
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        data-qa="btn-cancelar"
                                        onClick={onHandleClose}
                                        type="button"
                                        className={`btn btn${values.editavel ? '-outline-success' : '-success'} mt-2 mr-2`}
                                    >
                                        {values.editavel ? 'Cancelar' : 'Voltar'}
                                    </button>
                                </div>
                                {values.operacao === 'create' || (values.operacao === 'edit' && values.editavel) ? (
                                    <div className="p-Y bd-highlight">
                                        <button
                                            data-testid="btn-salvar-acao"
                                            data-qa="btn-salvar"
                                            type="submit"
                                            className="btn btn btn-success mt-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                ):null}
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        )
    };

    return (
        <ModalFormBodyText
            show={show}
            titulo={stateFormModal && !stateFormModal.editavel ? 'Visualizar Ação PDDE' : stateFormModal && stateFormModal.operacao === 'edit' ? 'Editar Ação PDDE' : 'Adicionar Ação PDDE'}
            onHide={onHandleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalForm)
