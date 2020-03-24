import React, {useState, Fragment} from "react";
import {Formik} from "formik";
import MaskedInput from 'react-text-mask'
import {YupSignupSchemaCadastroDespesa, cpfMaskContitional, calculaValorRecursoAcoes, trataNumericos, round} from "../../../utils/ValidacoesAdicionaisFormularios";
import NumberFormat from 'react-number-format';
import {DatePickerField} from "../../DatePickerField";

export const DespesaForm = () => {

    const initialValues = () => (
        {
            cnpCpf: "",
            razaoSocial: "",
            tipoDocumento: "",
            numreroDocumento: "",
            dataDocumento: "",
            tipoTransacao: "",
            dataTransacao: "",
            valorTotal: "",
            valorRecursoProprio: "",
            valorRecursoAcoes: "",
        }
    )

    const onSubmit = (values) => {
        values.valorTotal = trataNumericos(values.valorTotal);
        values.valorRecursoProprio = trataNumericos(values.valorRecursoProprio);
        values.valorRecursoAcoes = round( (values.valorTotal - values.valorRecursoProprio),2 );
        values.DadosDoGasto = inputFields;
        console.log("Ollyver values ", values)
        //console.log("Ollyver inputFields ", inputFields)
    }

    const [inputFields, setInputFields] = useState([
        { firstName: '', lastName: '' }
    ]);

    const handleAddFields = () => {
        const values = [...inputFields];
        values.push({ firstName: '', lastName: '' });
        setInputFields(values);
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    const handleInputChange = (index, event) => {
        const values = [...inputFields];
        if (event.target.name === "firstName") {
            values[index].firstName = event.target.value;
        } else {
            values[index].lastName = event.target.value;
        }

        setInputFields(values);
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log("inputFields", inputFields);
    };

    return (
        <>
            <Formik
                initialValues={initialValues()}
                validationSchema={YupSignupSchemaCadastroDespesa}
                validateOnBlur={true}
                onSubmit={onSubmit}
                enableReinitialize = {true}
            >
                {props => {
                    const {
                        values,
                        setFieldValue,
                        resetForm
                    } = props;
                    return (
                    <form id="despesaForm" onSubmit={props.handleSubmit}>
                        <div className="form-row">
                            <div className="col-12 col-md-6 mt-4">
                                <label htmlFor="cnpCpf">CNPJ ou CPF do fornecedor</label>
                                <MaskedInput
                                    mask={(valor) => cpfMaskContitional(valor)}
                                    value={props.values.cnpCpf}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="cnpCpf" id="cnpCpf" type="text" className="form-control" placeholder="Digite o número do documento"
                                />
                                {props.errors.cnpCpf && <span className="span_erro text-danger mt-1"> {props.errors.cnpCpf}</span>}
                            </div>
                            <div className="col-12 col-md-6  mt-4">
                                <label htmlFor="razaoSocial">Razão social do fornecedor</label>
                                <input
                                    value={props.values.razaoSocial}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="razaoSocial" id="razaoSocial" type="text" className="form-control" placeholder="Digite o nome"/>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="tipoDocumento">Tipo de documento</label>
                                <select
                                    value={props.values.tipoDocumento}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name='tipoDocumento' id='tipoDocumento' className="form-control" >
                                    <option value="">Selecione o tipo</option>
                                    <option value="laranja">Laranja</option>
                                    <option value="limao">Limão</option>
                                    <option value="coco">Coco</option>
                                    <option value="manga">Manga</option>
                                </select>
                            </div>

                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="numreroDocumento">Número do documento</label>
                                <input
                                    value={props.values.numreroDocumento}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name="numreroDocumento" id="numreroDocumento" type="text" className="form-control" placeholder="Digite o número"/>
                            </div>

                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="dataDocumento">Data do documento</label>
                                <DatePickerField
                                    name="dataDocumento"
                                    id="dataDocumento"
                                    value={values.dataDocumento}
                                    onChange={setFieldValue}
                                />
                                {props.errors.dataDocumento && <span className="span_erro text-danger mt-1"> {props.errors.dataDocumento}</span>}
                            </div>

                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="tipoTransacao">Tipo de transação</label>
                                <select
                                    value={props.values.tipoTransacao}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    name='tipoTransacao' id='tipoTransacao' className="form-control" >
                                    <option value="">Selecione o tipo</option>
                                    <option value="laranja">Laranja</option>
                                    <option value="limao">Limão</option>
                                    <option value="coco">Coco</option>
                                    <option value="manga">Manga</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="dataTransacao">Data da transação</label>
                                <DatePickerField
                                    name="dataTransacao"
                                    id="dataTransacao"
                                    value={values.dataTransacao}
                                    onChange={setFieldValue}
                                />
                                {props.errors.dataTransacao && <span className="span_erro text-danger mt-1"> {props.errors.dataTransacao}</span>}

                            </div>
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="valorTotal">Valor total</label>
                                <NumberFormat
                                    value={props.values.valorTotal}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    decimalScale = {2}
                                    prefix={'R$'}
                                    name="valorTotal"
                                    id="valorTotal"
                                    className="form-control"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                                {props.errors.valorTotal && <span className="span_erro text-danger mt-1"> {props.errors.valorTotal}</span>}

                            </div>
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="valorRecursoProprio">Valor do recurso próprio</label>
                                <NumberFormat
                                    value={props.values.valorRecursoProprio}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    decimalScale = {2}
                                    prefix={'R$'}
                                    name="valorRecursoProprio"
                                    id="valorRecursoProprio"
                                    className="form-control"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                />
                                {props.errors.valorRecursoProprio && <span className="span_erro text-danger mt-1"> {props.errors.valorRecursoProprio}</span>}
                            </div>
                            <div className="col-12 col-md-3 mt-4">
                                <label htmlFor="valorRecursoAcoes">Valor do recurso das ações</label>
                                <NumberFormat
                                    value={calculaValorRecursoAcoes(props)}
                                    thousandSeparator={'.'}
                                    decimalSeparator={','}
                                    decimalScale = {2}
                                    prefix={'R$ '}
                                    name="valorRecursoAcoes"
                                    id="valorRecursoAcoes"
                                    className="form-control"
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    readOnly={true}
                                />
                                {props.errors.valorRecursoAcoes && <span className="span_erro text-danger mt-1"> {props.errors.valorRecursoAcoes}</span>}
                            </div>
                        </div>
                        <hr/>



                        <div className="form-row">
                            {inputFields.map((inputField, index) => (
                                <Fragment key={`${inputField}~${index}`}>
                                    <div className="form-group col-sm-6">
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            value={inputField.firstName}
                                            onChange={event => handleInputChange(index, event)}
                                        />
                                    </div>
                                    <div className="form-group col-sm-4">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={inputField.lastName}
                                            onChange={event => handleInputChange(index, event)}
                                        />
                                    </div>
                                    <div className="form-group col-sm-2">
                                        <button
                                            className="btn btn-link"
                                            type="button"
                                            onClick={() => handleRemoveFields(index)}
                                        >
                                            -
                                        </button>
                                        <button
                                            className="btn btn-link"
                                            type="button"
                                            onClick={() => handleAddFields()}
                                        >
                                            +
                                        </button>
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                        <div className="d-flex  justify-content-end">
                            <button type="reset" onClick={resetForm} className="btn btn btn-outline-success mt-2 mr-2" >Cancelar </button>
                            <button type="submit" className="btn btn-success mt-2">Acessar</button>
                        </div>

                    </form>
                );
                }}
            </Formik>
        </>
    );
}