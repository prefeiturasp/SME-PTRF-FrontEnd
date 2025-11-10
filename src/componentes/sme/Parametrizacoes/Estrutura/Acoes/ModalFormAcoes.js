import React from "react";
import {ModalFormParametrizacoesAcoes} from "../../../../Globais/ModalBootstrap";
import {YupSignupSchemaTags} from "./YupSignupSchemaTags";
import {Formik} from "formik";

export const ModalFormAcoes = ({show, stateFormModal, handleSubmit, readOnly, handleClose, setShowModalConfirmDelete}) => {

    const bodyTextarea = () => {

        return (
            <>
            <Formik
                data-qa="formik-acoes"	
                initialValues={stateFormModal}
                validationSchema={YupSignupSchemaTags}
                validateOnBlur={true}
                enableReinitialize={true}
                onSubmit={handleSubmit}
            >
                {props => {
                    const { values, setFieldValue } = props;
                    return(
                        <form onSubmit={props.handleSubmit}>
                            <div className="row">
                                <div className='col-12' data-qa="legenda-campos-obrigatorios">
                                    <p>* Preenchimento obrigatório</p>
                                </div>
                            </div>
                            <div className='row mt-3'>
                                <div className='col'>
                                    <div className="form-group">
                                        <label data-qa="label-nome-acao" htmlFor="nome">Nome *</label>
                                        <input
                                            data-qa="campo-nome-acao"
                                            value={values.nome}
                                            maxLength={160}
                                            type="text"
                                            placeholder="Nome da ação"
                                            name='nome'
                                            id="nome"
                                            className="form-control"
                                            onChange={props.handleChange}
                                            disabled={readOnly}
                                        />
                                        {props.touched.nome && props.errors.nome && <span className="span_erro text-danger mt-1"> {props.errors.nome} </span>}
                                    </div>
                                </div>

                                <div className='col'>
                                    <div className="form-group">
                                        <label htmlFor="posicao_nas_pesquisas">Posição nas pesquisas</label>
                                        <input
                                            value={values.posicao_nas_pesquisas}
                                            name='posicao_nas_pesquisas'
                                            id="posicao_nas_pesquisas"
                                            type="text"
                                            className="form-control"
                                            placeholder="Posição nas pesquisas (Ex: AAAAAAA)"
                                            onChange={props.handleChange}
                                            maxLength={10}
                                            disabled={readOnly}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-4 col-sm-6">
                                    <p data-qa="legenda-aceita-capital" className="mb-0">Aceita capital?</p>
                                    <div className="form-check form-check-inline mt-2">
                                        <input
                                            data-qa="campo-aceita-capital-true"
                                            name="aceita_capital_true"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="aceita_capital_true"
                                            value="True"
                                            checked={values.aceita_capital === true}
                                            onChange={() => setFieldValue("aceita_capital", true)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-aceita-capital-true" className="form-check-label" htmlFor="aceita_capital_true">Sim</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            data-qa="campo-aceita-capital-false"
                                            name="aceita_capital_false"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="aceita_capital_false"
                                            value="False"
                                            checked={values.aceita_capital === false}
                                            onChange={() => setFieldValue("aceita_capital", false)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-aceita-capital-false" className="form-check-label" htmlFor="aceita_capital_false">Não</label>
                                    </div>
                                </div>

                                <div className="form-group col-md-4 col-sm-6">
                                    <p data-qa="legenda-aceita-custeio" className="mb-0">Aceita custeio?</p>
                                    <div className="form-check form-check-inline mt-2">
                                        <input
                                            data-qa="campo-aceita-custeio-true"
                                            name="aceita_custeio_true"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="aceita_custeio_true"
                                            value="True"
                                            checked={values.aceita_custeio === true}
                                            onChange={() => setFieldValue("aceita_custeio", true)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-aceita-custeio-true" className="form-check-label" htmlFor="aceita_custeio_true">Sim</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            data-qa="campo-aceita-custeio-false"
                                            name="aceita_custeio_false"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="aceita_custeio_false"
                                            value="False"
                                            checked={values.aceita_custeio === false}
                                            onChange={() => setFieldValue("aceita_custeio", false)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-aceita-custeio-false" className="form-check-label" htmlFor="aceita_custeio_false">Não</label>
                                    </div>
                                </div>

                                <div className="form-group col-md-4 col-sm-6">
                                    <p data-qa="legenda-aceita-livre" className="mb-0">Aceita livre aplicação?</p>
                                    <div className="form-check form-check-inline mt-2">
                                        <input
                                            data-qa="campo-aceita-livre-true"
                                            name="aceita_livre_true"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="aceita_livre_true"
                                            value="True"
                                            checked={values.aceita_livre === true}
                                            onChange={() => setFieldValue("aceita_livre", true)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-aceita-livre-true" className="form-check-label" htmlFor="aceita_livre_true">Sim</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            data-qa="campo-aceita-livre-false"
                                            name="aceita_livre_false"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="aceita_livre_false"
                                            value="False"
                                            checked={values.aceita_livre === false}
                                            onChange={() => setFieldValue("aceita_livre", false)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-aceita-livre-false" className="form-check-label" htmlFor="aceita_livre_false">Não</label>
                                    </div>
                                </div>

                                <div className="form-group col-md-4 col-sm-6">
                                    <p data-qa="legenda-e-recursos-proprios" className="mb-0">Recursos externos?</p>
                                    <div className="form-check form-check-inline mt-2">
                                        <input
                                            data-qa="campo-e-recursos-proprios-true"
                                            name="e_recursos_proprios_true"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="e_recursos_proprios_true"
                                            value="True"
                                            checked={values.e_recursos_proprios === true}
                                            onChange={() => setFieldValue("e_recursos_proprios", true)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-e-recursos-proprios-true" className="form-check-label" htmlFor="e_recursos_proprios_true">Sim</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            data-qa="campo-e-recursos-proprios-false"
                                            name="e_recursos_proprios_false"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="e_recursos_proprios_false"
                                            value="False"
                                            checked={values.e_recursos_proprios === false}
                                            onChange={() => setFieldValue("e_recursos_proprios", false)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-e-recursos-proprios-false" className="form-check-label" htmlFor="e_recursos_proprios_false">Não</label>
                                    </div>
                                </div>

                                <div className="form-group col-md-4 col-sm-6">
                                    <p data-qa="legenda-exibir-paa" className="mb-0">Exibir no PAA?</p>
                                    <div className="form-check form-check-inline mt-2">
                                        <input
                                            data-qa="campo-exibir-paa-true"
                                            name="exibir_paa_true"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="exibir_paa_true"
                                            value="True"
                                            checked={values.exibir_paa === true}
                                            onChange={() => setFieldValue("exibir_paa", true)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-exibir-paa-true" className="form-check-label" htmlFor="exibir_paa_true">Sim</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            data-qa="campo-exibir-paa-false"
                                            name="exibir_paa_false"
                                            className={`form-check-input`}
                                            type="radio"
                                            id="exibir_paa_false"
                                            value="False"
                                            checked={values.exibir_paa === false}
                                            onChange={() => setFieldValue("exibir_paa", false)}
                                            disabled={readOnly}
                                        />
                                        <label data-qa="label-exibir-paa-false" className="form-check-label" htmlFor="exibir_paa_false">Não</label>
                                    </div>
                                </div>
                            </div>

                            {!!values.id && <div className='row mt-3'>
                                <div className='col'>
                                    <p>ID</p>
                                    <p data-qa="label-id-acao">{values.id}</p>
                                </div>
                            </div>}

                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.operacao === 'edit' ? (
                                        <button
                                            data-qa="botao-confirmar-excluir-acao"
                                            onClick={() => setShowModalConfirmDelete(true)}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={readOnly}>
                                            Excluir
                                        </button>
                                    ): null}
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        onClick={handleClose}
                                        type="reset"
                                        className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        data-qa="botao-submit-modal-acoes"
                                        type="submit" className="btn btn btn-success mt-2"
                                        disabled={readOnly}>Salvar</button>
                                </div>
                            </div>
                        </form>
                    )}
                }
            </Formik>
            </>
        )
    };

    return (
        <ModalFormParametrizacoesAcoes
            show={show}
             titulo={stateFormModal && stateFormModal.operacao === 'edit' ? 'Editar ação' : 'Adicionar ação'}
            onHide={handleClose}
            bodyText={bodyTextarea()}
            primeiroBotaoOnclick={handleClose}
        />
    )
};