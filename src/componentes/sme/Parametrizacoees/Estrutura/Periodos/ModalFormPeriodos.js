import React, {memo} from "react";
import {ModalFormBodyText} from "../../../../Globais/ModalBootstrap";
import {Formik} from "formik";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import {exibeDataPT_BR} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {YupSignupSchemaPeriodos} from "./YupSignupSchemaPeriodos";

const ModalFormPeriodos = ({show, stateFormModal, handleClose, handleSubmitModalFormPeriodos, listaDePeriodos, setErroDatasAtendemRegras, erroDatasAtendemRegras, setShowModalConfirmDeletePeriodo}) => {

    console.log("erroDatasAtendemRegras ", erroDatasAtendemRegras);

    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchemaPeriodos}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    onSubmit={handleSubmitModalFormPeriodos}
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
                                            <label htmlFor="referencia">Referencia</label>
                                            <input
                                                type="text"
                                                value={props.values.referencia}
                                                name="referencia"
                                                id="referencia"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                disabled={!props.values.editavel}
                                            />
                                            {props.touched.referencia && props.errors.referencia && <span className="span_erro text-danger mt-1"> {props.errors.referencia} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="data_prevista_repasse">Data prevista do repasse</label>
                                            <DatePickerField
                                                name="data_prevista_repasse"
                                                id="data_prevista_repasse"
                                                value={values.data_prevista_repasse != null ? values.data_prevista_repasse : ""}
                                                onChange={setFieldValue}
                                                disabled={!props.values.editavel}
                                            />
                                            {props.touched.data_prevista_repasse && props.errors.data_prevista_repasse && <span className="span_erro text-danger mt-1"> {props.errors.data_prevista_repasse} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="data_inicio_realizacao_despesas">Início realização de despesas</label>
                                            <DatePickerField
                                                name="data_inicio_realizacao_despesas"
                                                id="data_inicio_realizacao_despesas"
                                                value={values.data_inicio_realizacao_despesas != null ? values.data_inicio_realizacao_despesas : ""}
                                                onChange={(name, value)=>{
                                                    setFieldValue(name, value);
                                                    setErroDatasAtendemRegras(false);
                                                }}
                                                disabled={!props.values.editavel}
                                            />
                                            {props.touched.data_inicio_realizacao_despesas && props.errors.data_inicio_realizacao_despesas && <span className="span_erro text-danger mt-1"> {props.errors.data_inicio_realizacao_despesas} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="data_fim_realizacao_despesas">Fim realização de despesas</label>
                                            <DatePickerField
                                                name="data_fim_realizacao_despesas"
                                                id="data_fim_realizacao_despesas"
                                                value={values.data_fim_realizacao_despesas != null ? values.data_fim_realizacao_despesas : ""}
                                                onChange={setFieldValue}
                                                disabled={!props.values.editavel}
                                            />
                                            {props.touched.data_fim_realizacao_despesas && props.errors.data_fim_realizacao_despesas && <span className="span_erro text-danger mt-1"> {props.errors.data_fim_realizacao_despesas} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="data_inicio_prestacao_contas">Início prestação de contas</label>
                                            <DatePickerField
                                                name="data_inicio_prestacao_contas"
                                                id="data_inicio_prestacao_contas"
                                                value={values.data_inicio_prestacao_contas != null ? values.data_inicio_prestacao_contas : ""}
                                                onChange={setFieldValue}
                                                disabled={!props.values.editavel}
                                            />
                                            {props.touched.data_inicio_prestacao_contas && props.errors.data_inicio_prestacao_contas && <span className="span_erro text-danger mt-1"> {props.errors.data_inicio_prestacao_contas} </span>}
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="data_fim_realizacao_despesas">Fim prestação de contas</label>
                                            <DatePickerField
                                                name="data_fim_prestacao_contas"
                                                id="data_fim_prestacao_contas"
                                                value={values.data_fim_prestacao_contas != null ? values.data_fim_prestacao_contas : ""}
                                                onChange={setFieldValue}
                                                disabled={!props.values.editavel}
                                            />
                                            {props.touched.data_fim_prestacao_contas && props.errors.data_fim_prestacao_contas && <span className="span_erro text-danger mt-1"> {props.errors.data_fim_prestacao_contas} </span>}
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <label htmlFor="periodo_anterior">Período anterior</label>
                                        <select
                                            value={values.periodo_anterior ? values.periodo_anterior : ""}
                                            onChange={(e)=>{
                                                props.handleChange(e);
                                                setErroDatasAtendemRegras(false);
                                            }}
                                            disabled={!props.values.editavel}
                                            name="periodo_anterior"
                                            id="periodo_anterior"
                                            className="form-control"
                                        >
                                            <option value=''>Selecione um período</option>
                                            {listaDePeriodos && listaDePeriodos.filter(element=> element.uuid !== values.uuid).map((periodo) =>
                                                <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                                            )}
                                        </select>
                                    </div>
                                </div>
                                {erroDatasAtendemRegras &&
                                    <div className='row mt-2'>
                                        <div className='col'>
                                            <p><span className="span_erro text-danger mt-1"><strong>{erroDatasAtendemRegras}</strong></span></p>
                                        </div>
                                    </div>
                                }
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
                                        {values.operacao === 'create' || (values.operacao === 'edit' && values.editavel) ? (
                                            <button onClick={()=>setShowModalConfirmDeletePeriodo(true)} type="button" className="btn btn btn-danger mt-2 mr-2">
                                                Apagar
                                            </button>
                                        ): null}
                                    </div>
                                    <div className="p-Y bd-highlight">
                                        <button onClick={()=>handleClose()} type="button" className={`btn btn${values.operacao === 'edit' && values.editavel ? '-outline-success' : '-success'} mt-2 mr-2`}>{values.operacao === 'edit' && values.editavel ? 'Cancelar' : 'Voltar'}</button>
                                    </div>
                                    {values.operacao === 'create' || (values.operacao === 'edit' && values.editavel) ? (
                                        <div className="p-Y bd-highlight">
                                            <button type="submit" className="btn btn btn-success mt-2">Salvar</button>
                                        </div>
                                    ):null}
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
            titulo="Visualizar período"
            //titulo={props.stateFormModal && props.stateFormModal.operacao === 'edit' ? 'Editar ação de associação' : 'Adicionar ação de associação'}
            onHide={handleClose}
            size='lg'
            bodyText={bodyTextarea()}
        />
    )
};

export default memo(ModalFormPeriodos)