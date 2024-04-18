import React, {useContext} from "react";
import {Formik} from "formik";
import {YupSignupSchemaMandatos} from "../YupSignupSchemaMandatos";
import {ModalFormBodyText} from "../../../Globais/ModalBootstrap";
import {MandatosContext} from "../context/Mandatos";
import {DatePickerField} from "../../../Globais/DatePickerField";
import ReactTooltip from "react-tooltip";
import moment from "moment";
import {useGetMandatoMaisRecente} from "../hooks/useGetMandatoMaisRecente";
import {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes
} from "../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const ModalForm = ({handleSubmitFormModal, handleConfirmDeleteMandato}) => {
    const {showModalForm, setShowModalForm, stateFormModal, bloquearBtnSalvarForm} = useContext(MandatosContext)
    const {data} = useGetMandatoMaisRecente()

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const getDataInicial = (values) => {
        return (values.uuid && values.limite_min_data_inicial) ? moment(values.limite_min_data_inicial).toDate()
            : !values.uuid && data.data_inicial_proximo_mandato ? moment(data.data_inicial_proximo_mandato).toDate()
                : null
    }

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaMandatos}
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
                        return (
                            <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-right mb-0'>* Preenchimento obrigatório</p>
                                        <div className="form-group">
                                            <span
                                                data-tip="Preencher com o período total do mandato. </br>Por exemplo: 2023 a 2025."
                                                data-html={true}>
                                                <label>Referência do mandato *</label>
                                                <ReactTooltip/>
                                            </span>

                                            <input
                                                type="text"
                                                value={values.referencia}
                                                name="referencia"
                                                id="referencia"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.referencia && props.errors.referencia && <span
                                                className="span_erro text-danger mt-1"> {props.errors.referencia}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p><strong>Período</strong></p>
                                    </div>
                                    <div className='col-6'>
                                        <label>Data inicial *</label>
                                        <DatePickerField
                                            name="data_inicial"
                                            id="data_inicial"
                                            value={values.data_inicial}
                                            onChange={setFieldValue}
                                            disabled={!values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            minDate={getDataInicial(values)}
                                        />
                                        {props.touched.data_inicial && props.errors.data_inicial && <span
                                            className="span_erro text-danger mt-1"> {props.errors.data_inicial}</span>}
                                    </div>
                                    <div className='col-6'>
                                        <label>Data final *</label>
                                        <DatePickerField
                                            name="data_final"
                                            id="data_final"
                                            value={values.data_final}
                                            onChange={setFieldValue}
                                            disabled={!values.data_inicial || !values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            minDate={moment(values.data_inicial).toDate()}
                                        />
                                        {props.touched.data_final && props.errors.data_final && <span
                                            className="span_erro text-danger mt-1"> {props.errors.data_final}</span>}
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col-6'>
                                        <p className='mb-2'>UUID</p>
                                        <p id='uuid'>{values.uuid}</p>
                                    </div>
                                    <div className='col-6'>
                                        <p className='mb-2'>ID</p>
                                        <p id='id'>{values.id}</p>
                                    </div>
                                </div>

                                {values.editavel ? (
                                    <div className="d-flex bd-highlight mt-2">
                                        <div className="p-Y flex-grow-1 bd-highlight">
                                            {values.uuid &&
                                                <button
                                                    onClick={() => handleConfirmDeleteMandato(values.uuid)}
                                                    type="button"
                                                    className="btn btn btn-danger mt-2 mr-2"
                                                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                >
                                                    Apagar
                                                </button>
                                            }
                                        </div>
                                        <div className="p-Y bd-highlight">
                                            <button
                                                onClick={() => setShowModalForm(false)}
                                                type="button"
                                                className={`btn btn-outline-success mt-2 mr-2`}
                                            >
                                                Cancelar
                                            </button>
                                        </div>

                                        <div className="p-Y bd-highlight">
                                            <button
                                                type="submit"
                                                className="btn btn btn-success mt-2"
                                                disabled={bloquearBtnSalvarForm || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            >
                                                {stateFormModal.uuid ? "Salvar" : "Adicionar"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="d-flex justify-content-end bd-highlight">
                                        <button
                                            onClick={() => setShowModalForm(false)}
                                            type="button"
                                            className={`btn btn-outline-success mt-2 mr-2`}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
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
            titulo={`${stateFormModal.uuid ? "Editar mandato" : "Adicionar mandato"}`}
            onHide={setShowModalForm}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )

}