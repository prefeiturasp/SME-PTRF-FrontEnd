import React, {useEffect, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {YupSignupSchemaValoresReprogramados} from "../../utils/ValidacoesAdicionaisFormularios";
import {SalvarValoresReprogramados} from "../../utils/Modais";
import {ASSOCIACAO_UUID} from "../../services/auth.service";
import {getTabelasReceita} from "../../services/Receitas.service";

export const ValoresReprogramados = () => {

    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const initial = {
        periodo: "",
        valor_total: "",
    };

    const [tabelas, setTabelas] = useState(tabelaInicial);
    const [initialValue, setInitialValue] = useState(initial);
    const [showModalSalvar, setShowModalSalvar] = useState(false);

    useEffect(()=> {
        const carregaTabelas = async () => {
            getTabelasReceita().then(response => {
                setTabelas(response.data);
            }).catch(error => {
                console.log(error);
            });
        };

        carregaTabelas();

    }, [])

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

                            <FieldArray
                                name="rateios"
                                render={({insert, remove, push}) => (
                                    <>
                                        {values.rateios && values.rateios.length > 0 && values.rateios.map((rateio, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className="form-row">

                                                         <div className="col mt-4">
                                                             <label htmlFor="acao_associacao">Ação</label>
                                                             <select
                                                                 id="acao_associacao"
                                                                 name="acao_associacao"
                                                                 value={props.values.acao_associacao}
                                                                 onChange={(e) => {
                                                                     props.handleChange(e);
                                                                 }
                                                                 }
                                                                 onBlur={props.handleBlur}
                                                                 className="form-control"
                                                             >
                                                                 {tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 ? (tabelas.acoes_associacao.map((item, key) => (
                                                                     <option key={key} value={item.uuid}>{item.nome}</option>
                                                                 ))) : null}
                                                             </select>
                                                             {props.touched.acao_associacao && props.errors.acao_associacao &&
                                                             <span className="span_erro text-danger mt-1"> {props.errors.acao_associacao}</span>}

                                                        </div>
                                                    </div>



                                                    {index >= 1 && values.rateios.length > 1 && (
                                                        <div className="d-flex  justify-content-start mt-3 mb-3">
                                                            <button
                                                                type="button"
                                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                                onClick={() => remove(index)}
                                                            >
                                                                - Remover Despesa
                                                            </button>
                                                        </div>
                                                    )}

                                                </div> /*div key*/
                                            )
                                        })}


                                        <div className="d-flex  justify-content-start mt-3 mb-3">
                                            <button
                                                type="button"
                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                onClick={() => push(
                                                    {
                                                        categoria_receita: "",
                                                        acao_associacao: "",
                                                        conta_associacao: "",
                                                        data: "",
                                                        valor: "",
                                                        descricao: "",
                                                    }
                                                )
                                                }
                                            >
                                                + Adicionar valor reprogramado
                                            </button>
                                        </div>

                                    </>
                                )}
                            />

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