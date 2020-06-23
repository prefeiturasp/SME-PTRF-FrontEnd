import React, {useEffect, useState} from "react";
import {Formik, FieldArray, Field} from "formik";
import {round, YupSignupSchemaValoresReprogramados} from "../../utils/ValidacoesAdicionaisFormularios";
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

        if (Object.entries(errors).length === 0 ) {
            onSubmit(values)
        }
    };

    const validateFormValoresReprogramados = async (values) => {
        console.log('validateFormValoresReprogramados ', values);

        var family = [{ name: "Mike", age: 10 }, { name: "Matt", age: 13 }, { name: "Nancy", age: 15 }, { name: "Adam", age: 22 }, { name: "Jenny", age: 85 }, { name: "Nancy", age: 15 }, { name: "Carl", age: 40 }],
            unique = [...new Set(family.map(a => a.name && a.age))];

        //console.log("Tamanho ", family.length);
        //console.log("Unique", unique);

        let tentativa = family.filter((item, index, array) => {
            return array.map((mapItem) => mapItem['name']).indexOf(item['name']) === index
        });


        //console.log("Tentativa", tentativa);

        const errors = {}

        let valor_total_somado = 0;
        let duplicado;
        if(values && values.rateios && values.rateios.length > 0){
            values.rateios.map((rateio)=>{
                valor_total_somado = valor_total_somado + Number(rateio.valor.replace(/\./gi,'').replace(/,/gi,'.'))
            })
        }
        values.valor_total = round(valor_total_somado, 2);

        // ********* Funcionando *********
        if (values.rateios && values.rateios.length > 0) {

            let myArray = values.rateios

            function checkDuplicateInObject(propertyName, inputArray) {
                var seenDuplicate = false,
                    testObject = {};

                inputArray.map(function (item) {
                    var itemPropertyName = item[propertyName];
                    if (itemPropertyName in testObject) {
                        testObject[itemPropertyName].duplicate = true;
                        item.duplicate = true;
                        seenDuplicate = true;
                    } else {
                        testObject[itemPropertyName] = item;
                        delete item.duplicate;
                    }
                });

                return seenDuplicate;
            }

            console.log('Duplicate acao_associacao: ' + checkDuplicateInObject('acao_associacao', myArray));
            console.log('Duplicate conta_associacao: ' + checkDuplicateInObject('conta_associacao', myArray));
            console.log('Duplicate categoria_receita: ' + checkDuplicateInObject('categoria_receita', myArray));

        }



    };

    const onSubmit = async (values) => {
        setShowModalSalvar(false);




        console.log("onSubmit ", values)
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
                                <SalvarValoresReprogramados show={showModalSalvar} handleClose={()=>setShowModalSalvar(false)} onSalvarTrue={()=>serviceSalvarValoresReprogramados(values, errors, setFieldValue)}/>
                            </section>

                        </form>
                    )
                }}
            </Formik>

        </>
    );
};