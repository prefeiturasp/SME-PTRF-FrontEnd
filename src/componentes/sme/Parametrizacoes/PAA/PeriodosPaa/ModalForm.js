import React, { useContext } from "react";
import { Formik } from "formik";
import { DatePicker, Tooltip } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { YupSignupSchema } from "./YupSignupSchema";
import { ModalFormBodyText } from "../../../../Globais/ModalBootstrap";
import { PeriodosPaaContext } from "./context/index";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import dayjs from 'dayjs'


export const ModalForm = ({handleSubmitFormModal}) => {

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    const {
        showModalForm,
        setShowModalForm,
        stateFormModal,
        bloquearBtnSalvarForm,
        setShowModalConfirmacaoExclusao
    } = useContext(PeriodosPaaContext)
    
    const setDataInicio = (data) => {
        // Lógica para obtenção do primeiro dia do mês/ano devido ao componente DatePicker, 
        // por padrão, no formato MM/YYYY, obter o dia atual (implicitamente)
        const dt = new Date(data)
        // obter primeiro dia para a referência do mês/ano
        const result = new Date(dt.getFullYear(), dt.getMonth(), 1)
        return dayjs(result).format("YYYY-MM-DD")
    }

    const setDataFim = (data) => {
        // Lógica para obtenção do último dia do mês/ano devido ao componente DatePicker, 
        // por padrão, no formato MM/YYYY, obter o dia atual (implicitamente)
        const dt = new Date(data)
        // obter último dia para a referência do mês/ano
        const result = new Date(dt.getFullYear(), dt.getMonth()+1, 0)
        return dayjs(result).format("YYYY-MM-DD")
    }

    const disabledDate = (current, data_inicial) => {
        return current && current < dayjs(data_inicial).endOf('month');
    };
    const bodyTextarea = () => {
        return (
            <>
                <Formik
                    initialValues={stateFormModal}
                    validationSchema={YupSignupSchema}
                    enableReinitialize={true}
                    validateOnChange={false}
                    validateOnBlur={true}
                    onSubmit={handleSubmitFormModal}
                >
                    {props => {
                        const { values, setFieldValue } = props;
                        return(
                            <form onSubmit={props.handleSubmit}>
                                <div className='row'>
                                    <div className='col-12'>
                                        <p className='text-right mb-2'>* Preenchimento obrigatório</p>
                                    </div>
                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="referencia">Referência do período de PAA *
                                                <Tooltip title="Preencher com o período de vigência do PAA. Por exemplo: 2025 a 2026">
                                                    <FontAwesomeIcon
                                                        style={{fontSize: '16px', marginLeft: "10px", color: "#00585E", cursor: "pointer"}}
                                                        icon={faInfoCircle}
                                                    />
                                                </Tooltip>
                                            </label>
                                            <input
                                                data-testid="input-referencia"
                                                data-qa="input-referencia"
                                                type="text"
                                                maxLength={150}
                                                value={props.values.referencia}
                                                name="referencia"
                                                id="referencia"
                                                className="form-control"
                                                onChange={props.handleChange}
                                                placeholder="Descrição do período (Ex: 2025 a 2026)"
                                                disabled={!props.values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                            />
                                            {props.touched.referencia && props.errors.referencia && <span className="span_erro text-danger mt-1"> {props.errors.referencia} </span>}
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-12'>
                                        <label className="font-weight-bold">Período</label>
                                    </div>

                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="data_inicial">Data inicial *</label>
                                            <DatePicker
                                                popupClassName='picker-data-inicial'
                                                name="data_inicial"
                                                id="data_inicial"
                                                onChange={(date) => setFieldValue("data_inicial", date ? setDataInicio(date) : "")}
                                                value={values.data_inicial ? dayjs(values.data_inicial) : null}
                                                format="MM/YYYY"
                                                className='w-100'
                                                picker="month"
                                                inputReadOnly
                                                disabled={!props.values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                dataQa={"input-data-inicial"}
                                                data-testid={"input-data-inicial"}
                                            />
                                            {props.touched.data_inicial && props.errors.data_inicial && <span className="span_erro text-danger mt-1"> {props.errors.data_inicial} </span>}
                                        </div>
                                    </div>

                                    <div className='col'>
                                        <div className="form-group">
                                            <label htmlFor="data_final">Data final *</label>
                                            <DatePicker
                                                inputReadOnly
                                                popupClassName='picker-data-final'
                                                name="data_final"
                                                id="data_final"
                                                onChange={(date) => setFieldValue("data_final", date ? setDataFim(date) : "")}
                                                value={values.data_final ? dayjs(values.data_final) : null}
                                                format="MM/YYYY"
                                                className='w-100'
                                                disabledDate={current => disabledDate(current, values.data_inicial)}
                                                picker="month"
                                                disabled={!props.values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                                dataQa={"input-data-final"}
                                                data-testid={"input-data-final"}
                                            />
                                            {props.touched.data_final && props.errors.data_final && <span className="span_erro text-danger mt-1"> {props.errors.data_final} </span>}
                                        </div>
                                    </div>
                                </div>

                                {values.id && <div className='row mt-3'>
                                    <div className='col'>
                                        <p className='mb-2'>ID</p>
                                        <p className='mb-2'>{values.id}</p>
                                    </div>
                                </div>}

                                <div className="d-flex bd-highlight mt-2">
                                    <div className="p-Y flex-grow-1 bd-highlight">
                                        {values.operacao === 'edit' ? (
                                            <button
                                                data-qa="btn-excluir-periodo-paa"
                                                data-testid="btn-excluir-periodo-paa"
                                                onClick={()=> setShowModalConfirmacaoExclusao(true)}
                                                type="button"
                                                className="btn btn btn-danger mt-2 mr-2"
                                                disabled={!values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                                Excluir
                                            </button>
                                        ): null}
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button
                                            data-testid="btn-cancelar"
                                            data-qa="btn-cancelar"
                                            onClick={()=> setShowModalForm(false)}
                                            type="button"
                                            className={`btn btn-outline-success mt-2 mr-2`}>
                                            {values.editavel ? 'Cancelar' : 'Voltar'}
                                        </button>
                                    </div>

                                    <div className="p-Y bd-highlight">
                                        <button
                                            data-testid="btn-salvar"
                                            data-qa="btn-salvar"
                                            type="submit"
                                            className="btn btn btn-success mt-2"
                                            disabled={bloquearBtnSalvarForm || !values.editavel || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                                            {!values.uuid ? 'Adicionar': 'Salvar'}
                                        </button>
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
            titulo={`${!stateFormModal.uuid ? 'Adicionar' : (stateFormModal.editavel ? 'Editar' :  'Visualizar')} período do PAA`}
            onHide={setShowModalForm}
            size='md'
            bodyText={bodyTextarea()}
        />
    )

}