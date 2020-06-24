import React, {useEffect, useState} from "react";
import {Formik, FieldArray} from "formik";
import {round, exibeDataPT_BR} from "../../utils/ValidacoesAdicionaisFormularios";
import {SalvarValoresReprogramados} from "../../utils/Modais";
import {getTabelasReceita} from "../../services/Receitas.service";
import {getSaldosValoresReprogramados, criarValoresReprogramados} from "../../services/ValoresReprogramados.service";
import CurrencyInput from "react-currency-input";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons'
import "./valores-reprogramados.scss"
const findDuplicates = require('array-find-duplicates');

export const ValoresReprogramados = () => {

    const tabelaInicial = {
        tipos_receita: [],
        acoes_associacao: [],
        contas_associacao: []
    };

    const initial = {
        associacao: "",
        periodo: {},
        saldos:[],
        valor_total: 0,
    };

    const [tabelas, setTabelas] = useState(tabelaInicial);
    const [initialValue, setInitialValue] = useState(initial);
    const [showModalSalvar, setShowModalSalvar] = useState(false);
    const [btnAddValoresReprogramadosReadonly, setBtnAddValoresReprogramadosReadonly] = useState(false);
    const [camposObrigatorios, setCamposObrigatorios] = useState(false);
    const [semSaldo, setSemSaldo] = useState(false);

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

    useEffect(()=> {
        const carregaSaldos = async () => {
            let saldos = await getSaldosValoresReprogramados();
            setInitialValue(saldos)
        };
        carregaSaldos();
    }, []);

    const getPath = () => {
        let path;
        path = `/lista-de-receitas`;
        window.location.assign(path)
    };

    const serviceSalvarValoresReprogramados = async (values, errors, setFieldValue) =>{
        setShowModalSalvar(false);
        setFieldValue("periodo", values.periodo);
        if (Object.entries(errors).length === 0 ) {
            onSubmit(values)
        }
    };

    const onShowModalSalvar = (errors, values) =>{
        if (Object.entries(errors).length <= 0){
            setShowModalSalvar(true);
        }
    };

    const validateFormValoresReprogramados = async (values) => {
        const errors = {};
        let valor_total_somado = 0;

        if(values && values.saldos && values.saldos.length > 0){
            setSemSaldo(false);

            values.saldos.map((item)=>{
                if (!item.acao_associacao || !item.conta_associacao || !item.aplicacao || !item.saldo || item.saldo === "0,00"){
                    errors.campos_obrigatorios = "Todos os campos são obrigatórios"
                    setCamposObrigatorios(true)
                }else {
                    setCamposObrigatorios(false)
                }
                if (typeof item.saldo === "string") {
                    valor_total_somado = valor_total_somado + Number(item.saldo.replace(/\./gi, '').replace(/,/gi, '.'))
                }else {
                    valor_total_somado = valor_total_somado + item.saldo
                }
                if (item.acao_associacao && item.acao_associacao.uuid){
                    item.acao_associacao = item.acao_associacao.uuid;
                }else{
                    item.acao_associacao = item.acao_associacao ? item.acao_associacao : null;
                }
                if (item.conta_associacao && item.conta_associacao.uuid){
                    item.conta_associacao = item.conta_associacao.uuid;
                }else{
                    item.conta_associacao = item.conta_associacao ? item.conta_associacao : null;
                }
            })
        }else{
            errors.sem_saldos = "É necessário ao menos um valor programado"
            setSemSaldo(true)
        }

        values.valor_total = round(valor_total_somado, 2);

        // Verificando Lançamentos Duplicados
        let duplicates;
        duplicates = findDuplicates(values.saldos, (a, b) => a.acao_associacao === b.acao_associacao && a.aplicacao === b.aplicacao && a.conta_associacao === b.conta_associacao);
        if (duplicates.length > 0){
            errors.lancamemto_duplicado = 'Não é permitido o lançamento duplicado de valores para a mesma conta, ação e tipo de aplicação';
            setBtnAddValoresReprogramadosReadonly(true)
        }else {
            setBtnAddValoresReprogramadosReadonly(false)
        }
        return errors;
    };

    const onSubmit = async (values) => {
        setShowModalSalvar(false);

        values.saldos.map((saldo)=>{
            if (saldo.acao_associacao && saldo.acao_associacao.uuid){
                saldo.acao_associacao = saldo.acao_associacao.uuid;
            }else{
                saldo.acao_associacao = saldo.acao_associacao ? saldo.acao_associacao : null;
            }
            if (saldo.conta_associacao && saldo.conta_associacao.uuid){
                saldo.conta_associacao = saldo.conta_associacao.uuid;
            }else{
                saldo.conta_associacao = saldo.conta_associacao ? saldo.conta_associacao : null;
            }

            saldo.aplicacao = saldo.aplicacao ? saldo.aplicacao : null;

            if (saldo.saldo && typeof saldo.saldo === "string"){
                saldo.saldo = Number(saldo.saldo.replace(/\./gi,'').replace(/,/gi,'.'))
            }
        });

        const payload = {
            saldos: values.saldos
        };

        try {
            const response = await criarValoresReprogramados(payload);
            if (response.status === 200 || response.status === 201 ){
                console.log("Salvar ", response)
                console.log("Operação realizada com sucesso!");
                getPath();
            }else{
                console.log("Erro")
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValue}
                //validationSchema={YupSignupSchemaValoresReprogramados}
                enableReinitialize={true}
                validateOnBlur={true}
                validate={validateFormValoresReprogramados}
                onSubmit={onSubmit}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
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
                                        value={`${props.values.periodo.referencia} - ${props.values.periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(props.values.periodo.data_inicio_realizacao_despesas) : "-"} até ${props.values.periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(props.values.periodo.data_fim_realizacao_despesas) : "-"}`}
                                        name="periodo"
                                        className="form-control"
                                        readOnly={true}
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
                                name="saldos"
                                render={({insert, remove, push}) => (
                                    <>
                                        {values.saldos && values.saldos.length > 0 && values.saldos.map((saldo, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className="form-row container-campos-dinamicos">

                                                         <div className="col mt-4">
                                                             <label htmlFor="acao_associacao">Ação</label>
                                                             <select
                                                                 id="acao_associacao"
                                                                 name={`saldos[${index}].acao_associacao`}
                                                                 value={saldo.acao_associacao && saldo.acao_associacao.uuid ? saldo.acao_associacao.uuid : saldo.acao_associacao ? saldo.acao_associacao : "" }
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
                                                                name={`saldos[${index}].conta_associacao`}
                                                                value={saldo.conta_associacao && saldo.conta_associacao.uuid ? saldo.conta_associacao.uuid : saldo.conta_associacao ? saldo.conta_associacao : ""}
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
                                                            <label htmlFor="aplicacao">Tipo de aplicação</label>
                                                            <select
                                                                id="aplicacao"
                                                                name={`saldos[${index}].aplicacao`}
                                                                value={saldo.aplicacao}
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                                className="form-control"
                                                            >
                                                                <option value="">Escoha o tipo de aplicação</option>
                                                                {tabelas.categorias_receita !== undefined && tabelas.categorias_receita.length > 0 ? (tabelas.categorias_receita.map((item, key) => (
                                                                    <option key={key} value={item.id}>{item.nome}</option>
                                                                ))) : null}
                                                            </select>
                                                            {props.touched.aplicacao && props.errors.aplicacao && <span className="text-danger mt-1"> {props.errors.aplicacao}</span>}
                                                        </div>

                                                        <div className="col mt-4">
                                                            <label htmlFor="saldo">Valor reprogramado</label>
                                                            <CurrencyInput
                                                                allowNegative={false}
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                value={saldo.saldo}
                                                                name={`saldos[${index}].saldo`}
                                                                id="saldo"
                                                                className="form-control"
                                                                //onChangeEvent={props.handleChange}
                                                                onChangeEvent={(e) => {
                                                                        props.handleChange(e);
                                                                    }
                                                                }
                                                            />
                                                            {props.touched.saldo && props.errors.saldo && <span className="text-danger mt-1"> {props.errors.saldo}</span>}
                                                        </div>

                                                        <input type="hidden" name={`saldos[${index}].name`} />
                                                        {index >= 0 && values.saldos.length > 0 && (
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
                                        {props.errors.lancamemto_duplicado &&
                                            <div className="col-12 mt-2">
                                                <span className="text-danger"> {props.errors.lancamemto_duplicado }</span>
                                            </div>
                                        }
                                        {props.errors.campos_obrigatorios &&
                                            <div className="col-12 mt-2">
                                                <span className="text-danger"> {props.errors.campos_obrigatorios }</span>
                                            </div>
                                        }
                                        {props.errors.sem_saldos &&
                                            <div className="col-12 mt-2">
                                                <span className="text-danger"> {props.errors.sem_saldos }</span>
                                            </div>
                                        }
                                        <div className="d-flex  justify-content-start mt-3 mb-3">
                                            <button
                                                type="button"
                                                disabled={btnAddValoresReprogramadosReadonly || camposObrigatorios}
                                                className="btn btn btn-outline-success mt-2 mr-2"
                                                onClick={() => push(
                                                    {
                                                        acao_associacao: "",
                                                        conta_associacao: "",
                                                        aplicacao: "",
                                                        saldo: "",
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
                                <button onClick={()=>getPath()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                <button onClick={()=>onShowModalSalvar(errors, values)} disabled={btnAddValoresReprogramadosReadonly || camposObrigatorios || semSaldo} type="button" className="btn btn-success mt-2">Salvar</button>
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