import React from "react";
import { Formik } from "formik";
import moment from "moment";
import { YupSignupSchemaMandatosVacancia } from "./YupSignupSchemaMandatosVacancia";
import { ModalFormBodyText } from "../../Globais/ModalBootstrap";
import { DatePickerField } from "../../Globais/DatePickerField";
import { RodapeFormsID } from "../../Globais/RodapeFormsID";
import { useGetMandatoMaisRecenteVacancia } from "./hooks/useGetMandatoMaisRecenteVacancia";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const ModalForm = ({ show, stateFormModal, handleClose, handleSubmitModalForm, setShowModalConfirmDelete }) => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    const { data: mandatoMaisRecente } = useGetMandatoMaisRecenteVacancia();

    const getMinDataInicial = (values) => {
        return (values.uuid && values.limite_min_data_inicial)
            ? moment(values.limite_min_data_inicial).toDate()
            : (!values.uuid && mandatoMaisRecente?.data_inicial_proximo_mandato)
                ? moment(mandatoMaisRecente.data_inicial_proximo_mandato).toDate()
                : null;
    };

    const bodyTextarea = () => (
        <Formik
            data-qa="formik-mandato-vacancia"
            initialValues={stateFormModal}
            validationSchema={YupSignupSchemaMandatosVacancia}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={handleSubmitModalForm}
        >
            {props => {
                const { values, setFieldValue } = props;
                return (
                    <form data-qa="form-mandato-vacancia" className="ModalForm" onSubmit={props.handleSubmit}>
                        <div className="row">
                            <div className="col-12" data-qa="legenda-campos-obrigatorios">
                                <p className="text-right mb-0">* Preenchimento obrigatório</p>
                                <div className="form-group">
                                    <label htmlFor="referencia_mandato">Referência do mandato *</label>
                                    <input
                                        data-qa="campo-referencia-mandato-vacancia"
                                        type="text"
                                        value={values.referencia_mandato}
                                        placeholder="Ex.: 2023 a 2025"
                                        name="referencia_mandato"
                                        id="referencia_mandato"
                                        className="form-control"
                                        onChange={props.handleChange}
                                        disabled={!values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    />
                                    {props.touched.referencia_mandato && props.errors.referencia_mandato &&
                                        <span className="span_erro text-danger mt-1"> {props.errors.referencia_mandato}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <p><strong>Período</strong></p>
                            </div>
                            <div className="col-6">
                                <label htmlFor="data_inicial">Data inicial *</label>
                                <DatePickerField
                                    name="data_inicial"
                                    id="data_inicial"
                                    value={values.data_inicial}
                                    onChange={setFieldValue}
                                    disabled={!values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    minDate={getMinDataInicial(values)}
                                />
                                {props.touched.data_inicial && props.errors.data_inicial &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.data_inicial}</span>}
                            </div>
                            <div className="col-6">
                                <label htmlFor="data_final">Data final *</label>
                                <DatePickerField
                                    name="data_final"
                                    id="data_final"
                                    value={values.data_final}
                                    onChange={setFieldValue}
                                    disabled={!values.data_inicial || !values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    minDate={values.data_inicial ? moment(values.data_inicial).toDate() : null}
                                />
                                {props.touched.data_final && props.errors.data_final &&
                                    <span className="span_erro text-danger mt-1"> {props.errors.data_final}</span>}
                            </div>
                        </div>

                        <RodapeFormsID value={values.id} />

                        {values.editavel ? (
                            <div className="d-flex bd-highlight mt-2">
                                <div className="p-Y flex-grow-1 bd-highlight">
                                    {values.uuid &&
                                        <button
                                            data-qa="botao-confirmar-excluir-mandato-vacancia"
                                            onClick={() => setShowModalConfirmDelete(true)}
                                            type="button"
                                            className="btn btn btn-danger mt-2 mr-2"
                                            disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        >
                                            Excluir
                                        </button>
                                    }
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        data-qa="botao-cancelar-modal-mandato-vacancia"
                                        onClick={() => handleClose()}
                                        type="button"
                                        className="btn btn-outline-success mt-2 mr-2"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                                <div className="p-Y bd-highlight">
                                    <button
                                        data-qa="botao-submit-modal-mandato-vacancia"
                                        type="submit"
                                        className="btn btn btn-success mt-2"
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                    >
                                        {values.uuid ? "Salvar" : "Adicionar"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-end bd-highlight">
                                <button
                                    data-qa="botao-cancelar-modal-mandato-vacancia"
                                    onClick={() => handleClose()}
                                    type="button"
                                    className="btn btn-outline-success mt-2 mr-2"
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </form>
                );
            }}
        </Formik>
    );

    return (
        <ModalFormBodyText
            show={show}
            titulo={stateFormModal && stateFormModal.uuid ? "Editar período de mandato" : "Adicionar período de mandato"}
            onHide={handleClose}
            size="lg"
            bodyText={bodyTextarea()}
        />
    );
};

export default ModalForm;
