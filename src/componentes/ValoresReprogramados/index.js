import React, {useEffect, useState} from "react";
import {Formik, FieldArray, Field, Form} from "formik";
import {round, YupSignupSchemaValoresReprogramados, checkDuplicateInObject} from "../../utils/ValidacoesAdicionaisFormularios";
import {SalvarValoresReprogramados} from "../../utils/Modais";
import {getTabelasReceita} from "../../services/Receitas.service";
import CurrencyInput from "react-currency-input";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import "./valores-reprogramados.scss"

export const ValoresReprogramados = () => {

    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const initial = {
        periodo: "",
        valor_total: 0,
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

    }, []);


    const serviceSalvarValoresReprogramados = async (values, errors, setFieldValue) =>{
        setShowModalSalvar(false);
        setFieldValue("periodo", values.periodo);

        console.log("serviceSalvarValoresReprogramados ", errors)

        if (Object.entries(errors).length === 0 ) {
            onSubmit(values)
        }
    };

    const validateFormValoresReprogramados = async (values) => {
        console.log('validateFormValoresReprogramados ', values);

        const errors = {}

        let valor_total_somado = 0;

        if(values && values.rateios && values.rateios.length > 0){
            values.rateios.map((rateio)=>{
                valor_total_somado = valor_total_somado + Number(rateio.valor.replace(/\./gi,'').replace(/,/gi,'.'))

                if (checkDuplicateInObject('acao_associacao', values.rateios) && checkDuplicateInObject('conta_associacao', values.rateios) && checkDuplicateInObject('categoria_receita', values.rateios)){

                    if (rateio.duplicate){
                        errors.lancamemto_duplicado = 'Não é permitido o lançamento duplicado de valores para a mesma conta, ação e tipo de aplicação';
                    }

                }
            })
        }
        values.valor_total = round(valor_total_somado, 2);

        return errors;

    };

    const onShowModalSalvar = (errors) =>{

        console.log("onShowModalSalvar ", errors)
        if (Object.entries(errors).length <= 0){
            setShowModalSalvar(true)
        }

    }

    const onSubmit = async (values) => {
        setShowModalSalvar(false);
        console.log("onSubmit ", values)
    };

    return (
        <>
            <h1>Componente Valores Reprogramados</h1>

            {/*<div>
                <h1>Friend List</h1>
                <Formik
                    initialValues={{ lily: { friends: ["jared", "ian", "brent"] } }}
                    onSubmit={values =>
                        setTimeout(() => {
                            alert(JSON.stringify(values, null, 2));
                        }, 500)
                    }
                    validationSchema={YupSignupSchemaValoresReprogramados}
                    render={({ values, errors }) => (
                        <Form>
                            <FieldArray
                                name="lily.friends"
                                render={arrayHelpers => (
                                    <div>
                                        <pre>{JSON.stringify(errors.lily, null, 2)}</pre>
                                        {values.lily.friends && values.lily.friends.length > 0 ? (
                                            values.lily.friends.map((friend, index) => (
                                                <div key={index}>
                                                    <Field name={`lily.friends.${index}`} />
                                                    <button
                                                        type="button"
                                                        onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => arrayHelpers.insert(index, "")} // insert an empty string at a position
                                                    >
                                                        +
                                                    </button>
                                                    <div className="row">
                                                        {errors && errors.length > 0 && errors.map((item, index)=>{
                                                            console.log("AQUI ", item)
                                                            return(
                                                                    <span className="text-danger mt-1">{item}</span>
                                                                )

                                                        })}
                                                        {errors.lily && <span className="text-danger mt-1">{errors.lily}</span>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <button type="button" onClick={() => arrayHelpers.push("")}>
                                                 show this when user has removed all friends from the list
                                                Add a friend
                                            </button>
                                        )}
                                        <div>
                                            <button type="submit">Submit</button>
                                        </div>
                                    </div>
                                )}
                            />
                        </Form>
                    )}
                />
            </div>*/}

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
                                    {props.errors.periodo && <span className="text-danger mt-1">{props.errors.periodo}</span>}
                                </div>

                                <div className="col-12 col-md-6 mt-4">
                                    <label htmlFor="valor_total">Valor total reprogramado</label>
                                    <CurrencyInput
                                        allowNegative={false}
                                        decimalSeparator=","
                                        thousandSeparator="."
                                        value={props.values.valor_total}
                                        name="valor_total"
                                        id="valor_total"
                                        className="form-control"
                                        //onChangeEvent={props.handleChange}
                                        onChangeEvent={(e) => {
                                                props.handleChange(e);
                                            }
                                        }
                                        readOnly={true}
                                    />
                                    {props.errors.valor_total && <span className="text-danger mt-1">{props.errors.valor_total}</span>}
                                </div>

                            </div>

                            <FieldArray
                                name="rateios"
                                render={({insert, remove, push}) => (
                                    <>
                                        {values.rateios && values.rateios.length > 0 && values.rateios.map((rateio, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className="form-row container-campos-dinamicos">

                                                         <div className="col mt-4">
                                                             <label htmlFor="acao_associacao">Ação</label>
                                                             <select
                                                                 id="acao_associacao"
                                                                 name={`rateios[${index}].acao_associacao`}
                                                                 value={rateio.acao_associacao}
                                                                 onChange={(e) => {
                                                                     props.handleChange(e);
                                                                 }
                                                                 }
                                                                 onBlur={props.handleBlur}
                                                                 className="form-control"
                                                             >
                                                                 <option value="">Escoha uma ação</option>
                                                                 {tabelas.acoes_associacao !== undefined && tabelas.acoes_associacao.length > 0 ? (tabelas.acoes_associacao.map((item, key) => (
                                                                     <option key={key} value={item.uuid}>{item.nome}</option>
                                                                 ))) : null}
                                                             </select>
                                                             {props.errors.acao_associacao && <span className="text-danger mt-1"> {props.errors.acao_associacao}</span>}

                                                        </div>

                                                        <div className="col mt-4">
                                                            <label htmlFor="conta_associacao">Tipo de conta</label>
                                                            <select
                                                                id="conta_associacao"
                                                                name={`rateios[${index}].conta_associacao`}
                                                                value={rateio.conta_associacao}
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                                className="form-control"
                                                            >
                                                                <option value="">Escoha o tipo de conta</option>
                                                                {tabelas.contas_associacao !== undefined && tabelas.contas_associacao.length > 0 ? (tabelas.contas_associacao.map((item, key) => (
                                                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                                                ))) : null}
                                                            </select>
                                                            {props.touched.conta_associacao && props.errors.conta_associacao && <span className="text-danger mt-1"> {props.errors.conta_associacao}</span>}
                                                        </div>

                                                        <div className="col mt-4">
                                                            <label htmlFor="categoria_receita">Tipo de aplicação</label>
                                                            <select
                                                                id="categoria_receita"
                                                                name={`rateios[${index}].categoria_receita`}
                                                                value={rateio.categoria_receita}
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                                className="form-control"
                                                            >
                                                                <option value="">Escoha o tipo de aplicação</option>
                                                                {tabelas.categorias_receita !== undefined && tabelas.categorias_receita.length > 0 ? (tabelas.categorias_receita.map((item, key) => (
                                                                    <option key={key} value={item.uuid}>{item.nome}</option>
                                                                ))) : null}
                                                            </select>
                                                            {props.touched.categoria_receita && props.errors.categoria_receita && <span className="text-danger mt-1"> {props.errors.categoria_receita}</span>}
                                                        </div>

                                                        <div className="col mt-4">
                                                            <label htmlFor="valor">Valor reprogramado</label>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={rateio.valor}
                                                                name={`rateios[${index}].valor`}
                                                                id="valor"
                                                                className="form-control"
                                                                //onChangeEvent={props.handleChange}
                                                                onChangeEvent={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                }
                                                            />
                                                            {props.touched.valor && props.errors.valor && <span className="text-danger mt-1"> {props.errors.valor}</span>}
                                                        </div>

                                                        <input type="hidden" name={`rateios[${index}].name`} />
                                                        {index >= 0 && values.rateios.length > 0 && (
                                                            <div className="col-1 mt-4 d-flex justify-content-center">
                                                                    <button className="btn-excluir-valores-reprogramados mt-4 pt-2" onClick={() => remove(index)}>
                                                                        <FontAwesomeIcon
                                                                            style={{fontSize: '20px', marginRight:"0"}}
                                                                            icon={faTrashAlt}
                                                                        />
                                                                    </button>
                                                            </div>
                                                        )}

                                                        <div className="col-12">
                                                            {/*{props.errors  && <span className="text-danger mt-1"> {props.errors }</span> }*/}
                                                            {/*{JSON.stringify(errors) && <span className="text-danger mt-1"> {JSON.stringify(errors) }</span>}*/}
                                                            {props.errors.lancamemto_duplicado && <span className="text-danger mt-1"> {props.errors.lancamemto_duplicado }</span>}
                                                        </div>
                                                    </div>
                                                </div> /*div key*/
                                            )
                                        })}


                                        <div className="d-flex  justify-content-start mt-3 mb-3">
                                            <button
                                                type="button"
                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                onClick={() => push(
                                                    {
                                                        acao_associacao: "",
                                                        conta_associacao: "",
                                                        categoria_receita: "",
                                                        valor: "",
                                                        //lancamemto_duplicado: "",
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
                                <button onClick={()=>onShowModalSalvar(errors)} type="button" className="btn btn-success mt-2">Salvar</button>
                            </div>

                            <section>
                                <SalvarValoresReprogramados show={showModalSalvar} handleClose={()=>setShowModalSalvar(false)} onSalvarTrue={()=>serviceSalvarValoresReprogramados(values, errors, setFieldValue)}/>
                            </section>

                        </form>
                    )
                }}
            </Formik>

        </>
    );
};