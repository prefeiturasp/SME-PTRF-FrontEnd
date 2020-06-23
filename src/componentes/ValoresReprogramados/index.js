import React, {useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {YupSignupSchemaValoresReprogramados} from "../../utils/ValidacoesAdicionaisFormularios";
import {SalvarValoresReprogramados} from "../../utils/Modais";

export const ValoresReprogramados = () => {

    const initial = {
        periodo: "",
        valor_total: "",
    };

    const [initialValue, setInitialValue] = useState(initial);
    const [showModalSalvar, setShowModalSalvar] = useState(false);

    const onSubmit = async (values) => {
        setShowModalSalvar(false);
        console.log("onSubmit ", values)
    };

    const validateFormValoresReprogramados = async (values) => {
        console.log('validateFormValoresReprogramados ', values)
        const errors = {}
    };

    return (
        <>
            <h1>Componente Valores Reprogramados</h1>

            <Formik
                initialValues={initialValue}
                validationSchema={YupSignupSchemaValoresReprogramados}
                enableReinitialize={true}
                validateOnBlur={true}
                validate={validateFormValoresReprogramados}
                onSubmit={onSubmit}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                        resetForm,
                        errors,
                    } = props;
                    return (
                        <form onSubmit={props.handleSubmit}>
                            <div className="form-row">
                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="periodo">Período do valor reprogramado</label>
                                    <input
                                        type="text"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.periodo}
                                        name="periodo"
                                        className="form-control"
                                    />
                                    {props.errors.periodo && <div id="feedback">{props.errors.periodo}</div>}
                                </div>

                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="valor_total">Valor total reprogramado</label>
                                    <input
                                        type="text"
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        value={props.values.valor_total}
                                        name="valor_total"
                                        className="form-control"
                                    />
                                    {props.errors.valor_total && <div id="feedback">{props.errors.valor_total}</div>}
                                </div>

                            </div>

                            <div className="d-flex  justify-content-end pb-3 mt-3">
                                <button type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                <button onClick={()=>setShowModalSalvar(true)} type="button" className="btn btn-success mt-2">Salvar</button>
                            </div>

                            <section>
                                <SalvarValoresReprogramados show={showModalSalvar} handleClose={()=>setShowModalSalvar(false)} onSalvarTrue={() => onSubmit(values, {resetForm})}/>
                            </section>

                        </form>
                    )
                }}
            </Formik>

        </>
    );
};